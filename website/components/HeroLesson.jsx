'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import CoinBadge from '@/components/CoinBadge'
import QuestionRenderer from '@/components/QuestionRenderer'
import '@/app/(pages)/Learn.css'
import './Button.css'

const UNIT_COLOR = '#FF6F61'

const QUESTIONS = [
  {
    id: 'hero-q1',
    type: 'mc',
    unit: 'Money Basics',
    reward: 10,
    prompt: 'What is compound interest?',
    options: [
      'Earning interest on both your principal and past interest',
      'A fixed fee charged on top of a loan',
      'Interest paid only on the original amount borrowed',
    ],
    correct: 0,
    explanation: 'Compound interest means your interest earns interest — your money snowballs the longer it sits.',
  },
  {
    id: 'hero-q2',
    type: 'numberline',
    unit: 'Investing',
    reward: 10,
    prompt: 'Drag to estimate: $1,000 invested at 7% annual return grows to about ___ after 10 years.',
    options: [],
    correct: 0,
    meta: { min: 500, max: 3500, step: 50, answer: 1967, tolerance: 400, format: 'dollar' },
    explanation: 'At 7% compounded annually, $1,000 becomes roughly $1,967 in 10 years.',
  },
  {
    id: 'hero-q3',
    type: 'fill-blank',
    unit: 'Budgeting',
    reward: 10,
    prompt: 'The 50/30/20 rule assigns 20% of income to ______.',
    options: ['savings', 'rent', 'food', 'taxes'],
    correct: 0,
    explanation: '50% goes to needs, 30% to wants, and 20% to savings or paying down debt.',
  },
]

export default function HeroLesson() {
  const { currentUser, openLogin } = useAuth()
  const [phase, setPhase]               = useState('intro')
  const [qIndex, setQIndex]             = useState(0)
  const [selected, setSelected]         = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore]               = useState(0)

  const q         = QUESTIONS[qIndex]
  const isCorrect = showFeedback && selected === q?.correct
  const pct       = ((qIndex + (showFeedback ? 1 : 0)) / QUESTIONS.length) * 100

  function handleAnswer(choice) {
    if (showFeedback) return
    setSelected(choice)
    setShowFeedback(true)
    if (choice === q.correct) setScore(s => s + q.reward)
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

  /* ─── Done screen — mirrors the real unit done screen ─── */
  if (phase === 'done') {
    return (
      <div className="hero-quiz">
        <div className="lesson-done">
          <div className="done-icon">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2>Nice work.</h2>
          <p className="done-subtitle">Money 101 · {score}/{QUESTIONS.reduce((s, q) => s + q.reward, 0)} cents</p>
          <div className="done-rewards">
            <div className="done-cents">
              <CoinBadge size={28} drop="2px 2px 0" />
              <span>+{score} cents earned</span>
            </div>
            <div className="done-xp">
              <span className="done-xp-icon" />
              <span>+{score * 2} XP earned</span>
            </div>
          </div>
          {!currentUser && (
            <div className="done-guest-cta">
              <p>Create an account to save your progress and keep earning.</p>
              <button type="button" className="btn btn-primary" onClick={openLogin}>
                <span className="btn-label">Log in to save</span>
                <span className="btn-icon-badge"><LogIn size={16} strokeWidth={2.5} /></span>
              </button>
            </div>
          )}
          <Link href="/learn" className="btn btn-secondary">
            <span className="btn-label">Start for real</span>
            <span className="btn-icon-badge"><ArrowRight size={16} strokeWidth={2.5} /></span>
          </Link>
        </div>
      </div>
    )
  }

  /* ─── Question screen ─── */
  return (
    <div className="hero-quiz">
      <div className="hl-lesson-shell">

        <div className="lesson-top">
          <div className="lesson-progress-track">
            <div className="lesson-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="lesson-counter">{qIndex + 1} / {QUESTIONS.length}</span>
        </div>

        <div className="lesson-meta">
          <span className="lesson-title-inline">{q.unit}</span>
          <span className="hero-quiz-reward">
            <CoinBadge size={22} drop="1px 1px 0" />
            +{q.reward}¢
          </span>
        </div>

        <div className="lesson-q-area">
          <QuestionRenderer
            key={q.id}
            q={q}
            showFeedback={showFeedback}
            selected={selected}
            onAnswer={handleAnswer}
          />

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
