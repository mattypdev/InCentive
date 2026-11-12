'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getClassEmail } from '@/app/actions/auth'
import './LoginModal.css'
import './Button.css'

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

const TABS = [
  { key: 'student', label: 'Student' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'signup',  label: 'Sign up' },
]

// Rendered once in the root layout; opened via openLogin() from useAuth().
export default function LoginModal() {
  const { loginOpen, closeLogin } = useAuth()
  if (!loginOpen) return null
  return <LoginDialog onClose={closeLogin} />
}

function LoginDialog({ onClose }) {
  const { signUp, logIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [tab, setTab]                   = useState('student')
  const [teacherMode, setTeacherMode]   = useState('login') // 'login' | 'signup'
  const [studentMode, setStudentMode]   = useState('email') // 'email' | 'pin'
  const [name, setName]                 = useState('')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [pinUsername, setPinUsername]   = useState('')
  const [pin, setPin]                   = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const emailRef = useRef(null)
  const pinRef = useRef(null)

  const isTeacher       = tab === 'teacher'
  const isTeacherSignup = isTeacher && teacherMode === 'signup'
  const isSignup        = tab === 'signup' || isTeacherSignup

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    emailRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  function switchTab(key) {
    setTab(key)
    setTeacherMode('login')
    setStudentMode('email')
    setError('')
    setName('')
    setEmail('')
    setPassword('')
    setPinUsername('')
    setPin('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'student' && studentMode === 'pin') {
        const result = await getClassEmail(pinUsername.trim(), pin.trim())
        if (result.error) throw new Error(result.error)
        await logIn(result.email, pin.trim())
        onClose()
        router.push('/learn')
      } else if (isTeacherSignup) {
        await signUp(name.trim(), email, password, 'teacher')
        onClose()
        router.push('/teach')
      } else if (tab === 'signup') {
        await signUp(name.trim(), email, password)
        onClose()
        router.push('/learn')
      } else {
        await logIn(email, password, isTeacher ? 'teacher' : undefined)
        onClose()
        router.push(isTeacher ? '/teach' : '/learn')
      }
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      setError('Could not sign in with Google.')
      setGoogleLoading(false)
    }
  }

  const headings = {
    student:       { title: 'Log in to learn',          sub: 'Pick up right where your streak left off.' },
    studentPin:    { title: 'Log in with class PIN',     sub: 'Enter the username and PIN your teacher gave you.' },
    teacher:       { title: 'Teacher sign in',           sub: 'Access your classes, gradebook, and lesson kits.' },
    teacherSignup: { title: 'Create a teacher account',  sub: 'Set up your classroom and assign lessons.' },
    signup:        { title: 'Create your account',       sub: 'Start building real financial confidence today.' },
  }

  const heading = isTeacherSignup ? headings.teacherSignup
    : (tab === 'student' && studentMode === 'pin') ? headings.studentPin
    : headings[tab]

  return (
    <div className="login-overlay" onMouseDown={onClose}>
      <div
        className="login-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onMouseDown={e => e.stopPropagation()}
      >
        <button type="button" className="login-close" onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="login-header">
          <div className="login-brand">in<span>cent</span>ive</div>

          <div className="login-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                type="button"
                className={`login-tab${tab === t.key ? ' active' : ''}`}
                onClick={() => switchTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <h2 id="login-title">{heading.title}</h2>
          <p>{heading.sub}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {tab === 'student' && studentMode === 'pin' ? (
            <>
              <div className="login-field">
                <label htmlFor="login-username">Username</label>
                <input
                  ref={pinRef}
                  id="login-username"
                  type="text"
                  placeholder="e.g. sathvik.65an"
                  value={pinUsername}
                  onChange={e => setPinUsername(e.target.value)}
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-pin">PIN</label>
                <input
                  id="login-pin"
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                  required
                  autoComplete="one-time-code"
                  style={{ letterSpacing: 4, fontWeight: 700 }}
                />
              </div>
            </>
          ) : (
            <>
              {isSignup && (
                <div className="login-field">
                  <label htmlFor="login-name">Full name</label>
                  <input
                    id="login-name"
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
                <label htmlFor="login-email">Email</label>
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  placeholder={isTeacher ? 'your.name@school.edu' : 'you@example.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
              </div>
            </>
          )}

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit btn btn-primary" type="submit" disabled={loading}>
            <span className="btn-label">
              {loading ? 'Please wait…' : isTeacherSignup ? 'Create teacher account' : tab === 'signup' ? 'Create account' : 'Log in'}
            </span>
            {!loading && <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>}
          </button>
        </form>

        {!(tab === 'student' && studentMode === 'pin') && (
          <>
            <div className="login-divider"><span>or</span></div>
            <button className="login-google-btn" type="button" disabled={googleLoading} onClick={handleGoogle}>
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>
          </>
        )}

        {isTeacher && (
          <p className="login-switch" style={{ marginTop: 16 }}>
            {isTeacherSignup ? 'Already have an account? ' : 'New teacher? '}
            <button type="button" onClick={() => { setTeacherMode(isTeacherSignup ? 'login' : 'signup'); setError(''); setName(''); setEmail(''); setPassword('') }}>
              {isTeacherSignup ? 'Log in' : 'Sign up'}
            </button>
          </p>
        )}

        {tab === 'student' && (
          <p className="login-switch">
            {studentMode === 'pin' ? 'Have an email? ' : 'Using a class PIN? '}
            <button type="button" onClick={() => { setStudentMode(studentMode === 'pin' ? 'email' : 'pin'); setError(''); setPinUsername(''); setPin(''); setEmail(''); setPassword('') }}>
              {studentMode === 'pin' ? 'Log in with email' : 'Log in with PIN'}
            </button>
          </p>
        )}

        {tab === 'signup' && (
          <p className="login-switch">
            Already have an account?{' '}
            <button type="button" onClick={() => switchTab('student')}>Log in</button>
          </p>
        )}
      </div>
    </div>
  )
}
