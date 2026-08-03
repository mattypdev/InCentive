import React, { useMemo, useState } from 'react'
import './LearnMap.css'

const VB_W = 1200
const VB_H = 980
const CX   = 600
const CY   = 398
const RING = 292

const RING_ANGLES = [-90, -18, 54, 126, 198]

function polar(deg, rad) {
  const a = (deg * Math.PI) / 180
  return [CX + rad * Math.cos(a), CY + rad * Math.sin(a)]
}

// deterministic PRNG — still used for the wave texture
function rng(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const INK = '#1E293B'

// Per-tier image dimensions.
// topOffset: how far the image top sits above the island's (x,y) centre.
const IMG = {
  hub:      { w: 320, h: 320, topOffset: 200 },
  ring:     { w: 250, h: 250, topOffset: 155 },
  capstone: { w: 230, h: 255, topOffset: 155 },
}

export default function LearnMap({ sections, stats, onSelect, capstoneUnlocked = false }) {
  const [hovered, setHovered] = useState(null)

  const islands = useMemo(() => sections.map((s, i) => {
    if (s.isCapstone) return { ...s, index: i, pos: [CX, 760], tier: 'capstone' }
    if (i === 0)      return { ...s, index: i, pos: [CX, CY],  tier: 'hub' }
    const angle = RING_ANGLES[(i - 1) % RING_ANGLES.length]
    return { ...s, index: i, pos: polar(angle, RING), tier: 'ring' }
  }), [sections])

  // first unfinished non-capstone section gets the flag
  const nextUp = stats.findIndex((st, i) => !sections[i].isCapstone && st.done < st.total)

  // paint back-to-front (smaller y = further away)
  const ordered = [...islands].sort((a, b) => a.pos[1] - b.pos[1])

  const waves = useMemo(() => {
    const rand = rng(1337)
    return Array.from({ length: 44 }, () => {
      const x = rand() * VB_W
      const y = rand() * VB_H
      const w = 18 + rand() * 26
      return `M ${x.toFixed(0)} ${y.toFixed(0)} q ${(w / 2).toFixed(0)} -7 ${w.toFixed(0)} 0`
    })
  }, [])

  return (
    <div className="learn-map">
      <svg
        className="learn-map-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="group"
        aria-label="Course map"
      >
        {/* ocean wave texture */}
        <g opacity=".55">
          {waves.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#E7DCC2" strokeWidth="3.5" strokeLinecap="round" />
          ))}
        </g>

        {/* dotted sea routes hub → ring */}
        {islands.filter(u => u.tier === 'ring').map(u => {
          const [x, y] = u.pos
          const mx = (CX + x) / 2 + (y - CY) * 0.13
          const my = (CY + y) / 2 - (x - CX) * 0.13
          return (
            <path key={`r-${u.id}`}
              d={`M ${CX} ${CY} Q ${mx} ${my} ${x} ${y}`}
              fill="none" stroke="#D9C9A8" strokeWidth="9"
              strokeLinecap="round" strokeDasharray="2 22" />
          )
        })}

        {/* dotted sea route hub → capstone */}
        {islands.filter(u => u.tier === 'capstone').map(u => (
          <path key={`c-${u.id}`}
            d={`M ${CX} ${CY + 120} L ${u.pos[0]} ${u.pos[1]}`}
            fill="none" stroke="#DED2B8" strokeWidth="8"
            strokeLinecap="round" strokeDasharray="2 22"
            opacity={capstoneUnlocked ? 0.9 : 0.4} />
        ))}

        {/* islands */}
        {ordered.map(u => {
          const st      = stats[u.index] ?? { done: 0, total: 0 }
          const pct     = st.total ? Math.round((st.done / st.total) * 100) : 0
          const [x, y]  = u.pos
          const dim     = u.isCapstone && !capstoneUnlocked
          const isHover = hovered === u.index
          const cfg     = IMG[u.tier]
          const imgX    = x - cfg.w / 2
          const imgY    = y - cfg.topOffset
          const plateY  = imgY + cfg.h + 12
          const plateW  = Math.max(168, u.label.length * 10.5 + 78)
          const slug    = u.isCapstone ? 'cap' : String(u.index)

          return (
            <g
              key={u.id}
              className={`map-island${isHover ? ' is-hover' : ''}${dim ? ' is-dim' : ''}`}
              onMouseEnter={() => setHovered(u.index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => !dim && onSelect(u.index)}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && !dim) {
                  e.preventDefault(); onSelect(u.index)
                }
              }}
              tabIndex={dim ? -1 : 0}
              role="button"
              aria-label={`${u.label} — ${st.done} of ${st.total} complete`}
            >
              <g className="map-island-body">
                {/* flat drop shadow ellipse */}
                <ellipse
                  cx={x} cy={y + cfg.clipRy * 0.9}
                  rx={cfg.clipRx * 0.8} ry={cfg.clipRy * 0.13}
                  fill="#000" opacity=".18"
                />
                <image
                  href={`/islands/island-${slug}.png`}
                  x={imgX} y={imgY}
                  width={cfg.w} height={cfg.h}
                />
              </g>

              {/* nameplate */}
              <g transform={`translate(${x},${plateY})`} className="map-plate">
                <rect x={-plateW / 2} y={-23} width={plateW} height={46} rx={23}
                  fill="#FFFDF5" stroke={INK} strokeWidth="3" />
                <text x={-plateW / 2 + 18} y={6} className="map-plate-label">{u.label}</text>
                <g transform={`translate(${plateW / 2 - 30},0)`}>
                  <circle r="16" fill="#FFF" stroke={INK} strokeWidth="2.5" />
                  <circle r="16" fill="none" stroke={u.color} strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray={`${((pct / 100) * 100.5).toFixed(1)} 999`}
                    transform="rotate(-90)" />
                  <text y="5" className="map-plate-count">{st.done}/{st.total}</text>
                </g>
              </g>

              {/* START / CONTINUE flag */}
              {u.index === nextUp && (
                <g transform={`translate(${x},${imgY - 28})`} className="map-flag">
                  <rect x="-52" y="-19" width="104" height="34" rx="10"
                    fill="#FFFDF5" stroke={INK} strokeWidth="3" />
                  <path d="M -8 15 L 0 25 L 8 15 Z"
                    fill="#FFFDF5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
                  <rect x="-8" y="13" width="16" height="5" fill="#FFFDF5" />
                  <text y="4" className="map-flag-text" fill={u.color}>
                    {st.done === 0 ? 'START' : 'CONTINUE'}
                  </text>
                </g>
              )}

              {/* lock badge on capstone */}
              {dim && (
                <g transform={`translate(${x},${y - 4})`}>
                  <circle r="26" fill="#FFFDF5" stroke={INK} strokeWidth="3" />
                  <rect x="-9" y="-4" width="18" height="15" rx="3" fill={INK} />
                  <path d="M -5.5 -4 v -5 a 5.5 5.5 0 0 1 11 0 v 5"
                    fill="none" stroke={INK} strokeWidth="3" />
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
