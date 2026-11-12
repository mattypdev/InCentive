'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { getStoredProgress } from '@/lib/guestProgress'
import { getSpent } from '@/lib/shop'
import { lessonsByUnit, units } from '@/lib/content/islands'
import './WalletPanel.css'

function GoalRing({ done, goal }) {
  const r = 21
  const circ = 2 * Math.PI * r
  const pct = goal > 0 ? Math.min(done / goal, 1) : 0
  const dash = pct * circ
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#EFEAD9" strokeWidth="7" />
      <circle cx="26" cy="26" r={r} fill="none" stroke="#0D9488" strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="31" textAnchor="middle" fontFamily="var(--font-heading)" fontWeight="800" fontSize="15" fill="#1E293B">
        {done}/{goal}
      </text>
    </svg>
  )
}

function findNextLesson(progress) {
  for (const unit of units) {
    const lessons = lessonsByUnit(unit.id)
    for (const lesson of lessons) {
      if (progress[lesson.id] === undefined) {
        return { lesson, unit }
      }
    }
  }
  return null
}

export default function WalletPanel() {
  const { currentUser, profile, streak } = useAuth()
  const [progress, setProgress] = useState({})
  const [spent, setSpent] = useState(getSpent)
  const [leaderboard, setLeaderboard] = useState([])
  const [ledgerCents, setLedgerCents] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setProgress(getStoredProgress() ?? {})
      return
    }
    const supabase = createClient()
    supabase
      .from('lesson_progress')
      .select('lesson_id, score')
      .eq('user_id', currentUser.id)
      .eq('completed', true)
      .then(({ data }) => {
        if (!data) return
        const map = {}
        data.forEach(r => { map[r.lesson_id] = r.score })
        setProgress(map)
      })
  }, [currentUser])

  useEffect(() => {
    const refresh = () => setSpent(getSpent())
    window.addEventListener('incentive:shop-update', refresh)
    return () => window.removeEventListener('incentive:shop-update', refresh)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.rpc('get_leaderboard').then(({ data }) => {
      if (data) setLeaderboard(data.slice(0, 3))
    })
  }, [])

  // Cents from wallet_ledger; falls back to legacy profile.xp - spent
  useEffect(() => {
    if (!currentUser) { setLedgerCents(null); return }
    const supabase = createClient()
    supabase
      .from('wallet_ledger')
      .select('cents')
      .eq('user_id', currentUser.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setLedgerCents(data.reduce((s, r) => s + (r.cents ?? 0), 0))
        }
      })
  }, [currentUser?.id])
  const cents = ledgerCents !== null ? Math.max(0, ledgerCents) : Math.max(0, (profile?.xp ?? 0) - spent)
  const xp = (profile?.xp ?? 0) * 2
  const todayDone = 0 // placeholder — real impl reads today's attempts
  const dailyGoal = 3

  const next = findNextLesson(progress)

  const QUESTS = [
    { label: 'Complete 10 lessons', done: Object.keys(progress).length, goal: 10 },
    { label: 'Earn 100 XP', done: xp, goal: 100 },
  ]

  const myRank = leaderboard.findIndex(r => r.id === currentUser?.id)

  return (
    <aside className="wallet-panel">
      <p className="wallet-panel-heading">Your wallet</p>

      <div className="wallet-stats">
        <div className="wallet-stat">
          <div className="wallet-stat-value">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 0 2 1 3 2 3-1-3 0-6 .5-9z"
                fill="#FF6F61" stroke="#1E293B" strokeWidth="1.6" />
            </svg>
            {streak}
          </div>
          <div className="wallet-stat-label">Streak</div>
        </div>
        <div className="wallet-stat">
          <div className="wallet-stat-value">
            <span className="wallet-coin-dot" aria-hidden="true" />
            {cents}
          </div>
          <div className="wallet-stat-label">Cents</div>
        </div>
        <div className="wallet-stat">
          <div className="wallet-stat-value">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"
                fill="#8B5CF6" stroke="#1E293B" strokeWidth="1.6" />
            </svg>
            {xp}
          </div>
          <div className="wallet-stat-label">XP</div>
        </div>
      </div>

      <div className="wallet-card wallet-goal-card">
        <GoalRing done={todayDone} goal={dailyGoal} />
        <div>
          <div className="wallet-goal-title">Daily goal</div>
          <div className="wallet-goal-sub">
            {dailyGoal - todayDone > 0
              ? `${dailyGoal - todayDone} more lesson${dailyGoal - todayDone > 1 ? 's' : ''} keeps your streak`
              : "Goal done! Great work today"}
          </div>
        </div>
      </div>

      {next && (
        <div className="wallet-card wallet-next-card">
          <span className="wallet-next-tag">Up next</span>
          <div className="wallet-next-title">{next.lesson.title}</div>
          <div className="wallet-next-sub">{next.unit.title} · {next.lesson.minutes} min</div>
          <Link href={`/learn/unit/${next.unit.id}?section=0`} className="wallet-continue-btn">
            Continue
          </Link>
        </div>
      )}

      <div className="wallet-card">
        <p className="wallet-section-title">Quests</p>
        {QUESTS.map(q => (
          <div key={q.label} className="wallet-quest">
            <div className="wallet-quest-row">
              <span>{q.label}</span>
              <span className="wallet-quest-count">{Math.min(q.done, q.goal)}/{q.goal}</span>
            </div>
            <div className="wallet-bar-track">
              <div className="wallet-bar-fill" style={{ width: `${Math.min((q.done / q.goal) * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length > 0 && (
        <div className="wallet-card">
          <p className="wallet-section-title">Leaderboard · this week</p>
          {leaderboard.map((row, i) => (
            <div key={row.id} className={`wallet-lb-row${row.id === currentUser?.id ? ' wallet-lb-row--me' : ''}`}>
              <span className="wallet-lb-rank">{i + 1}</span>
              <span className="wallet-lb-name">{row.id === currentUser?.id ? 'You' : row.name}</span>
              <span><span className="wallet-coin-dot" />  {row.xp}</span>
            </div>
          ))}
        </div>
      )}

      <div className="wallet-footer">
        <Link href="/shop">Shop →</Link>
        <Link href="/progress">Progress →</Link>
        <Link href="/leaderboard">Leaderboard →</Link>
      </div>
    </aside>
  )
}
