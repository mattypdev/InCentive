'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { lookupClassCode, joinClass } from '@/app/actions/auth'
import './Join.css'

export default function JoinClient() {
  const { logIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefill = searchParams.get('code') ?? ''

  const [digits, setDigits]       = useState(['','','',''])
  const [group, setGroup]         = useState(null)   // { id, name, code }
  const [lookupBusy, setLookupBusy] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastInitial, setLastInitial] = useState('')
  const [joinBusy, setJoinBusy]   = useState(false)
  const [joinError, setJoinError] = useState('')
  const [done, setDone]           = useState(null)  // { pin, email }
  const refs = [useRef(), useRef(), useRef(), useRef()]

  // Pre-fill from URL
  useEffect(() => {
    if (prefill.length === 4) {
      const chars = prefill.toUpperCase().split('').slice(0, 4)
      while (chars.length < 4) chars.push('')
      setDigits(chars)
    }
  }, [prefill])

  // Auto-lookup when all 4 digits filled
  const code = digits.join('')
  useEffect(() => {
    if (code.length < 4) { setGroup(null); setLookupError(''); return }
    let cancelled = false
    async function lookup() {
      setLookupBusy(true)
      setLookupError('')
      const result = await lookupClassCode(code)
      if (cancelled) return
      setLookupBusy(false)
      if (result.error) { setLookupError(result.error); setGroup(null) }
      else setGroup(result.group)
    }
    lookup()
    return () => { cancelled = true }
  }, [code])

  function handleDigit(i, val) {
    const ch = val.replace(/[^A-Za-z0-9]/g, '').slice(-1).toUpperCase()
    const next = [...digits]
    next[i] = ch
    setDigits(next)
    if (ch && i < 3) refs[i + 1].current?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
    if (e.key === 'ArrowLeft' && i > 0) refs[i - 1].current?.focus()
    if (e.key === 'ArrowRight' && i < 3) refs[i + 1].current?.focus()
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4)
    if (text.length > 0) {
      const next = ['','','','']
      text.split('').forEach((c, i) => { next[i] = c })
      setDigits(next)
      refs[Math.min(text.length, 3)].current?.focus()
      e.preventDefault()
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!group || joinBusy) return
    setJoinBusy(true)
    setJoinError('')
    const result = await joinClass(code, firstName.trim(), lastInitial.trim())
    if (result.error) {
      setJoinError(result.error)
      setJoinBusy(false)
      return
    }
    // Auto sign-in
    try {
      await logIn(result.email, result.pin)
    } catch {
      // Still show success even if auto-login fails
    }
    setDone({ pin: result.pin, email: result.email })
    setJoinBusy(false)
  }

  if (done) {
    return (
      <div className="join-page">
        <div className="join-card">
          <div className="join-success-icon"><CheckCircle2 size={40} /></div>
          <h1>You&apos;re in!</h1>
          <p className="join-success-msg">
            You&apos;ve joined <strong>{group?.name}</strong>. Your PIN is <strong className="join-pin">{done.pin}</strong> — remember it for next time.
          </p>
          <Link href="/learn" className="join-cta">
            Start learning <ArrowRight size={18} />
          </Link>
          <p className="join-pin-note">
            To log in later: use &ldquo;Log in with a class code&rdquo; on the sign-in page.<br />
            Username: <strong>{firstName}{lastInitial.toUpperCase()}</strong> &nbsp;·&nbsp; PIN: <strong>{done.pin}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <Link href="/login" className="join-back">← Back to sign in</Link>
        <h1>Join a class</h1>
        <p className="join-sub">Enter the 4-character code your teacher gave you.</p>

        {/* Code input */}
        <div className="join-code-inputs" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="join-digit"
              type="text"
              inputMode="text"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              aria-label={`Code character ${i + 1}`}
            />
          ))}
        </div>

        {/* Found banner */}
        {lookupBusy && <p className="join-lookup-msg">Looking up…</p>}
        {lookupError && <p className="join-lookup-error">{lookupError}</p>}
        {group && (
          <div className="join-found-banner">
            <CheckCircle2 size={16} />
            Found: <strong>{group.name}</strong>
          </div>
        )}

        {/* Name fields */}
        {group && (
          <form className="join-name-form" onSubmit={handleJoin}>
            <div className="join-name-row">
              <div className="join-field">
                <label htmlFor="join-first">First name</label>
                <input
                  id="join-first"
                  type="text"
                  placeholder="Alex"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>
              <div className="join-field">
                <label htmlFor="join-last">Last initial</label>
                <input
                  id="join-last"
                  type="text"
                  placeholder="D"
                  value={lastInitial}
                  onChange={e => setLastInitial(e.target.value.slice(0,1).toUpperCase())}
                  required
                  maxLength={1}
                />
              </div>
            </div>

            {joinError && <p className="join-error">{joinError}</p>}

            <button className="join-submit" type="submit" disabled={joinBusy}>
              {joinBusy ? 'Joining…' : 'Join class'}
              {!joinBusy && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
