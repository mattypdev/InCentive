import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HostShell from './HostShell'
import { Plus } from 'lucide-react'

export const metadata = { title: 'Host | Incentive' }

export default async function HostHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/host')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_host, chapter_id')
    .eq('id', user.id)
    .single()

  if (!profile?.is_host) redirect('/learn')

  // Host application / training check
  const { data: app } = await supabase
    .from('host_applications')
    .select('status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!app) {
    // No application yet → show the apply page
    return <HostApplyPage userId={user.id} />
  }

  const { data: sessions } = await supabase
    .from('live_sessions')
    .select('id, code, status, phase, created_at, state, run_of_show')
    .eq('host_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: hours } = await supabase
    .from('volunteer_hours')
    .select('hours')
    .eq('user_id', user.id)
  const totalHours = hours?.reduce((s, r) => s + (r.hours ?? 0), 0) ?? 0

  return (
    <HostShell chapterName="My Chapter" sessionCount={sessions?.length ?? 0} hours={totalHours}>
      <h1 className="host-page-title">My sessions</h1>
      <p className="host-page-sub">Start a new session or continue one in progress.</p>

      <Link href="/host/sessions/new" className="host-new-btn">
        <Plus size={18} /> New session
      </Link>

      {!sessions?.length && (
        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
          No sessions yet. Create your first one!
        </p>
      )}

      <div className="host-session-list">
        {sessions?.map(s => {
          const title = s.run_of_show?.[0]?.topic ?? `Session ${s.code}`
          return (
            <Link
              key={s.id}
              href={s.phase === 'lobby' || s.phase === 'question' || s.phase === 'reveal'
                ? `/host/sessions/${s.id}/console`
                : s.phase === 'ended'
                  ? `/host/sessions/${s.id}/report`
                  : `/host/sessions/${s.id}/console`
              }
              className="host-session-card"
            >
              <div className="host-session-card-info">
                <div className="host-session-card-title">{title}</div>
                <div className="host-session-card-meta">
                  {new Date(s.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="host-session-card-code">{s.code}</div>
              <span className={`host-session-status ${s.status}`}>{s.status}</span>
            </Link>
          )
        })}
      </div>
    </HostShell>
  )
}

function HostApplyPage() {
  return (
    <HostShell>
      <h1 className="host-page-title">Become a host</h1>
      <p className="host-page-sub">
        Hosts run live financial literacy sessions in schools and communities.
        Complete 2 short lessons and a 10-question check to get approved.
      </p>
      <div style={{ maxWidth: 480 }}>
        <div style={{
          border: '2px solid var(--foreground)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          marginBottom: '20px',
          background: 'var(--card)'
        }}>
          <h3 style={{ marginBottom: 12 }}>Host training</h3>
          <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>Complete &ldquo;How to Run a Session&rdquo; (5 min)</li>
            <li>Complete &ldquo;Facilitation Tips&rdquo; (5 min)</li>
            <li>Pass the host check (10 questions, 8/10 required)</li>
          </ol>
        </div>
        <Link href="/host/training" className="host-new-btn">
          Start training
        </Link>
      </div>
    </HostShell>
  )
}
