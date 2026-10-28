'use client'
import { useState, useEffect, useRef } from 'react'
import FlameIcon from '@/components/FlameIcon'
import '@/components/Navbar.css'
import '@/app/(pages)/Learn.css'
import './streak-demo.css'

function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef  = useRef(null)
  useEffect(() => {
    const from = prevRef.current
    const to   = value
    prevRef.current = to
    if (from === to) return
    cancelAnimationFrame(rafRef.current)
    const start = performance.now()
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])
  return display
}

function StreakPill({ count, label }) {
  const display = useCountUp(count)
  const isCold  = display === 0
  const isFire  = display >= 7
  return (
    <div className="demo-pill-wrap">
      <div
        className={`navbar-streak${isCold ? ' navbar-streak--cold' : isFire ? ' navbar-streak--fire' : ''}`}
        style={{ cursor: 'default' }}
      >
        <FlameIcon streak={display} size={22} />
        <span className="navbar-streak-count">{display}</span>
      </div>
      <span className="demo-pill-label">{label}</span>
    </div>
  )
}

function DoneStreakBadge({ count, isNew, key: k }) {
  return (
    <div key={k} className={`done-streak${isNew ? ' done-streak--new' : ''}`}>
      <FlameIcon streak={count} size={28} />
      <span>{isNew ? `${count}-day streak!` : `${count}-day streak`}</span>
    </div>
  )
}

export default function StreakDemoPage() {
  const [liveStreak, setLiveStreak]   = useState(0)
  const [badgeKey,   setBadgeKey]     = useState(0)
  const [badgeState, setBadgeState]   = useState(null)  // { count, isNew }
  const [animTarget, setAnimTarget]   = useState(0)
  const liveDisplay = useCountUp(animTarget)

  function fireLesson(days) {
    const isNew = liveStreak !== days
    setLiveStreak(days)
    setAnimTarget(days)
    setBadgeState({ count: days, isNew })
    setBadgeKey(k => k + 1)
  }

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

        <div>
          <h1 className="demo-heading">Streak Feature Demo</h1>
          <p className="demo-sub">All states, live — click a button to simulate a lesson finish.</p>
        </div>

        {/* ── Static states ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Navbar pill states</h2>
          <div className="demo-row">
            <StreakPill count={0}  label="0 days (cold)" />
            <StreakPill count={1}  label="1 day" />
            <StreakPill count={3}  label="3 days" />
            <StreakPill count={6}  label="6 days" />
            <StreakPill count={7}  label="7 days (🔥 fire)" />
            <StreakPill count={14} label="14 days" />
            <StreakPill count={30} label="30 days" />
          </div>
        </section>

        {/* ── Live interactive ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Live simulation</h2>
          <p className="demo-sub" style={{ marginBottom: 16 }}>
            Tap a button — the pill animates with count-up and the done-screen badge pops in.
          </p>

          <div className="demo-row" style={{ marginBottom: 24 }}>
            <div className="demo-pill-wrap">
              <div
                className={`navbar-streak${liveDisplay === 0 ? ' navbar-streak--cold' : liveDisplay >= 7 ? ' navbar-streak--fire' : ''}`}
                style={{ cursor: 'default' }}
              >
                <FlameIcon streak={liveDisplay} size={22} />
                <span className="navbar-streak-count">{liveDisplay}</span>
              </div>
              <span className="demo-pill-label">Live pill</span>
            </div>
          </div>

          <div className="demo-btn-row">
            {[1, 2, 3, 5, 7, 10, 14, 21, 30].map(n => (
              <button
                key={n}
                className="demo-btn"
                onClick={() => fireLesson(n)}
                style={liveStreak === n ? { background: '#FFF7ED', borderColor: '#F97316' } : {}}
              >
                Day {n}
              </button>
            ))}
            <button className="demo-btn demo-btn--reset" onClick={() => { setLiveStreak(0); setAnimTarget(0); setBadgeState(null) }}>
              Reset
            </button>
          </div>
        </section>

        {/* ── Done screen badge ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Done-screen streak badge</h2>
          <p className="demo-sub" style={{ marginBottom: 16 }}>
            Appears after finishing a lesson. Pops with orange border when the streak is newly extended.
          </p>
          <div className="demo-row" style={{ flexWrap: 'wrap', gap: 12 }}>
            {badgeState ? (
              <DoneStreakBadge key={badgeKey} count={badgeState.count} isNew={badgeState.isNew} />
            ) : (
              <span style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
                Click a day button above to see the badge
              </span>
            )}
            {/* Also show both variants side by side */}
            <DoneStreakBadge count={5} isNew={false} />
            <DoneStreakBadge key="new-static" count={5} isNew={true} />
          </div>
          <p className="demo-sub" style={{ marginTop: 8, fontSize: '0.75rem' }}>
            Left: already-extended today (quiet) · Right: newly extended (orange pop)
          </p>
        </section>

        {/* ── Fire animation ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">7-day flame animation</h2>
          <p className="demo-sub" style={{ marginBottom: 16 }}>
            At 7+ days the flame flickers — a CSS keyframe that scales and tilts.
          </p>
          <div className="demo-row">
            <div className="demo-pill-wrap">
              <div className="navbar-streak navbar-streak--fire" style={{ cursor: 'default' }}>
                <FlameIcon streak={7} size={22} />
                <span className="navbar-streak-count">7</span>
              </div>
              <span className="demo-pill-label">Flickering flame</span>
            </div>
            <div className="demo-pill-wrap">
              <div className="navbar-streak navbar-streak--fire" style={{ cursor: 'default' }}>
                <FlameIcon streak={30} size={22} />
                <span className="navbar-streak-count">30</span>
              </div>
              <span className="demo-pill-label">Same at 30 days</span>
            </div>
          </div>
        </section>

        {/* ── Count-up ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Count-up animation</h2>
          <p className="demo-sub" style={{ marginBottom: 16 }}>
            Ease-out cubic over 900ms — same hook used for XP and coins in the navbar.
          </p>
          <div className="demo-btn-row">
            {[0, 1, 5, 10, 30, 100].map(n => (
              <button key={n} className="demo-btn" onClick={() => setAnimTarget(n)}>
                → {n}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="navbar-streak" style={{ cursor: 'default', display: 'inline-flex' }}>
              <FlameIcon streak={liveDisplay} size={22} />
              <span className="navbar-streak-count">{liveDisplay}</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
