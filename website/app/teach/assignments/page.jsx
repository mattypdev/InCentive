import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TeachShell from '../TeachShell'
import { Plus } from 'lucide-react'
import { scoreClass } from '@/lib/teachUtils'

export const metadata = { title: 'Assignments · Incentive Teach' }

export default async function AssignmentsPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach/assignments')

  const params = await searchParams
  const classId = params?.class
  const tab = params?.tab ?? 'active'

  // Resolve active class
  const { data: classes } = await supabase
    .from('groups')
    .select('id, name, code, period')
    .eq('owner_id', user.id)
    .eq('kind', 'class')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  if (!classes?.length) redirect('/teach/classes/new')
  const activeClass = classId ? classes.find(c => c.id === classId) : classes[0]
  if (!activeClass) redirect('/teach/classes/new')

  const q = `?class=${activeClass.id}`
  const now = new Date().toISOString()

  // Load all assignments for this class
  const { data: allAssignments } = await supabase
    .from('assignments')
    .select('id, title, unit_id, lesson_id, items, opens_at, due_at, is_draft, is_review, created_at')
    .eq('group_id', activeClass.id)
    .order('due_at', { ascending: true, nullsFirst: false })

  const assignments = allAssignments ?? []

  // Categorize
  const active = assignments.filter(a => !a.is_draft && a.opens_at <= now && (!a.due_at || a.due_at >= now))
  const scheduled = assignments.filter(a => !a.is_draft && a.opens_at > now)
  const past = assignments.filter(a => !a.is_draft && a.due_at && a.due_at < now)
  const drafts = assignments.filter(a => a.is_draft)

  const tabData = { active, scheduled, past }
  const currentList = tabData[tab] ?? active

  // Student count
  const { count: studentCount } = await supabase
    .from('group_members')
    .select('user_id', { count: 'exact', head: true })
    .eq('group_id', activeClass.id)
    .eq('role', 'student')

  function assignmentName(a) {
    if (a.title) return a.title
    if (a.lesson_id) return a.lesson_id
    if (a.unit_id) return a.unit_id
    if (a.is_review) return 'Review assignment'
    return 'Untitled'
  }

  function assignmentChips(a) {
    const chips = []
    if (a.lesson_id) chips.push({ label: 'Lesson', cls: 'lesson' })
    if (a.unit_id && !a.lesson_id) chips.push({ label: 'Unit', cls: 'check' })
    if (a.is_review) chips.push({ label: 'Review', cls: 'warn' })
    if (Array.isArray(a.items) && a.items.length > 0) chips.push({ label: `${a.items.length} items`, cls: 'swipe' })
    return chips
  }

  const tabs = [
    { key: 'active',    label: `Active (${active.length})` },
    { key: 'scheduled', label: `Scheduled (${scheduled.length})` },
    { key: 'past',      label: `Past (${past.length})` },
  ]

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach/assignments" classId={activeClass.id} assignmentCount={active.length} />
      <main className="t-main">

        <div className="t-hrow">
          <div>
            <h1>Assignments</h1>
            <p className="t-sub">{activeClass.period ? `${activeClass.period} · ` : ''}{activeClass.name}</p>
          </div>
          <div className="t-spacer" />
          <Link href={`/teach/assignments/new${q}`} className="t-btn">
            <Plus size={16} />
            New assignment
          </Link>
        </div>

        {/* Tabs */}
        <div className="t-tabs">
          {tabs.map(t => (
            <Link
              key={t.key}
              href={`/teach/assignments${q}&tab=${t.key}`}
              className={`t-tab${tab === t.key ? ' on' : ''}`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Assignment table */}
        {currentList.length === 0 ? (
          <div className="t-card">
            <div className="t-empty">
              <h3>No assignments yet</h3>
              <p>Create one to get started.</p>
              <Link href={`/teach/assignments/new${q}`} className="t-btn">
                <Plus size={16} />
                New assignment
              </Link>
            </div>
          </div>
        ) : (
          <div className="t-card" style={{ padding: 0 }}>
            <table className="t-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Assigned to</th>
                  <th>Due</th>
                  <th>Progress</th>
                  <th>Avg score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentList.map(a => {
                  const chips = assignmentChips(a)
                  const dueDate = a.due_at
                    ? new Date(a.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '—'
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{assignmentName(a)}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {chips.map((c, i) => <span key={i} className={`t-chip ${c.cls}`}>{c.label}</span>)}
                        </div>
                      </td>
                      <td style={{ color: 'var(--t-mute)', fontSize: 13 }}>
                        Whole class
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--t-mute)', whiteSpace: 'nowrap' }}>
                        {dueDate}
                      </td>
                      <td style={{ minWidth: 100 }}>
                        <div className="t-stack" style={{ marginBottom: 3 }}>
                          <div className="t-stack-done" style={{ width: '0%' }} />
                          <div className="t-stack-started" style={{ width: '0%' }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t-mute)' }}>0/{studentCount ?? 0}</div>
                      </td>
                      <td>
                        <span className="m m0">—</span>
                      </td>
                      <td>
                        <Link href={`/teach/assignments/${a.id}${q}`} className="t-btn ghost xs">Open</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Drafts row */}
        {drafts.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--t-mute)' }}>Drafts ({drafts.length})</div>
            <div className="t-card" style={{ padding: 0 }}>
              {drafts.map(a => (
                <div key={a.id} style={{ padding: '10px 18px', borderBottom: '1px solid #E7E2D3', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{assignmentName(a)}</span>
                  <span className="t-chip draft">Draft</span>
                  <Link href={`/teach/assignments/${a.id}${q}`} className="t-btn ghost xs">Edit</Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
