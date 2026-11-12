'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import '@/app/(pages)/Learn.css'
import '@/components/Button.css'
import './question-types.css'

// ─── Sample questions for each type ───────────────────────────────────────

const DRAG_DROP_Q = {
  prompt: 'Put these budget steps in the correct order.',
  items: ['Track your spending', 'Set financial goals', 'List income sources', 'Allocate money to categories'],
  correctOrder: [1, 2, 0, 3], // indexes of items in correct order
}

const MATCHING_Q = {
  prompt: 'Match each term to its definition.',
  pairs: [
    { term: 'APR',        def: 'Annual cost of borrowing, including fees' },
    { term: 'Liquidity',  def: 'How quickly an asset can be converted to cash' },
    { term: 'Net worth',  def: 'Assets minus liabilities' },
    { term: 'Compound interest', def: 'Earning interest on previously earned interest' },
  ],
}

// Graph question — Supply: P = 1 + Q, Demand: P = (9 + s) − Q
// Target shift s = 3 (demand increases by 3 units at every price)
const GRAPH_Q = {
  prompt: 'Rising incomes allow consumers to buy 3 more units at every price. Drag the demand curve to show this change.',
  target: 3,
  tolerance: 0.6,
}

// ─── Drag & Drop ──────────────────────────────────────────────────────────

