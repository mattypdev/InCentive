'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { levels } from '@/data/levels'
import { useAuth } from '@/context/AuthContext'
import {
  fetchQuestionsForLesson, fetchFillBlank,
  createQuestion, updateQuestion, deleteQuestion,
  upsertFillBlank, deleteFillBlank,
} from '@/lib/questionsApi'
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '@/lib/articlesApi'
import { createClient } from '@/lib/supabase/client'
import { LogOut, ChevronDown, ChevronRight, Trash2, Plus, Save, FileText, BookOpen, Maximize2, X, FileUp } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import AdminRoute from '@/components/AdminRoute'
import '@/app/(pages)/Admin.css'

async function uploadArticleImage(file) {
  const supabase = createClient()
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('article-images').upload(path, file)
  if (error) throw error
  return supabase.storage.from('article-images').getPublicUrl(path).data.publicUrl
}

async function pdfToHtml(file) {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise

  const pageHtmlParts = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()

    const sizes = content.items.map(i => Math.round(i.transform[3]))
    const sizeCount = {}
    for (const s of sizes) sizeCount[s] = (sizeCount[s] ?? 0) + 1
    const bodySize = Number(Object.entries(sizeCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 12)

    const lines = {}
    for (const item of content.items) {
      if (!item.str) continue
      const y = Math.round(item.transform[5] / 2) * 2
      if (!lines[y]) lines[y] = []
      lines[y].push(item)
    }

    const sortedYs = Object.keys(lines).map(Number).sort((a, b) => b - a)

    const lineTexts = []
    for (const y of sortedYs) {
      const items = lines[y].sort((a, b) => a.transform[4] - b.transform[4])
      const fontSize = Math.round(items[0].transform[3])
      const text = items.map(i => i.str).join(' ').trim()
      if (!text) continue
      lineTexts.push({ text, fontSize })
    }

    const blocks = []
    let currentParagraph = []
    for (const line of lineTexts) {
      if (line.fontSize > bodySize * 1.25) {
        if (currentParagraph.length) { blocks.push({ type: 'p', text: currentParagraph.join(' ') }); currentParagraph = [] }
        const tag = line.fontSize > bodySize * 1.7 ? 'h1' : line.fontSize > bodySize * 1.4 ? 'h2' : 'h3'
        blocks.push({ type: tag, text: line.text })
      } else {
        currentParagraph.push(line.text)
      }
    }
    if (currentParagraph.length) blocks.push({ type: 'p', text: currentParagraph.join(' ') })

    const html = blocks.map(b => `<${b.type}>${b.text}</${b.type}>`).join('\n')
    if (html.trim()) pageHtmlParts.push(html)
  }

  return pageHtmlParts.join('\n<hr>\n')
}

const BLANK_MC = { prompt: '', options: ['', '', '', ''], correct: 0, explanation: '' }
const BLANK_FB = { prompt: '', options: ['', '', '', ''], correct: 0, explanation: '' }

