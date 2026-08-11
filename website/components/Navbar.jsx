'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import CoinBadge from '@/components/CoinBadge'
import { getSpent } from '@/lib/shop'
import './Navbar.css'

const links = [
  { label: 'Resources', href: '/resources' },
  { label: 'Articles', href: '/articles' },
  { label: 'Quizzes', href: '/quizzes' },
  { label: 'About', href: '/about' },
]

const CHECK_IN_LINKS = [
  { label: 'Progress', href: '/progress' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [checkinOpen, setCheckinOpen] = useState(false)
  const [spent, setSpent] = useState(getSpent)
  const { currentUser, profile, logOut } = useAuth()
  const router = useRouter()
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCheckinOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const refresh = () => setSpent(getSpent())
    window.addEventListener('incentive:shop-update', refresh)
    return () => window.removeEventListener('incentive:shop-update', refresh)
  }, [])

  const coins = Math.max(0, (profile?.xp ?? 0) - spent)
  const xp    = (profile?.xp ?? 0) * 2

  async function handleLogOut() {
    await logOut()
    router.push('/')
    setOpen(false)
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
          <li className="navbar-dropdown-wrap" ref={dropdownRef}>
            <button
              className={`navbar-dropdown-trigger${checkinOpen ? ' navbar-dropdown-trigger--open' : ''}`}
              onClick={() => setCheckinOpen(v => !v)}
              aria-expanded={checkinOpen}
            >
              Check-in
            </button>
            {checkinOpen && (
              <div className="navbar-dropdown">
                {CHECK_IN_LINKS.map(({ label, href }) => (
                  <Link key={href} to={href} className="navbar-dropdown-item" onClick={() => { setCheckinOpen(false); setOpen(false) }}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </li>
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link to={href} onClick={() => setOpen(false)}>{label}</Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {currentUser ? (
            <>
              <div className="navbar-xp" data-tooltip="This is your XP, you earn it every time you complete a lesson">
                <span className="navbar-xp-icon-wrap"></span>
                <span className="navbar-xp-count">{xp}</span>
              </div>
              <div className="navbar-cents" data-tooltip="This is how many cents you've earned">
                <CoinBadge size={24} drop="1px 1px 0" />
                <span className="navbar-cents-count">{coins}</span>
              </div>
              <button className="btn btn-secondary navbar-logout" onClick={handleLogOut}>
                <span className="btn-label">Log out</span>
                <span className="btn-icon-badge"><LogOut size={16} strokeWidth={2.5} /></span>
              </button>
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
              <button className="btn btn-secondary navbar-logout" onClick={() => router.push('/login')}>
                <span className="btn-label">Log in</span>
                <span className="btn-icon-badge"><LogIn size={16} strokeWidth={2.5} /></span>
              </button>
            </>
          )}
        </div>

        <div className="navbar-end">
          <div className={`navbar-xp navbar-xp--mobile${!currentUser ? ' navbar-xp--guest' : ''}`} title="Your XP" aria-hidden="true">
            <span className="navbar-xp-icon-wrap"></span>
            <span className="navbar-xp-count">{currentUser ? xp : 0}</span>
          </div>
          <div className={`navbar-cents navbar-cents--mobile${!currentUser ? ' navbar-cents--guest' : ''}`} title="Your cents" aria-hidden="true">
            <CoinBadge size={24} drop="1px 1px 0" />
            <span className="navbar-cents-count">{currentUser ? coins : 0}</span>
          </div>
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
            <li className="navbar-mobile-group-label">Check-in</li>
            {CHECK_IN_LINKS.map(({ label, href }) => (
              <li key={href} className="navbar-mobile-subitem">
                <Link to={href} onClick={() => setOpen(false)}>{label}</Link>
              </li>
            ))}
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link to={href} onClick={() => setOpen(false)}>{label}</Link>
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
              <button className="btn btn-secondary" onClick={handleLogOut} style={{ flex: 1, justifyContent: 'center' }}>
                <span className="btn-label">Log out</span>
                <span className="btn-icon-badge"><LogOut size={16} strokeWidth={2.5} /></span>
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => { router.push('/login'); setOpen(false) }} style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
              <span className="btn-label">Log in</span>
              <span className="btn-icon-badge"><LogIn size={16} strokeWidth={2.5} /></span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
