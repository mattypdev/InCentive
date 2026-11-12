'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { requestParentConsent, getClassEmail } from '@/app/actions/auth'
import './LoginPage.css'

const ROLES = [
  { id: 'student',   icon: '🎓', name: 'Student',   desc: 'Learn financial skills' },
  { id: 'teacher',   icon: '📚', name: 'Teacher',   desc: 'Bring lessons to class' },
  { id: 'parent',    icon: '👨‍👩‍👧', name: 'Parent',    desc: 'Learn together at home' },
  { id: 'volunteer', icon: '🙋', name: 'Volunteer', desc: 'Host community sessions' },
]

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function friendlyError(msg = '') {
  if (msg.includes('already registered') || msg.includes('User already registered')) return 'An account with that email already exists.'
  if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) return 'Incorrect email or password.'
  if (msg.includes('Password should') || msg.includes('at least')) return 'Password must be at least 6 characters.'
  if (msg.includes('rate limit') || msg.includes('Too many')) return 'Too many attempts — wait a minute and try again.'
  return 'Something went wrong. Please try again.'
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function isUnder13(month, year) {
  const today = new Date()
  const birthDate = new Date(parseInt(year), parseInt(month) - 1, 1)
  const ageMs = today - birthDate
  const age = ageMs / (365.25 * 24 * 60 * 60 * 1000)
  return age < 13
}

