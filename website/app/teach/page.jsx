import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TeachShell from './TeachShell'
import { Plus, Users } from 'lucide-react'
import CopyButton from './CopyButton'
import { relativeTime, scoreClass, scoreLabel, avatarColor } from '@/lib/teachUtils'

export const metadata = { title: 'Overview · Incentive Teach' }

export default async function TeachHome({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach')

  const params = await searchParams
  const classId = params?.class

  // Load teacher profile
  const { data: teacherProfile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  // Load classes
  const { data: classes } = await supabase
    .from('groups')
    .select('id, name, code, period, grade, subject')
    .eq('owner_id', user.id)
    .eq('kind', 'class')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  if (!classes?.length) redirect('/teach/classes/new')

  const activeClass = classId ? classes.find(c => c.id === classId) : classes[0]
  if (!activeClass) redirect('/teach/classes/new')

  // Load student count
  const { count: studentCount } = await supabase
    .from('group_members')
    .select('user_id', { count: 'exact', head: true })
    .eq('group_id', activeClass.id)
    .eq('role', 'student')

  // If no students → show FirstRun
  if (!studentCount || studentCount === 0) {
    return <FirstRun activeClass={activeClass} teacherName={teacherProfile?.first_name} classId={activeClass.id} />
  }

  // Load overview data
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString()

  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', activeClass.id)
    .eq('role', 'student')

  const studentIds = (members ?? []).map(m => m.user_id)

  // KPI data
  const [lpWeekRes, lpAllRes, assignDueRes, streaksRes, profilesRes] = await Promise.all([
    supabase.from('lesson_progress').select('user_id, score, completed').in('user_id', studentIds).gte('updated_at', sevenDaysAgo),
    supabase.from('lesson_progress').select('user_id, lesson_id, score, completed, updated_at').in('user_id', studentIds).order('updated_at', { ascending: false }),
    supabase.from('assignments').select('id, title, unit_id, lesson_id, opens_at, due_at, items').eq('group_id', activeClass.id).eq('is_draft', false).not('due_at', 'is', null).gte('due_at', now.toISOString()).order('due_at').limit(5),
    supabase.from('streaks').select('user_id, last_active_on').in('user_id', studentIds),
    supabase.from('profiles').select('id, first_name, last_initial').in('id', studentIds),
  ])

  const lpWeek = lpWeekRes.data ?? []
  const lpAll  = lpAllRes.data ?? []
  const dueSoon = assignDueRes.data ?? []
  const streaks = streaksRes.data ?? []
  const profiles = profilesRes.data ?? []

  const activeUsers = new Set(lpWeek.map(r => r.user_id))
  const completedAll = lpAll.filter(r => r.completed)
  const allScores = completedAll.map(r => r.score).filter(s => s != null)
  const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null

  // Needs attention
  const needsAttention = []
  for (const p of profiles) {
    const streak = streaks.find(s => s.user_id === p.id)
    const lastActive = streak?.last_active_on ? new Date(streak.last_active_on) : null
    const daysInactive = lastActive ? Math.floor((now.getTime() - lastActive.getTime()) / 86400000) : 999
    const name = `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim()

    if (daysInactive >= 5) {
      needsAttention.push({ id: p.id, name, reason: `No activity · ${daysInactive === 999 ? 'never' : daysInactive + ' days'}`, kind: 'inactive' })
    } else {
      const userScores = completedAll.filter(lp => lp.user_id === p.id).map(lp => lp.score).filter(s => s != null)
      if (userScores.length) {
        const avg = userScores.reduce((a, b) => a + b, 0) / userScores.length
        if (avg < 60) {
          needsAttention.push({ id: p.id, name, reason: `Under 60% · ${userScores.length} lesson${userScores.length !== 1 ? 's' : ''}`, kind: 'low' })
        }
      }
    }
  }

  // Most-missed question (this week)
  const { data: attWeek } = await supabase
    .from('attempts')
    .select('id, user_id')
    .in('user_id', studentIds)
    .gte('completed_at', sevenDaysAgo)

  let mostMissed = null
  if (attWeek?.length) {
    const { data: ans } = await supabase
      .from('answers')
      .select('question_id, correct')
      .in('attempt_id', attWeek.map(a => a.id))
    if (ans?.length) {
      const qMap = {}
      for (const a of ans) {
        if (!qMap[a.question_id]) qMap[a.question_id] = { total: 0, correct: 0 }
        qMap[a.question_id].total++
        if (a.correct) qMap[a.question_id].correct++
      }
      const worst = Object.entries(qMap)
        .filter(([, v]) => v.total >= 2)
        .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))[0]
      if (worst) {
        mostMissed = {
          id: worst[0],
          correctRate: Math.round((worst[1].correct / worst[1].total) * 100),
          total: worst[1].total,
        }
      }
    }
  }

  // Mastery by unit
  const { data: units } = await supabase.from('units').select('id, title, island').order('sort').limit(7)
  const masteryByUnit = (units ?? []).map(unit => {
    const lessons = completedAll.filter(lp => lp.lesson_id?.startsWith(unit.id))
    const sc = lessons.map(l => l.score).filter(s => s != null)
    return {
      id: unit.id,
      title: unit.title,
      avgScore: sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : null,
      count: sc.length,
    }
  }).filter(u => u.avgScore !== null)

  // Recent activity — last 10 sorted
  const recentActivity = lpAll
    .slice(0, 10)
    .map(r => {
      const p = profiles.find(pr => pr.id === r.user_id)
      return {
        userId: r.user_id,
        name: p ? `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim() : 'Student',
        initials: p ? (((p.first_name ?? 'S')[0]) + ((p.last_initial ?? 'S')[0])).toUpperCase() : 'S',
        lessonId: r.lesson_id,
        score: r.score,
        completed: r.completed,
        updatedAt: r.updated_at,
      }
    })

  // Greeting
  const h = now.getHours()
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  const todayStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach" classId={activeClass.id} />
      <main className="t-main">

        {/* Header */}
        <div className="t-hrow">
          <div>
            <h1>{greet}{teacherProfile?.first_name ? `, ${teacherProfile.first_name}` : ''}</h1>
            <p className="t-sub">{todayStr} · {activeClass.period ? `${activeClass.period} · ` : ''}{studentCount} students</p>
          </div>
          <div className="t-spacer" />
          <Link href={`/teach/assignments/new?class=${activeClass.id}`} className="t-btn">
            <Plus size={16} />
            New assignment
          </Link>
        </div>

        {/* KPI cards */}
        <div className="t-kpis">
          <div className="t-card">
            <div className="t-card-label">Active this week</div>
            <div className="t-kpi-num">{activeUsers.size}</div>
            <div className="t-kpi-label">of {studentCount} students</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Average score</div>
            <div className="t-kpi-num">{avgScore != null ? `${avgScore}%` : '—'}</div>
            <div className="t-kpi-label">all completed lessons</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">Lessons finished</div>
            <div className="t-kpi-num">{completedAll.length}</div>
            <div className="t-kpi-label">total completions</div>
          </div>
          <div className="t-card">
            <div className="t-card-label">On time</div>
            <div className="t-kpi-num">—</div>
            <div className="t-kpi-label">no due dates set</div>
          </div>
        </div>

        {/* Two-column section */}
        <div className="t-cols" style={{ marginBottom: 20 }}>

          {/* Left: Due soon + Needs attention */}
          <div className="t-col-main" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Due soon */}
            <div className="t-card" style={{ padding: 0 }}>
              <div style={{ padding: '14px 18px 10px', borderBottom: `1.5px solid #E7E2D3`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Due soon</span>
                <div className="t-spacer" />
                <Link href={`/teach/assignments?class=${activeClass.id}`} className="t-btn ghost sm">View all</Link>
              </div>
              {dueSoon.length === 0 ? (
                <div style={{ padding: '20px 18px', color: 'var(--t-mute)', fontSize: 13 }}>
                  No upcoming due dates. <Link href={`/teach/assignments/new?class=${activeClass.id}`} style={{ color: 'var(--t-teal)', fontWeight: 600 }}>Create an assignment →</Link>
                </div>
              ) : (
                dueSoon.map(a => {
                  const dueDate = a.due_at ? new Date(a.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
                  return (
                    <div key={a.id} style={{ padding: '12px 18px', borderBottom: '1px solid #E7E2D3', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.title ?? a.lesson_id ?? a.unit_id ?? 'Assignment'}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--t-mute)', marginTop: 2 }}>Due {dueDate}</div>
                      </div>
                      <div style={{ width: 100 }}>
                        <div className="t-stack" style={{ marginBottom: 3 }}>
                          <div className="t-stack-done" style={{ width: '0%' }} />
                          <div className="t-stack-started" style={{ width: '0%' }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t-mute)' }}>0/{studentCount}</div>
                      </div>
                      <Link href={`/teach/assignments/${a.id}?class=${activeClass.id}`} className="t-btn ghost xs">Open</Link>
                    </div>
                  )
                })
              )}
            </div>

            {/* Needs attention */}
            <div className="t-card" style={{ padding: 0 }}>
              <div style={{ padding: '14px 18px 10px', borderBottom: '1.5px solid #E7E2D3', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Needs attention</span>
                <span style={{ fontSize: 12, color: 'var(--t-mute)', marginLeft: 4 }}>{needsAttention.length}</span>
                <div className="t-spacer" />
              </div>
              {needsAttention.length === 0 ? (
                <div style={{ padding: '16px 18px', color: 'var(--t-mute)', fontSize: 13 }}>All students are on track 🎉</div>
              ) : (
                needsAttention.slice(0, 5).map(s => (
                  <div key={s.id} style={{ padding: '10px 18px', borderBottom: '1px solid #E7E2D3', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, flex: 1 }}>{s.name}</span>
                    <span className={`t-chip ${s.kind === 'inactive' ? 'warn' : 'off'}`}>{s.reason}</span>
                    {s.kind === 'inactive' ? (
                      <Link href={`/teach/assignments/new?class=${activeClass.id}`} className="t-btn ghost xs">Assign</Link>
                    ) : (
                      <Link href={`/teach/progress/${s.id}?class=${activeClass.id}`} className="t-btn ghost xs">View</Link>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right: Most-missed + mastery */}
          <div className="t-col-side">

            {/* Most-missed */}
            <div className="t-card">
              <div className="t-card-label">Most-missed question</div>
              {mostMissed ? (
                <>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                    Q{mostMissed.id.slice(-4)} · {mostMissed.correctRate}% correct ({mostMissed.total} attempts)
                  </p>
                  <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>
                    {100 - mostMissed.correctRate}% answered incorrectly this week
                  </div>
                  <Link href={`/teach/assignments/new?class=${activeClass.id}`} className="t-btn sm" style={{ marginTop: 2 }}>
                    Assign review
                  </Link>
                </>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--t-mute)' }}>No data yet. Check back after students complete some lessons.</p>
              )}
            </div>

            {/* Mastery by unit */}
            <div className="t-card">
              <div className="t-card-label" style={{ marginBottom: 10 }}>Class mastery by unit</div>
              {masteryByUnit.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--t-mute)' }}>No completions yet.</p>
              ) : (
                masteryByUnit.slice(0, 6).map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 13 }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.title}</span>
                    <span className={`m ${scoreClass(u.avgScore)}`}>{u.avgScore}%</span>
                  </div>
                ))
              )}
              <Link href={`/teach/progress?class=${activeClass.id}`} style={{ fontSize: 12, color: 'var(--t-teal)', fontWeight: 600, display: 'block', marginTop: 8 }}>
                Full progress grid →
              </Link>
            </div>

          </div>
        </div>

        {/* Recent activity */}
        <div className="t-card" style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '1.5px solid #E7E2D3' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Recent activity</span>
          </div>
          {recentActivity.length === 0 ? (
            <div style={{ padding: '20px 18px', color: 'var(--t-mute)', fontSize: 13 }}>No activity yet.</div>
          ) : (
            <table className="t-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Lesson</th>
                  <th>Score</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="t-avatar" style={{ background: avatarColor(r.userId) }}>{r.initials}</div>
                        <Link href={`/teach/progress/${r.userId}?class=${activeClass.id}`} style={{ fontWeight: 600, color: 'var(--t-ink)' }}>
                          {r.name}
                        </Link>
                      </div>
                    </td>
                    <td style={{ color: 'var(--t-mute)', fontSize: 12.5 }}>{r.lessonId ?? '—'}</td>
                    <td>
                      <span className={`m ${scoreClass(r.score)}`}>{scoreLabel(r.score)}</span>
                    </td>
                    <td style={{ color: 'var(--t-mute)', fontSize: 12.5 }}>{relativeTime(r.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  )
}

// ─── First Run ─────────────────────────────────────────────────────────────

function FirstRun({ activeClass, teacherName, classId }) {
  const joinUrl = `incentivefinance.org/join?code=${activeClass.code}`

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach" classId={classId} />
      <main className="t-main">

        <div className="t-hrow">
          <div>
            <h1>Set up {activeClass.name}</h1>
            <p className="t-sub">Three steps. Your Overview fills in as soon as students start working.</p>
          </div>
        </div>

        {/* Step 1: Create the class — DONE */}
        <div className="t-step done">
          <div className="t-step-circle">✓</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Create the class</div>
            <div style={{ fontSize: 13, color: 'var(--t-mute)', marginBottom: 8 }}>Class created and ready to go.</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
              <span><strong>{activeClass.name}</strong></span>
              {activeClass.period && <span style={{ color: 'var(--t-mute)' }}>{activeClass.period}</span>}
              <span style={{ color: 'var(--t-mute)' }}>Code: <strong style={{ color: 'var(--t-teal)', letterSpacing: '.06em' }}>{activeClass.code}</strong></span>
            </div>
          </div>
        </div>

        {/* Step 2: Get students in — ACTIVE */}
        <div className="t-step active">
          <div className="t-step-circle">2</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Get students in</div>
            <div style={{ fontSize: 13, color: 'var(--t-mute)', marginBottom: 14 }}>Share the join code or add names yourself.</div>

            <div style={{ background: 'var(--t-side)', borderRadius: 12, border: '2px solid var(--t-ink)', padding: '14px 20px', marginBottom: 14, maxWidth: 320 }}>
              <div className="t-code-big">{activeClass.code}</div>
              <div className="t-code-url">{joinUrl}</div>
              <CopyButton text={joinUrl} />
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href={`/teach/students?class=${classId}`} className="t-btn ghost sm">
                <Users size={14} />
                Or add names yourself
              </Link>
              <span style={{ fontSize: 12, color: 'var(--t-mute)' }}>Waiting for students… 0 joined</span>
            </div>
          </div>
        </div>

        {/* Step 3: First assignment — PENDING */}
        <div className="t-step pending">
          <div className="t-step-circle">3</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Give them their first assignment</div>
            <div style={{ fontSize: 13, color: 'var(--t-mute)', marginBottom: 10 }}>The Basics · Unit 1 — the perfect starting point.</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href={`/teach/assignments/new?class=${classId}&island=the-basics`} className="t-btn sm">Assign it</Link>
              <Link href={`/teach/assignments/new?class=${classId}`} className="t-btn ghost sm">Choose something else</Link>
            </div>
          </div>
        </div>

        {/* What you'll see card */}
        <div className="t-dashed-card" style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--t-ink)' }}>What you'll see after this</div>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Live activity feed — who finished what and when</li>
            <li>KPI cards — active students, average score, lessons done</li>
            <li>Due-soon progress bars for each assignment</li>
            <li>Needs-attention alerts for struggling or inactive students</li>
          </ul>
        </div>

      </main>
    </div>
  )
}
