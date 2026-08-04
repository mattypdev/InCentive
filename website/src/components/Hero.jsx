import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Hero.css'

function Squiggle({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
      <path
        d="M2 8 C 20 2, 40 12, 60 6 S 100 2, 120 8 S 160 12, 180 6 S 198 4, 198 4"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"
      />
    </svg>
  )
}

function ShapeLayer({ className }) {
  return (
    <div className={`hero-shape-layer ${className}`} aria-hidden="true">
      <div className="hs hs--circle-lg" />
      <div className="hs hs--circle-sm" />
      <div className="hs hs--circle-xs" />
      <div className="hs hs--pill" />
      <div className="hs hs--pill-sm" />
      <div className="hs hs--square" />
      <div className="hs hs--square-sm" />
      <div className="hs hs--triangle" />
      <div className="hs hs--ring" />
      <div className="hs hs--dots" />
    </div>
  )
}

function LoginPanel() {
  const { currentUser, profile, logIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]         = useState('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (currentUser) {
    return (
      <div className="hero-login">
        <div className="hero-login-header">
          <p className="hero-login-title">Welcome back!</p>
          <p className="hero-login-sub">{profile?.name || currentUser.email}</p>
        </div>
        <button className="hero-login-submit" onClick={() => navigate('/learn')}>
          Continue Learning <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      mode === 'signup' ? await signUp(name.trim(), email, password) : await logIn(email, password)
      navigate('/learn')
    } catch (err) {
      const m = err.message ?? ''
      setError(
        m.includes('Invalid login') || m.includes('invalid_credentials') ? 'Incorrect email or password.' :
        m.includes('already registered') ? 'Account already exists.' :
        'Something went wrong.'
      )
    } finally { setLoading(false) }
  }

  return (
    <div className="hero-login">
      <div className="hero-login-header">
        <p className="hero-login-title">{mode === 'login' ? 'Log in' : 'Create account'}</p>
        <p className="hero-login-sub">
          {mode === 'login' ? 'Pick up right where you left off.' : 'Start learning for free today.'}
        </p>
      </div>
      <form className="hero-login-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <input className="hero-login-input" type="text" placeholder="Your name"
            value={name} onChange={e => setName(e.target.value)}
            required autoComplete="name" />
        )}
        <input className="hero-login-input" type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)}
          required autoComplete="email" />
        <input className="hero-login-input" type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        {error && <p className="hero-login-error">{error}</p>}
        <button className="hero-login-submit" type="submit" disabled={loading}>
          {loading ? 'Loading…' : mode === 'login' ? 'Log in' : 'Create account'}
          {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
        </button>
      </form>
      <div className="hero-login-perks">
        {['Free forever', 'No credit card', 'Track your progress'].map(p => (
          <span key={p} className="hero-login-perk"><Check size={13} strokeWidth={3}/>{p}</span>
        ))}
      </div>
      <button className="hero-login-toggle" onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setName('') }}>
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="about">

      {/* Colored shapes clipped to left half */}
      <ShapeLayer className="hero-shape-layer--color" />
      {/* Same shapes, white, clipped to right half */}
      <ShapeLayer className="hero-shape-layer--white" />

      {/* Left — marketing copy */}
      <div className="hero-left">
        <div className="hero-left-inner">
          <h1 className="hero-title">
            Learn Money.
            <br />
            Build{' '}
            <span className="hero-highlight">
              Confidence
              <Squiggle className="hero-squiggle" />
            </span>
            .
          </h1>
          <p className="hero-subtitle">
            incentive makes personal finance approachable, interactive,
            and actually fun. Build real skills with courses designed for
            the way you learn.
          </p>
        </div>
      </div>

      {/* Right — login */}
      <div className="hero-right">
        <LoginPanel />
      </div>

    </section>
  )
}
