'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { score as scoreQuestion } from '@/lib/scoring'
import { startAttempt, saveStep, saveAnswer, finishLesson } from '@/app/actions/lesson'
import {
  McQuestion, SortQuestion, OrderQuestion, WordbankQuestion,
  NumberlineQuestion, SliderQuestion, FillNumberQuestion,
  SpotMistakeQuestion, ScenarioQuestion,
} from '@/components/questions'
import './LessonPlayer.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

function countGraded(steps) {
  return steps.filter(s => s.kind === 'question' && s.graded !== false).length
}

function learnGroupOf(steps, qIdx) {
  for (let i = qIdx - 1; i >= 0; i--) {
    if (steps[i].kind === 'learn') return i
    if (steps[i].kind === 'hook') return -1
  }
  return -1
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HookStep({ step }) {
  return (
    <div className="hook-step">
      <p className="hook-question">{step.text}</p>
    </div>
  )
}

function LearnStep({ step }) {
  const { format, title, body, data = {} } = step

  function renderData() {
    if (format === 'walkthrough' && data.panels) {
      return (
        <div className="learn-walkthrough">
          {data.panels.map((p, i) => (
            <div key={i} className={`learn-walkthrough-panel${p.color ? ` learn-walkthrough-panel--${p.color}` : ''}`}>
              <span className="learn-panel-label">{p.label}</span>
              <span className="learn-panel-value">{p.value}</span>
            </div>
          ))}
        </div>
      )
    }
    if (format === 'compare' && (data.left || data.right)) {
      return (
        <div className="learn-compare">
          {[data.left, data.right].map((side, i) => side && (
            <div key={i} className="learn-compare-side">
              <div className="learn-compare-label">{side.label}</div>
              <div className="learn-compare-stat">{side.months} mo</div>
              <div className="learn-compare-sub">{side.interest} in interest</div>
            </div>
          ))}
        </div>
      )
    }
    if ((format === 'explain' || format === 'story') && data.highlightBox) {
      return (
        <div className="learn-highlight-box">
          <div className="learn-highlight-title">{data.highlightBox}</div>
          {data.detail && <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{data.detail}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <div className="learn-step">
      <h2 className="learn-title">{title}</h2>
      <p className="learn-body">{body}</p>
      {renderData()}
    </div>
  )
}

function AnotherWayCard({ anotherWay }) {
  return (
    <div className="another-way-card">
      <span className="another-way-label">Another way to see it</span>
      <h2 className="another-way-title">{anotherWay.title}</h2>
      <p className="learn-body">{anotherWay.body}</p>
    </div>
  )
}

function LoanPayoffWidget({ config }) {
  const { balance = 1000, apr = 24, minPayment = 25 } = config
  const [payment, setPayment] = useState(minPayment)
  const trackRef = useRef(null)

  const maxPay = balance * 0.15
  const pct = ((payment - minPayment) / (maxPay - minPayment)) * 100

  function calcPayoff(pmt) {
    const monthly = apr / 100 / 12
    if (pmt <= balance * monthly) return { months: 999, interest: 999999 }
    let bal = balance, months = 0, interest = 0
    while (bal > 0 && months < 600) {
      const intCharge = bal * monthly
      interest += intCharge
      bal = Math.max(0, bal + intCharge - pmt)
      months++
    }
    return { months, interest: Math.round(interest) }
  }

  const { months, interest } = calcPayoff(payment)
  const presets = [minPayment, minPayment * 2, Math.round(balance * 0.1)]

  function setFromEvent(e) {
    const rect = trackRef.current.getBoundingClientRect()
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left) - rect.left
    const p = Math.max(0, Math.min(1, x / rect.width))
    const v = Math.round(p * (maxPay - minPayment) + minPayment)
    setPayment(v)
  }

  return (
    <div className="loan-payoff">
      <div
        ref={trackRef}
        className="loan-slider-track"
        onPointerDown={setFromEvent}
        onPointerMove={e => { if (e.buttons === 1) setFromEvent(e) }}
        role="slider" aria-valuemin={minPayment} aria-valuemax={maxPay} aria-valuenow={payment}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') setPayment(p => Math.min(maxPay, p + 5))
          if (e.key === 'ArrowLeft')  setPayment(p => Math.max(minPayment, p - 5))
        }}
      >
        <div className="loan-slider-fill" style={{ width: `${pct}%` }} />
        <div className="loan-slider-knob" style={{ left: `${pct}%` }} />
      </div>
      <div className="loan-ticks">
        <span>${minPayment}/mo (min)</span>
        <span>${Math.round(maxPay / 2)}</span>
        <span>${Math.round(maxPay)}/mo</span>
      </div>
      <div className="loan-results">
        <div className="loan-result-card">
          <span className="loan-result-value">{months >= 500 ? '∞' : months + ' mo'}</span>
          <span className="loan-result-label">to pay off</span>
        </div>
        <div className="loan-result-card">
          <span className="loan-result-value">${interest >= 99999 ? '∞' : interest.toLocaleString()}</span>
          <span className="loan-result-label">paid in interest</span>
        </div>
      </div>
      <div className="loan-chart">
        {presets.map(p => {
          const r = calcPayoff(p)
          const maxM = calcPayoff(minPayment).months
          return (
            <div key={p} className="loan-chart-row">
              <span>${p}/mo</span>
              <div className="loan-bar" style={{ width: `${Math.min(240, (r.months / maxM) * 240)}px` }} />
              <em>{r.months} mo · ${r.interest.toLocaleString()}</em>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TryItStep({ step }) {
  return (
    <div className="try-it-step">
      <div className="try-it-header">
        <span className="try-it-title">Try it: ${step.config?.balance?.toLocaleString()} at {step.config?.apr}% APR</span>
        <span className="try-it-tag">Interactive</span>
      </div>
      {step.widget === 'loan_payoff' && <LoanPayoffWidget config={step.config} />}
    </div>
  )
}

function MoneyMoveStep({ step }) {
  return (
    <div className="money-move-step">
      <span className="money-move-label">Money Move</span>
      <p className="money-move-text">{step.text}</p>
    </div>
  )
}

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

function ResultsScreen({ lesson, answers, centsAwarded, xpAwarded, onContinue, unitSlug, islandSlug }) {
  const gradedSteps = lesson.steps.filter(s => s.kind === 'question' && s.graded !== false)
  const totalCredit = gradedSteps.reduce((sum, s) => sum + (answers[s.questionId]?.credit ?? 0), 0)
  const numGraded = gradedSteps.length
  const pct = numGraded > 0 ? Math.round((totalCredit / numGraded) * 100) : 100
  const missed = gradedSteps.filter(s => (answers[s.questionId]?.credit ?? 0) < 1)

  const r = 46
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="results-screen">
      <svg className="results-score-ring" viewBox="0 0 110 110" aria-label={`${pct}% correct`}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="#EFEAD9" strokeWidth="12" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={pct >= 83 ? '#16A34A' : pct >= 50 ? '#D97706' : '#DC2626'}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 55 55)"
        />
        <text x="55" y="62" textAnchor="middle" fontFamily="var(--font-heading)" fontWeight="800" fontSize="20" fill="var(--foreground)">
          {pct}%
        </text>
      </svg>

      <h2 className="results-title">
        {pct === 100 ? 'Perfect! 🎉' : pct >= 83 ? 'Great work!' : pct >= 50 ? 'Nice try!' : 'Keep going!'}
      </h2>

      <div className="results-rewards">
        <div className="results-reward-chip">
          <span>+{centsAwarded}¢</span>
        </div>
        {xpAwarded > 0 && (
          <div className="results-reward-chip">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"
                fill="#8B5CF6" stroke="var(--foreground)" strokeWidth="1.6" />
            </svg>
            +{xpAwarded} XP
          </div>
        )}
        {pct === 100 && <div className="results-reward-chip" style={{ background: '#FEF3C7' }}>⭐ Perfect</div>}
      </div>

      {missed.length > 0 && (
        <div className="results-missed">
          <div className="results-missed-title">Questions to review</div>
          {missed.map(s => (
            <div key={s.questionId} className="results-missed-item">{s.prompt.slice(0, 80)}…</div>
          ))}
        </div>
      )}

      <div className="results-swipe-unlock">
        Swipe Round unlocked for this unit →
      </div>

      <div className="results-nav" style={{ width: '100%' }}>
        <button className="lesson-check-btn" style={{ width: '100%' }} onClick={onContinue}>
          Back to unit
        </button>
      </div>
    </div>
  )
}

function FeedbackBar({ phase, step, onContinue, onReRead }) {
  if (phase === 'idle') return null
  const isCorrect = phase === 'correct'
  const isPartial = phase === 'partial'

  let cls = 'feedback-bar'
  if (isCorrect) cls += ' feedback-bar--correct'
  else if (isPartial) cls += ' feedback-bar--partial'
  else cls += ' feedback-bar--wrong'

  let btnCls = 'lesson-check-btn'
  if (isCorrect) btnCls += ' lesson-check-btn--continue'
  else if (isPartial) btnCls += ' lesson-check-btn--continue-warn'
  else btnCls += ' lesson-check-btn--continue-wrong'

  const title = isCorrect ? '✓ Correct!' : isPartial ? 'Close!' : 'Not quite'
  const icon = isCorrect ? '✓' : isPartial ? '~' : '✗'

  return (
    <div className={cls} role="alert" aria-live="assertive">
      <div className="feedback-icon" aria-hidden="true">
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>{icon}</span>
      </div>
      <div>
        <div className="feedback-title">{title}</div>
        {step?.explanation && <div className="feedback-text">{step.explanation}</div>}
      </div>
      <div className="feedback-actions">
        {step?.kind === 'question' && onReRead && (
          <button className="feedback-reread" onClick={onReRead} aria-label="Re-read the lesson step">
            ↩ Re-read
          </button>
        )}
        <button className={btnCls} onClick={onContinue} autoFocus>
          Continue
        </button>
      </div>
    </div>
  )
}

// ── Main LessonPlayer ─────────────────────────────────────────────────────────

export default function LessonPlayer({ lesson, islandSlug, unitSlug, backUrl }) {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState('idle')    // idle | correct | partial | wrong
  const [response, setResponse] = useState(null)
  const [answers, setAnswers] = useState({})    // { [questionId]: { response, credit, misconception } }
  const [anotherWayIdx, setAnotherWayIdx] = useState(null)  // learn step idx queued for another-way
  const [showAnotherWay, setShowAnotherWay] = useState(false)
  const [showReRead, setShowReRead] = useState(false)
  const [done, setDone] = useState(false)
  const [centsAwarded, setCentsAwarded] = useState(0)
  const [xpAwarded, setXpAwarded] = useState(0)
  const [attemptId, setAttemptId] = useState(null)
  const startTimeRef = useRef(Date.now())

  const steps = lesson.steps
  const step = steps[stepIndex]
  const gradedCount = countGraded(steps)
  const answeredGraded = Object.values(answers).filter(a => a.credit !== undefined).length

  // Start or resume attempt on mount
  useEffect(() => {
    startAttempt(lesson.id).then(({ attemptId }) => {
      if (attemptId) setAttemptId(attemptId)
    })
  }, [lesson.id])

  // Keyboard shortcut: Enter to Continue when feedback is shown
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Enter' && phase !== 'idle' && !showReRead) handleContinue()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, showReRead, stepIndex])

  // Reset response when step changes
  useEffect(() => {
    setResponse(null)
    setPhase('idle')
  }, [stepIndex, showAnotherWay])

  function handleCheck() {
    if (step.kind !== 'question') return
    if (response == null) return

    const ms = Date.now() - startTimeRef.current
    startTimeRef.current = Date.now()

    const result = scoreQuestion(step.type, step.config, response)
    const phaseVal = result.credit === 1 ? 'correct' : result.credit === 0.5 ? 'partial' : 'wrong'
    setPhase(phaseVal)

    const newAnswers = {
      ...answers,
      [step.questionId]: { response, credit: result.credit, misconception: result.misconception },
    }
    setAnswers(newAnswers)

    // Save to DB
    saveAnswer(attemptId, step.questionId, response, result.credit, result.misconception, ms)
    saveStep(attemptId, stepIndex, newAnswers)

    // Check if another-way should be queued: both questions after the same learn step are wrong
    if (result.credit === 0 && step.graded !== false) {
      const learnIdx = learnGroupOf(steps, stepIndex)
      if (learnIdx >= 0 && steps[learnIdx].anotherWay) {
        // Find the paired question (previous question in the same group)
        const questionsBefore = steps
          .slice(learnIdx + 1, stepIndex)
          .filter(s => s.kind === 'question')
        if (questionsBefore.length > 0) {
          const prevQ = questionsBefore[questionsBefore.length - 1]
          if (newAnswers[prevQ.questionId]?.credit === 0) {
            setAnotherWayIdx(learnIdx)
          }
        }
      }
    }
  }

  function handleContinue() {
    if (showAnotherWay) {
      setShowAnotherWay(false)
      setAnotherWayIdx(null)
      advance()
      return
    }

    if (anotherWayIdx !== null) {
      setShowAnotherWay(true)
      setPhase('idle')
      return
    }

    advance()
  }

  function advance() {
    const next = stepIndex + 1
    if (next >= steps.length) {
      completeLesson()
    } else {
      setStepIndex(next)
      setPhase('idle')
      setAnotherWayIdx(null)
    }
  }

  async function completeLesson() {
    const totalCredit = Object.values(answers).reduce((s, a) => s + (a.credit ?? 0), 0)
    const result = await finishLesson(attemptId, lesson.id, totalCredit, gradedCount)
    setCentsAwarded(result.centsAwarded)
    setXpAwarded(result.xpAwarded)
    setDone(true)
  }

  // Find the most recent learn step before current question (for re-read)
  function findLearnStepForReRead() {
    for (let i = stepIndex - 1; i >= 0; i--) {
      if (steps[i].kind === 'learn') return steps[i]
    }
    return null
  }

  // Type tag
  function getTypeTag() {
    if (!step) return null
    if (step.kind === 'hook') return <span className="lesson-type-tag lesson-type-tag--hook">Hook</span>
    if (step.kind === 'learn') return <span className="lesson-type-tag lesson-type-tag--learn">Learn</span>
    if (step.kind === 'question' && step.graded !== false) return <span className="lesson-type-tag lesson-type-tag--question">Question</span>
    if (step.kind === 'question') return <span className="lesson-type-tag lesson-type-tag--unscored">Practice</span>
    if (step.kind === 'try_it') return <span className="lesson-type-tag lesson-type-tag--try">Interactive</span>
    if (step.kind === 'money_move') return <span className="lesson-type-tag lesson-type-tag--move">Money Move</span>
    return null
  }

  // Progress bar state per segment
  function segState(i) {
    if (i < stepIndex) return 'done'
    if (i === stepIndex && phase !== 'idle') {
      if (phase === 'correct') return 'done'
      if (phase === 'partial') return 'half'
    }
    return 'none'
  }

  if (done) {
    return (
      <div className="lesson-player">
        <div className="lesson-topbar">
          <button className="lesson-exit-btn" onClick={() => router.push(backUrl || '/learn')}>
            ✕ Exit
          </button>
          <div className="lesson-progress-seg">
            <div className="lesson-progress-seg-inner">
              {steps.map((_, i) => (
                <div key={i} className="lesson-seg lesson-seg--done" />
              ))}
            </div>
          </div>
        </div>
        <ResultsScreen
          lesson={lesson}
          answers={answers}
          centsAwarded={centsAwarded}
          xpAwarded={xpAwarded}
          islandSlug={islandSlug}
          unitSlug={unitSlug}
          onContinue={() => router.push(backUrl || `/learn/${islandSlug}`)}
        />
      </div>
    )
  }

  if (!step) return null

  const isQuestion = !showAnotherWay && step.kind === 'question'
  const canCheck = isQuestion && response != null && phase === 'idle'
  const learnStepForReRead = isQuestion ? findLearnStepForReRead() : null

  return (
    <div className="lesson-player">
      {/* Top bar */}
      <div className="lesson-topbar">
        <button
          className="lesson-exit-btn"
          onClick={() => router.push(backUrl || '/learn')}
          aria-label="Exit lesson"
        >
          ✕
        </button>
        <div className="lesson-progress-seg" role="progressbar" aria-valuenow={stepIndex} aria-valuemax={steps.length}>
          <div className="lesson-progress-seg-inner">
            {steps.map((_, i) => (
              <div key={i} className={`lesson-seg${segState(i) === 'done' ? ' lesson-seg--done' : segState(i) === 'half' ? ' lesson-seg--half' : ''}`} />
            ))}
          </div>
        </div>
        <div className="lesson-topbar-meta">
          {gradedCount > 0 && (
            <span className="lesson-xp-badge" aria-label={`${answeredGraded} of ${gradedCount} questions`}>
              {answeredGraded}/{gradedCount}
            </span>
          )}
          <span className="lesson-xp-badge" aria-label={`${lesson.centsReward} cents reward`}>
            +{lesson.centsReward}¢
          </span>
        </div>
      </div>

      {/* Step content */}
      <main className="lesson-content">
        {/* Lesson pill */}
        <div className="lesson-pill" style={{ marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{lesson.title}</span>
          <span className="lesson-pill-badge">Step {stepIndex + 1} of {steps.length}</span>
          {getTypeTag()}
        </div>

        {isQuestion && gradedCount > 0 && (
          <div className="lesson-q-counter">
            Question {answeredGraded + 1} of {gradedCount}
          </div>
        )}

        {showAnotherWay && anotherWayIdx !== null ? (
          <AnotherWayCard anotherWay={steps[anotherWayIdx].anotherWay} />
        ) : (
          <>
            {step.kind === 'hook'       && <HookStep step={step} />}
            {step.kind === 'learn'      && <LearnStep step={step} />}
            {step.kind === 'try_it'     && <TryItStep step={step} />}
            {step.kind === 'money_move' && <MoneyMoveStep step={step} />}
            {isQuestion && (
              <>
                <p className="question-prompt">{step.prompt}</p>
                <QuestionRenderer
                  step={step}
                  response={response}
                  onChange={setResponse}
                  phase={phase}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Bottom bar for non-question steps */}
      {(step.kind !== 'question' || showAnotherWay) && phase === 'idle' && (
        <div className="lesson-bottom-bar">
          <button
            className="lesson-check-btn lesson-check-btn--continue"
            onClick={showAnotherWay ? handleContinue : advance}
          >
            {step.kind === 'money_move' ? 'Done' : 'Continue'}
          </button>
        </div>
      )}

      {/* Check button for questions */}
      {isQuestion && phase === 'idle' && (
        <div className="lesson-bottom-bar">
          <button
            className="lesson-check-btn"
            disabled={!canCheck}
            onClick={handleCheck}
          >
            Check
          </button>
        </div>
      )}

      {/* Feedback bar */}
      <FeedbackBar
        phase={phase}
        step={step}
        onContinue={handleContinue}
        onReRead={learnStepForReRead ? () => setShowReRead(true) : null}
      />

      {/* Re-read modal */}
      {showReRead && learnStepForReRead && (
        <div className="reread-overlay" onClick={() => setShowReRead(false)}>
          <div className="reread-sheet" onClick={e => e.stopPropagation()}>
            <button className="reread-close" onClick={() => setShowReRead(false)} aria-label="Close">✕</button>
            <LearnStep step={learnStepForReRead} />
          </div>
        </div>
      )}
    </div>
  )
}
