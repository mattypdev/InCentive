'use client'
import { useState, useRef, useEffect } from 'react'
import StreakFlame from '@/components/StreakFlame'
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

function DemoPill({ count, state = 'idle', label }) {
  const display = useCountUp(count)
  const isCold  = count === 0
  const isFire  = count >= 7
  return (
    <div className="demo-pill-wrap">
      <div
        className={`navbar-streak${isCold ? ' navbar-streak--cold' : isFire ? ' navbar-streak--fire' : ''}`}
        style={{ cursor: 'default' }}
      >
        <span className="navbar-streak-flame">
          <StreakFlame count={count} state={state} />
        </span>
        <span className="navbar-streak-count">{display}</span>
      </div>
      <span className="demo-pill-label">{label}</span>
    </div>
  )
}

function ReplayFlame({ count, state, label, desc }) {
  const [k, setK] = useState(0)
  return (
    <div className="demo-state-card">
      <div className="demo-state-flame">
        <StreakFlame key={k} count={count} state={state} />
      </div>
      <div className="demo-state-count">{count}</div>
      <div className="demo-state-label">{label}</div>
      <p className="demo-state-desc">{desc}</p>
      <button className="demo-btn" onClick={() => setK(n => n + 1)}>Replay</button>
    </div>
  )
}

function AtRiskToggle({ count }) {
  const [on, setOn] = useState(true)
  return (
    <div className="demo-state-card">
      <div className="demo-state-flame">
        <StreakFlame count={count} state={on ? 'atRisk' : 'idle'} />
      </div>
      <div className="demo-state-count">{count}</div>
      <div className="demo-state-label">At risk</div>
      <p className="demo-state-desc">Past 8 PM — shrinks, desaturates, flickers.</p>
      <button className="demo-btn" onClick={() => setOn(v => !v)}>
        {on ? 'Restore' : 'Set at risk'}
      </button>
    </div>
  )
}

export default function StreakDemoPage() {
  const [liveCount,  setLiveCount]  = useState(0)
  const [liveState,  setLiveState]  = useState('idle')
  const [badgeKey,   setBadgeKey]   = useState(0)
  const [badgeState, setBadgeState] = useState(null)
  const [animTarget, setAnimTarget] = useState(0)
  const prevLiveRef = useRef(0)
  const liveDisplay = useCountUp(animTarget)

  function fireLesson(days) {
    const prev = prevLiveRef.current
    const isNew = days !== prev
    setLiveCount(days)
    setAnimTarget(days)
    setLiveState(isNew ? (prev === 0 ? 'ignite' : 'refresh') : 'idle')
    prevLiveRef.current = days
    if (isNew) {
      setBadgeState({ count: days, isNew: true })
      setBadgeKey(k => k + 1)
    } else {
      setBadgeState({ count: days, isNew: false })
    }
  }

  function resetLive() {
    setLiveCount(0); setAnimTarget(0); setLiveState('idle')
    setBadgeState(null); prevLiveRef.current = 0
  }

  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 56 }}>

        <div>
          <h1 className="demo-heading">Streak Flame Demo</h1>
          <p className="demo-sub">All 4 animation states · 3 tier sizes · live simulation</p>
        </div>

        {/* ── 4 States ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">States</h2>
          <div className="demo-states-row">
            <div className="demo-state-card">
              <div className="demo-state-flame">
                <StreakFlame count={0} state="idle" />
              </div>
              <div className="demo-state-count">0</div>
              <div className="demo-state-label">Dormant</div>
              <p className="demo-state-desc">No streak yet — grey/desaturated, flat.</p>
            </div>
            <ReplayFlame count={1}  state="ignite"  label="Ignite"  desc="First streak earned — layers pop in with sparks." />
            <ReplayFlame count={5}  state="refresh" label="Refresh" desc="Daily check-in — squash & stretch, ring pulse." />
            <AtRiskToggle count={5} />
          </div>
        </section>

        {/* ── Pill states ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Pill — single size at all counts</h2>
          <div className="demo-row" style={{ alignItems: 'flex-end', gap: 24 }}>
            <DemoPill count={0}  state="idle" label="0 days (dormant)" />
            <DemoPill count={1}  state="idle" label="1 day" />
            <DemoPill count={7}  state="idle" label="7 days" />
            <DemoPill count={30} state="idle" label="30 days" />
          </div>
        </section>

        {/* ── Live simulation ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Live simulation</h2>
          <p className="demo-sub" style={{ marginBottom: 16 }}>
            Click a day button to simulate finishing a lesson. Watch the ignite/refresh fire.
          </p>

          <div className="demo-row" style={{ marginBottom: 24 }}>
            <div className="demo-pill-wrap">
              <div
                className={`navbar-streak${liveDisplay === 0 ? ' navbar-streak--cold' : liveDisplay >= 7 ? ' navbar-streak--fire' : ''}`}
                style={{ cursor: 'default' }}
              >
                <span className="navbar-streak-flame">
                  <StreakFlame count={liveCount} state={liveState} />
                </span>
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
                style={liveCount === n ? { background: '#FFF7ED', borderColor: '#F97316' } : {}}
              >
                Day {n}
              </button>
            ))}
            <button className="demo-btn demo-btn--reset" onClick={resetLive}>Reset</button>
          </div>
        </section>

        {/* ── Done-screen badge ── */}
        <section className="demo-section">
          <h2 className="demo-section-title">Done-screen streak badge</h2>
          <p className="demo-sub" style={{ marginBottom: 16 }}>
            Appears after finishing a lesson. Orange pop when streak is newly extended.
          </p>
          <div className="demo-row" style={{ flexWrap: 'wrap', gap: 12 }}>
            {badgeState ? (
              <div key={badgeKey} className={`done-streak${badgeState.isNew ? ' done-streak--new' : ''}`}>
                <StreakFlame
                  key={badgeKey}
                  count={badgeState.count}
                  state={badgeState.isNew ? (badgeState.count === 1 ? 'ignite' : 'refresh') : 'idle'}
                />
                <span>{badgeState.isNew ? `${badgeState.count}-day streak!` : `${badgeState.count}-day streak`}</span>
              </div>
            ) : (
              <span style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
                Click a day button above to see the badge
              </span>
            )}
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
              <button key={n} className="demo-btn" onClick={() => setAnimTarget(n)}>→ {n}</button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="navbar-streak" style={{ cursor: 'default', display: 'inline-flex' }}>
              <span className="navbar-streak-flame">
                <StreakFlame count={liveDisplay} state="idle" />
              </span>
              <span className="navbar-streak-count">{liveDisplay}</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
