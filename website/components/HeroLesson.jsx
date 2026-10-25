'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, X, Zap } from 'lucide-react'

const QUESTIONS = [
  {
    type: 'mc',
    unit: 'Money Basics',
    reward: 10,
    prompt: 'What happens to the value of your money when inflation rises?',
    options: [
      { text: 'It buys less than before', correct: true },
      { text: 'It buys more than before' },
      { text: 'Its value stays the same' },
    ],
    explanation: 'Inflation means prices rise, so each dollar buys fewer goods and services.',
  },
  {
    type: 'fill-blank',
    unit: 'Budgeting',
    reward: 10,
    before: 'The 50/30/20 rule splits income into needs, wants, and',
    after: '.',
    answer: 'savings',
    alts: ['saving', 'save'],
    explanation: 'The three buckets are 50% needs, 30% wants, and 20% savings.',
  },
  {
    type: 'slider',
    unit: 'Investing',
    reward: 10,
    prompt: 'Drag to guess: investing $200/month at 8% for 20 years grows to roughly…',
    min: 50000,
    max: 200000,
    step: 1000,
    answer: 118589,
    tolerance: 20000,
    format: '$',
    explanation: 'Compound growth turns $200/month into ~$118,000 — that\'s the magic of investing early.',
  },
]

function ProgressDots({ total, current }) {
  return (
    <div className="hl-dots">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`hl-dot${i < current ? ' hl-dot--done' : i === current ? ' hl-dot--active' : ''}`}
        />
      ))}
    </div>
  )
}

