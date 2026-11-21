'use client'
import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { updateLeagueVisibility } from '@/app/actions/league'
import './League.css'

const DOW_LABELS = ['M','T','W','T','F','S','S']

const AVATAR_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#F7DC6F','#DDA0DD','#98D8C8','#FFA07A']
function avatarColor(id) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function displayName(u) {
  if (u.first_name) {
    const last = u.last_initial ? ` ${u.last_initial.toUpperCase()}.` : ''
    return u.first_name + last
  }
  return u.name ?? '?'
}

function Avatar({ user, size = 36 }) {
  const letter = (user.first_name?.[0] ?? user.name?.[0] ?? '?').toUpperCase()
  return (
    <div className="lb-avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: avatarColor(user.id) }}>
      {letter}
    </div>
  )
}

const RANK_STYLES = [
  { bg: '#F59E0B', color: '#fff' },
  { bg: '#94A3B8', color: '#fff' },
  { bg: '#CD7F32', color: '#fff' },
]

export default function LeaderboardClient({ data, userId }) {
  const [tab, setTab] = useState('students')
  const [search, setSearch] = useState('')
  const [hidden, setHidden] = useState(data.me?.hide_from_leaderboard ?? false)
  const [pending, startTransition] = useTransition()

  const me = data.me

  const sorted = useMemo(() => {
    const pool = tab === 'class'
      ? data.users.filter(u => data.classUserIds.includes(u.id))
      : data.users
    return [...pool].sort((a, b) => b.xp - a.xp)
  }, [data.users, data.classUserIds, tab])

  const filtered = search.trim()
    ? sorted.filter(u => displayName(u).toLowerCase().includes(search.toLowerCase()))
    : sorted

  const top3 = filtered.slice(0, Math.min(3, filtered.length))
  const rest  = filtered.slice(Math.min(3, filtered.length))

  // Sidebar stats (always based on global students list)
  const globalSorted = useMemo(() =>
    [...data.users].sort((a, b) => b.xp - a.xp),
    [data.users]
  )
  const myRank  = me ? globalSorted.findIndex(u => u.id === userId) + 1 : null
  const rank5XP = globalSorted[4]?.xp ?? 0
  const myXP    = me?.xp ?? 0
  const xpGap   = Math.max(0, rank5XP - myXP)
  const pct     = rank5XP > 0 ? Math.min(100, Math.round((myXP / rank5XP) * 100)) : 0

  function handleHide() {
    const next = !hidden
    setHidden(next)
    startTransition(() => updateLeagueVisibility(next))
  }

  return (
    <main className="lb-page">
      <div className="container">
        <div className="lb-layout">

          {/* ── Main column ── */}
          <div className="lb-main">
            <div className="lb-header">
              <div>
                <h1 className="lb-title">Leaderboard</h1>
                <p className="lb-sub">Students on Incentive, ranked by XP.</p>
              </div>
            </div>

            <div className="lb-controls">
              <div className="lb-tabs">
                <button className={`lb-tab${tab === 'students' ? ' on' : ''}`} onClick={() => setTab('students')} type="button">
                  Students
                </button>
                <button className={`lb-tab${tab === 'class' ? ' on' : ''}`} onClick={() => setTab('class')} type="button">
                  My class
                </button>
              </div>
              <input
                className="lb-search"
                placeholder="Find a name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {tab === 'class' && data.classUserIds.length === 0 ? (
              <p className="lb-empty">You're not in a class yet. Ask your teacher for a class code.</p>
            ) : filtered.length === 0 ? (
              <p className="lb-empty">No results{search ? ` for "${search}"` : ''}.</p>
            ) : (
              <>
                {/* Top 3 */}
                <div className="lb-top3">
                  {top3.map((u, i) => {
                    const isMe = u.id === userId
                    const style = RANK_STYLES[i]
                    return (
                      <div key={u.id} className={`lb-top-card${isMe ? ' me' : ''}`}>
                        <div className="lb-top-rank" style={{ background: style.bg, color: style.color }}>
                          {i + 1}
                        </div>
                        <Avatar user={u} size={44} />
                        <div className="lb-top-name">
                          {displayName(u)}
                          {isMe && <span className="lb-you">you</span>}
                        </div>
                        <div className="lb-top-right">
                          <div className="lb-top-xp">
                            {u.xp.toLocaleString()}
                            <span className="lb-xp-label">XP</span>
                          </div>
                          {u.streak_count > 0 && (
                            <div className="lb-top-streak"><Flame size={12} />{u.streak_count}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Rows 4+ */}
                {rest.length > 0 && (
                  <div className="lb-table-wrap">
                    <table className="lb-table">
                      <thead>
                        <tr>
                          <th className="lb-col-rank">Rank</th>
                          <th>Student</th>
                          <th className="lb-col-streak">Streak</th>
                          <th className="lb-col-xp">XP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rest.map((u, i) => {
                          const rank = top3.length + i + 1
                          const isMe = u.id === userId
                          return (
                            <tr key={u.id} className={`lb-row${isMe ? ' me' : ''}`}>
                              <td className="lb-col-rank">{rank}</td>
                              <td>
                                <div className="lb-name-cell">
                                  <Avatar user={u} size={30} />
                                  <span className="lb-name">{displayName(u)}</span>
                                  {isMe && <span className="lb-you">you</span>}
                                </div>
                              </td>
                              <td className="lb-col-streak">
                                {u.streak_count > 0 && <span className="lb-streak-cell"><Flame size={12} />{u.streak_count}</span>}
                              </td>
                              <td className="lb-col-xp">{u.xp.toLocaleString()}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lb-side">

            {/* Your rank */}
            {me && (
              <div className="lb-card">
                <h3 className="lb-card-title">Your rank</h3>
                <div className="lb-rank-row">
                  <span className="lb-rank-num">#{myRank ?? '—'}</span>
                  <span className="lb-rank-of">of {data.users.length}</span>
                </div>
                {myRank && myRank > 5 ? (
                  <>
                    <p className="lb-xp-gap">{xpGap.toLocaleString()} XP to reach top 5</p>
                    <div className="lb-progress-bar">
                      <div className="lb-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </>
                ) : myRank && myRank <= 5 ? (
                  <p className="lb-top5">You're in the top 5 🎉</p>
                ) : null}
                <Link href="/learn" className="lb-start-btn">Start next lesson →</Link>
              </div>
            )}

            {/* Streak */}
            {me && (
              <div className="lb-card">
                <h3 className="lb-card-title">Your streak</h3>
                <div className="lb-streak-row">
                  <Flame size={20} style={{ color: '#FF6B35', flexShrink: 0 }} />
                  <span className="lb-streak-num">{me.streak_count}</span>
                  <span className="lb-streak-label">day{me.streak_count !== 1 ? 's' : ''}</span>
                  <span className="lb-streak-best">Best: {me.streak_best}</span>
                </div>
                <div className="lb-week-dots">
                  {DOW_LABELS.map((label, i) => {
                    const dow = i + 1
                    return (
                      <div key={i} className="lb-dot-col">
                        <div className={`lb-dot${data.weeklyActiveDays.includes(dow) ? ' active' : ''}`} />
                        <span className="lb-dot-label">{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Hide toggle */}
            <div className="lb-hide-row">
              <label htmlFor="lb-hide" className="lb-hide-label">Hide me from leaderboards</label>
              <button
                id="lb-hide"
                type="button"
                role="switch"
                aria-checked={hidden}
                className={`lb-toggle${hidden ? ' on' : ''}`}
                onClick={handleHide}
                disabled={pending}
              >
                <span className="lb-toggle-knob" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
