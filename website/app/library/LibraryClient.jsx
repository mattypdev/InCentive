'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { islands, units, lessonsByUnit, unitsByIsland } from '@/lib/content/islands'
import './Library.css'

const LEVELS = ['beginner', 'intermediate', 'advanced']

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="lib-hl">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function unitMatchesSearch(unit, lessons, query) {
  if (!query) return true
  const q = query.toLowerCase()
  if (unit.title.toLowerCase().includes(q)) return true
  if (unit.summary.toLowerCase().includes(q)) return true
  return lessons.some(l =>
    l.title.toLowerCase().includes(q) ||
    l.objective?.toLowerCase().includes(q)
  )
}

function unitMatchesFilters(unit, lessons, { island, level, maxMins }) {
  if (island && unit.island !== island) return false
  if (level && unit.level !== level) return false
  if (maxMins) {
    const avg = lessons.reduce((s, l) => s + (l.minutes ?? 5), 0) / (lessons.length || 1)
    if (avg > maxMins) return false
  }
  return true
}

export default function LibraryClient() {
  const [query, setQuery]  = useState('')
  const [island, setIsland] = useState('')
  const [level, setLevel]  = useState('')
  const [shortOnly, setShortOnly] = useState(false)

  const results = useMemo(() => {
    const out = []
    for (const isl of islands) {
      const islUnits = unitsByIsland(isl.slug)
      const matching = islUnits.filter(unit => {
        const lessons = lessonsByUnit(unit.id)
        return (
          unitMatchesSearch(unit, lessons, query) &&
          unitMatchesFilters(unit, lessons, { island, level, maxMins: shortOnly ? 5 : null })
        )
      })
      if (matching.length > 0) {
        out.push({ island: isl, units: matching })
      }
    }
    return out
  }, [query, island, level, shortOnly])

  const totalUnits = results.reduce((s, g) => s + g.units.length, 0)

  return (
    <div className="lib-page">
      <div className="lib-header">
        <h1 className="lib-title">Library</h1>
      </div>

      <div className="lib-search chunk">
        <Search size={18} strokeWidth={2} />
        <input
          className="lib-search-input"
          placeholder="Search lessons, units, topics…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search library"
        />
        {query && (
          <button className="lib-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <div className="lib-filters">
        <select
          className={`lib-chip lib-chip--select${island ? ' lib-chip--on' : ''}`}
          value={island}
          onChange={e => setIsland(e.target.value)}
          aria-label="Filter by island"
        >
          <option value="">Island ▾</option>
          {islands.map(i => (
            <option key={i.slug} value={i.slug}>{i.title}</option>
          ))}
        </select>

        <select
          className={`lib-chip lib-chip--select${level ? ' lib-chip--on' : ''}`}
          value={level}
          onChange={e => setLevel(e.target.value)}
          aria-label="Filter by level"
        >
          <option value="">Level ▾</option>
          {LEVELS.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>

        <button
          className={`lib-chip${shortOnly ? ' lib-chip--on' : ''}`}
          onClick={() => setShortOnly(v => !v)}
        >
          ≤ 5 min
        </button>

        {(query || island || level || shortOnly) && (
          <button className="lib-chip lib-chip--reset" onClick={() => {
            setQuery(''); setIsland(''); setLevel(''); setShortOnly(false)
          }}>
            Clear all
          </button>
        )}
      </div>

      {query && (
        <p className="lib-match-count">
          {totalUnits === 0
            ? 'No matches'
            : `${totalUnits} unit${totalUnits !== 1 ? 's' : ''} match "${query}"`}
        </p>
      )}

      <div className="lib-results">
        {results.map(({ island: isl, units: islUnits }) => (
          <div key={isl.slug}>
            <div className="lib-island-header">
              <span className="lib-island-dot" style={{ background: isl.color }} />
              <span className="lib-island-name">{isl.title}</span>
              <span className="lib-island-meta">
                Island {isl.order} · {isl.standards.map(s => s.replace(/_/g, ' ')).join(', ')} · {islUnits.length} unit{islUnits.length !== 1 ? 's' : ''}
              </span>
            </div>

            {islUnits.map(unit => {
              const lessons = lessonsByUnit(unit.id)
              const totalMins = lessons.reduce((s, l) => s + (l.minutes ?? 5), 0)
              const levelColor = unit.level === 'beginner' ? '#DCFCE7' : unit.level === 'intermediate' ? '#FEF3C7' : '#EDE9FE'

              return (
                <div key={unit.id} className="lib-unit-row">
                  <div className="lib-unit-stripe" style={{ background: isl.color }} />
                  <div className="lib-unit-info">
                    <h3 className="lib-unit-title">{highlight(unit.title, query)}</h3>
                    <p className="lib-unit-sub">{highlight(unit.summary, query)}</p>
                  </div>
                  <div className="lib-unit-meta">
                    {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} · ~{totalMins} min
                  </div>
                  <div>
                    <span className="lib-level-chip" style={{ background: levelColor }}>
                      {unit.level}
                    </span>
                  </div>
                  <div className="lib-unit-actions">
                    <Link href={`/learn/${isl.slug}`} className="lib-action-link">
                      Open island
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {results.length === 0 && (
          <div className="lib-empty">
            <p>No units match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
