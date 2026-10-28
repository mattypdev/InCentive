'use client'
import { useEffect, useRef } from 'react'
import { StreakFlame as Core } from './StreakFlameCore'

const tierFor = n =>
  n >= 7 ? { w: 156, tall: 1.16, displayW: 34 }
: n >= 3 ? { w: 124, tall: 1.05, displayW: 28 }
:          { w: 92,  tall: 1,    displayW: 22 }

// state: 'idle' | 'ignite' | 'refresh' | 'atRisk'
export default function StreakFlame({ count = 1, state = 'idle', className = '' }) {
  const containerRef = useRef(null)
  const flameRef     = useRef(null)
  const prevCount    = useRef(null)
  const prevState    = useRef(null)

  const tier     = tierFor(count)
  const scale    = tier.displayW / tier.w
  const displayH = Math.round(tier.w * 1.2 * tier.tall * scale)

  // Mount / unmount
  useEffect(() => {
    if (!containerRef.current) return
    const f = new Core(containerRef.current, { count, sparks: true, idle: true })
    flameRef.current  = f
    prevCount.current = count
    prevState.current = state

    if      (state === 'ignite') f.ignite(count)
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

    if (state === 'ignite' && prevS !== 'ignite') {
      f.ignite(count)
    } else if (state === 'refresh' && (prevC !== count || prevS !== 'refresh')) {
      f.refresh(count)
    } else if (state === 'atRisk' && prevS !== 'atRisk') {
      f.setAtRisk(true)
    } else if (prevS === 'atRisk' && state !== 'atRisk') {
      f.setAtRisk(false)
    } else if (prevC !== count) {
      f.refresh(count)
    }
  }, [count, state])

  if (count <= 0) return null

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width:      tier.displayW,
        height:     displayH,
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
          transform:       `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents:   'none',
        }}
      />
    </div>
  )
}
