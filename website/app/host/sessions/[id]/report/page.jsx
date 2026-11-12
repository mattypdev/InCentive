import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSessionReport } from '@/app/actions/host'
import HostShell from '@/app/host/HostShell'

export const metadata = { title: 'Session report | Host | Incentive' }

export default async function SessionReportPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const report = await getSessionReport(id)
  if (report.error) notFound()

  const { session, stats } = report
  const title = session.run_of_show?.[0]?.topic ?? `Session ${session.code}`
  const date = new Date(session.started_at ?? session.created_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <HostShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <h1 className="host-page-title" style={{ margin: 0 }}>Session report</h1>
        <span className="host-session-status ended">ended</span>
      </div>
      <p className="host-page-sub">{title} · {date} · {session.length_min} min</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard title="Attendance" value={stats.totalPlayers} sub={`${stats.phoneCount} phones · ${stats.paperCount} paper`} />
        {stats.learningGain != null && (
          <StatCard
            title="Learning gain"
            value={`${stats.preAccuracy}% → ${stats.postAccuracy}%`}
            sub={`+${stats.learningGain} points on before/after check`}
            highlight
          />
        )}
        <StatCard title="Game accuracy" value={`${stats.gameAccuracy}%`} sub="during live questions" />
      </div>

      {/* Leaderboard */}
      <div style={{
        background: 'var(--card)',
        border: 'var(--border-width) solid var(--foreground)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        marginBottom: 24,
        maxWidth: 480,
      }}>
        <h2 style={{ marginBottom: 16 }}>Top players</h2>
        {report.players
          .map(p => {
            const pts = report.responses.filter(r => r.player_id === p.id && r.phase === 'game').reduce((s, r) => s + (r.points ?? 0), 0)
            return { ...p, pts }
          })
          .sort((a, b) => b.pts - a.pts)
          .slice(0, 10)
          .map((p, i) => (
            <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 24, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--muted-foreground)' }}>#{i + 1}</span>
              <span style={{ flex: 1 }}>{p.nickname ?? `Player ${i + 1}`}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent)' }}>{p.pts}</span>
            </div>
          ))
        }
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/host" className="host-secondary-btn">← All sessions</Link>
        <Link href={`/host/sessions/${id}/console`} className="host-secondary-btn">Re-open console</Link>
      </div>
    </HostShell>
  )
}

function StatCard({ title, value, sub, highlight }) {
  return (
    <div style={{
      background: highlight ? '#F0FDFA' : 'var(--card)',
      border: '2px solid var(--foreground)',
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px',
    }}>
      <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: 6 }}>{title}</h3>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{sub}</div>
    </div>
  )
}