function QuestionCard({ q, onSave, onDelete, isFillBlank }) {
  const [draft, setDraft] = useState(q)
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(q)

  useEffect(() => { setDraft(q) }, [q])

  function setOption(i, value) {
    const options = [...draft.options]
    options[i] = value
    setDraft({ ...draft, options })
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draft)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-qcard">
      <label className="admin-field">
        <span>{isFillBlank ? 'Prompt (use ______ where the blank goes)' : 'Prompt'}</span>
        <textarea
          value={draft.prompt}
          onChange={e => setDraft({ ...draft, prompt: e.target.value })}
          rows={2}
        />
      </label>
      <div className="admin-options">
        {draft.options.map((opt, i) => (
          <label key={i} className={`admin-option-row${draft.correct === i ? ' admin-option-row--correct' : ''}`}>
            <input
              type="radio"
              name={`correct-${draft.id ?? 'new'}`}
              checked={draft.correct === i}
              onChange={() => setDraft({ ...draft, correct: i })}
            />
            <input
              type="text"
              value={opt}
              placeholder={`Option ${i + 1}`}
              onChange={e => setOption(i, e.target.value)}
            />
          </label>
        ))}
      </div>
      <label className="admin-field">
        <span>Explanation</span>
        <textarea
          value={draft.explanation ?? ''}
          onChange={e => setDraft({ ...draft, explanation: e.target.value })}
          rows={2}
        />
      </label>
      <div className="admin-qcard-actions">
        <button className="admin-btn admin-btn--danger" onClick={() => onDelete(q)}>
          <Trash2 size={15} /> Delete
        </button>
        <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={!dirty || saving}>
          <Save size={15} /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function LessonEditor({ lessonId, unitId, title }) {
  const [questions, setQuestions] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchQuestionsForLesson(lessonId).then(setQuestions).catch(e => setError(e.message))
  }, [lessonId])

  useEffect(() => { load() }, [load])

  async function handleSave(draft) {
    setError('')
    try {
      if (draft.id) {
        await updateQuestion(draft.id, {
          prompt: draft.prompt, options: draft.options, correct: draft.correct, explanation: draft.explanation,
        })
      } else {
        await createQuestion({
          unitId, lessonId, position: questions.length,
          prompt: draft.prompt, options: draft.options, correct: draft.correct, explanation: draft.explanation,
        })
      }
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(q) {
    if (q.id && !window.confirm('Delete this question?')) return
    if (!q.id) { setQuestions(prev => prev.filter(x => x !== q)); return }
    setError('')
    try {
      await deleteQuestion(q.id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  function addBlank() {
    setQuestions(prev => [...(prev ?? []), { ...BLANK_MC }])
  }

  if (questions === null) return <p className="admin-loading">Loading questions…</p>

  return (
    <div className="admin-lesson-editor">
      <h3>{title}</h3>
      {error && <p className="admin-error">{error}</p>}
      {questions.length === 0 && <p className="admin-empty">No questions yet.</p>}
      {questions.map((q, i) => (
        <QuestionCard key={q.id ?? `new-${i}`} q={q} onSave={handleSave} onDelete={handleDelete} />
      ))}
      <button className="admin-btn admin-btn--add" onClick={addBlank}>
        <Plus size={16} /> Add question
      </button>
    </div>
  )
}

function FillBlankEditor({ unitId, title }) {
  const [q, setQ] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchFillBlank(unitId).then(row => setQ(row ?? { ...BLANK_FB })).catch(e => setError(e.message))
  }, [unitId])

  useEffect(() => { load() }, [load])

  async function handleSave(draft) {
    setError('')
    try {
      await upsertFillBlank(unitId, {
        prompt: draft.prompt, options: draft.options, correct: draft.correct, explanation: draft.explanation,
      })
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this fill-blank question?')) return
    setError('')
    try {
      await deleteFillBlank(unitId)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (q === null) return <p className="admin-loading">Loading…</p>

  return (
    <div className="admin-lesson-editor">
      <h3>{title} — Fill in the blank</h3>
      {error && <p className="admin-error">{error}</p>}
      <QuestionCard q={q} onSave={handleSave} onDelete={handleDelete} isFillBlank />
    </div>
  )
}

const BLANK_ARTICLE = { title: '', author: '', cover_image_url: '', body: '' }

function FullArticleEditor({ draft, onChange, onSave, onClose, saving }) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const pdfRef = useRef(null)

  async function handlePdf(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPdfLoading(true)
    setPdfError('')
    try {
      const html = await pdfToHtml(file)
      onChange({ ...draft, body: html, title: draft.title || file.name.replace(/\.pdf$/i, '') })
    } catch (err) {
      setPdfError(`PDF import failed: ${err.message}`)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="fae-overlay">
      <div className="fae-topbar">
        <div className="fae-topbar-fields">
          <input
            className="fae-title-input"
            type="text"
            placeholder="Article title…"
            value={draft.title}
            onChange={e => onChange({ ...draft, title: e.target.value })}
          />
          <input
            className="fae-author-input"
            type="text"
            placeholder="Author (optional)"
            value={draft.author ?? ''}
            onChange={e => onChange({ ...draft, author: e.target.value })}
          />
          <input
            className="fae-cover-input"
            type="url"
            placeholder="Cover image URL (optional)"
            value={draft.cover_image_url ?? ''}
            onChange={e => onChange({ ...draft, cover_image_url: e.target.value })}
          />
        </div>
        <div className="fae-topbar-actions">
          <input ref={pdfRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handlePdf} />
          <button className="admin-btn" onClick={() => pdfRef.current?.click()} disabled={pdfLoading} title="Import PDF as article">
            <FileUp size={15} /> {pdfLoading ? 'Importing…' : 'Import PDF'}
          </button>
          <button className="admin-btn admin-btn--primary" onClick={onSave} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="admin-btn" onClick={onClose} title="Close editor">
            <X size={15} />
          </button>
        </div>
      </div>
      {pdfError && <div className="fae-pdf-error">{pdfError}</div>}
      <div className="fae-paper-wrap">
        <div className="fae-paper">
          <RichTextEditor
            value={draft.body}
            onChange={html => onChange({ ...draft, body: html })}
            onUploadImage={uploadArticleImage}
            stickyToolbar
            fullHeight
          />
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, onSave, onDelete }) {
  const [draft, setDraft] = useState(article)
  const [saving, setSaving] = useState(false)
  const [fullEditor, setFullEditor] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(article)

  useEffect(() => { setDraft(article) }, [article])

  async function handleSave() {
    setSaving(true)
    try { await onSave(draft) } finally { setSaving(false) }
  }

  return (
    <>
      {fullEditor && (
        <FullArticleEditor
          draft={draft}
          onChange={setDraft}
          onSave={async () => { await handleSave(); setFullEditor(false) }}
          onClose={() => setFullEditor(false)}
          saving={saving}
        />
      )}
      <div className="admin-article-card">
        <div className="admin-article-meta-row">
          <label className="admin-field" style={{ flex: 2 }}>
            <span>Title</span>
            <input type="text" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <label className="admin-field" style={{ flex: 1 }}>
            <span>Author</span>
            <input type="text" value={draft.author ?? ''} placeholder="incentive team" onChange={e => setDraft({ ...draft, author: e.target.value })} />
          </label>
        </div>
        <label className="admin-field">
          <span>Cover image URL <span className="admin-field-hint">(optional)</span></span>
          <input type="url" value={draft.cover_image_url ?? ''} placeholder="https://..." onChange={e => setDraft({ ...draft, cover_image_url: e.target.value })} />
        </label>
        {draft.cover_image_url && (
          <img src={draft.cover_image_url} alt="Cover preview" className="admin-cover-preview" />
        )}
        <div className="admin-qcard-actions">
          <button className="admin-btn admin-btn--danger" onClick={() => onDelete(article)}>
            <Trash2 size={15} /> Delete
          </button>
          <button className="admin-btn" onClick={() => setFullEditor(true)} title="Open full-screen editor">
            <Maximize2 size={15} /> Open editor
          </button>
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={!dirty || saving}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}

function ArticlesEditor() {
  const [articles, setArticles] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchArticles().then(setArticles).catch(e => setError(e.message))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(draft) {
    setError('')
    const patch = { title: draft.title, author: draft.author, body: draft.body, cover_image_url: draft.cover_image_url ?? null }
    try {
      if (draft.id) {
        await updateArticle(draft.id, patch)
      } else {
        await createArticle(patch)
      }
      load()
    } catch (e) { setError(e.message) }
  }

  async function handleDelete(article) {
    if (article.id && !window.confirm('Delete this article?')) return
    if (!article.id) { setArticles(prev => prev.filter(a => a !== article)); return }
    setError('')
    try { await deleteArticle(article.id); load() } catch (e) { setError(e.message) }
  }

  function addBlank() {
    setArticles(prev => [...(prev ?? []), { ...BLANK_ARTICLE }])
  }

  if (articles === null) return <p className="admin-loading">Loading articles…</p>

  return (
    <div className="admin-lesson-editor">
      <h3>Articles</h3>
      {error && <p className="admin-error">{error}</p>}
      {articles.length === 0 && <p className="admin-empty">No articles yet.</p>}
      {articles.map((a, i) => (
        <ArticleCard key={a.id ?? `new-${i}`} article={a} onSave={handleSave} onDelete={handleDelete} />
      ))}
      <button className="admin-btn admin-btn--add" onClick={addBlank}>
        <Plus size={16} /> New article
      </button>
    </div>
  )
}

function AdminContent() {
  const { currentUser, logOut } = useAuth()
  const [tab, setTab] = useState('questions')
  const [openUnit, setOpenUnit] = useState(null)
  const [selected, setSelected] = useState(null)

  function toggleUnit(unitId) {
    setOpenUnit(prev => prev === unitId ? null : unitId)
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin</h1>
          <p>Signed in as {currentUser?.email}</p>
        </div>
        <button className="admin-btn" onClick={logOut}><LogOut size={16} /> Log out</button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab${tab === 'questions' ? ' admin-tab--active' : ''}`} onClick={() => setTab('questions')}>
          <BookOpen size={15} /> Questions
        </button>
        <button className={`admin-tab${tab === 'articles' ? ' admin-tab--active' : ''}`} onClick={() => setTab('articles')}>
          <FileText size={15} /> Articles
        </button>
      </div>

      {tab === 'questions' && (
        <div className="admin-layout">
          <nav className="admin-sidebar">
            {levels.map(level => (
              <div key={level.id} className="admin-level">
                <div className="admin-level-title">{level.title}</div>
                {level.units.map(unit => (
                  <div key={unit.id} className="admin-unit">
                    <button className="admin-unit-toggle" onClick={() => toggleUnit(unit.id)}>
                      {openUnit === unit.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span>{unit.icon} {unit.title}</span>
                    </button>
                    {openUnit === unit.id && (
                      <div className="admin-lesson-list">
                        {(unit.lessons ?? []).map(lesson => (
                          <button
                            key={lesson.id}
                            className={`admin-lesson-link${selected?.lessonId === lesson.id ? ' admin-lesson-link--active' : ''}`}
                            onClick={() => setSelected({ kind: 'lesson', unitId: unit.id, lessonId: lesson.id, title: lesson.title })}
                          >
                            {lesson.title}
                          </button>
                        ))}
                        <button
                          className={`admin-lesson-link admin-lesson-link--fb${selected?.kind === 'fillBlank' && selected?.unitId === unit.id ? ' admin-lesson-link--active' : ''}`}
                          onClick={() => setSelected({ kind: 'fillBlank', unitId: unit.id, title: unit.title })}
                        >
                          Fill in the blank
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <section className="admin-main">
            {!selected && <p className="admin-empty">Pick a lesson on the left to edit its questions.</p>}
            {selected?.kind === 'lesson' && (
              <LessonEditor key={selected.lessonId} lessonId={selected.lessonId} unitId={selected.unitId} title={selected.title} />
            )}
            {selected?.kind === 'fillBlank' && (
              <FillBlankEditor key={selected.unitId} unitId={selected.unitId} title={selected.title} />
            )}
          </section>
        </div>
      )}

      {tab === 'articles' && (
        <div className="admin-layout">
          <section className="admin-main admin-main--full">
            <ArticlesEditor />
          </section>
        </div>
      )}
    </main>
  )
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminContent />
    </AdminRoute>
  )
}
