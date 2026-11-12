'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { lessonsByUnit } from '@/lib/content/islands'
import { getStoredProgress } from '@/lib/guestProgress'
import { islands } from '@/lib/content/islands'
import './IslandPage.css'

export default function IslandPageClient({ island, units }) {
  const { currentUser } = useAuth()
  const supabase = createClient()
  const [progress, setProgress] = useState({})

  useEffect(() => {
    if (!currentUser) {
      setProgress(getStoredProgress() ?? {})
      return
    }
    supabase
      .from('lesson_progress')
      .select('lesson_id, score')
      .eq('user_id', currentUser.id)
      .eq('completed', true)
      .then(({ data }) => {
        if (!data) return
        const map = {}
        data.forEach(r => { map[r.lesson_id] = r.score })
        setProgress(map)
      })
  }, [currentUser])

  function lessonState(lessonId) {
    if (progress[lessonId] !== undefined) return 'done'
    return 'new'
  }

  function unitProgress(unitId) {
    const ls = lessonsByUnit(unitId)
    if (!ls.length) return { done: 0, total: 0, pct: 0 }
    const done = ls.filter(l => progress[l.id] !== undefined).length
    return { done, total: ls.length, pct: Math.round((done / ls.length) * 100) }
  }

  const islandOrder = island.order
  const totalIslands = islands.filter(i => i.slug !== 'capstone').length

  return (
    <div className="island-page">
      {/* Banner */}
      <div className="island-page-banner" style={{ background: island.color + '22' }}>
        <div className="island-page-banner-inner">
          <div className="island-page-banner-text">
            <p className="island-page-kicker">ISLAND {islandOrder} OF {totalIslands}</p>
            <h1 className="island-page-title">{island.title}</h1>
            <p className="island-page-tagline">{island.tagline}</p>
            <div className="island-page-standards">
              {island.standards.map(s => (
                <span key={s} className="island-standard-chip">
                  {s.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          <Image
            src={island.art}
            alt={island.title}
            width={200}
            height={200}
            className="island-page-art"
          />
        </div>
      </div>

      {/* Back to map */}
      <div className="island-page-nav">
        <Link href="/learn" className="island-back-link">← All islands</Link>
      </div>

      {/* Units */}
      <div className="island-page-units">
        {units.map((unit, idx) => {
          const { done, total, pct } = unitProgress(unit.id)
          const lessons = lessonsByUnit(unit.id)
          const isOpen = idx === 0 || done > 0

          return (
            <div key={unit.id} className={`island-unit-card chunk${isOpen ? ' island-unit-card--open' : ''}`}>
              <div className="island-unit-header">
                <div className="island-unit-meta">
                  <span className="island-unit-number">Unit {idx + 1}</span>
                  <span className="island-unit-level-chip">{unit.level}</span>
                </div>
                <h2 className="island-unit-title">{unit.title}</h2>
                <p className="island-unit-summary">{unit.summary}</p>

                {total > 0 && (
                  <div className="island-unit-progress">
                    <div className="island-unit-progress-bar">
                      <div className="island-unit-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="island-unit-progress-label">{done}/{total}</span>
                  </div>
                )}
              </div>

              {isOpen && (
                <div className="island-lessons-grid">
                  {lessons.map(lesson => {
                    const state = lessonState(lesson.id)
                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${island.slug}/${unit.slug}/${lesson.slug}`}
                        className={`island-lesson-chip island-lesson-chip--${state}`}
                      >
                        {state === 'done' && <span className="island-lesson-check">✓</span>}
                        <span className="island-lesson-name">{lesson.title}</span>
                        <span className="island-lesson-mins">{lesson.minutes}m</span>
                      </Link>
                    )
                  })}

                  <Link
                    href={`/learn/${island.slug}/${unit.slug}/check`}
                    className="island-lesson-chip island-lesson-chip--check"
                  >
                    <span className="island-lesson-name">Unit Check</span>
                    <span className="island-lesson-mins">+40¢</span>
                  </Link>

                  <Link
                    href={`/learn/${island.slug}/${unit.slug}/swipe`}
                    className="island-lesson-chip island-lesson-chip--swipe"
                  >
                    <span className="island-lesson-name">Swipe Round</span>
                    <span className="island-lesson-mins">+10¢</span>
                  </Link>
                </div>
              )}
            </div>
          )
        })}

        {/* Island Challenge */}
        <div className="island-challenge-card chunk">
          <div className="island-challenge-inner">
            <div>
              <p className="island-challenge-kicker">Island Challenge</p>
              <h2 className="island-challenge-title">Test everything</h2>
              <p className="island-challenge-desc">15 questions across all units. Pass 12/15 to earn 100¢ + the {island.title} badge.</p>
            </div>
            <Link href={`/learn/${island.slug}/challenge`} className="btn btn-primary">
              Start challenge
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