export default function LoginPageClient() {
  const { signUp, logIn, signInWithGoogle, currentUser, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'

  const [tab, setTab]               = useState(defaultTab)
  const [role, setRole]             = useState('student')
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear]   = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [error, setError]           = useState('')
  const [busy, setBusy]             = useState('')  // '' | 'email' | 'google'
  const [phase, setPhase]           = useState('form')  // 'form' | 'consent_pending'
  const [showClassLogin, setShowClassLogin] = useState(false)
  const [classUser, setClassUser]   = useState('')
  const [classPin, setClassPin]     = useState('')
  const emailRef = useRef(null)

  useEffect(() => {
    if (!loading && currentUser) router.replace('/learn')
  }, [currentUser, loading, router])

  // Auto-focus email on tab switch
  useEffect(() => {
    emailRef.current?.focus()
  }, [tab])

  const under13 = tab === 'signup' && role === 'student' && birthMonth && birthYear
    ? isUnder13(birthMonth, birthYear)
    : false

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setError('')
    setBusy('email')

    try {
      if (tab === 'signup') {
        const extra = {}
        if (birthMonth) extra.birth_month = parseInt(birthMonth)
        if (birthYear)  extra.birth_year  = parseInt(birthYear)

        await signUp(name.trim(), email, password, role, extra)

        if (under13 && parentEmail) {
          // Request consent — user ID now set
          const uid = (await import('@/lib/supabase/client'))
            .createClient().auth.getUser().then(r => r.data.user?.id)
          const id = await uid
          if (id) await requestParentConsent(id, parentEmail)
          setPhase('consent_pending')
          return
        }

        router.push('/learn')
      } else if (showClassLogin) {
        const result = await getClassEmail(classUser.trim(), classPin.trim())
        if (result.error) throw new Error(result.error)
        await logIn(result.email, classPin.trim())
        router.push('/learn')
      } else {
        await logIn(email, password)
        router.push('/learn')
      }
    } catch (err) {
      setError(friendlyError(err?.message ?? ''))
    } finally {
      setBusy('')
    }
  }

  async function handleGoogle() {
    if (busy) return
    setBusy('google')
    try {
      await signInWithGoogle()
    } catch {
      setError('Could not sign in with Google.')
      setBusy('')
    }
  }

  function switchTab(t) {
    setTab(t)
    setError('')
    setShowClassLogin(false)
    setPhase('form')
  }

  if (loading) return null

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  if (phase === 'consent_pending') {
    return (
      <div className="lp-root">
        <div className="lp-left">
          <Link href="/" className="lp-brand">in<span>cent</span>ive</Link>
          <div className="lp-tagline">
            <h2>Almost there!</h2>
            <p>A confirmation link is on its way to your parent or guardian.</p>
          </div>
          <img src="/islands/island-0.png" alt="" className="lp-art" />
        </div>
        <div className="lp-right">
          <div className="lp-form-inner lp-almost">
            <h2>Check your inbox</h2>
            <p>
              We sent a link to <strong>{parentEmail}</strong>. Once they approve,
              your progress and streaks will be saved permanently.
            </p>
            <ol className="lp-steps">
              {[
                ['active', 'Email sent'],
                ['', 'Parent approves'],
                ['', 'Progress saved'],
              ].map(([cls, label], i) => (
                <li key={i} className="lp-step">
                  <span className={`lp-step-dot ${cls}`}>{i + 1}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ol>
            <Link href="/learn" className="lp-ghost-btn">Start a lesson while you wait</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lp-root">
      {/* Left branding panel */}
      <div className="lp-left">
        <Link href="/" className="lp-brand">in<span>cent</span>ive</Link>
        <div className="lp-tagline">
          <h2>Build real financial confidence</h2>
          <p>Short lessons, live games, and real skills — all free.</p>
        </div>
        <img src="/islands/island-0.png" alt="" className="lp-art" />
      </div>

      {/* Right form panel */}
      <div className="lp-right">
        <div className="lp-form-inner">

          {/* Tabs */}
          <div className="lp-tabs" role="tablist">
            {['login','signup'].map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`lp-tab${tab === t ? ' active' : ''}`}
                onClick={() => switchTab(t)}
              >
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Role cards (signup only) */}
          {tab === 'signup' && (
            <div className="lp-roles" role="group" aria-label="Select your role">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  className={`lp-role-card${role === r.id ? ' selected' : ''}`}
                  onClick={() => setRole(r.id)}
                  type="button"
                  aria-pressed={role === r.id}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-name">{r.name}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Google */}
          <button
            className="lp-google"
            type="button"
            onClick={handleGoogle}
            disabled={!!busy}
          >
            <GoogleIcon />
            {busy === 'google' ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="lp-or"><span>or</span></div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="lp-fields">

              {tab === 'signup' && (
                <div className="lp-field">
                  <label htmlFor="lp-name">Full name</label>
                  <input
                    id="lp-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Class login fields (login tab only) */}
              {tab === 'login' && showClassLogin ? (
                <>
                  <div className="lp-field">
                    <label htmlFor="lp-class-user">Username</label>
                    <input
                      id="lp-class-user"
                      type="text"
                      placeholder="e.g. AlexD"
                      value={classUser}
                      onChange={e => setClassUser(e.target.value)}
                      required
                    />
                  </div>
                  <div className="lp-field">
                    <label htmlFor="lp-class-pin">PIN</label>
                    <input
                      id="lp-class-pin"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="4-digit PIN"
                      value={classPin}
                      onChange={e => setClassPin(e.target.value.replace(/\D/g,''))}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="lp-field">
                    <label htmlFor="lp-email">Email</label>
                    <input
                      ref={emailRef}
                      id="lp-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="lp-field">
                    <label htmlFor="lp-pw">Password</label>
                    <input
                      id="lp-pw"
                      type="password"
                      placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                    />
                  </div>
                </>
              )}

              {/* Birth date (student signup) */}
              {tab === 'signup' && role === 'student' && (
                <div className="lp-field">
                  <label>Birthday (optional — for content matching)</label>
                  <div className="lp-field-row">
                    <select value={birthMonth} onChange={e => setBirthMonth(e.target.value)}>
                      <option value="">Month</option>
                      {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1)}>{m}</option>
                      ))}
                    </select>
                    <select value={birthYear} onChange={e => setBirthYear(e.target.value)}>
                      <option value="">Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Under-13 warning + parent email */}
              {under13 && (
                <>
                  <div className="lp-under13-warning">
                    Because you&apos;re under 13, we need a parent or guardian&apos;s email to save your progress. Your account will work right away!
                  </div>
                  <div className="lp-field">
                    <label htmlFor="lp-parent-email">Parent or guardian email</label>
                    <input
                      id="lp-parent-email"
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={e => setParentEmail(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

            </div>

            {error && <p className="lp-error">{error}</p>}

            <button
              className="lp-submit"
              type="submit"
              disabled={!!busy}
            >
              {busy === 'email' ? 'Please wait…' : tab === 'login'
                ? (showClassLogin ? 'Log in to class' : 'Log in')
                : `Create ${role} account`
              }
              {!busy && <ArrowRight size={18} strokeWidth={2.5} />}
            </button>
          </form>

          {/* Class login toggle (login tab only) */}
          {tab === 'login' && !showClassLogin && (
            <button
              className="lp-class-toggle"
              type="button"
              onClick={() => { setShowClassLogin(true); setError('') }}
            >
              Log in with a class code instead
            </button>
          )}
          {tab === 'login' && showClassLogin && (
            <button
              className="lp-class-toggle"
              type="button"
              onClick={() => { setShowClassLogin(false); setError('') }}
            >
              Log in with email instead
            </button>
          )}

          {/* Have a code box (signup only) */}
          {tab === 'signup' && (
            <div className="lp-code-box">
              <p>Joining a class or session?</p>
              <Link href="/join">Enter your class code →</Link>
            </div>
          )}

          {/* Switch tab link */}
          <p className="lp-switch">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}>
              {tab === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}
