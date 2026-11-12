'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { score as scoreQuestion } from '@/lib/scoring'
import {
  McQuestion, SortQuestion, OrderQuestion, WordbankQuestion,
  NumberlineQuestion, SliderQuestion, FillNumberQuestion,
  SpotMistakeQuestion, ScenarioQuestion,
} from '@/components/questions'
import '@/components/LessonPlayer/LessonPlayer.css'
import './UnitCheck.css'

const PASS_THRESHOLD = 8  // 8 of 10

function QuestionRenderer({ step, response, onChange, phase }) {
  const props = { config: step.config, response, onChange, phase }
  switch (step.type) {
    case 'mc':           return <McQuestion {...props} />
    case 'sort':         return <SortQuestion {...props} />
    case 'order':        return <OrderQuestion {...props} />
    case 'wordbank':     return <WordbankQuestion {...props} />
    case 'numberline':   return <NumberlineQuestion {...props} />
    case 'slider':       return <SliderQuestion {...props} />
    case 'fill_number':  return <FillNumberQuestion {...props} />
    case 'spot_mistake': return <SpotMistakeQuestion {...props} />
    case 'scenario':     return <ScenarioQuestion {...props} />
    default:             return <McQuestion {...props} />
  }
}

export default function UnitCheckClient({ unit, questions, backUrl }) {
  const router = useRouter()
  const [qIdx, setQIdx] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [response, setResponse] = useState(null)
  const [results, setResults] = useState([])   // { credit }
  const [done, setDone] = useState(false)

  const q = questions[qIdx]
  const passed = results.filter(r => r.credit >= 0.5).length >= PASS_THRESHOLD

  useEffect(() => {
    setResponse(null)
    setPhase('idle')
  }, [qIdx])

  function handleCheck() {
    if (!response) return
    const result = scoreQuestion(q.type, q.config, response)
    setResults(r => [...r, { credit: result.credit, questionId: q.questionId }])
    setPhase(result.credit === 1 ? 'correct' : result.credit === 0.5 ? 'partial' : 'wrong')
  }

  function handleNext() {
    if (qIdx + 1 >= questions.length) {
      setDone(true)
    } else {
      setQIdx(i => i + 1)
    }
  }

  if (done) {
    const correctCount = results.filter(r => r.credit >= 0.5).length
    return (
      <div className="unit-check-page">
        <div className="lesson-topbar">
          <Link href={backUrl} className="lesson-exit-btn">✕ Exit</Link>
          <span style={{ fontWeight: 700 }}>{unit.title} · Unit Check</span>
        </div>
        <div className="unit-check-results">
          <div className={`unit-check-verdict${passed ? ' unit-check-verdict--pass' : ' unit-check-verdict--fail'}`}>
            {passed ? '✓ Passed!' : '✗ Not this time'}
          </div>
          <p className="unit-check-score">{correctCount}/{questions.length}</p>
          <p className="unit-check-sub">
            {passed
              ? `You earned +40¢!`
              : `Need ${PASS_THRESHOLD}/10 to pass. Review the unit and try again.`}
          </p>
          <Link href={backUrl} className="lesson-check-btn lesson-check-btn--continue" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: 16 }}>
            Back to unit
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="unit-check-page">
      <div className="lesson-topbar">
        <Link href={backUrl} className="lesson-exit-btn">✕ Exit</Link>
        <div className="lesson-progress-seg">
          <div className="lesson-progress-seg-inner">
            {questions.map((_, i) => (
              <div key={i} className={`lesson-seg${i < qIdx ? ' lesson-seg--done' : i === qIdx && phase !== 'idle' ? (phase === 'correct' ? ' lesson-seg--done' : ' lesson-seg--half') : ''}`} />
            ))}
          </div>
        </div>
        <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.85rem' }}>
          {qIdx + 1}/{questions.length}
        </span>
      </div>

      <main className="lesson-content">
        <div className="lesson-pill" style={{ marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{unit.title}</span>
          <span className="lesson-pill-badge">Unit Check · No hints</span>
          <span className="lesson-type-tag lesson-type-tag--question">Question</span>
        </div>

        <p className="question-prompt">{q.prompt}</p>
        <QuestionRenderer
          step={q}
          response={response}
          onChange={setResponse}
          phase={phase}
        />
      </main>

      {/* Bottom / feedback */}
      {phase === 'idle' ? (
        <div className="lesson-bottom-bar">
          <button
            className="lesson-check-btn"
            disabled={response == null}
            onClick={handleCheck}
          >
            Check
          </button>
        </div>
      ) : (
        <div className={`feedback-bar feedback-bar--${phase === 'correct' ? 'correct' : phase === 'partial' ? 'partial' : 'wrong'}`} role="alert">
          <div className="feedback-icon">
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
              {phase === 'correct' ? '✓' : phase === 'partial' ? '~' : '✗'}
            </span>
          </div>
          <div>
            <div className="feedback-title">
              {phase === 'correct' ? 'Correct!' : phase === 'partial' ? 'Close!' : 'Not quite'}
            </div>
            <div className="feedback-text">{q.explanation}</div>
          </div>
          <div className="feedback-actions">
            <button
              className={`lesson-check-btn${phase === 'correct' ? ' lesson-check-btn--continue' : phase === 'partial' ? ' lesson-check-btn--continue-warn' : ' lesson-check-btn--continue-wrong'}`}
              onClick={handleNext}
              autoFocus
            >
              {qIdx + 1 >= questions.length ? 'See results' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
