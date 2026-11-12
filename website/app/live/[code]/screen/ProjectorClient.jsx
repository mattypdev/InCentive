'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import './Projector.css'

const ANSWER_COLORS = ['#EF4444','#3B82F6','#F59E0B','#22C55E']
const ANSWER_LABELS = ['A','B','C','D']

export default function ProjectorClient({ initialSession, initialQuestions }) {
  const supabase = createClient()
  const [session, setSession]       = useState(initialSession)
  const [questions]                 = useState(initialQuestions ?? [])
  const [responses, setResponses]   = useState([])
  const [playerCount, setPlayerCount] = useState(0)

  const phase = session?.phase ?? 'draft'
  const qIndex = session?.current_question_index ?? 0
  const currentQId = session?.question_ids?.[qIndex]
  const currentQ = questions.find(q => q.id === currentQId) ?? null

  useEffect(() => {
    if (!session?.id) return
    const channel = supabase
      .channel(`projector:${session.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_sessions', filter: `id=eq.${session.id}` },
        payload => setSession(prev => ({ ...prev, ...payload.new })))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_players', filter: `session_id=eq.${session.id}` },
        () => setPlayerCount(c => c + 1))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_responses', filter: `session_id=eq.${session.id}` },
        payload => setResponses(prev => [...prev, payload.new]))
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [session?.id])

  useEffect(() => {
    if (!session?.id) return
    supabase.from('live_players').select('id').eq('session_id', session.id)
      .then(({ data }) => setPlayerCount(data?.length ?? 0))
    supabase.from('live_responses').select('*').eq('session_id', session.id)
      .then(({ data }) => setResponses(data ?? []))
  }, [session?.id])

  // Tally
  const gameResponses = responses.filter(r => r.phase === 'game' && r.question_id === currentQId)
  const tally = {}
  const totalAnswered = gameResponses.reduce((s, r) => {
    const key = typeof r.answer === 'string' ? r.answer.replace(/"/g,'') : JSON.stringify(r.answer)
    const cnt = r.paper_count ?? 1
    tally[key] = (tally[key] ?? 0) + cnt
    return s + cnt
  }, 0)

  if (phase === 'lobby' || phase === 'draft') {
    return (
      <div className="proj-lobby">
        <div className="proj-logo">in<span>cent</span>ive</div>
        <div className="proj-join">
          <span>Join at <strong>incentivefinance.org/join</strong></span>
          <span className="proj-code">{session?.code}</span>
        </div>
        <div className="proj-player-count">{playerCount} players joined</div>
      </div>
    )
  }

  if (phase === 'question' || phase === 'reveal') {
    return (
      <div className="proj-question">
        <div className="proj-topbar">
          <span>Question {qIndex + 1} of {session?.question_ids?.length ?? '?'}</span>
          <span>incentivefinance.org/join · <strong className="proj-code-sm">{session?.code}</strong></span>
        </div>
        <div className="proj-q-text">{currentQ?.prompt ?? currentQ?.question}</div>
        <div className="proj-options">
          {(currentQ?.options ?? []).map((opt, i) => {
            const letter = ANSWER_LABELS[i]
            const count = tally[letter] ?? tally[opt] ?? 0
            const pct = totalAnswered > 0 ? (count / totalAnswered) * 100 : 0
            const isCorrect = phase === 'reveal' && (
              currentQ.answer === letter || currentQ.answer === opt || currentQ.correct_index === i
            )
            return (
              <div key={i} className={`proj-option${isCorrect ? ' correct' : ''}${phase === 'reveal' && !isCorrect ? ' wrong' : ''}`}>
                <div className="proj-option-icon" style={{ background: ANSWER_COLORS[i] }} />
                <span className="proj-option-text">{opt}</span>
                {phase === 'reveal' && (
                  <span className="proj-option-pct">{Math.round(pct)}%</span>
                )}
              </div>
            )
          })}
        </div>
        {phase === 'reveal' && currentQ?.explanation && (
          <div className="proj-explanation">{currentQ.explanation}</div>
        )}
      </div>
    )
  }

  if (phase === 'leaderboard') {
    return (
      <div className="proj-lobby" style={{ background: '#1E293B' }}>
        <div className="proj-logo">Leaderboard</div>
        <div className="proj-join">
          <span>Code: <strong className="proj-code">{session?.code}</strong></span>
        </div>
      </div>
    )
  }

  if (phase === 'ended') {
    return (
      <div className="proj-lobby">
        <div className="proj-logo">Thanks for playing!</div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24 }}>Great session today.</p>
      </div>
    )
  }

  return (
    <div className="proj-lobby">
      <div className="proj-logo">in<span>cent</span>ive</div>
      <div className="proj-join">
        <span>Code: <strong className="proj-code">{session?.code}</strong></span>
      </div>
    </div>
  )
}
