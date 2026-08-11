'use client'
import React, { useMemo, useState } from 'react'
import './BasicsWorldMap.css'

const VB_W = 1100
const VB_H  = 1530
const INK   = '#1E293B'

// Main island visual centre (island-0.png, 992×1024)
const MAIN_CX = 550
const MAIN_CY = 295
const MW = 280
const MH = Math.round(MW * 1024 / 992)   // ≈ 289
const M_TOP_OFFSET = Math.round(MH * 0.62) // fraction of image above visual centre

// 6 unit island positions — organic, not gridded
const UNIT_POS = [
  [235, 610],   // What is Money?
  [845, 545],   // Income
  [145, 938],   // Spending
  [935, 895],   // Saving
  [310, 1170],  // Banks & Accounts
  [795, 1140],  // Payments
]
const TEST_POS = [550, 1415]

// Per-unit lesson offsets — varied angles & distances for organic scatter
const LESSON_OFFSETS = [
  // u0 What is Money? (235,610)
  [[-95,-62],[-45,-102],[30,-96],[92,-54],[107,15],[66,82],[-5,102],[-80,67]],
  // u1 Income (845,545)
  [[87,-60],[42,-98],[-28,-102],[-92,-65],[-102,10],[-62,82],[12,102],[78,67]],
  // u2 Spending (145,938)
  [[-82,-70],[-10,-107],[62,-92],[103,-20],[92,62],[32,108],[-50,97],[-102,22]],
  // u3 Saving (935,895)
  [[82,-70],[10,-107],[-62,-92],[-103,-20],[-92,62],[-32,108],[50,97],[102,22]],
  // u4 Banks & Accounts (310,1170)
  [[-102,-55],[-52,-102],[25,-100],[92,-65],[102,10],[62,87],[-10,102],[-87,67]],
  // u5 Payments (795,1140)
  [[102,-55],[52,-102],[-25,-100],[-92,-65],[-102,10],[-62,87],[10,102],[87,67]],
]

const UW = 84, UH = 76   // unit island size in SVG units
const LW = 50, LH = 46   // lesson island size
const TW = 102, TH = 92  // chapter-test size

