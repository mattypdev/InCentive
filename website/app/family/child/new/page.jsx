'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createChildAccount } from '@/app/actions/family'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 16 }, (_, i) => CURRENT_YEAR - 5 - i)

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export default function NewChildPage() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [form, setForm] = useState({
    firstName: '',
    birthYear: '',
    birthMonth: '',
    username: '',
    pin: generatePin(),
    guardianConsent: false,
    dataConsent: false,
  })

  function set(key, val) { setForm(p => ({ ...p, [key]: val })) }

  async function handleCreate() {
    if (!form.firstName.trim()) { setError('First name is required'); return }
    if (!form.birthYear || !form.birthMonth) { setError('Birth date is required'); return }
    if (!form.username.trim()) { setError('Username is required'); return }
    if (!form.guardianConsent || !form.dataConsent) { setError('Please confirm both boxes'); return }

    setBusy(true)
    setError('')
    const result = await createChildAccount({
      firstName: form.firstName.trim(),
      birthYear: parseInt(form.birthYear),
      birthMonth: parseInt(form.birthMonth),
      username: form.username.trim(),
      pin: form.pin,
    })
    setBusy(false)

    if (result.error) { setError(result.error); return }
    setSuccess({ firstName: form.firstName, username: form.username, pin: form.pin })
  }

  if (success) {
    return (
      <main className="family-main">
        <div style={{ maxWidth: 480, margin: '40px auto' }}>
          <div className="family-box" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginBottom: 8 }}>
              Account created for {success.firstName}! 🎉
            </h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: 16 }}>
              Save these login details — {success.firstName} will need them to sign in.
            </p>
            <div style={{ background: '#F8F4E8', border: '2px solid var(--foreground)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1.5px dashed #E2DACA', fontSize: 14 }}>
                <span style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>Username</span>
                <strong>{success.username}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>PIN</span>
                <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 22, letterSpacing: '.1em' }}>{success.pin}</strong>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 20 }}>
              To log in: go to incentivefinance.org/login → Log in → Username + PIN tab
            </p>
            <Link href="/family" className="family-btn" style={{ display: 'inline-block' }}>
              Go to {success.firstName}&apos;s journey →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="family-main">
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <Link href="/family/link" style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>
          ← Back
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, margin: '16px 0 6px' }}>
          Create a child account
        </h1>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 24, fontSize: 14 }}>
          For children under 13 whose parent or guardian manages their account.
        </p>

        {error && (
          <div style={{ background: '#FFE4E6', border: '2px solid var(--foreground)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
            {error}
          </div>
        )}

        <div className="family-form-group">
          <label>Child&apos;s first name</label>
          <input className="family-form-input" placeholder="Alex" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="family-form-group">
            <label>Birth month</label>
            <select className="family-form-input" value={form.birthMonth} onChange={e => set('birthMonth', e.target.value)}>
              <option value="">Month</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="family-form-group">
            <label>Birth year</label>
            <select className="family-form-input" value={form.birthYear} onChange={e => set('birthYear', e.target.value)}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="family-form-group">
          <label>Username</label>
          <input className="family-form-input" placeholder="e.g., alex" value={form.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} />
          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>Letters and numbers only. This is how they'll log in.</p>
        </div>

        <div className="family-form-group">
          <label>PIN (4 digits)</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="family-form-input"
              value={form.pin}
              onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              style={{ fontFamily: 'var(--font-heading)', fontSize: 24, letterSpacing: '.2em', width: 120 }}
            />
            <button type="button" className="family-btn ghost" style={{ marginTop: 0, fontSize: 13 }} onClick={() => set('pin', generatePin())}>
              Regenerate
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          {[
            { key: 'guardianConsent', label: 'I am the parent or legal guardian of this child.' },
            { key: 'dataConsent',     label: 'I consent to Incentive collecting limited data about this child\'s learning progress per the Privacy Policy.' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={e => set(key, e.target.checked)}
                style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, lineHeight: 1.4 }}>{label}</span>
            </label>
          ))}
        </div>

        <button
          className="family-btn"
          style={{ width: '100%', fontSize: 16 }}
          onClick={handleCreate}
          disabled={busy}
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </div>
    </main>
  )
}
