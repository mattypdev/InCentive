'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './SwipeRound.css'

// true_false is the ONLY question type allowed in Swipe Round
// (validator enforces this — see spec)

export default function SwipeRoundClient({ unit, cards, backUrl }) {
  const router = useRouter()
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [result, setResult] = useState(null)   // 'correct' | 'wrong'
  const [history, setHistory] = useState([])   // { statement, correct, userAnswer }
  const [done, setDone] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(null)
  const autoRef = useRef(null)

  const card = cards[cardIdx]
  const streak = history.filter(h => h.userAnswer === h.correct).length

  useEffect(() => {
    function onKey(e) {
      if (done || flipped) return
      if (e.key === 'ArrowRight' || e.key === 't') answer(true)
      if (e.key === 'ArrowLeft'  || e.key === 'f') answer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cardIdx, flipped, done])

  function answer(userTrue) {
    if (flipped || done) return
    const isCorrect = userTrue === card.correct
    setResult(isCorrect ? 'correct' : 'wrong')
    setFlipped(true)
    setHistory(h => [...h, { statement: card.statement, correct: card.correct, userAnswer: userTrue }])

    const delay = isCorrect ? 1800 : 3200
    autoRef.current = setTimeout(() => {
      if (cardIdx + 1 >= cards.length) {
        setDone(true)
      } else {
        setCardIdx(i => i + 1)
        setFlipped(false)
        setResult(null)
        setDragX(0)
      }
    }, delay)
  }

  function onPointerDown(e) {
    if (flipped || done) return
    startX.current = e.clientX
    setDragging(true)
  }

  function onPointerMove(e) {
    if (!dragging || startX.current == null) return
    setDragX(e.clientX - startX.current)
  }

  function onPointerUp(e) {
    if (!dragging) return
    setDragging(false)
    const dx = e.clientX - (startX.current ?? e.clientX)
    if (Math.abs(dx) > 80) {
      answer(dx > 0)  // right = true, left = false
    } else {
      setDragX(0)
    }
    startX.current = null
  }

  if (done) {
    const correct = history.filter(h => h.userAnswer === h.correct).length
    const missed = history.filter(h => h.userAnswer !== h.correct)
    return (
      <div className="swipe-page">
        <div className="swipe-topbar">
          <Link href={backUrl} className="swipe-exit">✕ Exit</Link>
          <span className="swipe-title">{unit.title} · Swipe Round</span>
        </div>
        <div className="swipe-results">
          <h2 className="swipe-results-title">{correct}/{cards.length} correct</h2>
          <p className="swipe-results-sub">+10¢ earned</p>
          {missed.length > 0 && (
            <div className="swipe-missed">
              <div className="swipe-missed-label">Missed</div>
              {missed.map((h, i) => (
                <div key={i} className="swipe-missed-item">
                  <span>{h.statement}</span>
                  <span className="swipe-missed-answer">{h.correct ? 'TRUE' : 'FALSE'}</span>
                </div>
              ))}
            </div>
          )}
          <Link href={backUrl} className="swipe-btn">Back to unit</Link>
        </div>
      </div>
    )
  }

  const rotation = dragging ? Math.min(15, Math.max(-15, dragX * 0.05)) : 0
  const opacity = dragging ? Math.max(0.6, 1 - Math.abs(dragX) * 0.002) : 1

  return (
    <div className="swipe-page">
      <div className="swipe-topbar">
        <Link href={backUrl} className="swipe-exit">✕ Exit</Link>
        <span className="swipe-title">{unit.title} · Swipe Round</span>
        <span className="swipe-counter">{cardIdx + 1}/{cards.length}</span>
      </div>

      {/* Card stack */}
      <div className="swipe-deck-wrap">
        {/* Shadow card */}
        {cardIdx + 1 < cards.length && (
          <div className="swipe-card swipe-card--shadow" />
        )}

        {/* Active card */}
        <div
          className={`swipe-card${flipped ? ` swipe-card--${result}` : ''}`}
          style={{
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            opacity,
            cursor: flipped ? 'default' : 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Direction hints */}
          {dragging && dragX > 40 && (
            <div className="swipe-hint swipe-hint--true">TRUE</div>
          )}
          {dragging && dragX < -40 && (
            <div className="swipe-hint swipe-hint--false">FALSE</div>
          )}

          <div className="swipe-card-content">
            {flipped ? (
              <>
                <div className={`swipe-verdict${result === 'correct' ? ' swipe-verdict--correct' : ' swipe-verdict--wrong'}`}>
                  {result === 'correct' ? '✓ Correct' : '✗ False'}
                </div>
                <p className="swipe-statement">{card.statement}</p>
                {card.explanation && (
                  <p className="swipe-explanation">{card.explanation}</p>
                )}
              </>
            ) : (
              <p className="swipe-statement">{card.statement}</p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      {!flipped && (
        <div className="swipe-btns">
          <button className="swipe-btn swipe-btn--false" onClick={() => answer(false)}>← False</button>
          <button className="swipe-btn swipe-btn--true"  onClick={() => answer(true)}>True →</button>
        </div>
      )}

      <p className="swipe-keyboard-hint">Swipe, tap a button, or press ← F / → T on keyboard</p>
    </div>
  )
}
