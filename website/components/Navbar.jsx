'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LogIn, LogOut, ChevronDown, User, TrendingUp, Settings, Trophy } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import CoinBadge from '@/components/CoinBadge'
import StreakFlame from '@/components/StreakFlame'
import { isAtRisk } from '@/lib/streak'
import { getSpent } from '@/lib/shop'
import './Navbar.css'
import './Button.css'

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

const links = [
  { label: 'Resources', href: '/resources' },
  { label: 'Quizzes', href: '/quizzes' },
  { label: 'About', href: '/about' },
  { label: 'Impact', href: '/impact' },
]

function ProfileAvatar({ profile, size = 28 }) {
  const initial = (profile?.first_name?.[0] ?? '?').toUpperCase()
  return (
    <span
      className="navbar-avatar"
      style={{ width: size, height: size, fontSize: size * 0.43 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [spent, setSpent] = useState(getSpent)
  const [flameState, setFlameState] = useState('idle')
  const prevStreakRef = useRef(null)
  const { currentUser, profile, streak, logOut, openLogin } = useAuth()
  const router = useRouter()
  const userMenuRef = useRef(null)

  const displayName = profile?.first_name ?? currentUser?.email?.split('@')[0] ?? ''
  const truncatedName = displayName.length > 12 ? displayName.slice(0, 12) + '…' : displayName
  const roleLine = profile?.is_teacher ? 'Teacher' : 'Student'
  const fullName = profile?.name ?? displayName

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const refresh = () => setSpent(getSpent())
    window.addEventListener('incentive:shop-update', refresh)
    return () => window.removeEventListener('incentive:shop-update', refresh)
  }, [])

  useEffect(() => {
    const prev = prevStreakRef.current
    prevStreakRef.current = streak
    if (prev === null) {
      setFlameState(streak > 0 && isAtRisk() ? 'atRisk' : 'idle')
      return
    }
    if (streak > prev) {
      setFlameState(prev === 0 ? 'ignite' : 'refresh')
    } else if (streak > 0 && isAtRisk()) {
      setFlameState('atRisk')
    } else {
      setFlameState('idle')
    }
  }, [streak])

  const coins       = Math.max(0, (profile?.xp ?? 0) - spent)
  const xp          = (profile?.xp ?? 0) * 2
  const xpCount     = useCountUp(currentUser ? xp : 0)
  const coinCount   = useCountUp(currentUser ? coins : 0)
  const streakCount = useCountUp(currentUser ? streak : 0)

  async function handleLogOut() {
    setUserMenuOpen(false)
    setOpen(false)
    await logOut()
    router.push('/')
  }

  function closeMenu(href) {
    setUserMenuOpen(false)
    setOpen(false)
    router.push(href)
  }

  return (
    <header className="navbar">
      <nav className="navbar-inner container">
        <Link href="/" className="navbar-brand" aria-label="incentive home">
          <img src="/coin-logo.png" alt="" className="navbar-brand-logo" />
          <span>in<span className="brand-highlight">cent</span>ive</span>
        </Link>

        <ul className={`navbar-links ${open ? 'navbar-links--open' : ''}`}>
          <li key="/learn">
            <Link href="/learn" onClick={() => setOpen(false)}>Learn</Link>
          </li>
          {profile?.is_teacher && (
            <li key="/teach">
              <Link href="/teach" onClick={() => setOpen(false)}>Classes</Link>
            </li>
          )}
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)}>{label}</Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {currentUser ? (
            <>
              <div className="navbar-xp" data-tooltip="This is your XP, you earn it every time you complete a lesson">
                <span className="navbar-xp-icon-wrap"></span>
                <span className="navbar-xp-count">{xpCount}</span>
              </div>
              <div className="navbar-cents" data-tooltip="This is how many cents you've earned">
                <CoinBadge size={24} drop="1px 1px 0" />
                <span className="navbar-cents-count">{coinCount}</span>
              </div>
              <div
                className={`navbar-streak${streakCount === 0 ? ' navbar-streak--cold' : streakCount >= 7 ? ' navbar-streak--fire' : ''}`}
                data-tooltip={streakCount === 0 ? 'Complete a lesson to start your streak' : `${streakCount}-day streak — keep it going!`}
              >
                <span className="navbar-streak-flame">
                  <StreakFlame count={streak} state={flameState} />
                </span>
                <span className="navbar-streak-count">{streakCount}</span>
              </div>

              {/* Profile pill */}
              <div className="navbar-profile-wrap" ref={userMenuRef}>
                <button
                  className={`navbar-profile-pill${userMenuOpen ? ' navbar-profile-pill--open' : ''}`}
                  onClick={() => setUserMenuOpen(v => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label={`${displayName} — account menu`}
                >
                  <ProfileAvatar profile={profile} size={28} />
                  <span className="navbar-profile-name">{truncatedName}</span>
                  <ChevronDown size={13} strokeWidth={2.5} className="navbar-profile-chevron" />
                </button>

                {userMenuOpen && (
                  <div className="navbar-profile-menu" role="menu">
                    {/* Header */}
                    <div className="navbar-profile-menu-header">
                      <ProfileAvatar profile={profile} size={36} />
                      <div>
                        <div className="navbar-profile-menu-name">{fullName}</div>
                        <div className="navbar-profile-menu-role">{roleLine}</div>
                      </div>
                    </div>
                    <div className="navbar-profile-menu-divider" />
                    <button className="navbar-profile-menu-item" role="menuitem" onClick={() => closeMenu('/settings')}>
                      <User size={14} strokeWidth={2} /> Profile
                    </button>
                    <button className="navbar-profile-menu-item" role="menuitem" onClick={() => closeMenu('/progress')}>
                      <TrendingUp size={14} strokeWidth={2} /> My progress
                    </button>
                    <button className="navbar-profile-menu-item" role="menuitem" onClick={() => closeMenu('/leaderboard')}>
                      <Trophy size={14} strokeWidth={2} /> Leaderboard
                    </button>
                    <button className="navbar-profile-menu-item" role="menuitem" onClick={() => closeMenu('/settings')}>
                      <Settings size={14} strokeWidth={2} /> Settings
                    </button>
                    <div className="navbar-profile-menu-divider" />
                    <button className="navbar-profile-menu-item navbar-profile-menu-item--danger" role="menuitem" onClick={handleLogOut}>
                      <LogOut size={14} strokeWidth={2} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="navbar-xp navbar-xp--guest" data-tooltip="Log in to start earning XP">
                <span className="navbar-xp-icon-wrap"></span>
                <span className="navbar-xp-count">0</span>
              </div>
              <div className="navbar-cents navbar-cents--guest" data-tooltip="Log in to start earning cents">
                <CoinBadge size={24} drop="1px 1px 0" />
                <span className="navbar-cents-count">0</span>
              </div>
              <div className="navbar-streak navbar-streak--cold" data-tooltip="Log in to track your streak">
                <span className="navbar-streak-flame">
                  <StreakFlame count={0} state="idle" />
                </span>
                <span className="navbar-streak-count">0</span>
              </div>
              <button className="btn btn-secondary navbar-logout" onClick={openLogin}>
                <span className="btn-label">Log in</span>
                <span className="btn-icon-badge"><LogIn size={16} strokeWidth={2.5} /></span>
              </button>
            </>
          )}
        </div>

        <div className="navbar-end">
          {currentUser ? (
            <>
              <div className="navbar-xp navbar-xp--mobile" title="Your XP" aria-hidden="true">
                <span className="navbar-xp-icon-wrap"></span>
                <span className="navbar-xp-count">{xpCount}</span>
              </div>
              <div className="navbar-cents navbar-cents--mobile" title="Your cents" aria-hidden="true">
                <CoinBadge size={24} drop="1px 1px 0" />
                <span className="navbar-cents-count">{coinCount}</span>
              </div>
            </>
          ) : (
            <button className="btn btn-primary navbar-cta--mobile" onClick={openLogin}>
              <span className="btn-label">Log in</span>
              <span className="btn-icon-badge"><LogIn size={15} strokeWidth={2.5} /></span>
            </button>
          )}
          <button
            className="navbar-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="navbar-mobile">
          <ul>
            <li key="/learn">
              <Link href="/learn" onClick={() => setOpen(false)}>Learn</Link>
            </li>
            {profile?.is_teacher && (
              <li key="/teach">
                <Link href="/teach" onClick={() => setOpen(false)}>Classes</Link>
              </li>
            )}
            <li key="/progress">
              <Link href="/progress" onClick={() => setOpen(false)}>My progress</Link>
            </li>
            <li key="/leaderboard">
              <Link href="/leaderboard" onClick={() => setOpen(false)}>Leaderboard</Link>
            </li>
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)}>{label}</Link>
              </li>
            ))}
          </ul>
          {currentUser ? (
            <div className="navbar-mobile-bottom">
              <div className="navbar-xp">
                <span className="navbar-xp-icon-wrap"></span>
                <span className="navbar-xp-count">{xp}</span>
              </div>
              <div className="navbar-cents">
                <CoinBadge size={24} drop="1px 1px 0" />
                <span className="navbar-cents-count">{coins}</span>
              </div>
              <div className={`navbar-streak${streak === 0 ? ' navbar-streak--cold' : streak >= 7 ? ' navbar-streak--fire' : ''}`}>
                <span className="navbar-streak-flame">
                  <StreakFlame count={streak} state={flameState} />
                </span>
                <span className="navbar-streak-count">{streak}</span>
              </div>
              <button className="btn btn-secondary" onClick={handleLogOut} style={{ flex: 1, justifyContent: 'center' }}>
                <span className="btn-label">Log out</span>
                <span className="btn-icon-badge"><LogOut size={16} strokeWidth={2.5} /></span>
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => { setOpen(false); openLogin() }} style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
              <span className="btn-label">Log in</span>
              <span className="btn-icon-badge"><LogIn size={16} strokeWidth={2.5} /></span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
