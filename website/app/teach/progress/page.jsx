import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TeachShell from '../TeachShell'
import { scoreClass, scoreLabel, avatarColor } from '@/lib/teachUtils'

export const metadata = { title: 'Progress · Incentive Teach' }

export default async function ProgressPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach/progress')

  const params = await searchParams
  const classId = params?.class

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

  // Students
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', activeClass.id)
    .eq('role', 'student')

  const studentIds = (members ?? []).map(m => m.user_id)

  // Units (columns)
  const { data: units } = await supabase
    .from('units')
    .select('id, island, title, sort')
    .order('sort')

  // Load data
  let students = []
  let scores = {}

  if (studentIds.length) {
    const [profilesRes, lpRes] = await Promise.all([
      supabase.from('profiles').select('id, first_name, last_initial').in('id', studentIds),
      supabase.from('lesson_progress').select('user_id, lesson_id, score, completed').in('user_id', studentIds).eq('completed', true),
    ])

    const profiles = profilesRes.data ?? []
    const lp = lpRes.data ?? []

    students = profiles.map(p => ({
      id: p.id,
      name: `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim(),
    }))

    for (const p of profiles) {
      scores[p.id] = {}
      for (const unit of units ?? []) {
        const unitLessons = lp.filter(l => l.user_id === p.id && l.lesson_id?.startsWith(unit.id))
        if (!unitLessons.length) {
          scores[p.id][unit.id] = null
        } else {
          const avg = unitLessons.reduce((a, b) => a + (b.score ?? 0), 0) / unitLessons.length
          scores[p.id][unit.id] = Math.round(avg)
        }
      }
    }
  }

  // Group units by island
  const { data: islands } = await supabase.from('islands').select('slug, title, sort').order('sort')
  const islandMap = {}
  for (const isl of islands ?? []) {
    islandMap[isl.slug] = { ...isl, units: (units ?? []).filter(u => u.island === isl.slug) }
  }
  const islandList = Object.values(islandMap).filter(isl => isl.units.length > 0)

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach/progress" classId={activeClass.id} />
      <main className="t-main">

        <div className="t-hrow">
          <div>
            <h1>Progress</h1>
            <p className="t-sub">{activeClass.period ? `${activeClass.period} · ` : ''}{activeClass.name} · {students.length} students</p>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="t-card">
            <div className="t-empty">
              <h3>No students yet</h3>
              <p>Add students to see their progress here.</p>
              <Link href={`/teach/students${q}`} className="t-btn">Add students</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="t-card" style={{ padding: 0 }}>
              <div className="t-pgrid" style={{ padding: '0 4px 8px' }}>
                <table>
                  <thead>
                    <tr>
                      <th className="name-col" style={{ paddingLeft: 10 }}>Student</th>
                      {islandList.map(isl => (
                        isl.units.map(u => (
                          <th key={u.id} title={u.title}>
                            {u.title.length > 9 ? u.title.slice(0, 8) + '…' : u.title}
                          </th>
                        ))
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td className="name-col">
                          <Link href={`/teach/progress/${s.id}${q}`} style={{ color: 'var(--t-ink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                            <div className="t-avatar" style={{ background: avatarColor(s.id), width: 24, height: 24, fontSize: 10 }}>
                              {s.name.split(' ').map(w => w[0] ?? '').join('').slice(0,2).toUpperCase()}
                            </div>
                            {s.name}
                          </Link>
                        </td>
                        {islandList.map(isl => (
                          isl.units.map(u => {
                            const sc = scores[s.id]?.[u.id] ?? null
                            return (
                              <td key={u.id} className={`pgrid-cell ${scoreClass(sc)}`} title={sc != null ? `${sc}%` : 'Not started'}>
                                {sc != null ? `${sc}%` : '—'}
                              </td>
                            )
                          })
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--t-mute)' }}>Score key:</span>
              {[
                { label: '≥90%', cls: 'm4' },
                { label: '70–89%', cls: 'm3' },
                { label: '50–69%', cls: 'm2' },
                { label: '<50%', cls: 'm1' },
                { label: 'Not started', cls: 'm0' },
              ].map(k => (
                <div key={k.cls} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className={`m ${k.cls}`} style={{ minWidth: 28, height: 20, fontSize: 10 }}>{k.label === 'Not started' ? '—' : k.label}</span>
                  <span style={{ color: 'var(--t-mute)' }}>{k.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  )
}