function seededRng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function BasicsWorldMap({
  units, chapterTest, completedIds, currentUser, color, onNodeClick, sparklingId,
}) {
  const [hovered, setHovered] = useState(null)

  const waves = useMemo(() => {
    const rand = seededRng(31337)
    return Array.from({ length: 64 }, () => {
      const x = rand() * VB_W
      const y = rand() * VB_H
      const w = 18 + rand() * 28
      return `M ${x.toFixed(0)} ${y.toFixed(0)} q ${(w / 2).toFixed(0)} -7 ${w.toFixed(0)} 0`
    })
  }, [])

  function isLessonUnlocked(unit, ui, li) {
    if (!currentUser) return true
    if (ui > 0) {
      const prev = units[ui - 1]
      const prevDone = completedIds.has(prev.id) ||
        (prev.lessons ?? []).every(l => completedIds.has(l.id))
      if (!prevDone) return false
    }
    if (li === 0) return true
    return completedIds.has(unit.lessons[li - 1].id) || completedIds.has(unit.id)
  }

  function lessonDone(lesson, unit) {
    return completedIds.has(lesson.id) || completedIds.has(unit.id)
  }

  const testDone     = completedIds.has(chapterTest.id)
  const testUnlocked = !currentUser || units.every(u =>
    completedIds.has(u.id) || (u.lessons ?? []).every(l => completedIds.has(l.id))
  )

  let firstAvailableId = null
  outer: for (let ui = 0; ui < units.length; ui++) {
    const unit = units[ui]
    for (let li = 0; li < (unit.lessons ?? []).length; li++) {
      if (!lessonDone(unit.lessons[li], unit) && isLessonUnlocked(unit, ui, li)) {
        firstAvailableId = unit.lessons[li].id
        break outer
      }
    }
  }
  if (!firstAvailableId && testUnlocked && !testDone) firstAvailableId = chapterTest.id
  const anyDone = units.some(u =>
    completedIds.has(u.id) || (u.lessons ?? []).some(l => completedIds.has(l.id))
  )

  return (
    <div className="basics-world-map">
      <svg
        className="basics-world-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="group"
        aria-label="The Basics lesson world"
      >
        {/* ocean waves */}
        <g opacity=".48">
          {waves.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#E7DCC2" strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>

        {/* dotted sea routes: main island → each unit */}
        {UNIT_POS.map(([ux, uy], ui) => {
          const mx = (MAIN_CX + ux) / 2 + (uy - MAIN_CY) * 0.1
          const my = (MAIN_CY + uy) / 2 - (ux - MAIN_CX) * 0.1
          return (
            <path key={`route-${ui}`}
              d={`M ${MAIN_CX} ${MAIN_CY} Q ${mx.toFixed(0)} ${my.toFixed(0)} ${ux} ${uy}`}
              fill="none" stroke="#D9C9A8" strokeWidth="7"
              strokeLinecap="round" strokeDasharray="2 20" opacity="0.55"
            />
          )
        })}

        {/* ── lesson islands ── rendered first so units sit on top */}
        {units.map((unit, ui) => {
          const [cx, cy] = UNIT_POS[ui]
          const offsets  = LESSON_OFFSETS[ui] ?? []
          return offsets.map(([ox, oy], li) => {
            const lesson  = unit.lessons?.[li]
            if (!lesson) return null
            const lx      = cx + ox
            const ly      = cy + oy
            const done    = lessonDone(lesson, unit)
            const locked  = !isLessonUnlocked(unit, ui, li)
            const isFirst = lesson.id === firstAvailableId
            const isHov   = hovered === lesson.id && !locked
            const bx      = lx + LW / 2 - 7
            const by      = ly - LH + 7
            const badgeColor = done ? '#0D9488' : locked ? '#94A3B8' : color

            return (
              <g key={lesson.id}
                onClick={() => !locked && !sparklingId && onNodeClick(lesson)}
                onMouseEnter={() => !locked && setHovered(lesson.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
                tabIndex={locked ? -1 : 0}
                role="button"
                aria-label={`${lesson.title}${done ? ' — done' : locked ? ' — locked' : ''}`}
                onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !locked && !sparklingId) { e.preventDefault(); onNodeClick(lesson) } }}
              >
                <g className={`bwm-isle-body${isHov ? ' is-hov' : ''}`}>
                  <image
                    href="/islands/lesson-island.png"
                    x={lx - LW / 2} y={ly - LH}
                    width={LW} height={LH}
                    opacity={locked ? 0.32 : 1}
                    style={locked ? { filter: 'grayscale(0.7)' } : undefined}
                  />
                </g>
                <circle cx={bx} cy={by} r="9.5" fill={badgeColor} stroke={INK} strokeWidth="1.5" />
                {done
                  ? <path d={`M ${bx-4} ${by} l 2.5 2.5 l 5-5`} fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  : locked
                    ? <rect x={bx-3.5} y={by-2.5} width={7} height={5.5} rx="1.5" fill="white" />
                    : <text x={bx} y={by+3.5} textAnchor="middle" fontSize="9" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif">{li + 1}</text>
                }
                {isFirst && (
                  <g transform={`translate(${lx},${ly - LH - 18})`}>
                    <rect x="-28" y="-11" width="56" height="19" rx="9.5" fill="white" stroke={color} strokeWidth="2" />
                    <path d="M -4 8 L 0 13 L 4 8 Z" fill="white" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                    <rect x="-4" y="7" width="8" height="3" fill="white" />
                    <text y="3" textAnchor="middle" fontSize="8" fontWeight="900" letterSpacing="0.06em" fill={color} fontFamily="system-ui,sans-serif">
                      {anyDone ? 'CONTINUE' : 'START'}
                    </text>
                  </g>
                )}
              </g>
            )
          })
        })}

        {/* ── unit islands ── sit above lessons, no pointer events */}
        {units.map((unit, ui) => {
          const [cx, cy] = UNIT_POS[ui]
          const pw = Math.max(104, unit.title.length * 5 + 24)
          return (
            <g key={`unit-${unit.id}`} style={{ pointerEvents: 'none' }}>
              <image href="/islands/node-island.png" x={cx - UW / 2} y={cy - UH} width={UW} height={UH} />
              <rect x={cx - pw / 2} y={cy + 4} width={pw} height={18} rx={9} fill="white" stroke={INK} strokeWidth="1.5" />
              <text x={cx} y={cy + 16} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={INK} fontFamily="system-ui,sans-serif">
                {unit.title}
              </text>
            </g>
          )
        })}

        {/* ── main island ── largest, non-interactive */}
        <g style={{ pointerEvents: 'none' }}>
          <image
            href="/islands/island-0.png"
            x={MAIN_CX - MW / 2}
            y={MAIN_CY - M_TOP_OFFSET}
            width={MW}
            height={MH}
          />
        </g>

        {/* ── chapter-test island ── */}
        {(() => {
          const [tx, ty] = TEST_POS
          const isHov    = hovered === chapterTest.id && testUnlocked
          const bx       = tx + TW / 2 - 10
          const by       = ty - TH + 10
          const isFirst  = chapterTest.id === firstAvailableId
          return (
            <g
              onClick={() => testUnlocked && !sparklingId && onNodeClick(chapterTest)}
              onMouseEnter={() => testUnlocked && setHovered(chapterTest.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: testUnlocked ? 'pointer' : 'not-allowed' }}
              tabIndex={testUnlocked ? 0 : -1}
              role="button"
              aria-label={`Chapter Test${testDone ? ' — done' : !testUnlocked ? ' — locked' : ''}`}
              onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && testUnlocked && !sparklingId) { e.preventDefault(); onNodeClick(chapterTest) } }}
            >
              <g className={`bwm-isle-body${isHov ? ' is-hov' : ''}`}>
                <image href="/islands/node-island.png" x={tx - TW / 2} y={ty - TH} width={TW} height={TH}
                  opacity={!testUnlocked ? 0.32 : 1}
                  style={!testUnlocked ? { filter: 'grayscale(0.7)' } : undefined}
                />
              </g>
              <circle cx={bx} cy={by} r="13"
                fill={testDone ? '#F59E0B' : testUnlocked ? '#F59E0B' : '#94A3B8'}
                stroke={INK} strokeWidth="2" />
              {testDone
                ? <path d={`M ${bx-5} ${by} l 3.5 3.5 l 7-7`} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                : !testUnlocked
                  ? <rect x={bx-4.5} y={by-3} width={9} height={7} rx="2" fill="white" />
                  : <text x={bx} y={by+4.5} textAnchor="middle" fontSize="12">⭐</text>
              }
              <rect x={tx - 55} y={ty + 4} width={110} height={18} rx={9} fill="white" stroke={INK} strokeWidth="1.5" />
              <text x={tx} y={ty + 16} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#F59E0B" fontFamily="system-ui,sans-serif">
                Chapter Test
              </text>
              {isFirst && (
                <g transform={`translate(${tx},${ty - TH - 20})`}>
                  <rect x="-28" y="-11" width="56" height="19" rx="9.5" fill="white" stroke="#F59E0B" strokeWidth="2" />
                  <path d="M -4 8 L 0 13 L 4 8 Z" fill="white" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
                  <rect x="-4" y="7" width="8" height="3" fill="white" />
                  <text y="3" textAnchor="middle" fontSize="8" fontWeight="900" letterSpacing="0.06em" fill="#F59E0B" fontFamily="system-ui,sans-serif">
                    {anyDone ? 'CONTINUE' : 'START'}
                  </text>
                </g>
              )}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}
