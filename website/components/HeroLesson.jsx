'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import CoinBadge from '@/components/CoinBadge'
import '@/app/(pages)/Learn.css'
import './Button.css'

const UNIT_COLOR = '#FF6F61'

const QUESTIONS = [
  {
    type: 'mc',
    unit: 'Money Basics',
    reward: 10,
    prompt: 'What is the main benefit of compound interest?',
    options: [
      'Your interest earns interest too',
      'You pay less tax on savings',
      'Banks pay you a sign-up bonus',
    ],
    correct: 0,
    explanation: 'Compound interest means you earn interest on your principal AND on accumulated interest — your money snowballs over time.',
  },
  {
    type: 'fill-blank',
    unit: 'Budgeting',
    reward: 10,
    prompt: 'The 50/30/20 rule assigns 20% of income to ______.',
    options: ['savings', 'rent', 'food', 'taxes'],
    correct: 0,
    explanation: '50% goes to needs, 30% to wants, and 20% to savings or paying down debt.',
  },
  {
    type: 'mc',
    unit: 'Investing',
    reward: 10,
    prompt: 'What does "diversifying" your portfolio mean?',
    options: [
      'Spreading money across different assets',
      'Putting everything into one stock',
      'Only buying government bonds',
    ],
    correct: 0,
    explanation: 'Diversification spreads risk — if one investment drops, others may cushion the impact.',
  },
]

function FillBlankPrompt({ prompt, selectedOption, correctIndex, selectedIndex, showFeedback }) {
  const parts = prompt.split('______')
  if (parts.length < 2) return <p className="lesson-prompt">{prompt}</p>
  let cls = 'fill-blank-gap'
  if (selectedOption !== null && !showFeedback) cls += ' fill-blank-gap--pending'
  if (showFeedback && selectedIndex === correctIndex) cls += ' fill-blank-gap--correct'
  if (showFeedback && selectedIndex !== correctIndex) cls += ' fill-blank-gap--wrong'
  return (
    <p className="lesson-prompt lesson-prompt--fill-blank">
      {parts[0]}<span className={cls}>{selectedOption ?? '______'}</span>{parts[1]}
    </p>
  )
}

export default function HeroLesson() {
  const [phase, setPhase]           = useState('intro')
  const [qIndex, setQIndex]         = useState(0)
  const [selected, setSelected]     = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore]           = useState(0)

  const q         = QUESTIONS[qIndex]
  const isCorrect = showFeedback && selected === q.correct
  const pct       = ((qIndex + (showFeedback ? 1 : 0)) / QUESTIONS.length) * 100

  function handleAnswer(i) {
    if (showFeedback) return
    setSelected(i)
    setShowFeedback(true)
    if (i === q.correct) setScore(s => s + q.reward)
  }

  function handleContinue() {
    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(i => i + 1)
      setSelected(null)
      setShowFeedback(false)
    } else {
      setPhase('done')
    }
  }

  /* ─── Intro screen ─── */
  if (phase === 'intro') {
    return (
      <div className="hero-quiz hl-intro-card">
        <div className="hl-intro-banner" style={{ background: UNIT_COLOR }}>
          <p className="hl-intro-eyebrow">The Basics · Lesson 1</p>
          <h3 className="hl-intro-title">Money 101</h3>
          <p className="hl-intro-meta">3 questions · earn up to ¢30</p>
        </div>
        <p className="hl-intro-desc">
          Get a taste of what real lessons feel like — answer a few questions and see how incentive works.
        </p>
        <button className="btn btn-primary hl-cta-btn" onClick={() => setPhase('question')}>
          <span className="btn-label">Try a quick lesson</span>
          <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
        </button>
      </div>
    )
  }

  /* ─── Done screen ─── */
  if (phase === 'done') {
    const total     = QUESTIONS.reduce((s, q) => s + q.reward, 0)
    const allCorrect = score === total
    return (
      <div className="hero-quiz hl-done-card">
        <div className={`hl-done-icon${allCorrect ? ' hl-done-icon--gold' : ''}`}>
          <Star size={26} strokeWidth={2.5} />
        </div>
        <h3 className="hl-done-heading">{allCorrect ? 'Perfect score!' : 'Nice work!'}</h3>
        <p className="hl-done-sub">
          You earned <strong>¢{score}</strong> — that's real money in the actual app.
        </p>
        <Link href="/learn" className="btn btn-primary hl-cta-btn">
          <span className="btn-label">Start for real</span>
          <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
        </Link>
      </div>
    )
  }

  /* ─── Question screen ─── */
  return (
    <div className="hero-quiz">
      <div className="hl-lesson-shell">

        {/* Progress row */}
        <div className="lesson-top">
          <div className="lesson-progress-track">
            <div className="lesson-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="lesson-counter">{qIndex + 1} / {QUESTIONS.length}</span>
        </div>

        {/* Unit label */}
        <div className="lesson-meta">
          <span className="lesson-title-inline">{q.unit}</span>
          <span className="hero-quiz-reward">
            <CoinBadge size={22} drop="1px 1px 0" />
            +{q.reward}¢
          </span>
        </div>

        {/* Question + feedback */}
        <div className="lesson-q-area">
          {q.type === 'fill-blank' ? (
            <div className="mc-question mc-question--fill">
              <FillBlankPrompt
                prompt={q.prompt}
                selectedOption={selected !== null ? q.options[selected] : null}
                correctIndex={q.correct}
                selectedIndex={selected}
                showFeedback={showFeedback}
              />
              <ul className="lesson-options lesson-options--fill-blank">
                {q.options.map((opt, i) => {
                  let cls = 'lesson-option'
                  if (showFeedback) {
                    if (i === q.correct) cls += ' correct'
                    else if (i === selected) cls += ' wrong'
                  } else if (i === selected) cls += ' selected'
                  return (
                    <li key={i}>
                      <button className={cls} onClick={() => handleAnswer(i)} disabled={showFeedback}>
                        <span className="option-letter">{i + 1}</span>
                        {opt}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="mc-question">
              <p className="lesson-prompt">{q.prompt}</p>
              <ul className="lesson-options">
                {q.options.map((opt, i) => {
                  let cls = 'lesson-option'
                  if (showFeedback) {
                    if (i === q.correct) cls += ' correct'
                    else if (i === selected) cls += ' wrong'
                  } else if (i === selected) cls += ' selected'
                  return (
                    <li key={i}>
                      <button className={cls} onClick={() => handleAnswer(i)} disabled={showFeedback}>
                        <span className="option-letter">{i + 1}</span>
                        {opt}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {showFeedback && (
            <div className={`lesson-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              <p className="feedback-label">{isCorrect ? 'Correct!' : 'Not quite'}</p>
              <p className="feedback-explain">{q.explanation}</p>
            </div>
          )}
        </div>

        {showFeedback && (
          <button className="btn btn-primary hl-cta-btn" onClick={handleContinue}>
            <span className="btn-label">
              {qIndex + 1 < QUESTIONS.length ? 'Continue' : 'See results'}
            </span>
            <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
          </button>
        )}

      </div>
    </div>
  )
}
