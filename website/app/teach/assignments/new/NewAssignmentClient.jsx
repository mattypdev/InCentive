'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
import { createAssignment } from '@/app/actions/teach'
import { useRouter } from 'next/navigation'

const ISLAND_COLORS = {
  'the-basics':          '#FFE4E6',
  'banking-budgeting':   '#FEF3C7',
  'credit-protection':   '#E0F2FE',
  'taxes-investing':     '#DCFCE7',
  'markets-business':    '#EDE9FE',
  'finance-psychology':  '#FFF7ED',
  'capstone':            '#CCFBF1',
}

export default function NewAssignmentClient({ groupId, content, students, backHref }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [openIslands, setOpenIslands] = useState({})
  const [selectedItems, setSelectedItems] = useState([]) // [{type, id, title, islandSlug}]
  const [filterIsland, setFilterIsland] = useState(null)

  // Right panel state
  const [title, setTitle] = useState('')
  const [assignTo, setAssignTo] = useState('class') // 'class' | 'students'
  const [selectedStudents, setSelectedStudents] = useState([])
  const [opensAt, setOpensAt] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [pinUpNext, setPinUpNext] = useState(false)
  const [allowLate, setAllowLate] = useState(false)
  const [lockOrder, setLockOrder] = useState(false)
  const [error, setError] = useState('')

  function toggleIsland(slug) {
    setOpenIslands(prev => ({ ...prev, [slug]: !prev[slug] }))
  }

  function toggleItem(item) {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) return prev.filter(i => i.id !== item.id)
      const next = [...prev, item]
      // Auto-fill title if empty
      if (!title && next.length === 1) setTitle(item.title)
      return next
    })
  }

  function isSelected(id) {
    return selectedItems.some(i => i.id === id)
  }

  // Filter content
  const filteredContent = content.map(isl => ({
    ...isl,
    units: isl.units.map(unit => ({
      ...unit,
      lessons: unit.lessons.filter(l =>
        (!search || l.title.toLowerCase().includes(search.toLowerCase())) &&
        (!filterIsland || isl.slug === filterIsland)
      ),
    })).filter(u => (!search && !filterIsland) || u.lessons.length > 0 || u.title.toLowerCase().includes(search.toLowerCase())),
  })).filter(isl => (!filterIsland || isl.slug === filterIsland) && isl.units.length > 0)

  async function handleSubmit(isDraft = false) {
    if (!selectedItems.length) { setError('Select at least one item.'); return }

    setError('')
    startTransition(async () => {
      const opensDate = opensAt ? new Date(opensAt).toISOString() : new Date().toISOString()
      const dueDate = dueAt ? new Date(dueAt).toISOString() : undefined

      // Use first lesson_id if single lesson selected
      const singleLesson = selectedItems.length === 1 && selectedItems[0].type === 'lesson' ? selectedItems[0].id : undefined
      const singleUnit = selectedItems.length === 1 && selectedItems[0].type === 'unit' ? selectedItems[0].id : undefined

      const result = await createAssignment({
        groupId,
        lessonId: singleLesson,
        unitId: singleUnit,
        title: title || selectedItems.map(i => i.title).join(', '),
        items: selectedItems.map(i => ({ type: i.type, id: i.id })),
        opensAt: opensDate,
        dueAt: dueDate,
        isDraft,
        settings: {
          retakes: true,
          best_score: true,
          pin_up_next: pinUpNext,
          allow_late: allowLate,
          lock_order: lockOrder,
          target_user_ids: assignTo === 'students' ? selectedStudents : null,
        },
      })
      if (result.error) { setError(result.error); return }
      router.push(`/teach/assignments/${result.id}?class=${groupId}`)
    })
  }

  return (
    <main className="t-main">
      <div className="t-hrow">
        <Link href={backHref} style={{ color: 'var(--t-mute)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Assignments
        </Link>
        <h1 style={{ fontSize: 22, marginLeft: 4 }}>New assignment</h1>
      </div>

      <div className="t-cols" style={{ alignItems: 'flex-start' }}>

        {/* Step 1: Content picker */}
        <div className="t-col-main">
          <div className="t-card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1.5px solid #E7E2D3' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>1 · Choose content</div>
              <input
                className="t-search"
                placeholder="Search lessons and units…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {/* Island filter chips */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setFilterIsland(null)}
                  style={{
                    padding: '4px 12px', borderRadius: 99, border: '1.5px solid var(--t-ink)',
                    background: !filterIsland ? 'var(--t-teal)' : '#fff',
                    color: !filterIsland ? '#fff' : 'var(--t-ink)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >All</button>
                {content.map(isl => (
                  <button
                    key={isl.slug}
                    onClick={() => setFilterIsland(filterIsland === isl.slug ? null : isl.slug)}
                    style={{
                      padding: '4px 12px', borderRadius: 99, border: '1.5px solid var(--t-ink)',
                      background: filterIsland === isl.slug ? 'var(--t-teal)' : (ISLAND_COLORS[isl.slug] ?? '#F1F5F9'),
                      color: filterIsland === isl.slug ? '#fff' : 'var(--t-ink)',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {isl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Island accordion */}
            {filteredContent.length === 0 && (
              <div style={{ padding: '20px 18px', color: 'var(--t-mute)', fontSize: 13 }}>No content matches your search.</div>
            )}
            {filteredContent.map(isl => (
              <div key={isl.slug}>
                <button className="t-island-btn" onClick={() => toggleIsland(isl.slug)}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: ISLAND_COLORS[isl.slug] ?? '#E2E8F0', display: 'inline-block' }} />
                  {isl.title}
                  <span style={{ marginLeft: 'auto', color: 'var(--t-mute)' }}>
                    {openIslands[isl.slug] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>

                {openIslands[isl.slug] && isl.units.map(unit => (
                  <div key={unit.id}>
                    {/* Unit row */}
                    <div className="t-unit-row" style={{ background: '#FAFAF8', paddingLeft: 24 }}>
                      <input
                        type="checkbox"
                        checked={isSelected(unit.id)}
                        onChange={() => toggleItem({ type: 'unit', id: unit.id, title: unit.title, islandSlug: isl.slug })}
                        style={{ width: 16, height: 16, accentColor: 'var(--t-teal)', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{unit.title}</span>
                      <span className="t-chip check">{unit.lessons.length} lessons</span>
                    </div>

                    {/* Lesson rows */}
                    {unit.lessons.map(lesson => (
                      <div key={lesson.id} className="t-unit-row" style={{ paddingLeft: 44 }}>
                        <input
                          type="checkbox"
                          checked={isSelected(lesson.id)}
                          onChange={() => toggleItem({ type: 'lesson', id: lesson.id, title: lesson.title, islandSlug: isl.slug })}
                          style={{ width: 16, height: 16, accentColor: 'var(--t-teal)', cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1, fontSize: 13 }}>{lesson.title}</span>
                        <span className="t-chip lesson">Lesson</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Details panel */}
        <div className="t-col-side">
          <div className="t-card">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>2 · Details</div>

            {/* Title */}
            <div className="t-form-group">
              <label className="t-label">Title</label>
              <input
                className="t-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Assignment title…"
              />
            </div>

            {/* Selected items */}
            {selectedItems.length > 0 && (
              <div className="t-form-group">
                <label className="t-label">Selected ({selectedItems.length})</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selectedItems.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 10px', background: '#F4FBF9', borderRadius: 8,
                      border: '1px solid var(--t-teal-l)', fontSize: 13,
                    }}>
                      <span style={{ flex: 1 }}>{item.title}</span>
                      <span className={`t-chip ${item.type}`}>{item.type}</span>
                      <button
                        onClick={() => toggleItem(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-mute)', fontSize: 16, lineHeight: 1 }}
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assign to */}
            <div className="t-form-group">
              <label className="t-label">Assign to</label>
              <div style={{ display: 'flex', borderRadius: 8, border: '2px solid var(--t-ink)', overflow: 'hidden', marginBottom: assignTo === 'students' ? 10 : 0 }}>
                {['class', 'students'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAssignTo(opt)}
                    style={{
                      flex: 1, padding: '8px', border: 'none',
                      background: assignTo === opt ? 'var(--t-teal)' : '#fff',
                      color: assignTo === opt ? '#fff' : 'var(--t-ink)',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      borderRight: opt === 'class' ? '2px solid var(--t-ink)' : 'none',
                    }}
                  >
                    {opt === 'class' ? 'Whole class' : 'Choose students'}
                  </button>
                ))}
              </div>
              {assignTo === 'students' && students.length > 0 && (
                <div style={{ maxHeight: 160, overflowY: 'auto', border: '2px solid var(--t-line)', borderRadius: 8 }}>
                  {students.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid var(--t-line)' }}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => setSelectedStudents(prev =>
                          prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                        )}
                        style={{ accentColor: 'var(--t-teal)' }}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              <div>
                <label className="t-label">Opens</label>
                <input type="datetime-local" className="t-input" style={{ fontSize: 13 }} value={opensAt} onChange={e => setOpensAt(e.target.value)} />
              </div>
              <div>
                <label className="t-label">Due</label>
                <input type="datetime-local" className="t-input" style={{ fontSize: 13 }} value={dueAt} onChange={e => setDueAt(e.target.value)} />
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { key: 'pinUpNext', label: 'Put at top of Up next', value: pinUpNext, set: setPinUpNext },
                { key: 'allowLate', label: 'Allow late work', value: allowLate, set: setAllowLate },
                { key: 'lockOrder', label: 'Lock in order', value: lockOrder, set: setLockOrder },
              ].map(opt => (
                <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={opt.value}
                    onChange={e => opt.set(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--t-teal)', cursor: 'pointer' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {error && (
              <div style={{ background: '#FFE4E6', border: '1.5px solid #FCA5A5', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#B91C1C', marginBottom: 12 }}>
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="t-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleSubmit(false)} disabled={isPending}>
                {isPending ? 'Saving…' : 'Assign'}
              </button>
              <button className="t-btn ghost sm" onClick={() => handleSubmit(true)} disabled={isPending}>
                Save draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
