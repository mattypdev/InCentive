'use client'
import { useRef, useCallback } from 'react'
import './questions.css'

export default function NumberlineQuestion({ config, response, onChange, phase }) {
  const { min, max, correct, tolerance, labels = [] } = config
  const checked = phase !== 'idle'
  const trackRef = useRef(null)

  const pct = response != null ? ((response - min) / (max - min)) * 100 : 50
  const correctPct = ((correct - min) / (max - min)) * 100

  function getPctFromEvent(e) {
    const rect = trackRef.current.getBoundingClientRect()
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left) - rect.left
    return Math.max(0, Math.min(1, x / rect.width))
  }

  function setFromEvent(e) {
    if (checked) return
    const p = getPctFromEvent(e)
    const value = Math.round(p * (max - min) + min)
    onChange(value)
  }

  const onPointerMove = useCallback(e => {
    if (e.buttons !== 1 && e.type !== 'touchmove') return
    setFromEvent(e)
  }, [checked, min, max])

  return (
    <div className="numberline-wrap">
      <div
        ref={trackRef}
        className="numberline-track"
        onPointerDown={setFromEvent}
        onPointerMove={onPointerMove}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={response ?? Math.round((min + max) / 2)}
        tabIndex={0}
        onKeyDown={e => {
          if (checked) return
          const step = Math.round((max - min) / 20)
          if (e.key === 'ArrowRight') onChange(Math.min(max, (response ?? correct) + step))
          if (e.key === 'ArrowLeft')  onChange(Math.max(min, (response ?? correct) - step))
        }}
      >
        {response != null && (
          <div className="numberline-fill" style={{ width: `${pct}%` }} />
        )}
        {checked && (
          <div className="numberline-answer-marker" style={{ left: `${correctPct}%` }} />
        )}
        {response != null && (
          <div className="numberline-knob" style={{ left: `${pct}%` }}>
            <div className="numberline-label">{response}</div>
          </div>
        )}
      </div>
      <div className="numberline-ticks">
        {labels.length > 0
          ? labels.map(l => <span key={l.value}>{l.label}</span>)
          : [min, Math.round((min + max) / 2), max].map(v => <span key={v}>{v}</span>)
        }
      </div>
      {!checked && <p className="question-hint">Click or drag to place your answer</p>}
    </div>
  )
}
