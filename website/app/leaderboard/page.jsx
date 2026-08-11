'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { allUnits } from '@/data/levels'
import { Trophy, Medal } from 'lucide-react'
import '@/app/(pages)/Leaderboard.css'

const rewardMap = {}
allUnits.forEach(u => {
  rewardMap[u.id] = u.centsReward ?? 0
  if (u.lessons) u.lessons.forEach(l => { rewardMap[l.id] = l.centsReward ?? 0 })
})

function computeXP(rows) {
  let total = 0
  rows.forEach(r => {
    const pct = (r.score ?? 0) / 100
    if (rewardMap[r.lesson_id] !== undefined) total += Math.round(rewardMap[r.lesson_id] * pct)
    else if (r.lesson_id === 'capstone') total += Math.round(200 * pct)
    else if (r.lesson_id?.endsWith('-test')) total += Math.round(100 * pct)
  })
  return total * 2
}

async function fetchLeaderboard() {
  const supabase = createClient()
  // Production path: SECURITY DEFINER function
  const { data, error } = await supabase.rpc('get_leaderboard')
  if (!error) return data ?? []

  // Dev fallback: service client
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY
  if (!serviceKey) throw new Error('Leaderboard: run scripts/leaderboard_function.sql in Supabase SQL Editor, or add NEXT_PUBLIC_SUPABASE_SERVICE_KEY to .env.local for local dev')

  const { createClient: createBrowserClient } = await import('@supabase/supabase-js')
  const svc = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey)
  const [{ data: profiles, error: pe }, { data: progress, error: le }] = await Promise.all([
    svc.from('profiles').select('id, name'),
    svc.from('lesson_progress').select('user_id, lesson_id, score').eq('completed', true),
  ])
  if (pe || le) throw new Error((pe || le).message)

  const byUser = {}
  for (const r of (progress ?? [])) {
    if (!byUser[r.user_id]) byUser[r.user_id] = []
    byUser[r.user_id].push(r)
  }

  const entries = (profiles ?? []).map(p => {
    const userRows = byUser[p.id] ?? []
    const xp = computeXP(userRows)
    const lessons = userRows.filter(r => !r.lesson_id?.endsWith('-test') && r.lesson_id !== 'capstone').length
    const tests = userRows.filter(r => r.lesson_id?.endsWith('-test')).length
    return { id: p.id, name: p.name || 'Unnamed', xp, lessons, tests }
  })
  return entries.sort((a, b) => b.xp - a.xp || b.lessons - a.lessons)
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="lb-rank lb-rank--gold"><Trophy size={14} strokeWidth={2.5} /> 1st</span>
  if (rank === 2) return <span className="lb-rank lb-rank--silver"><Medal size={14} strokeWidth={2.5} /> 2nd</span>
  if (rank === 3) return <span className="lb-rank lb-rank--bronze"><Medal size={14} strokeWidth={2.5} /> 3rd</span>
  return <span className="lb-rank">#{rank}</span>
}

export default function Leaderboard() {
  const { currentUser } = useAuth()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
      .then(setRows)
      .catch(e => setError(e.message))
  }, [])

  return (
    <main className="lb-page">
      <div className="container">
        <div className="lb-header">
          <h1 className="lb-title">Leaderboard</h1>
          <p className="lb-subtitle">See how everyone is doing</p>
        </div>

        {error && <p className="lb-error">{error}</p>}
        {!rows && !error && <p className="lb-loading">Loading…</p>}
        {rows && rows.length === 0 && <p className="lb-empty">No users yet — be the first to earn XP!</p>}

        {rows && rows.length > 0 && (
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th className="lb-col-rank">Rank</th>
                  <th className="lb-col-name">Name</th>
                  <th className="lb-col-xp">XP</th>
                  <th className="lb-col-lessons">Lessons</th>
                  <th className="lb-col-tests">Tests</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const rank = i + 1
                  const isMe = currentUser && row.id === currentUser.id
                  return (
                    <tr key={row.id} className={`lb-row${isMe ? ' lb-row--me' : ''}`}>
                      <td className="lb-col-rank"><RankBadge rank={rank} /></td>
                      <td className="lb-col-name">
                        <span className="lb-name">{row.name}</span>
                        {isMe && <span className="lb-you">you</span>}
                      </td>
                      <td className="lb-col-xp"><strong>{Number(row.xp).toLocaleString()}</strong></td>
                      <td className="lb-col-lessons">{row.lessons}</td>
                      <td className="lb-col-tests">{row.tests}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