function MCQuestion({ q, onAnswer, answered }) {
  return (
    <ul className="hl-options">
      {q.options.map((opt, i) => {
        let cls = 'hl-option'
        if (answered !== null) {
          if (opt.correct) cls += ' hl-option--correct'
          else if (i === answered) cls += ' hl-option--wrong'
        }
        return (
          <li key={i}>
            <button
              className={cls}
              onClick={() => onAnswer(i, opt.correct)}
              disabled={answered !== null}
            >
              {answered !== null && opt.correct && (
                <span className="hl-check"><Check size={13} strokeWidth={3} /></span>
              )}
              {answered !== null && i === answered && !opt.correct && (
                <span className="hl-wrong"><X size={13} strokeWidth={3} /></span>
              )}
              {opt.text}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function FillBlankQuestion({ q, onAnswer, answered }) {
  const [val, setVal] = useState('')
  const normalized = val.trim().toLowerCase()
  const isCorrect = normalized === q.answer || (q.alts || []).includes(normalized)

  function submit(e) {
    e.preventDefault()
    if (!val.trim() || answered !== null) return
    onAnswer(val.trim(), isCorrect)
  }

  return (
    <form className="hl-fillblank" onSubmit={submit}>
      <p className="hl-blank-sentence">
        {q.before}{' '}
        <span className={`hl-blank-input-wrap${answered !== null ? (isCorrect ? ' hl-blank--correct' : ' hl-blank--wrong') : ''}`}>
          <input
            className="hl-blank-input"
            type="text"
            value={val}
            onChange={e => setVal(e.target.value)}
            disabled={answered !== null}
            placeholder="___"
            aria-label="Fill in the blank"
          />
        </span>
        {q.after}
      </p>
      {answered === null && (
        <button className="hl-submit" type="submit" disabled={!val.trim()}>
          Check
        </button>
      )}
    </form>
  )
}

function SliderQuestion({ q, onAnswer, answered }) {
  const mid = q.min + Math.round(((q.max - q.min) / 2) / q.step) * q.step
  const [value, setValue] = useState(mid)
  const pct = ((value - q.min) / (q.max - q.min)) * 100
  const bubblePct = Math.max(4, Math.min(96, pct))
  const isCorrect = answered !== null && Math.abs(value - q.answer) <= q.tolerance

  function fmt(v) {
    if (q.format === '$') return '$' + v.toLocaleString()
    return v.toLocaleString()
  }

  const ticks = Array.from({ length: 3 }, (_, i) =>
    Math.round(q.min + (q.max - q.min) * i / 2)
  )

  return (
    <div className="hl-slider-wrap">
      <div className="hl-bubble-row" style={{ '--bpct': `${bubblePct}%` }}>
        <span className={`hl-bubble${answered !== null ? (isCorrect ? ' hl-bubble--ok' : ' hl-bubble--bad') : ''}`}>
          {fmt(value)}
        </span>
      </div>
      <input
        className={`hl-range${answered !== null ? (isCorrect ? ' hl-range--ok' : ' hl-range--bad') : ''}`}
        type="range"
        min={q.min}
        max={q.max}
        step={q.step}
        value={value}
        disabled={answered !== null}
        onChange={e => setValue(Number(e.target.value))}
        style={{ '--pct': `${pct}%` }}
      />
      <div className="hl-ticks">
        {ticks.map((t, i) => (
          <span key={i} className="hl-tick">{fmt(t)}</span>
        ))}
      </div>
      {answered === null && (
        <button className="hl-submit" onClick={() => onAnswer(value, isCorrect)}>
          Lock it in
        </button>
      )}
      {answered !== null && !isCorrect && (
        <p className="hl-answer-note">Correct answer: {fmt(q.answer)}</p>
      )}
    </div>
  )
}

export default function HeroLesson() {
  const [phase, setPhase] = useState('intro')
  const [qIndex, setQIndex] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect] = useState(false)
  const [score, setScore] = useState(0)

  const q = QUESTIONS[qIndex]

  function handleAnswer(choice, isCorrect) {
    setAnswered(choice)
    setCorrect(isCorrect)
    if (isCorrect) setScore(s => s + q.reward)
  }

  function handleNext() {
    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(i => i + 1)
      setAnswered(null)
      setCorrect(false)
    } else {
      setPhase('done')
    }
  }

  if (phase === 'intro') {
    return (
      <div className="hero-quiz hl-intro">
        <div className="hl-intro-icon"><Zap size={28} strokeWidth={2.5} /></div>
        <h3 className="hl-intro-title">Try a quick lesson!</h3>
        <p className="hl-intro-body">
          Answer {QUESTIONS.length} real questions — earn cents, see how it works.
        </p>
        <div className="hl-intro-pills">
          <span className="hl-pill">Multiple choice</span>
          <span className="hl-pill">Fill in the blank</span>
          <span className="hl-pill">Slider</span>
        </div>
        <button className="hl-start-btn" onClick={() => setPhase('question')}>
          Start <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    const total = QUESTIONS.reduce((s, q) => s + q.reward, 0)
    const pct = Math.round((score / total) * 100)
    return (
      <div className="hero-quiz hl-done">
        <div className="hl-done-score">
          <span className="hl-done-pct">{pct}%</span>
          <span className="hl-done-label">¢{score} earned</span>
        </div>
        <p className="hl-done-msg">
          {pct === 100 ? 'Perfect score — you\'re a natural!' : pct >= 66 ? 'Great start! Keep going to build your streak.' : 'Nice try! The full course will get you there.'}
        </p>
        <Link href="/learn" className="hl-start-btn">
          Start Learning Free <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    )
  }

  return (
    <div className="hero-quiz hl-active">
      <div className="hero-quiz-top">
        <span className="hero-quiz-unit">{q.unit}</span>
        <span className="hero-quiz-reward">
          <span className="hero-quiz-coin">¢</span>+{q.reward}
        </span>
      </div>

      <ProgressDots total={QUESTIONS.length} current={qIndex} />

      <p className="hero-quiz-prompt">{q.type === 'fill-blank' ? 'Fill in the blank' : q.prompt}</p>

      {q.type === 'mc' && <MCQuestion q={q} onAnswer={handleAnswer} answered={answered} />}
      {q.type === 'fill-blank' && <FillBlankQuestion q={q} onAnswer={handleAnswer} answered={answered} />}
      {q.type === 'slider' && (
        <>
          <p className="hl-slider-prompt">{q.prompt}</p>
          <SliderQuestion q={q} onAnswer={handleAnswer} answered={answered} />
        </>
      )}

      {answered !== null && (
        <div className={`hl-feedback${correct ? ' hl-feedback--ok' : ' hl-feedback--bad'}`}>
          <span className="hl-feedback-icon">
            {correct ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
          </span>
          <span>{q.explanation}</span>
        </div>
      )}

      {answered !== null && (
        <button className="hl-next-btn" onClick={handleNext}>
          {qIndex + 1 < QUESTIONS.length ? 'Next question' : 'See results'}
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
