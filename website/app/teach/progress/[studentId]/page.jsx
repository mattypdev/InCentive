import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TeachShell from '../../TeachShell'
import { ArrowLeft } from 'lucide-react'
import { relativeTime, scoreClass, scoreLabel, avatarColor } from '@/lib/teachUtils'

export const metadata = { title: 'Student · Incentive Teach' }

export default async function StudentDetailPage({ params, searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach/progress')

  const { studentId } = await params
  const sp = await searchParams
  const classId = sp?.class

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

  // Student profile
  const [profileRes, memberRes, lpRes, streakRes] = await Promise.all([
    supabase.from('profiles').select('id, first_name, last_initial, class_email, is_class_account').eq('id', studentId).single(),
    supabase.from('group_members').select('joined_at').eq('group_id', activeClass.id).eq('user_id', studentId).single(),
    supabase.from('lesson_progress').select('lesson_id, score, completed, updated_at').eq('user_id', studentId).order('updated_at', { ascending: false }),
    supabase.from('streaks').select('current, last_active_on').eq('user_id', studentId).single(),
  ])

  const profile = profileRes.data
  if (!profile) redirect(`/teach/progress${q}`)

  const lp = lpRes.data ?? []
  const completed = lp.filter(l => l.completed)
  const scores = completed.map(l => l.score).filter(s => s != null)
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

  // Class median
  const { data: classMembers } = await supabase.from('group_members').select('user_id').eq('group_id', activeClass.id).eq('role', 'student')
  const classIds = (classMembers ?? []).map(m => m.user_id).filter(id => id !== studentId)
  let classMedianScore = null
  if (classIds.length) {
    const { data: classLp } = await supabase.from('lesson_progress').select('score').in('user_id', classIds).eq('completed', true)
    const cs = (classLp ?? []).map(l => l.score).filter(s => s != null).sort((a, b) => a - b)
    classMedianScore = cs.length ? cs[Math.floor(cs.length / 2)] : null
  }

  const name = `${profile.first_name ?? ''} ${profile.last_initial ? profile.last_initial + '.' : ''}`.trim()
  const initials = `${(profile.first_name ?? 'S')[0]}${(profile.last_initial ?? 'S')[0]}`.toUpperCase()
  const bgColor = avatarColor(studentId)

  // Open assignments
  const { data: openAssignments } = await supabase
    .from('assignments')
    .select('id, title, lesson_id, unit_id, due_at, opens_at')
    .eq('group_id', activeClass.id)
    .eq('is_draft', false)
    .not('due_at', 'is', null)
    .gte('due_at', new Date().toISOString())
    .order('due_at')
    .limit(5)

  // Island progress
  const [islandsRes, lessonsRes] = await Promise.all([
    supabase.from('islands').select('slug, title, sort').order('sort'),
    supabase.from('lessons').select('id, unit_id').order('sort'),
  ])
  const { data: unitsData } = await supabase.from('units').select('id, island').order('sort')

  const islandProgress = (islandsRes.data ?? []).map(isl => {
    const islandUnits = (unitsData ?? []).filter(u => u.island === isl.slug)
    const islandLessonIds = new Set((lessonsRes.data ?? []).filter(l => islandUnits.some(u => u.id === l.unit_id)).map(l => l.id))
    const total = islandLessonIds.size
    const done = completed.filter(l => islandLessonIds.has(l.lesson_id)).length
    return { slug: isl.slug, title: isl.title, done, total }
  }).filter(i => i.total > 0)

  // Missed questions
  const { data: attempts } = await supabase.from('attempts').select('id').eq('user_id', studentId)
  let missedConcepts = []
  if (attempts?.length) {
    const { data: wrongAnswers } = await supabase
      .from('answers')
      .select('question_id')
      .in('attempt_id', attempts.map(a => a.id))
      .eq('correct', false)
    const qCounts = {}
    for (const a of wrongAnswers ?? []) {
      qCounts[a.question_id] = (qCounts[a.question_id] ?? 0) + 1
    }
    missedConcepts = Object.entries(qCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([qid, count]) => ({ id: qid, count }))
  }

  const recentWork = completed.slice(0, 10)
  const joinedDate = memberRes.data?.joined_at
    ? new Date(memberRes.data.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'
  const lastActive = streakRes.data?.last_active_on ?? null

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach/progress" classId={activeClass.id} />
      <main className="t-main">

        {/* Back */}
        <Link href={`/teach/progress${q}`} style={{ color: 'var(--t-mute)', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginBottom: 14 }}>
          <ArrowLeft size={14} /> Progress
        </Link>

        {/* Student header */}
        <div className="t-hrow">
          <div className="t-avatar" style={{ background: bgColor, width: 48, height: 48, fontSize: 18 }}>{initials}</div>
          <div>
            <h1>{name}</h1>
            <p className="t-sub">
              {profile.class_email ?? 'Class account'}
              {' · '}Joined {joinedDate}
              {lastActive && ` · Last active ${relativeTime(lastActive)}`}
            </p>
          </div>
          <div className="t-spacer" />
          <Link href={`/teach/assignments/new${q}&student=${studentId}`} className="t-btn ghost sm">Assign review</Link>
          <Link href={`/teach/assignments/new${q}`} className="t-btn sm">Assign work</Link>
        </div>

        {/* KPIs */}
        <div className="t-kpis" style={{ marginBottom: 20 }}>
          <div className="t-card">
            <div className="t-card-label">Lessons finished</div>
            <div className="t-kpi-num">{completed.length}</div>
            <div className="t-kpi-label">{classMedianScore != null ? `class avg ${classMedianScore}%` : 'no class data'}</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Average score</div>
            <div className="t-kpi-num">{avgScore != null ? `${avgScore}%` : '—'}</div>
            <div className="t-kpi-label">{classMedianScore != null ? `class ${classMedianScore}%` : '—'}</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">On time</div>
            <div className="t-kpi-num">—</div>
            <div className="t-kpi-label">no due dates</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Streak</div>
            <div className="t-kpi-num">{streakRes.data?.current ?? 0}</div>
            <div className="t-kpi-label">days</div>
          </div>
        </div>

        <div className="t-cols">
          {/* Left column */}
          <div className="t-col-main" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Ideas to work on */}
            {missedConcepts.length > 0 && (
              <div className="t-card">
                <div className="t-card-label" style={{ marginBottom: 10 }}>Ideas to work on</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  {missedConcepts.map(mc => (
                    <div key={mc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#FFF7ED', borderRadius: 8, fontSize: 13 }}>
                      <span style={{ flex: 1, fontWeight: 600 }}>Question {mc.id.slice(-8)}</span>
                      <span style={{ color: 'var(--t-mute)', fontSize: 12 }}>missed {mc.count}×</span>
                    </div>
                  ))}
                </div>
                <Link href={`/teach/assignments/new${q}&student=${studentId}`} className="t-btn sm">
                  Assign a review
                </Link>
              </div>
            )}

            {/* Recent work */}
            <div className="t-card" style={{ padding: 0 }}>
              <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #E7E2D3' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Recent work</span>
              </div>
              {recentWork.length === 0 ? (
                <div style={{ padding: '20px 18px', color: 'var(--t-mute)', fontSize: 13 }}>No completed lessons yet.</div>
              ) : (
                <table className="t-table">
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Score</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentWork.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: 13 }}>{r.lesson_id}</td>
                        <td><span className={`m ${scoreClass(r.score)}`}>{scoreLabel(r.score)}</span></td>
                        <td style={{ color: 'var(--t-mute)', fontSize: 12.5 }}>{relativeTime(r.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

          {/* Right column */}
          <div className="t-col-side">

            {/* Islands progress */}
            <div className="t-card">
              <div className="t-card-label" style={{ marginBottom: 12 }}>Islands</div>
              {islandProgress.map(isl => (
                <div key={isl.slug} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    <span>{isl.title}</span>
                    <span style={{ color: 'var(--t-mute)', fontWeight: 400 }}>{isl.done}/{isl.total}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: '#E7E2D3', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isl.total > 0 ? `${Math.round((isl.done / isl.total) * 100)}%` : '0%', background: 'var(--t-teal)', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Open assignments */}
            {openAssignments && openAssignments.length > 0 && (
              <div className="t-card">
                <div className="t-card-label" style={{ marginBottom: 10 }}>Open assignments</div>
                {openAssignments.map(a => (
                  <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid #E7E2D3', fontSize: 13 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{a.title ?? a.lesson_id ?? 'Assignment'}</div>
                    <div style={{ color: 'var(--t-mute)', fontSize: 12 }}>
                      Due {a.due_at ? new Date(a.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Account card */}
            <div className="t-card">
              <div className="t-card-label" style={{ marginBottom: 10 }}>Account</div>
              <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--t-mute)' }}>Account type</span>
                  <span className={`t-chip ${profile.is_class_account ? 'ok' : 'check'}`}>
                    {profile.is_class_account ? 'Class account' : 'Personal'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--t-mute)' }}>Reset PIN</span>
                  <button className="t-btn ghost xs">Reset</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--t-mute)' }}>Remove from class</span>
                  <button className="t-btn ghost xs" style={{ color: '#B91C1C' }}>Remove</button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
