'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { transitionSession, addPaperVotes } from '@/app/actions/host'

const ANSWER_COLORS = ['#EF4444','#3B82F6','#F59E0B','#22C55E']
const ANSWER_LABELS = ['A','B','C','D']

function TimerRing({ secsLeft, totalSecs }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = totalSecs > 0 ? (secsLeft / totalSecs) * circ : 0
  return (
    <div className="console-timer-ring">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} className="ring-bg" />
        <circle
          cx="36" cy="36" r={r}
          className="ring-fg"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
        />
      </svg>
      <div className="console-timer-num">{secsLeft}</div>
    </div>
  )
}

export default function ConsoleClient({ session: initialSession, questions }) {
  const router = useRouter()
  const supabase = createClient()
  const [session, setSession]       = useState(initialSession)
  const [players, setPlayers]       = useState([])
  const [responses, setResponses]   = useState([])
  const [elapsed, setElapsed]       = useState(0)
  const [secsLeft, setSecsLeft]     = useState(30)
  const [busy, setBusy]             = useState(false)
  const [paperVotes, setPaperVotes] = useState({ A: 0, B: 0, C: 0, D: 0 })
  const startRef = useRef(null)
  const timerRef = useRef(null)

  const phase = session?.phase ?? 'draft'
  const qIndex = session?.current_question_index ?? 0
  const questionIds = session?.question_ids ?? []
  const currentQId = questionIds[qIndex]
  const currentQ = questions?.find(q => q.id === currentQId) ?? null
  const totalQuestions = questionIds.length
  const limitMs = session?.question_limit_ms ?? 30000

  // Subscribe to Realtime
  useEffect(() => {
    if (!session?.id) return
    const channel = supabase
      .channel(`session:${session.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'live_sessions',
        filter: `id=eq.${session.id}`,
      }, payload => {
        setSession(prev => ({ ...prev, ...payload.new }))
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_players',
        filter: `session_id=eq.${session.id}`,
      }, payload => {
        setPlayers(prev => [...prev, payload.new])
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_responses',
        filter: `session_id=eq.${session.id}`,
      }, payload => {
        setResponses(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [session?.id])

  // Elapsed timer
  useEffect(() => {
    if (!session?.started_at) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(session.started_at)) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [session?.started_at])

  // Question timer countdown
  useEffect(() => {
    if (phase !== 'question' || !session?.question_started_at) { clearInterval(timerRef.current); return }
    const updateTimer = () => {
      const msElapsed = Date.now() - new Date(session.question_started_at).getTime()
      setSecsLeft(Math.max(0, Math.ceil((limitMs - msElapsed) / 1000)))
    }
    updateTimer()
    timerRef.current = setInterval(updateTimer, 500)
    return () => clearInterval(timerRef.current)
  }, [phase, session?.question_started_at, limitMs])

  // Fetch initial players
  useEffect(() => {
    if (!session?.id) return
    supabase.from('live_players').select('*').eq('session_id', session.id)
      .then(({ data }) => setPlayers(data ?? []))
    supabase.from('live_responses').select('*').eq('session_id', session.id)
      .then(({ data }) => setResponses(data ?? []))
  }, [session?.id])

  async function go(toPhase, meta = {}) {
    if (busy) return
    setBusy(true)
    const result = await transitionSession(session.id, toPhase, meta)
    setBusy(false)
    if (result.error) alert(result.error)
  }

  async function handleStartSession() {
    await go('lobby')
    setTimeout(() => {}, 100)
  }

  async function handleNextQuestion() {
    const nextIndex = qIndex + 1
    if (nextIndex >= totalQuestions) {
      await go('leaderboard')
    } else {
      await transitionSession(session.id, 'question', { current_question_index: nextIndex })
    }
  }

  async function handleReveal() { await go('reveal') }
  async function handleDiscussion() { await go('discussion') }
  async function handleLeaderboard() { await go('leaderboard') }
  async function handleEnd() {
    if (window.confirm('End this session?')) {
      await go('ended')
      router.push(`/host/sessions/${session.id}/report`)
    }
  }

  async function handleAddPaperVotes() {
    const hasVotes = Object.values(paperVotes).some(v => v > 0)
    if (!hasVotes || !currentQId) return
    await addPaperVotes(session.id, currentQId, paperVotes)
    setPaperVotes({ A: 0, B: 0, C: 0, D: 0 })
  }

  // Tally by answer
  const gameResponses = responses.filter(r =>
    r.session_id === session?.id && r.phase === 'game' &&
    r.question_id === currentQId
  )
  const tally = {}
  const totalAnswered = gameResponses.reduce((s, r) => {
    const key = typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)
    const count = r.paper_count ?? 1
    tally[key] = (tally[key] ?? 0) + count
    return s + count
  }, 0)

  const answeredCount = responses.filter(r =>
    r.phase === 'game' && r.question_id === currentQId && r.source === 'phone'
  ).length

  // Leaderboard from responses
  const playerScores = {}
  responses.filter(r => r.phase === 'game').forEach(r => {
    if (r.player_id) {
      playerScores[r.player_id] = (playerScores[r.player_id] ?? 0) + (r.points ?? 0)
    }
  })
  const leaderboard = players
    .map(p => ({ ...p, points: playerScores[p.id] ?? 0 }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  const formatElapsed = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="host-console">
      {/* Top bar */}
      <div className="console-topbar">
        <span className="console-live-badge">LIVE</span>
        <span className="console-session-name">
          {session?.run_of_show?.[0]?.topic ?? 'Session'}
        </span>
        <span className="console-q-progress">
          {phase === 'question' || phase === 'reveal' ? `Q${qIndex + 1}/${totalQuestions}` : phase.replace('_', ' ').toUpperCase()}
        </span>
        <span className="console-join-url">incentivefinance.org/join ·</span>
        <span className="console-code">{session?.code}</span>
        <span className="console-players">{players.length} players</span>
        <span className="console-elapsed">{formatElapsed(elapsed)}</span>
      </div>

      <div className="console-body">
        {/* Main */}
        <div className="console-main">

          {/* Lobby */}
          {phase === 'draft' && (
            <>
              <h2 style={{ color: '#fff', fontSize: 'var(--text-2xl)' }}>Ready to start?</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Students can join at <strong style={{ color: '#FCD34D' }}>incentivefinance.org/join</strong> using code <strong style={{ color: '#FCD34D', letterSpacing: 3 }}>{session?.code}</strong>
              </p>
              <div className="console-controls">
                <button className="console-btn primary" onClick={handleStartSession} disabled={busy}>
                  Open lobby
                </button>
              </div>
            </>
          )}

          {phase === 'lobby' && (
            <>
              <h2 style={{ color: '#fff', fontSize: 'var(--text-2xl)' }}>
                Lobby — {players.length} joined
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Share code <strong style={{ color: '#FCD34D', letterSpacing: 3 }}>{session?.code}</strong>
              </p>
              <div className="console-controls">
                <button className="console-btn primary" onClick={() => go('before_check')} disabled={busy}>
                  Start before-check
                </button>
                <button className="console-btn" onClick={() => go('question', { current_question_index: 0 })} disabled={busy}>
                  Skip to first question
                </button>
              </div>
            </>
          )}

          {phase === 'before_check' && (
            <>
              <p className="console-q-progress">BEFORE-CHECK</p>
              <h2 className="console-q-text">3 quick questions — don't worry if you don't know!</h2>
              <div className="console-controls">
                <button className="console-btn primary" onClick={() => go('question', { current_question_index: 0 })} disabled={busy}>
                  Start live game
                </button>
              </div>
            </>
          )}

          {(phase === 'question' || phase === 'reveal') && currentQ && (
            <>
              <p className="console-q-progress">QUESTION {qIndex + 1} OF {totalQuestions}</p>
              <h2 className="console-q-text">{currentQ.prompt ?? currentQ.question}</h2>

              <div className="console-timer-row">
                {phase === 'question' && (
                  <TimerRing secsLeft={secsLeft} totalSecs={limitMs / 1000} />
                )}
                <span className="console-answered">
                  {answeredCount} of {players.length} answered
                </span>
              </div>

              {/* Answer bars */}
              <div className="console-answers">
                {(currentQ.options ?? []).map((opt, i) => {
                  const letter = ANSWER_LABELS[i]
                  const count = tally[letter] ?? tally[opt] ?? 0
                  const pct = totalAnswered > 0 ? (count / totalAnswered) * 100 : 0
                  const isCorrect = phase === 'reveal' && (currentQ.answer === letter || currentQ.answer === opt || currentQ.correct_index === i)
                  return (
                    <div key={i} className="console-answer-bar">
                      <div
                        className="console-answer-letter"
                        style={{ background: ANSWER_COLORS[i] + '33', border: `2px solid ${ANSWER_COLORS[i]}`, color: ANSWER_COLORS[i] }}
                      >
                        {letter}
                      </div>
                      <div className={`console-answer-fill${isCorrect ? ' correct' : ''}`}>
                        <div className="console-answer-fill-inner" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="console-answer-count">{count}</span>
                    </div>
                  )
                })}
              </div>

              <div className="console-controls">
                {phase === 'question' && (
                  <button className="console-btn primary" onClick={handleReveal} disabled={busy}>
                    Reveal answer
                  </button>
                )}
                {phase === 'reveal' && (
                  <>
                    <button className="console-btn" onClick={handleDiscussion} disabled={busy}>
                      Discussion pause
                    </button>
                    <button className="console-btn primary" onClick={handleNextQuestion} disabled={busy}>
                      {qIndex + 1 < totalQuestions ? 'Next →' : 'Show leaderboard'}
                    </button>
                  </>
                )}
                <button className="console-btn" onClick={() => go('question', {
                  current_question_index: qIndex,
                  question_limit_ms: limitMs + 15000,
                })} disabled={busy}>
                  +15 sec
                </button>
              </div>

              {/* Paper votes */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-xs)', marginBottom: 8 }}>
                  Paper card votes
                </p>
                <div className="console-paper-votes">
                  {ANSWER_LABELS.map(ltr => (
                    <button
                      key={ltr}
                      className="paper-vote-btn"
                      onClick={() => setPaperVotes(v => ({ ...v, [ltr]: v[ltr] + 1 }))}
                    >
                      {ltr}+ ({paperVotes[ltr]})
                    </button>
                  ))}
                  <button className="console-btn" onClick={handleAddPaperVotes}>
                    Submit paper votes
                  </button>
                </div>
              </div>
            </>
          )}

          {phase === 'discussion' && (
            <>
              <p className="console-q-progress">DISCUSSION PAUSE</p>
              <h2 className="console-q-text">{currentQ?.prompt ?? 'Discussion'}</h2>
              {currentQ?.explanation && (
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  {currentQ.explanation}
                </div>
              )}
              <div className="console-controls">
                <button className="console-btn primary" onClick={handleNextQuestion} disabled={busy}>
                  {qIndex + 1 < totalQuestions ? 'Next question →' : 'Leaderboard'}
                </button>
              </div>
            </>
          )}

          {phase === 'leaderboard' && (
            <>
              <p className="console-q-progress">LEADERBOARD</p>
              <div className="console-controls" style={{ marginBottom: 20 }}>
                <button className="console-btn" onClick={() => go('after_check')} disabled={busy}>
                  After-check
                </button>
                <button className="console-btn primary" onClick={handleEnd} disabled={busy}>
                  End session
                </button>
              </div>
            </>
          )}

          {phase === 'after_check' && (
            <>
              <p className="console-q-progress">AFTER-CHECK</p>
              <div className="console-controls">
                <button className="console-btn primary" onClick={handleEnd} disabled={busy}>
                  End session
                </button>
              </div>
            </>
          )}

          {phase === 'ended' && (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Session ended. <a href={`/host/sessions/${session.id}/report`} style={{ color: '#FCD34D' }}>View report →</a></p>
          )}
        </div>

        {/* Right panel */}
        <div className="console-right">
          <div>
            <h3>Top players</h3>
            {leaderboard.map((p, i) => (
              <div key={p.id} className="console-lb-row">
                <span className="console-lb-rank">#{i + 1}</span>
                <span className="console-lb-name">{p.nickname ?? `Player ${i + 1}`}</span>
                <span className="console-lb-pts">{p.points}</span>
              </div>
            ))}
            {!leaderboard.length && <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)' }}>No players yet</p>}
          </div>

          {currentQ?.host_notes && (
            <div>
              <h3>Host notes</h3>
              <p className="console-notes-text">{currentQ.host_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
