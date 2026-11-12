'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Copy, Users } from 'lucide-react'
import { addStudentsByName, renameClass, inviteCoTeacher } from '@/app/actions/teach'
import { useRouter } from 'next/navigation'
import { scoreClass, scoreLabel, avatarColor } from '@/lib/teachUtils'

export default function StudentsClient({ activeClass, students, coTeachers }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [namesInput, setNamesInput] = useState('')
  const [coTeacherEmail, setCoTeacherEmail] = useState('')
  const [newClassName, setNewClassName] = useState(activeClass.name)
  const [copied, setCopied] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [newCredentials, setNewCredentials] = useState(null) // [{name, username, pin}]
  const [renameSuccess, setRenameSuccess] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')

  const joinUrl = `https://incentivefinance.org/join?code=${activeClass.code}`

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.username?.toLowerCase().includes(search.toLowerCase())
  )

  const displayedStudents = showAll ? filtered : filtered.slice(0, 10)
  const namesCount = namesInput.split('\n').filter(n => n.trim()).length

  function copyLink() {
    navigator.clipboard.writeText(joinUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleAddStudents() {
    setAddError('')
    setAddSuccess('')
    setNewCredentials(null)
    const names = namesInput.split('\n').filter(n => n.trim())
    if (!names.length) return
    startTransition(async () => {
      const result = await addStudentsByName(activeClass.id, names)
      if (result.error) { setAddError(result.error); return }
      setAddSuccess(`Added ${result.added} student${result.added !== 1 ? 's' : ''}!`)
      setNewCredentials(result.credentials ?? null)
      setNamesInput('')
      router.refresh()
    })
  }

  function handleRename() {
    if (!newClassName.trim()) return
    startTransition(async () => {
      const result = await renameClass(activeClass.id, newClassName.trim())
      if (!result.error) { setRenameSuccess(true); router.refresh() }
    })
  }

  function handleInviteCoTeacher() {
    if (!coTeacherEmail.trim()) return
    startTransition(async () => {
      const result = await inviteCoTeacher(activeClass.id, coTeacherEmail.trim())
      setInviteMsg(result.error ?? 'Invite sent!')
      setCoTeacherEmail('')
    })
  }

  function formatLastActive(daysAgo) {
    if (daysAgo === null) return 'Never'
    if (daysAgo === 0) return 'Today'
    if (daysAgo === 1) return 'Yesterday'
    return `${daysAgo}d ago`
  }

  return (
    <main className="t-main">
      <div className="t-hrow">
        <div>
          <h1>Students</h1>
          <p className="t-sub">{activeClass.period ? `${activeClass.period} · ` : ''}{activeClass.name} · {students.length} enrolled</p>
        </div>
      </div>

      <div className="t-cols" style={{ alignItems: 'flex-start' }}>

        {/* Left: Roster */}
        <div className="t-col-main">
          <div className="t-card" style={{ padding: 0 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #E7E2D3', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Roster</span>
              <span style={{ color: 'var(--t-mute)', fontSize: 13 }}>{students.length}</span>
              <div className="t-spacer" />
              <input
                className="t-search"
                style={{ width: 200, minWidth: 0 }}
                placeholder="Search students…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {students.length === 0 ? (
              <div className="t-empty">
                <Users size={32} style={{ marginBottom: 8, color: 'var(--t-mute)' }} />
                <h3>No students yet</h3>
                <p>Add names below or share the join code.</p>
              </div>
            ) : (
              <>
                <table className="t-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Last active</th>
                      <th>Lessons</th>
                      <th>Avg score</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStudents.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="t-avatar" style={{ background: avatarColor(s.id) }}>
                              {s.name.split(' ').map(w => w[0] ?? '').join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <Link href={`/teach/progress/${s.id}?class=${activeClass.id}`} style={{ fontWeight: 600, color: 'var(--t-ink)' }}>
                                {s.name}
                              </Link>
                              {s.username && (
                                <div style={{ fontSize: 11.5, color: 'var(--t-mute)' }}>{s.username}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--t-mute)', fontSize: 13 }}>
                          {s.hasJoined ? formatLastActive(s.lastActiveDaysAgo) : (
                            <span className="t-chip off">Not joined</span>
                          )}
                        </td>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{s.lessonsCount}</td>
                        <td><span className={`m ${scoreClass(s.avgScore)}`}>{scoreLabel(s.avgScore)}</span></td>
                        <td>
                          <button className="t-btn ghost xs">Reset PIN</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length > 10 && (
                  <div style={{ padding: '12px 18px', borderTop: '1.5px solid #E7E2D3', textAlign: 'center' }}>
                    <button
                      className="t-btn ghost sm"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? 'Show fewer' : `Show all ${filtered.length}`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="t-col-side">

          {/* Join code card */}
          <div className="t-card" style={{ background: '#F4FBF9' }}>
            <div className="t-card-label">Join code</div>
            <div className="t-code-big">{activeClass.code}</div>
            <div className="t-code-url">incentivefinance.org/join · enter code {activeClass.code}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button className="t-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={copyLink}>
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy join link'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t-mute)' }}>
              Students visit <strong>incentivefinance.org/join</strong> and enter the code, or use your link.
            </div>
          </div>

          {/* Add students card */}
          <div className="t-card">
            <div className="t-card-label" style={{ marginBottom: 10 }}>Add students</div>
            <textarea
              className="t-input"
              rows={5}
              placeholder={'One name per line:\nAisha Khan\nJordan Patel\nLeo Martinez'}
              value={namesInput}
              onChange={e => setNamesInput(e.target.value)}
              style={{ resize: 'vertical', fontSize: 13 }}
            />
            {addError && (
              <div style={{ background: '#FFE4E6', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#B91C1C', marginTop: 6 }}>{addError}</div>
            )}
            {addSuccess && (
              <div style={{ background: '#DCFCE7', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#166534', marginTop: 6 }}>{addSuccess}</div>
            )}
            <button
              className="t-btn"
              style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}
              onClick={handleAddStudents}
              disabled={isPending || namesCount === 0}
            >
              {isPending ? 'Adding…' : `Add ${namesCount > 0 ? namesCount : ''} student${namesCount !== 1 ? 's' : ''}`}
            </button>
          </div>

          {/* Credential sheet — shown once after adding */}
          {newCredentials?.length > 0 && (
            <div className="t-card" style={{ background: '#FFFBEB', border: '2px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Student sign-in info</div>
                  <div style={{ fontSize: 12, color: 'var(--t-mute)', marginTop: 2 }}>Give these to students. They sign in at <strong>incentivefinance.org/join</strong> using their username + PIN.</div>
                </div>
                <button className="t-btn ghost sm" onClick={() => setNewCredentials(null)} style={{ flexShrink: 0 }}>Dismiss</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #F59E0B' }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 700, fontSize: 11, color: 'var(--t-mute)' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 700, fontSize: 11, color: 'var(--t-mute)' }}>Username</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 700, fontSize: 11, color: 'var(--t-mute)' }}>PIN</th>
                  </tr>
                </thead>
                <tbody>
                  {newCredentials.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #FDE68A' }}>
                      <td style={{ padding: '6px 8px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>{c.username}</td>
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>{c.pin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Class settings card */}
          <div className="t-card">
            <div className="t-card-label" style={{ marginBottom: 12 }}>Class settings</div>

            {/* Co-teacher */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Co-teacher</div>
              {coTeachers.length > 0 ? (
                <div style={{ fontSize: 13, color: 'var(--t-mute)', marginBottom: 6 }}>
                  {coTeachers.length} co-teacher{coTeachers.length !== 1 ? 's' : ''} added
                </div>
              ) : null}
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className="t-input"
                  style={{ flex: 1, fontSize: 13 }}
                  placeholder="teacher@school.edu"
                  value={coTeacherEmail}
                  onChange={e => setCoTeacherEmail(e.target.value)}
                />
                <button className="t-btn sm" onClick={handleInviteCoTeacher} disabled={isPending}>Invite</button>
              </div>
              {inviteMsg && <div style={{ fontSize: 12, color: 'var(--t-mute)', marginTop: 4 }}>{inviteMsg}</div>}
            </div>

            {/* Rename */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Class name</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className="t-input"
                  style={{ flex: 1, fontSize: 13 }}
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                />
                <button className="t-btn sm" onClick={handleRename} disabled={isPending}>
                  {renameSuccess ? 'Saved!' : 'Rename'}
                </button>
              </div>
            </div>

            {/* Archive */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Archive class</div>
              <button className="t-btn ghost sm" style={{ color: '#B91C1C' }}>Archive class</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
