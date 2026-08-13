'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import '@/app/(pages)/Login.css'
import '@/components/Button.css'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, logIn, signInWithGoogle } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(name, email, password)
      } else {
        await logIn(email, password)
      }
      router.push('/learn')
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  function friendlyError(msg) {
    if (msg === 'CHECK_EMAIL') return 'Check your email and click the confirmation link, then log in.'
    if (msg.includes('already registered') || msg.includes('User already registered')) return 'An account with that email already exists.'
    if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) return 'Incorrect email or password.'
    if (msg.includes('Email not confirmed') || msg.includes('not confirmed')) return 'Please confirm your email first, then log in.'
    if (msg.includes('Password should') || msg.includes('at least')) return 'Password must be at least 6 characters.'
    if (msg.includes('rate limit') || msg.includes('Too many')) return 'Too many attempts — wait a minute and try again.'
    return 'Something went wrong. Please try again.'
  }

  return (
    <main className="login-page">
      {/* Decorative shapes */}
      <div className="login-shapes" aria-hidden="true">
        <div className="login-shape login-shape--circle" />
        <div className="login-shape login-shape--triangle" />
        <div className="login-shape login-shape--square" />
        <div className="login-shape login-shape--pill" />
      </div>

      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="login-brand">
            in<span>cent</span>ive
          </Link>
          <h1>{mode === 'login' ? 'Log in to learn' : 'Create your account'}</h1>
          <p>{mode === 'login' ? 'Pick up right where your streak left off.' : 'Start building real financial confidence today.'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="login-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit btn btn-primary" type="submit" disabled={loading}>
            <span className="btn-label">
              {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </span>
            {!loading && (
              <span className="btn-icon-badge">
                <ArrowRight size={18} strokeWidth={2.5} />
              </span>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          className="login-google-btn"
          type="button"
          disabled={googleLoading}
          onClick={async () => {
            setGoogleLoading(true)
            try { await signInWithGoogle() } catch (err) { setError('Could not sign in with Google.'); setGoogleLoading(false) }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <p className="login-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </main>
  )
}
