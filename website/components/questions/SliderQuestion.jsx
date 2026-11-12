'use client'
import { useRef, useCallback } from 'react'
import './questions.css'

export default function SliderQuestion({ config, response, onChange, phase }) {
  const { min, max, correct, unit = '', tolerance } = config
  const checked = phase !== 'idle'
  const trackRef = useRef(null)

  const value = response ?? Math.round((min + max) / 2)
  const pct = ((value - min) / (max - min)) * 100
  const correctPct = ((correct - min) / (max - min)) * 100

  function setFromEvent(e) {
    if (checked) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left) - rect.left
    const p = Math.max(0, Math.min(1, x / rect.width))
    const v = Math.round(p * (max - min) + min)
    onChange(v)
  }

  const onPointerMove = useCallback(e => {
    if (e.buttons !== 1) return
    setFromEvent(e)
  }, [checked, min, max])

  const ticks = [min, Math.round((min + max) * 0.33), Math.round((min + max) * 0.67), max]

  return (
    <div className="slider-wrap">
      <div className="slider-display">
        {value} <span>{unit}</span>
      </div>
      <div
        ref={trackRef}
        className="slider-track"
        onPointerDown={setFromEvent}
        onPointerMove={onPointerMove}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={e => {
          if (checked) return
          const step = Math.round((max - min) / 24)
          if (e.key === 'ArrowRight') onChange(Math.min(max, value + step))
          if (e.key === 'ArrowLeft')  onChange(Math.max(min, value - step))
        }}
      >
        <div className="slider-fill" style={{ width: `${pct}%` }} />
        {checked && (
          <div className="slider-correct-marker" style={{ left: `${correctPct}%` }} />
        )}
        <div className="slider-knob" style={{ left: `${pct}%` }} />
      </div>
      <div className="slider-ticks">
        {ticks.map(v => <span key={v}>{v}</span>)}
      </div>
      {!checked && <p className="question-hint">Drag the slider to your estimate</p>}
    </div>
  )
}
