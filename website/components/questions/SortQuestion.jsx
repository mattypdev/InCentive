'use client'
import { useState } from 'react'
import './questions.css'

export default function SortQuestion({ config, response, onChange, phase }) {
  const { buckets, items, correct } = config
  const [dragging, setDragging] = useState(null)
  const [over, setOver] = useState(null)
  const checked = phase !== 'idle'

  // Build current placement from response
  const placement = response || {}

  const poolItems = items.filter(it => !placement[it.id])
  const bucketItems = bid => items.filter(it => placement[it.id] === bid)

  function place(itemId, bucketId) {
    if (checked) return
    const next = { ...placement }
    if (bucketId) next[itemId] = bucketId
    else delete next[itemId]
    onChange(next)
  }

  function chipClass(item) {
    let cls = 'sort-chip'
    if (dragging === item.id) cls += ' sort-chip--dragging'
    if (checked && correct && placement[item.id]) {
      if (placement[item.id] === correct[item.id]) cls += ' sort-chip--correct'
    }
    return cls
  }

  return (
    <div className="sort-wrap">
      <div className="sort-buckets">
        {buckets.map(b => (
          <div
            key={b.id}
            className={`sort-bucket${over === b.id ? ' sort-bucket--over' : ''}`}
            onDragOver={e => { e.preventDefault(); setOver(b.id) }}
            onDragLeave={() => setOver(null)}
            onDrop={e => { e.preventDefault(); if (dragging) place(dragging, b.id); setOver(null); setDragging(null) }}
            onClick={() => { /* tap-to-place: if a chip is "selected", place it here */ }}
          >
            <div className="sort-bucket__label">{b.label}</div>
            {bucketItems(b.id).map(it => (
              <span
                key={it.id}
                className={chipClass(it)}
                draggable={!checked}
                onDragStart={() => setDragging(it.id)}
                onDragEnd={() => setDragging(null)}
                onClick={() => !checked && place(it.id, null)}
                role="button"
                tabIndex={0}
                aria-label={`Remove ${it.text} from ${b.label}`}
              >
                {it.text}
              </span>
            ))}
          </div>
        ))}
      </div>
      {poolItems.length > 0 && (
        <div className="sort-pool">
          <div className="sort-pool__label">Still to sort</div>
          <div>
            {poolItems.map(it => (
              <span
                key={it.id}
                className={chipClass(it)}
                draggable={!checked}
                onDragStart={() => setDragging(it.id)}
                onDragEnd={() => setDragging(null)}
                role="button"
                tabIndex={0}
                aria-label={it.text}
              >
                {it.text}
              </span>
            ))}
          </div>
        </div>
      )}
      {!checked && <p className="question-hint">Drag a chip, or tap it to move between boxes</p>}
    </div>
  )
}
