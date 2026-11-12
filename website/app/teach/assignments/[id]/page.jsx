import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TeachShell from '../../TeachShell'
import { ArrowLeft } from 'lucide-react'
import { scoreClass, scoreLabel, avatarColor } from '@/lib/teachUtils'

export const metadata = { title: 'Assignment · Incentive Teach' }

export default async function AssignmentDetailPage({ params, searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach/assignments')

  const { id } = await params
  const sp = await searchParams
  const classId = sp?.class
  const filter = sp?.filter ?? 'all' // all | notdone | under60

  // Load assignment
  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, group_id, title, unit_id, lesson_id, items, opens_at, due_at, is_draft, is_review, settings')
    .eq('id', id)
    .single()

  if (!assignment) redirect('/teach/assignments')

  // Resolve active class
  const { data: classes } = await supabase
    .from('groups')
    .select('id, name, code, period')
    .eq('owner_id', user.id)
    .eq('kind', 'class')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  const activeClass = classId
    ? classes?.find(c => c.id === classId)
    : classes?.find(c => c.id === assignment.group_id)
  const resolvedClassId = activeClass?.id ?? assignment.group_id
  const q = `?class=${resolvedClassId}`

  // Students
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', assignment.group_id)
    .eq('role', 'student')

  const studentIds = (members ?? []).map(m => m.user_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_initial')
    .in('id', studentIds)

  // Get lesson progress for the lesson
  const lessonId = assignment.lesson_id
  let studentRows = []

  if (lessonId) {
    const { data: lp } = await supabase
      .from('lesson_progress')
      .select('user_id, score, completed, updated_at')
      .in('user_id', studentIds)
      .eq('lesson_id', lessonId)

    studentRows = (profiles ?? []).map(p => {
      const progress = lp?.find(l => l.user_id === p.id)
      return {
        id: p.id,
        name: `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim(),
        score: progress?.score ?? null,
        status: !progress ? 'not-started' : progress.completed ? 'done' : 'started',
        updatedAt: progress?.updated_at ?? null,
      }
    })
  } else {
    studentRows = (profiles ?? []).map(p => ({
      id: p.id,
      name: `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim(),
      score: null,
      status: 'not-started',
      updatedAt: null,
    }))
  }

  // Apply filter
  const filteredRows = studentRows.filter(r => {
    if (filter === 'notdone') return r.status !== 'done'
    if (filter === 'under60') return r.score !== null && r.score < 60
    return true
  })

  // KPIs
  const doneCount  = studentRows.filter(r => r.status === 'done').length
  const scores     = studentRows.filter(r => r.score !== null).map(r => r.score)
  const avgScore   = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const notStarted = studentRows.filter(r => r.status === 'not-started').length
  const under60    = studentRows.filter(r => r.score !== null && r.score < 60).length

  // Question stats
  let questionStats = []
  if (lessonId) {
    const { data: attempts } = await supabase
      .from('attempts')
      .select('id')
      .in('user_id', studentIds)
      .eq('lesson_id', lessonId)
    if (attempts?.length) {
      const { data: answers } = await supabase
        .from('answers')
        .select('question_id, correct')
        .in('attempt_id', attempts.map(a => a.id))
      const qMap = {}
      for (const a of answers ?? []) {
        if (!qMap[a.question_id]) qMap[a.question_id] = { total: 0, correct: 0 }
        qMap[a.question_id].total++
        if (a.correct) qMap[a.question_id].correct++
      }
      questionStats = Object.entries(qMap)
        .map(([qid, v]) => ({
          id: qid,
          correctRate: Math.round((v.correct / v.total) * 100),
          total: v.total,
        }))
        .sort((a, b) => a.correctRate - b.correctRate)
    }
  }

  const assignName = assignment.title ?? assignment.lesson_id ?? assignment.unit_id ?? 'Assignment'
  const openDate = assignment.opens_at ? new Date(assignment.opens_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
  const dueDate  = assignment.due_at   ? new Date(assignment.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'

  const statusChipClass = { 'done': 'done', 'started': 'warn', 'not-started': 'off' }

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach/assignments" classId={resolvedClassId} />
      <main className="t-main">

        {/* Back + Header */}
        <div style={{ marginBottom: 6 }}>
          <Link href={`/teach/assignments${q}`} style={{ color: 'var(--t-mute)', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginBottom: 8 }}>
            <ArrowLeft size={14} /> Assignments
          </Link>
        </div>

        <div className="t-hrow">
          <div>
            <h1>{assignName}</h1>
            <p className="t-sub">Assigned to whole class · Opened {openDate} · Due {dueDate}</p>
          </div>
          <div className="t-spacer" />
          <button className="t-btn ghost sm">Change due date</button>
          <Link href={`/teach/assignments/new${q}`} className="t-btn ghost sm">Edit</Link>
        </div>

        {/* KPIs */}
        <div className="t-kpis" style={{ marginBottom: 20 }}>
          <div className="t-card">
            <div className="t-card-label">Done</div>
            <div className="t-kpi-num">{doneCount}<span style={{ fontSize: 16, fontWeight: 600 }}>/{studentIds.length}</span></div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Avg score</div>
            <div className="t-kpi-num">{avgScore != null ? `${avgScore}%` : '—'}</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Not started</div>
            <div className="t-kpi-num">{notStarted}</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Under 60%</div>
            <div className="t-kpi-num">{under60}</div>
          </div>
        </div>

        <div className="t-cols">
          {/* Left: Students table */}
          <div className="t-col-main">
            <div className="t-card" style={{ padding: 0 }}>
              <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #E7E2D3', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Students</span>
                <div className="t-spacer" />
                {/* Filter tabs */}
                {[
                  { key: 'all', label: 'All' },
                  { key: 'notdone', label: 'Not done' },
                  { key: 'under60', label: 'Under 60%' },
                ].map(f => (
                  <Link
                    key={f.key}
                    href={`/teach/assignments/${id}${q}&filter=${f.key}`}
                    className={`t-btn ghost xs${filter === f.key ? '' : ''}`}
                    style={filter === f.key ? { background: 'var(--t-teal)', color: '#fff' } : {}}
                  >
                    {f.label}
                  </Link>
                ))}
              </div>
              <table className="t-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--t-mute)', padding: '20px' }}>No students match this filter.</td></tr>
                  ) : filteredRows.map(row => (
                    <tr key={row.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="t-avatar" style={{ background: avatarColor(row.id) }}>
                            {row.name.split(' ').map(w => w[0] ?? '').join('').slice(0,2).toUpperCase()}
                          </div>
                          <Link href={`/teach/progress/${row.id}${q}`} style={{ fontWeight: 600, color: 'var(--t-ink)' }}>
                            {row.name}
                          </Link>
                        </div>
                      </td>
                      <td><span className={`m ${scoreClass(row.score)}`}>{scoreLabel(row.score)}</span></td>
                      <td><span className={`t-chip ${statusChipClass[row.status] ?? 'off'}`}>{row.status.replace('-', ' ')}</span></td>
                      <td>
                        <Link href={`/teach/progress/${row.id}${q}`} className="t-btn ghost xs">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bulk action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {notStarted > 0 && (
                <button className="t-btn ghost sm">
                  Nudge the {notStarted} who haven't started
                </button>
              )}
              {under60 > 0 && (
                <button className="t-btn ghost sm">
                  Assign review to the {under60} under 60%
                </button>
              )}
            </div>
          </div>

          {/* Right: Question stats */}
          {questionStats.length > 0 && (
            <div className="t-col-side">
              <div className="t-card">
                <div className="t-card-label" style={{ marginBottom: 10 }}>Questions (hardest first)</div>
                {questionStats.map((q, i) => (
                  <div key={q.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < questionStats.length - 1 ? '1px solid #E7E2D3' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t-mute)', background: '#F1F5F9', padding: '1px 6px', borderRadius: 4 }}>Q{i + 1}</span>
                      <span className={`m ${scoreClass(q.correctRate)}`}>{q.correctRate}%</span>
                      <span style={{ fontSize: 11, color: 'var(--t-mute)' }}>{q.total} answers</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 8, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${q.correctRate}%`, background: q.correctRate >= 70 ? '#99F6E4' : q.correctRate >= 50 ? '#FDE68A' : '#FDBA74', borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
