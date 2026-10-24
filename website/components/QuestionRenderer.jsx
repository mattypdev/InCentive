'use client'
import { useState, useRef, useMemo, useEffect } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Fill-in-the-blank prompt (existing type) ─────────────────────────────

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

// ─── Multiple-choice (default) ────────────────────────────────────────────

function MCQuestion({ q, showFeedback, selected, onAnswer }) {
  const isFill = q.type === 'fill-blank'
  return (
    <>
      {isFill ? (
        <FillBlankPrompt
          prompt={q.prompt}
          selectedOption={selected !== null ? q.options[selected] : null}
          correctIndex={q.correct} selectedIndex={selected} showFeedback={showFeedback}
        />
      ) : (
        <p className="lesson-prompt">{q.prompt}</p>
      )}
      <ul className={`lesson-options${isFill ? ' lesson-options--fill-blank' : ''}`}>
        {q.options?.map((opt, i) => {
          let cls = 'lesson-option'
          if (showFeedback) { if (i === q.correct) cls += ' correct'; else if (i === selected) cls += ' wrong' }
          else if (i === selected) cls += ' selected'
          return (
            <li key={i}>
              <button className={cls} onClick={() => onAnswer(i)} disabled={showFeedback}>
                <span className="option-letter">{i + 1}</span>{opt}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

// ─── Sort into buckets ────────────────────────────────────────────────────

function SortQuestion({ q, showFeedback, selected, onAnswer }) {
  const { buckets, items } = q.meta
  // shuffledItems: array of original item indices in display order
  const shuffledIndices = useMemo(() => shuffle(items.map((_, i) => i)), [q.id])

  const [pool, setPool]     = useState(shuffledIndices) // indices not yet placed
  const [placed, setPlaced] = useState(() => buckets.map(() => []))  // placed[bucketIdx] = [itemIdx, ...]
  const [active, setActive] = useState(null)  // item index currently selected

  const allPlaced = pool.length === 0
  const isCorrect = selected === q.correct  // 0 = correct, set by parent after onAnswer

  function pickFromPool(itemIdx) {
    if (showFeedback) return
    setActive(prev => prev === itemIdx ? null : itemIdx)
  }

  function pickFromBucket(bucketIdx, itemIdx) {
    if (showFeedback) return
    // return item to pool
    setPlaced(prev => prev.map((b, bi) => bi === bucketIdx ? b.filter(i => i !== itemIdx) : b))
    setPool(prev => [...prev, itemIdx])
    setActive(null)
  }

  function assignToBucket(bucketIdx) {
    if (showFeedback || active === null) return
    setPool(prev => prev.filter(i => i !== active))
    setPlaced(prev => prev.map((b, bi) => bi === bucketIdx ? [...b, active] : b))
    setActive(null)
  }

  function handleCheck() {
    const correct = placed.every((bucketItems, bi) =>
      bucketItems.every(idx => items[idx].bucket === bi)
    ) && allPlaced
    onAnswer(correct ? 0 : 1)
  }

  // Bucket colors
  const bucketColors = ['var(--accent)', 'var(--secondary)', 'var(--quaternary)', 'var(--tertiary)']

  return (
    <div className="q-sort">
      <p className="lesson-prompt lesson-prompt--sort">{q.prompt}</p>
      <p className="q-type-hint">Tap an item, then tap a bucket to place it</p>

      {/* Buckets */}
      <div className="sort-buckets" style={{ gridTemplateColumns: `repeat(${buckets.length}, 1fr)` }}>
        {buckets.map((label, bi) => (
          <div
            key={bi}
            className={`sort-bucket${active !== null && !showFeedback ? ' sort-bucket--droppable' : ''}`}
            style={{ '--bucket-color': bucketColors[bi % bucketColors.length] }}
            onClick={() => assignToBucket(bi)}
          >
            <div className="sort-bucket-label">{label}</div>
            <div className="sort-bucket-items">
              {placed[bi].map(itemIdx => {
                const correct = showFeedback ? items[itemIdx].bucket === bi : null
                return (
                  <div
                    key={itemIdx}
                    className={`sort-item sort-item--placed${correct === true ? ' sort-item--correct' : correct === false ? ' sort-item--wrong' : ''}`}
                    onClick={e => { e.stopPropagation(); pickFromBucket(bi, itemIdx) }}
                  >
                    {items[itemIdx].text}
                    {!showFeedback && <span className="sort-item-remove">×</span>}
                    {showFeedback && correct === true  && <span className="sort-item-icon">✓</span>}
                    {showFeedback && correct === false && <span className="sort-item-icon">✗</span>}
                  </div>
                )
              })}
              {placed[bi].length === 0 && <div className="sort-bucket-empty">Drop here</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Item pool */}
      {!allPlaced && (
        <div className="sort-pool">
          {pool.map(itemIdx => (
            <button
              key={itemIdx}
              className={`sort-item sort-item--pool${active === itemIdx ? ' sort-item--active' : ''}`}
              onClick={() => pickFromPool(itemIdx)}
              disabled={showFeedback}
            >
              {items[itemIdx].text}
            </button>
          ))}
        </div>
      )}

      {!showFeedback && (
        <button className="btn btn-primary q-check-btn" onClick={handleCheck} disabled={!allPlaced}>
          <span className="btn-label">Check answer</span>
        </button>
      )}
    </div>
  )
}

// ─── Drag-to-order ────────────────────────────────────────────────────────

function OrderQuestion({ q, showFeedback, selected, onAnswer }) {
  const correctItems = q.meta.items
  const initialOrder = useMemo(() => shuffle(correctItems.map((_, i) => i)), [q.id])
  const [order, setOrder] = useState(initialOrder)
  const [snappingOrigIdx, setSnappingOrigIdx] = useState(null)
  const dragIdx     = useRef(null)
  const dragOverIdx = useRef(null)

  const isCorrect = selected === q.correct

  useEffect(() => {
    if (snappingOrigIdx === null) return
    const t = setTimeout(() => setSnappingOrigIdx(null), 400)
    return () => clearTimeout(t)
  }, [snappingOrigIdx])

  function dragStart(i) { dragIdx.current = i }
  function dragOver(e, i) { e.preventDefault(); dragOverIdx.current = i }
  function drop() {
    const from = dragIdx.current, to = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const movedOrigIdx = order[from]
    const next = [...order]
    next.splice(to, 0, next.splice(from, 1)[0])
    setOrder(next)
    setSnappingOrigIdx(movedOrigIdx)
    dragIdx.current = null; dragOverIdx.current = null
  }

  function handleCheck() {
    const correct = order.every((origIdx, pos) => origIdx === pos)
    onAnswer(correct ? 0 : 1)
  }

  return (
    <div className="q-order">
      <p className="lesson-prompt">{q.prompt}</p>
      <p className="q-type-hint">Drag to reorder — first item at the top</p>
      <ol className="order-list">
        {order.map((origIdx, pos) => {
          const inPlace = showFeedback ? origIdx === pos : null
          const isSnapping = !showFeedback && origIdx === snappingOrigIdx
          return (
            <li
              key={origIdx}
              className={`order-item${inPlace === true ? ' order-item--correct' : inPlace === false ? ' order-item--wrong' : ''}${isSnapping ? ' order-item--snap' : ''}`}
              draggable={!showFeedback}
              onDragStart={() => dragStart(pos)}
              onDragOver={e => dragOver(e, pos)}
              onDrop={drop}
            >
              <span className="order-handle">⠿</span>
              <span className="order-num">{pos + 1}</span>
              <span className="order-text">{correctItems[origIdx]}</span>
              {showFeedback && inPlace === true  && <span className="order-icon order-icon--ok">✓</span>}
              {showFeedback && inPlace === false && <span className="order-icon order-icon--bad">✗</span>}
            </li>
          )
        })}
      </ol>
      {!showFeedback && (
        <button className="btn btn-primary q-check-btn" onClick={handleCheck}>
          <span className="btn-label">Check order</span>
        </button>
      )}
    </div>
  )
}

// ─── Word bank fill-in-the-blank ──────────────────────────────────────────

function WordBankQuestion({ q, showFeedback, selected, onAnswer }) {
  const { bank, answers } = q.meta
  const parts = q.prompt.split('______')
  const numBlanks = parts.length - 1

  const [placed, setPlaced] = useState(Array(numBlanks).fill(null))
  const usedWords = placed.filter(Boolean)
  const available = bank.filter(w => !usedWords.includes(w))
  const allFilled = placed.every(Boolean)

  const results = showFeedback ? placed.map((w, i) => w === answers[i]) : []
  const isCorrect = selected === q.correct

  function placeWord(word) {
    const nextBlank = placed.indexOf(null)
    if (nextBlank === -1) return
    const next = [...placed]; next[nextBlank] = word; setPlaced(next)
  }

  function removeWord(blankIdx) {
    const next = [...placed]; next[blankIdx] = null; setPlaced(next)
  }

  function handleCheck() {
    const correct = placed.every((w, i) => w === answers[i])
    onAnswer(correct ? 0 : 1)
  }

  let blankCount = 0

  return (
    <div className="q-wordbank">
      <p className="wb-sentence">
        {parts.map((part, i) => {
          const nodes = [<span key={`p${i}`}>{part}</span>]
          if (i < numBlanks) {
            const idx  = blankCount++
            const word = placed[idx]
            const res  = showFeedback ? results[idx] : null
            nodes.push(
              <button
                key={`b${idx}`}
                className={`wb-blank${word ? ' wb-blank--filled' : ''}${res === true ? ' wb-blank--correct' : res === false ? ' wb-blank--wrong' : ''}`}
                onClick={() => !showFeedback && word && removeWord(idx)}
                disabled={showFeedback || !word}
              >
                {word ?? '______'}
              </button>
            )
          }
          return nodes
        })}
      </p>

      <div className="wb-bank">
        {bank.map(word => {
          const used = usedWords.includes(word)
          return (
            <button
              key={word}
              className={`wb-chip${used ? ' wb-chip--used' : ''}`}
              onClick={() => !showFeedback && !used && placeWord(word)}
              disabled={showFeedback || used}
            >
              {word}
            </button>
          )
        })}
      </div>

      {!showFeedback && (
        <button className="btn btn-primary q-check-btn" onClick={handleCheck} disabled={!allFilled}>
          <span className="btn-label">Check answer</span>
        </button>
      )}
    </div>
  )
}

// ─── Dispatcher ───────────────────────────────────────────────────────────

export default function QuestionRenderer({ q, showFeedback, selected, onAnswer }) {
  if (!q) return null
  switch (q.type) {
    case 'sort':      return <SortQuestion     q={q} showFeedback={showFeedback} selected={selected} onAnswer={onAnswer} />
    case 'order':     return <OrderQuestion    q={q} showFeedback={showFeedback} selected={selected} onAnswer={onAnswer} />
    case 'wordbank':  return <WordBankQuestion q={q} showFeedback={showFeedback} selected={selected} onAnswer={onAnswer} />
    default:          return <MCQuestion       q={q} showFeedback={showFeedback} selected={selected} onAnswer={onAnswer} />
  }
}
