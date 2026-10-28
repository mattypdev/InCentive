'use client'
import { useEffect, useRef } from 'react'
import { StreakFlame as Core } from './StreakFlameCore'

// Fixed display size — fits within the navbar pill at all streak lengths.
const CORE_W    = 92
const DISPLAY_W = 22
const DISPLAY_H = Math.round(CORE_W * 1.2 * (DISPLAY_W / CORE_W)) // 26px
const SCALE     = DISPLAY_W / CORE_W

// state: 'idle' | 'ignite' | 'refresh' | 'atRisk'
export default function StreakFlame({ count = 0, state = 'idle', className = '' }) {
  const containerRef = useRef(null)
  const flameRef     = useRef(null)
  const prevCount    = useRef(null)
  const prevState    = useRef(null)

  // Dormant (count=0): desaturate the outer wrapper via CSS so the Core
  // never needs to know about the grey state — keeps the logic simple.
  const dormant = count <= 0

  useEffect(() => {
    if (!containerRef.current) return
    // idle: false → no idle sway animation; flame stays flat after effects settle.
    const f = new Core(containerRef.current, { count: Math.max(count, 1), sparks: true, idle: false })
    flameRef.current  = f
    prevCount.current = count
    prevState.current = state

    if      (state === 'ignite') f.ignite(Math.max(count, 1))
    else if (state === 'atRisk') f.setAtRisk(true)

    return () => { f.destroy(); flameRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        // Grey dormant when no streak; transitions to orange when streak is earned.
        filter:     dormant ? 'saturate(0.15) brightness(1.1)' : undefined,
        transition: 'filter 600ms ease-in-out',
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
