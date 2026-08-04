import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Mail } from 'lucide-react'
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
  const { currentUser, profile, logIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]         = useState('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [emailSent, setEmailSent] = useState(false)

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
      if (mode === 'signup') {
        await signUp(name.trim(), email, password)
        setEmailSent(true)
      } else {
        await logIn(email, password)
        navigate('/learn')
      }
    } catch (err) {
      const m = err.message ?? ''
      setError(
        m.includes('Invalid login') || m.includes('invalid_credentials') ? 'Incorrect email or password.' :
        m.includes('already registered') ? 'Account already exists.' :
        'Something went wrong.'
      )
    } finally { setLoading(false) }
  }

  if (emailSent) {
    return (
      <div className="hero-email-overlay" onClick={() => setEmailSent(false)}>
        <div className="hero-email-popup" onClick={e => e.stopPropagation()}>
          <div className="hero-email-icon"><Mail size={32} strokeWidth={2} /></div>
          <h3 className="hero-email-title">Check your email</h3>
          <p className="hero-email-body">
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Click it to activate your account, then come back to log in.
          </p>
          <button className="hero-email-back" onClick={() => { setEmailSent(false); setMode('login') }}>
            Back to log in
          </button>
        </div>
      </div>
    )
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
      <div className="hero-login-divider"><span>or</span></div>

      <button type="button" className="hero-google-btn" onClick={signInWithGoogle}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

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
