'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { joinSession, submitLiveAnswer } from '@/app/actions/host'
import { useAuth } from '@/context/AuthContext'
import './Player.css'

const ANSWER_COLORS = ['#EF4444','#3B82F6','#F59E0B','#22C55E']
const ANSWER_LABELS = ['A','B','C','D']

export default function PlayerClient({ code }) {
  const { currentUser, signInAsGuest } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [session, setSession]     = useState(null)
  const [playerId, setPlayerId]   = useState(null)
  const [phase, setPhase]         = useState('joining')  // joining, lobby, question, answered, reveal, leaderboard, ended
  const [sessionPhase, setSessionPhase] = useState(null)
  const [currentQ, setCurrentQ]   = useState(null)
  const [selected, setSelected]   = useState(null)
  const [result, setResult]       = useState(null)  // { correct, points, pct }
  const [streak, setStreak]       = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [rank, setRank]           = useState(null)
  const [nickname, setNickname]   = useState('')
  const [nickDone, setNickDone]   = useState(false)
  const [error, setError]         = useState('')
  const [secsLeft, setSecsLeft]   = useState(30)
  const timerRef = useRef(null)
  const joinedRef = useRef(false)
  const answerStartRef = useRef(Date.now())
  const questionsRef = useRef({})

  // Questions cache (passed from server via event)
  const [questions, setQuestions] = useState({})

  // Join on mount (after nickname)
  async function doJoin() {
    if (joinedRef.current) return
    joinedRef.current = true

    // Ensure auth
    if (!currentUser) {
      try { await signInAsGuest() } catch {}
    }

    const result = await joinSession(code, nickname || undefined)
    if (result.error) { setError(result.error); return }

    setSession(result.session)
    setPlayerId(result.playerId)
    setSessionPhase(result.session?.phase ?? 'lobby')
    setPhase(result.session?.phase === 'question' ? 'question' : 'lobby')

    subscribeRealtime(result.sessionId, result.session)
  }

  function subscribeRealtime(sessionId, initialSession) {
    const channel = supabase
      .channel(`player:${sessionId}:${Math.random()}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'live_sessions',
        filter: `id=eq.${sessionId}`,
      }, payload => {
        const upd = payload.new
        setSession(upd)
        setSessionPhase(upd.phase)
        if (upd.phase === 'question') {
          const qId = upd.question_ids?.[upd.current_question_index ?? 0]
          fetchQuestion(qId)
          setSelected(null)
          setResult(null)
          setPhase('question')
          answerStartRef.current = Date.now()
          startTimer(upd.question_limit_ms ?? 30000)
        }
        if (upd.phase === 'reveal') setPhase('reveal')
        if (upd.phase === 'leaderboard') setPhase('leaderboard')
        if (upd.phase === 'ended') setPhase('ended')
        if (upd.phase === 'lobby') setPhase('lobby')
      })
      .subscribe()
  }

  async function fetchQuestion(qId) {
    if (!qId || questionsRef.current[qId]) {
      setCurrentQ(questionsRef.current[qId])
      return
    }
    const { data } = await supabase
      .from('questions')
      .select('id, prompt, question, options, answer, correct_index, explanation')
      .eq('id', qId)
      .single()
    if (data) {
      questionsRef.current[data.id] = data
      setCurrentQ(data)
    }
  }

  function startTimer(limitMs) {
    clearInterval(timerRef.current)
    const endAt = Date.now() + limitMs
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
      setSecsLeft(left)
      if (left === 0) clearInterval(timerRef.current)
    }, 500)
  }

  async function handleAnswer(option, index) {
    if (selected !== null || !session || !playerId || !currentQ) return
    setSelected(option)
    const msElapsed = Date.now() - answerStartRef.current
    const correct = currentQ.answer === option || currentQ.answer === ANSWER_LABELS[index] || currentQ.correct_index === index
    const res = await submitLiveAnswer(
      session.id, playerId, currentQ.id,
      option, correct, msElapsed, 'game', streak
    )
    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    setTotalPoints(p => p + (res.points ?? 0))
    setResult({ correct, points: res.points ?? 0 })
    setPhase('answered')
  }

  // Nickname screen
  if (!nickDone) {
    return (
      <div className="player-page">
        <div className="player-card">
          <div className="player-logo">in<span>cent</span>ive</div>
          <h2 style={{ marginBottom: 8 }}>Enter a nickname</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
            This is what the class sees on the leaderboard.
          </p>
          <input
            className="player-input"
            type="text"
            placeholder="Swift Dime"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
            onKeyDown={e => { if (e.key === 'Enter') { setNickDone(true); doJoin() }}}
          />
          {error && <p style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: 8 }}>{error}</p>}
          <button
            className="player-btn"
            onClick={() => { setNickDone(true); doJoin() }}
          >
            Join session
          </button>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 12 }}>
            Code: <strong>{code?.toUpperCase()}</strong>
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'joining') {
    return (
      <div className="player-page">
        <div className="player-card">
          <div className="player-logo">in<span>cent</span>ive</div>
          <p>Joining session…</p>
        </div>
      </div>
    )
  }

  if (phase === 'lobby') {
    return (
      <div className="player-page">
        <div className="player-card">
          <div className="player-logo">in<span>cent</span>ive</div>
          <div className="player-nick-badge">{nickname || 'You'}</div>
          <h2>You&apos;re in!</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
            Waiting for the host to start…
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'question' && currentQ) {
    return (
      <div className="player-page">
        <div className="player-topbar">
          <span className="player-nick-badge">{nickname}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
            Q{(session?.current_question_index ?? 0) + 1}
          </span>
        </div>
        <div className="player-q-text">{currentQ.prompt ?? currentQ.question}</div>
        <div className="player-options">
          {(currentQ.options ?? []).map((opt, i) => (
            <button
              key={i}
              className="player-option"
              style={{ background: ANSWER_COLORS[i] + '22', borderColor: ANSWER_COLORS[i] }}
              onClick={() => handleAnswer(opt, i)}
            >
              <span className="player-option-letter" style={{ background: ANSWER_COLORS[i] }}>
                {ANSWER_LABELS[i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
        <div className="player-timer">{secsLeft}s</div>
      </div>
    )
  }

  if (phase === 'answered' && result) {
    return (
      <div className="player-page">
        <div className={`player-result ${result.correct ? 'correct' : 'wrong'}`}>
          <h2>{result.correct ? 'Correct! 🎉' : 'Not quite'}</h2>
          <div className="player-pts">+{result.points} pts</div>
          {streak > 1 && <p>{streak} in a row!</p>}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginTop: 8 }}>
            Waiting for reveal…
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'reveal' && result) {
    return (
      <div className="player-page">
        <div className={`player-result ${result.correct ? 'correct' : 'wrong'}`}>
          <h2>{result.correct ? 'Correct! 🎉' : 'Not quite'}</h2>
          <div className="player-pts">+{result.points} pts</div>
          {currentQ?.explanation && (
            <div className="player-explanation">{currentQ.explanation}</div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'leaderboard' || phase === 'ended') {
    return (
      <div className="player-page">
        <div className="player-card">
          <div className="player-logo">in<span>cent</span>ive</div>
          <h2>{phase === 'ended' ? 'Session ended' : 'Leaderboard'}</h2>
          <div className="player-pts" style={{ fontSize: 'var(--text-3xl)' }}>{totalPoints}</div>
          <p>total points</p>
          <div style={{
            marginTop: 20,
            background: '#FFF7ED',
            border: '2px dashed #FDBA74',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: 'var(--text-sm)',
          }}>
            <strong>Save your progress!</strong> Log in or sign up to keep your cents and streaks.
          </div>
          <a href="/login" className="player-btn" style={{ marginTop: 16 }}>Log in / Sign up</a>
        </div>
      </div>
    )
  }

  return (
    <div className="player-page">
      <div className="player-card">
        <div className="player-logo">in<span>cent</span>ive</div>
        <p>{phase}</p>
      </div>
    </div>
  )
}
