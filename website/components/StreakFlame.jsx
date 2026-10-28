'use client'
import { useEffect, useRef } from 'react'
import { StreakFlame as Core } from './StreakFlameCore'

// Fixed display dimensions — single tier (no progressive sizing).
const CORE_W    = 92           // SVG viewBox width used by Core
const CORE_TALL = 1.0          // height multiplier
const DISPLAY_W = 28           // px wide in the UI
const DISPLAY_H = Math.round(CORE_W * 1.2 * CORE_TALL * (DISPLAY_W / CORE_W)) // ≈ 34px
const SCALE     = DISPLAY_W / CORE_W

// state: 'idle' | 'ignite' | 'refresh' | 'atRisk'
export default function StreakFlame({ count = 0, state = 'idle', className = '' }) {
  const containerRef = useRef(null)
  const flameRef     = useRef(null)
  const prevCount    = useRef(null)
  const prevState    = useRef(null)

  // Mount / unmount
  useEffect(() => {
    if (!containerRef.current) return
    const f = new Core(containerRef.current, { count: Math.max(count, 1), sparks: true, idle: true })
    flameRef.current  = f
    prevCount.current = count
    prevState.current = state

    if      (state === 'ignite') f.ignite(Math.max(count, 1))
    else if (state === 'atRisk') f.setAtRisk(true)

    return () => { f.destroy(); flameRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Count / state changes after mount
  useEffect(() => {
    const f = flameRef.current
    if (!f) return
    const prevC = prevCount.current
    const prevS = prevState.current
    prevCount.current = count
    prevState.current = state

    const c = Math.max(count, 1)

    if (state === 'ignite' && prevS !== 'ignite') {
      f.ignite(c)
    } else if (state === 'refresh' && (prevC !== count || prevS !== 'refresh')) {
      f.refresh(c)
    } else if (state === 'atRisk' && prevS !== 'atRisk') {
      f.setAtRisk(true)
    } else if (prevS === 'atRisk' && state !== 'atRisk') {
      f.setAtRisk(false)
    } else if (prevC !== count && state === 'idle') {
      // count changed but no explicit state transition — just refresh
      if (count > 0) f.refresh(c)
    }
  }, [count, state])

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width:      DISPLAY_W,
        height:     DISPLAY_H,
        position:   'relative',
        overflow:   'visible',
        flexShrink: 0,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position:        'absolute',
          top:             0,
          left:            0,
          transform:       `scale(${SCALE})`,
          transformOrigin: 'top left',
          pointerEvents:   'none',
        }}
      />
    </div>
  )
}
