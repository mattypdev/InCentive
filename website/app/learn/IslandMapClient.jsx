'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { islands, unitsByIsland, islandBySlug } from '@/lib/content/islands'
import { getStoredProgress } from '@/lib/guestProgress'
import './IslandMap.css'

export default function IslandMapClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { currentUser } = useAuth()
  const supabase = createClient()

  const defaultSlug = islands[0].slug
  const paramSlug   = searchParams.get('island')
  const activeSlug  = islands.find(i => i.slug === paramSlug)?.slug ?? defaultSlug

  const [heroIndex, setHeroIndex] = useState(islands.findIndex(i => i.slug === activeSlug) ?? 0)
  const [progress,  setProgress]  = useState({})  // lessonId → score

  const heroIsland = islands[heroIndex]
  const heroUnits  = unitsByIsland(heroIsland.slug)

  // Load progress
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

  function unitDone(unitId) {
    const { lessonsByUnit } = require('@/lib/content/islands')
    const ls = lessonsByUnit(unitId)
    return ls.length > 0 && ls.every(l => progress[l.id] !== undefined)
  }

  function navigate(delta) {
    const next = Math.max(0, Math.min(islands.length - 1, heroIndex + delta))
    setHeroIndex(next)
    router.replace(`/learn?island=${islands[next].slug}`, { scroll: false })
  }

  return (
    <div className="island-map">
      {/* Hero */}
      <div className="island-map-header">
        <div>
          <h1 className="island-map-title">Your money journey</h1>
          <p className="island-map-subtitle">
            {islands.length} islands · {heroUnits.reduce((s, u) => s + (unitsByIsland ? 1 : 0), 0 )} units · 278 lessons · all 6 national standards
          </p>
        </div>
        <div className="island-map-toggle">
          <span className="island-map-toggle-on">Path</span>
          <Link href="/library" className="island-map-toggle-off">Library</Link>
        </div>
      </div>

      <div className="island-hero">
        <button
          className={`island-arrow${heroIndex === 0 ? ' island-arrow--dim' : ''}`}
          onClick={() => navigate(-1)}
          aria-label="Previous island"
          disabled={heroIndex === 0}
        >
          ‹
        </button>

        <div className="island-stage">
          <div className="island-stage-shadow" />
          <Image
            src={heroIsland.art}
            alt={heroIsland.title}
            width={360}
            height={360}
            priority
            className="island-stage-img"
          />
        </div>

        <div className="island-info chunk">
          <div className="island-info-kicker">
            ISLAND {heroIndex + 1} OF {islands.length - 1} · {heroIsland.tagline.toUpperCase()}
          </div>
          <h2 className="island-info-title">{heroIsland.title}</h2>
          <p className="island-info-sub">{heroIsland.tagline}</p>

          <div className="island-units-list">
            {heroUnits.slice(0, 4).map((u, i) => (
              <div key={u.id} className="island-unit-row">
                <span className={`island-unit-dot${unitDone(u.id) ? ' island-unit-dot--done' : ''}`}>
                  {i + 1}
                </span>
                <span className="island-unit-name">{u.title}</span>
                {unitDone(u.id) && <span className="island-unit-done-label">Done</span>}
              </div>
            ))}
            {heroUnits.length > 4 && (
              <div className="island-unit-more">+ {heroUnits.length - 4} more units</div>
            )}
          </div>

          <div className="island-info-actions">
            <Link href={`/learn/${heroIsland.slug}`} className="btn btn-primary island-continue-btn">
              Continue
            </Link>
            <Link href={`/learn/${heroIsland.slug}`} className="btn btn-ghost island-explore-btn">
              Explore island
            </Link>
          </div>
        </div>

        <button
          className={`island-arrow${heroIndex >= islands.length - 1 ? ' island-arrow--dim' : ''}`}
          onClick={() => navigate(1)}
          aria-label="Next island"
          disabled={heroIndex >= islands.length - 1}
        >
          ›
        </button>
      </div>

      {/* Strip */}
      <div className="island-strip">
        {islands.map((isl, idx) => (
          <button
            key={isl.slug}
            className={`island-tile${idx === heroIndex ? ' island-tile--active' : ''}`}
            onClick={() => { setHeroIndex(idx); router.replace(`/learn?island=${isl.slug}`, { scroll: false }) }}
            aria-label={isl.title}
          >
            <div className="island-tile-img">
              <Image src={isl.art} alt={isl.title} width={86} height={58} />
            </div>
            <b className="island-tile-name">{isl.title}</b>
          </button>
        ))}
      </div>
    </div>
  )
}
