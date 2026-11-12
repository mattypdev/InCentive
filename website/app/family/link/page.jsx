'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { redeemFamilyCode } from '@/app/actions/family'

export default function FamilyLinkPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleRedeem() {
    if (code.length < 6) { setError('Enter a 6-character code'); return }
    setBusy(true)
    setError('')
    const result = await redeemFamilyCode(code)
    setBusy(false)
    if (result.error) { setError(result.error); return }
    setSuccess(result.childName ?? 'your child')
  }

  if (success) {
    return (
      <main className="family-main">
        <div style={{ maxWidth: 440, margin: '40px auto' }}>
          <div className="family-box" style={{ textAlign: 'center', padding: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 8 }}>
              Linked to {success}!
            </h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: 20 }}>
              You can now follow {success}&apos;s money learning journey. They control what you see.
            </p>
            <Link href="/family" className="family-btn" style={{ display: 'inline-block' }}>
              Go to {success}&apos;s journey →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="family-main">
      <div style={{ maxWidth: 440, margin: '40px auto' }}>
        <Link href="/family" style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>
          ← Back
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, margin: '16px 0 6px' }}>
          Enter a family code
        </h1>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 24 }}>
          Ask your child to go to their Wallet → Family → Add a parent to get their code.
        </p>

        <div className="family-form-group">
          <label>Family code</label>
          <input
            className="family-form-input"
            placeholder="e.g., FM7-K2P"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            maxLength={7}
            style={{ fontSize: 24, letterSpacing: '.12em', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800 }}
          />
        </div>

        {error && (
          <div style={{ background: '#FFE4E6', border: '2px solid var(--foreground)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          className="family-btn"
          style={{ width: '100%', fontSize: 16 }}
          onClick={handleRedeem}
          disabled={busy || code.length < 6}
        >
          {busy ? 'Linking…' : 'Link accounts'}
        </button>

        <div style={{ marginTop: 20, borderTop: '1.5px dashed #E2DACA', paddingTop: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 10 }}>
            Creating an account for a child under 13?
          </p>
          <Link href="/family/child/new" className="family-btn ghost" style={{ fontSize: 14 }}>
            Create under-13 account
          </Link>
        </div>
      </div>
    </main>
  )
}