function DragDropQuestion({ onNext }) {
  const [order, setOrder] = useState([0, 1, 2, 3])
  const [checked, setChecked] = useState(false)
  const dragIdx = useRef(null)
  const dragOverIdx = useRef(null)

  const items = DRAG_DROP_Q.items

  function handleDragStart(i) { dragIdx.current = i }
  function handleDragOver(e, i) { e.preventDefault(); dragOverIdx.current = i }
  function handleDrop() {
    const from = dragIdx.current
    const to   = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const next = [...order]
    next.splice(to, 0, next.splice(from, 1)[0])
    setOrder(next)
    dragIdx.current = null
    dragOverIdx.current = null
  }

  const isCorrect = checked && order.every((v, i) => v === DRAG_DROP_Q.correctOrder[i])
  const isWrong   = checked && !isCorrect

  return (
    <div className="q-shell">
      <p className="lesson-prompt">{DRAG_DROP_Q.prompt}</p>
      <p className="q-hint">Drag to reorder</p>
      <ul className="drag-list">
        {order.map((itemIdx, pos) => (
          <li
            key={itemIdx}
            className={`drag-item${checked ? (isCorrect ? ' drag-correct' : ' drag-wrong') : ''}`}
            draggable
            onDragStart={() => handleDragStart(pos)}
            onDragOver={e => handleDragOver(e, pos)}
            onDrop={handleDrop}
          >
            <span className="drag-handle">⠿</span>
            <span className="drag-num">{pos + 1}</span>
            {items[itemIdx]}
          </li>
        ))}
      </ul>
      {!checked ? (
        <button className="btn btn-primary" onClick={() => setChecked(true)}>
          <span className="btn-label">Check answer</span>
        </button>
      ) : (
        <div className={`lesson-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <p className="feedback-label">{isCorrect ? 'Correct!' : 'Not quite'}</p>
          <p className="feedback-explain">
            {isCorrect
              ? 'That\'s the right order — goals first, then track and allocate.'
              : 'Correct order: Set financial goals → List income sources → Track your spending → Allocate money to categories.'}
          </p>
          <button className="btn btn-primary" onClick={onNext}>
            <span className="btn-label">Next</span>
            <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5}/></span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Matching ─────────────────────────────────────────────────────────────

function MatchingQuestion({ onNext }) {
  const pairs = MATCHING_Q.pairs
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDef,  setSelectedDef]  = useState(null)
  const [matched, setMatched] = useState({}) // termIdx -> defIdx
  const [wrong,   setWrong]   = useState(null)
  const [done,    setDone]    = useState(false)

  const shuffledDefs = useRef([...pairs.map((_, i) => i)].sort(() => Math.random() - 0.5))

  function pickTerm(i) {
    if (matched[i] !== undefined) return
    setSelectedTerm(i)
    setWrong(null)
    if (selectedDef !== null) tryMatch(i, selectedDef)
  }

  function pickDef(shufflePos) {
    const defIdx = shuffledDefs.current[shufflePos]
    if (Object.values(matched).includes(defIdx)) return
    setSelectedDef(shufflePos)
    setWrong(null)
    if (selectedTerm !== null) tryMatch(selectedTerm, shufflePos)
  }

  function tryMatch(termIdx, shufflePos) {
    const defIdx = shuffledDefs.current[shufflePos]
    if (termIdx === defIdx) {
      const next = { ...matched, [termIdx]: shufflePos }
      setMatched(next)
      setSelectedTerm(null)
      setSelectedDef(null)
      if (Object.keys(next).length === pairs.length) setDone(true)
    } else {
      setWrong({ termIdx, shufflePos })
      setTimeout(() => { setWrong(null); setSelectedTerm(null); setSelectedDef(null) }, 800)
    }
  }

  const isTermMatched    = i   => matched[i] !== undefined
  const isTermSelected   = i   => selectedTerm === i
  const isTermWrong      = i   => wrong?.termIdx === i
  const isDefMatched     = pos => Object.values(matched).includes(pos)
  const isDefSelected    = pos => selectedDef === pos
  const isDefWrong       = pos => wrong?.shufflePos === pos

  return (
    <div className="q-shell">
      <p className="lesson-prompt">{MATCHING_Q.prompt}</p>
      <p className="q-hint">Tap a term, then tap its definition</p>
      <div className="match-grid">
        <ul className="match-col">
          {pairs.map((p, i) => (
            <li
              key={i}
              className={`match-term${isTermMatched(i) ? ' match-done' : isTermWrong(i) ? ' match-wrong' : isTermSelected(i) ? ' match-selected' : ''}`}
              onClick={() => !isTermMatched(i) && pickTerm(i)}
            >
              {isTermMatched(i) && <Check size={14} strokeWidth={3} style={{flexShrink:0}}/>}
              {p.term}
            </li>
          ))}
        </ul>
        <ul className="match-col">
          {shuffledDefs.current.map((defIdx, pos) => (
            <li
              key={pos}
              className={`match-def${isDefMatched(pos) ? ' match-done' : isDefWrong(pos) ? ' match-wrong' : isDefSelected(pos) ? ' match-selected' : ''}`}
              onClick={() => !isDefMatched(pos) && pickDef(pos)}
            >
              {pairs[defIdx].def}
            </li>
          ))}
        </ul>
      </div>
      {done && (
        <div className="lesson-feedback feedback-correct">
          <p className="feedback-label">All matched!</p>
          <p className="feedback-explain">Great work connecting those terms.</p>
          <button className="btn btn-primary" onClick={onNext}>
            <span className="btn-label">Next</span>
            <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5}/></span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Supply & Demand Graph ────────────────────────────────────────────────
//
// Coordinate system: Quantity 0–10 on x, Price 0–10 on y
// Supply:  P = 1 + Q      → upward sloping
// Demand:  P = (9 + s) − Q → downward sloping, s is the student's shift
// Equilibrium: P_eq = (10 + s)/2,  Q_eq = (8 + s)/2

const GW = 300, GH = 240
const GP = { top: 16, right: 28, bottom: 36, left: 36 }
const PW = GW - GP.left - GP.right  // plot width in px
const PH = GH - GP.top  - GP.bottom // plot height in px
const MAX_Q = 10, MAX_P = 10

function qPx(q) { return GP.left + (q / MAX_Q) * PW }
function pPx(p) { return GP.top  + ((MAX_P - p) / MAX_P) * PH }

// Clip a line (P = a - b*Q) to the visible plot area, return {x1,y1,x2,y2}
function clipLine(a, b) {
  // P = a - b*Q  →  Q = (a - P) / b
  // Find Q at P=0 and P=MAX_P, then Q at Q=0 and Q=MAX_Q
  const pts = []
  // P=0 → Q = a/b
  const qAtP0 = a / b
  if (qAtP0 >= 0 && qAtP0 <= MAX_Q) pts.push([qAtP0, 0])
  // P=MAX_P → Q = (a - MAX_P) / b
  const qAtPmax = (a - MAX_P) / b
  if (qAtPmax >= 0 && qAtPmax <= MAX_Q) pts.push([qAtPmax, MAX_P])
  // Q=0 → P = a
  if (a >= 0 && a <= MAX_P) pts.push([0, a])
  // Q=MAX_Q → P = a - b*MAX_Q
  const pAtQmax = a - b * MAX_Q
  if (pAtQmax >= 0 && pAtQmax <= MAX_P) pts.push([MAX_Q, pAtQmax])
  if (pts.length < 2) return null
  return { x1: qPx(pts[0][0]), y1: pPx(pts[0][1]), x2: qPx(pts[1][0]), y2: pPx(pts[1][1]) }
}

function GraphQuestion({ onNext }) {
  const [shift, setShift] = useState(0)   // student's shift, range -4..+6
  const [checked, setChecked] = useState(false)
  const hasMovedRef = useRef(false)

  const { target, tolerance } = GRAPH_Q
  const isCorrect = checked && Math.abs(shift - target) <= tolerance

  // Supply: P = 1 + Q  (a=1, b=-1 → rewrite as P = 1 + 1*Q, but clipLine expects P = a - b*Q
  // Let's pass it as: a=11, b=1 flipped... simpler to just compute directly)
  const supplyPts  = { x1: qPx(0), y1: pPx(1), x2: qPx(9), y2: pPx(10) }  // Q:0→9, P:1→10
  const demandOrig = clipLine(9, 1)                                           // P = 9 - Q
  const demandCurr = clipLine(9 + shift, 1)                                   // P = (9+s) - Q

  // Equilibrium (intersection of S and D)
  // 1 + Q = (9+s) - Q  →  Q = (8+s)/2, P = (10+s)/2
  function eqPt(s) {
    const q = (8 + s) / 2
    const p = (10 + s) / 2
    if (q < 0 || q > MAX_Q || p < 0 || p > MAX_P) return null
    return { cx: qPx(q), cy: pPx(p) }
  }
  const eqOrig = eqPt(0)
  const eqCurr = eqPt(shift)

  // Label positions: end of each line
  function labelPos(pts, padX, padY) {
    if (!pts) return { x: 0, y: 0 }
    // use the point with higher x for the label
    const [px, py] = pts.x2 > pts.x1 ? [pts.x2, pts.y2] : [pts.x1, pts.y1]
    return { x: Math.min(px + padX, GW - 4), y: Math.max(py + padY, 8) }
  }
  const supplyLabel  = { x: Math.min(qPx(9) + 4, GW - 4), y: Math.max(pPx(10) - 4, 8) }
  const demandLabel  = demandCurr ? labelPos(demandCurr, 4, 0) : { x: 0, y: 0 }
  const ghostLabel   = demandOrig && shift !== 0 ? labelPos(demandOrig, 4, 0) : null

  const sliderMin = -4, sliderMax = 6

  return (
    <div className="q-shell">
      <p className="lesson-prompt">{GRAPH_Q.prompt}</p>
      <p className="q-hint">Drag the slider to move the demand curve</p>

      <div className="graph-wrap">
        <svg width={GW} height={GH}>
          {/* Grid lines */}
          {[2,4,6,8].map(v => (
            <g key={v}>
              <line x1={qPx(v)} y1={GP.top} x2={qPx(v)} y2={GP.top+PH} stroke="var(--border)" strokeWidth="1"/>
              <line x1={GP.left} y1={pPx(v)} x2={GP.left+PW} y2={pPx(v)} stroke="var(--border)" strokeWidth="1"/>
              <text x={qPx(v)} y={GP.top+PH+14} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle">{v}</text>
              <text x={GP.left-6} y={pPx(v)+3} fontSize="9" fill="var(--muted-foreground)" textAnchor="end">{v}</text>
            </g>
          ))}

          {/* Axes */}
          <line x1={GP.left} y1={GP.top} x2={GP.left} y2={GP.top+PH} stroke="var(--foreground)" strokeWidth="2"/>
          <line x1={GP.left} y1={GP.top+PH} x2={GP.left+PW} y2={GP.top+PH} stroke="var(--foreground)" strokeWidth="2"/>
          <text x={GP.left + PW/2} y={GH - 2} fontSize="10" fill="var(--muted-foreground)" textAnchor="middle">Quantity</text>
          <text x={9} y={GP.top + PH/2} fontSize="10" fill="var(--muted-foreground)" textAnchor="middle"
            transform={`rotate(-90, 9, ${GP.top + PH/2})`}>Price</text>

          {/* Ghost original demand — only when moved */}
          {shift !== 0 && demandOrig && (
            <>
              <line {...demandOrig} stroke="var(--muted-foreground)" strokeWidth="2"
                strokeDasharray="6 4" opacity="0.45"/>
              {ghostLabel && <text x={ghostLabel.x} y={ghostLabel.y} fontSize="11" fontWeight="700"
                fill="var(--muted-foreground)" opacity="0.55">D</text>}
            </>
          )}

          {/* Original equilibrium ghost dot */}
          {shift !== 0 && eqOrig && (
            <circle {...eqOrig} r="4" fill="var(--muted-foreground)" opacity="0.35"/>
          )}

          {/* Supply curve */}
          <line {...supplyPts} stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round"/>
          <text x={supplyLabel.x} y={supplyLabel.y} fontSize="12" fontWeight="800" fill="var(--secondary)">S</text>

          {/* Demand curve (animated) */}
          {demandCurr && (
            <line {...demandCurr} stroke={checked ? (isCorrect ? 'var(--secondary)' : 'var(--accent)') : 'var(--accent)'}
              strokeWidth="3" strokeLinecap="round"
              style={{transition:'all 200ms ease'}}/>
          )}
          <text x={demandLabel.x} y={demandLabel.y} fontSize="12" fontWeight="800"
            fill={checked ? (isCorrect ? 'var(--secondary)' : 'var(--accent)') : 'var(--accent)'}
            style={{transition:'all 200ms ease'}}>
            {shift !== 0 ? "D'" : 'D'}
          </text>

          {/* Current equilibrium dot */}
          {eqCurr && (
            <circle {...eqCurr} r="5" fill="var(--foreground)" stroke="white" strokeWidth="2"
              style={{transition:'all 200ms ease'}}/>
          )}

          {/* Correct-answer zone indicator (shown after check) */}
          {checked && !isCorrect && (() => {
            const correct = clipLine(9 + target, 1)
            const lbl = correct ? labelPos(correct, 4, 0) : null
            return correct ? (
              <>
                <line {...correct} stroke="var(--secondary)" strokeWidth="2"
                  strokeDasharray="8 4" opacity="0.7"/>
                {lbl && <text x={lbl.x} y={lbl.y} fontSize="11" fontWeight="700"
                  fill="var(--secondary)" opacity="0.8">D*</text>}
              </>
            ) : null
          })()}
        </svg>
      </div>

      {/* Slider */}
      <div className="graph-slider-wrap">
        <span className="graph-slider-label">D shifts left</span>
        <input
          type="range"
          min={sliderMin} max={sliderMax} step="0.5"
          value={shift}
          disabled={checked}
          className="graph-slider"
          onChange={e => {
            hasMovedRef.current = true
            setShift(parseFloat(e.target.value))
          }}
        />
        <span className="graph-slider-label">D shifts right</span>
      </div>
      <p className="graph-shift-readout">
        {shift === 0 ? 'No shift yet' : shift > 0 ? `D shifted right by ${shift} unit${shift===1?'':'s'}` : `D shifted left by ${Math.abs(shift)} unit${Math.abs(shift)===1?'':'s'}`}
      </p>

      {!checked ? (
        <button className="btn btn-primary" onClick={() => setChecked(true)} disabled={!hasMovedRef.current}>
          <span className="btn-label">Check answer</span>
        </button>
      ) : (
        <div className={`lesson-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <p className="feedback-label">{isCorrect ? 'Correct!' : 'Not quite'}</p>
          <p className="feedback-explain">
            {isCorrect
              ? `Exactly right — a +${target}-unit increase in demand shifts D right by ${target}. Equilibrium price and quantity both rise.`
              : `The demand curve should shift right by exactly ${target} units (D'). The dashed green line shows the correct position.`}
          </p>
          <button className="btn btn-primary" onClick={onNext}>
            <span className="btn-label">Next</span>
            <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5}/></span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Word Bank Fill-in-the-blank ──────────────────────────────────────────

const WORDBANK_Q = {
  sentence: ['Spending less than you earn and saving the difference is called living within your', null, '. Building a 3–6 month', null, 'fund protects you from unexpected expenses.'],
  bank: ['emergency', 'means', 'budget', 'salary'],
  answers: ['means', 'emergency'],
}

function WordBankQuestion({ onNext }) {
  const [placed, setPlaced] = useState([null, null]) // word placed in each blank
  const [checked, setChecked] = useState(false)

  const usedWords = placed.filter(Boolean)
  const available = WORDBANK_Q.bank.filter(w => !usedWords.includes(w))

  function placeWord(word, blankIdx) {
    if (checked) return
    const next = [...placed]
    const prev = next[blankIdx]
    next[blankIdx] = word
    setPlaced(next)
  }

  function removeWord(blankIdx) {
    if (checked) return
    const next = [...placed]
    next[blankIdx] = null
    setPlaced(next)
  }

  const allFilled = placed.every(Boolean)
  const results   = checked ? placed.map((w, i) => w === WORDBANK_Q.answers[i]) : []
  const allCorrect = results.every(Boolean)

  let blankCount = 0

  return (
    <div className="q-shell">
      <p className="q-label">Fill in the blanks</p>
      <p className="wb-sentence">
        {WORDBANK_Q.sentence.map((part, i) => {
          if (part !== null) return <span key={i}>{part} </span>
          const idx  = blankCount++
          const word = placed[idx]
          const res  = checked ? results[idx] : null
          return (
            <button
              key={i}
              className={`wb-blank${word ? ' wb-blank--filled' : ''}${res === true ? ' wb-blank--correct' : res === false ? ' wb-blank--wrong' : ''}`}
              onClick={() => word && removeWord(idx)}
            >
              {word ?? '______'}
              {word && !checked && <X size={12} strokeWidth={3} style={{marginLeft:4}}/>}
            </button>
          )
        })}
      </p>

      <div className="wb-bank">
        {WORDBANK_Q.bank.map(word => {
          const isUsed = usedWords.includes(word)
          return (
            <button
              key={word}
              className={`wb-chip${isUsed ? ' wb-chip--used' : ''}`}
              onClick={() => {
                if (checked || isUsed) return
                const nextBlank = placed.indexOf(null)
                if (nextBlank !== -1) placeWord(word, nextBlank)
              }}
              disabled={checked || isUsed}
            >
              {word}
            </button>
          )
        })}
      </div>

      {!checked ? (
        <button className="btn btn-primary" onClick={() => setChecked(true)} disabled={!allFilled}>
          <span className="btn-label">Check answer</span>
        </button>
      ) : (
        <div className={`lesson-feedback ${allCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <p className="feedback-label">{allCorrect ? 'Correct!' : 'Not quite'}</p>
          <p className="feedback-explain">
            {allCorrect
              ? 'Exactly right — living within your means and keeping an emergency fund are the two pillars of financial health.'
              : `The correct words are "${WORDBANK_Q.answers[0]}" and "${WORDBANK_Q.answers[1]}".`}
          </p>
          <button className="btn btn-primary" onClick={onNext}>
            <span className="btn-label">Next</span>
            <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5}/></span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Page shell ───────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Drag & Drop',   component: DragDropQuestion },
  { label: 'Matching',      component: MatchingQuestion },
  { label: 'Graph',         component: GraphQuestion    },
  { label: 'Word Bank',     component: WordBankQuestion },
]

export default function QuestionTypesPrototype() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  function next() {
    if (step + 1 < STEPS.length) setStep(s => s + 1)
    else setDone(true)
  }

  const Current = STEPS[step]?.component

  if (done) {
    return (
      <main className="learn-page">
        <section className="section"><div className="container">
          <div className="lesson-done">
            <div className="done-icon done-icon--gold"><Check size={36} strokeWidth={3}/></div>
            <h2>All question types reviewed!</h2>
            <p className="done-subtitle">Let us know which ones to build out.</p>
            <button className="btn btn-secondary" onClick={() => { setStep(0); setDone(false) }}>
              <span className="btn-label">Restart</span>
              <span className="btn-icon-badge"><ArrowLeft size={16} strokeWidth={2.5}/></span>
            </button>
          </div>
        </div></section>
      </main>
    )
  }

  const pct = (step / STEPS.length) * 100

  return (
    <main className="learn-page">
      <section className="section"><div className="container">
        <div className="lesson-shell">

          {/* Top bar */}
          <div className="lesson-top">
            <div style={{fontSize:'var(--text-sm)', fontWeight:700, color:'var(--muted-foreground)'}}>
              PROTOTYPE
            </div>
            <div className="lesson-progress-track">
              <div className="lesson-progress-fill" style={{width:`${pct}%`}}/>
            </div>
            <span className="lesson-counter">{step + 1} / {STEPS.length}</span>
          </div>

          {/* Type label */}
          <div className="lesson-meta">
            <span className="lesson-title-inline">Question Types</span>
            <span className="qt-badge">{STEPS[step].label}</span>
          </div>

          {/* Step tabs */}
          <div className="qt-tabs">
            {STEPS.map((s, i) => (
              <button
                key={i}
                className={`qt-tab${i === step ? ' qt-tab--active' : ''}${i < step ? ' qt-tab--done' : ''}`}
                onClick={() => setStep(i)}
              >
                {i < step ? <Check size={12} strokeWidth={3}/> : null}
                {s.label}
              </button>
            ))}
          </div>

          <Current key={step} onNext={next} />
        </div>
      </div></section>
    </main>
  )
}
