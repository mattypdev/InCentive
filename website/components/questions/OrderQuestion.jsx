'use client'
import { useState } from 'react'
import './questions.css'

export default function OrderQuestion({ config, response, onChange, phase }) {
  const { items, correct } = config
  const checked = phase !== 'idle'

  // response is an ordered array of ids
  const ordered = response || items.map(it => it.id)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  function reorder(fromIdx, toIdx) {
    if (fromIdx === toIdx) return
    const next = [...ordered]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    onChange(next)
  }

  function moveItem(idx, dir) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= ordered.length) return
    reorder(idx, newIdx)
  }

  function itemById(id) { return items.find(it => it.id === id) }

  function rowClass(idx) {
    let cls = 'order-item'
    if (dragIdx === idx) cls += ' order-item--dragging'
    if (checked && correct) {
      cls += ordered[idx] === correct[idx] ? ' mc-option--correct' : ' mc-option--wrong'
    }
    return cls
  }

  return (
    <div className="order-list">
      {ordered.map((id, i) => (
        <div
          key={id}
          className={rowClass(i)}
          draggable={!checked}
          onDragStart={() => setDragIdx(i)}
          onDragOver={e => { e.preventDefault(); setOverIdx(i) }}
          onDrop={() => { if (dragIdx !== null) reorder(dragIdx, i); setDragIdx(null); setOverIdx(null) }}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
        >
          <span
            className="order-handle"
            aria-hidden="true"
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'ArrowUp') { e.preventDefault(); !checked && moveItem(i, -1) }
              if (e.key === 'ArrowDown') { e.preventDefault(); !checked && moveItem(i, 1) }
            }}
          >⋮⋮</span>
          {itemById(id)?.text}
        </div>
      ))}
      {!checked && <p className="question-hint">Drag the handles, or press ↑ ↓ after selecting a step</p>}
    </div>
  )
}
