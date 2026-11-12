'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClass } from '@/app/actions/teach'
import '@/app/teach/Teach.css'

export default function NewClassPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const firstName = profile?.first_name ?? 'there'

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [period, setPeriod] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Class name is required'); return }
    setBusy(true)
    const result = await createClass({ name: name.trim(), period: period.trim() || undefined })
    setBusy(false)
    if (result.error) { setError(result.error); return }
    router.push(`/teach?class=${result.groupId}`)
  }

  return (
    <div className="teach-layout" style={{ background: 'var(--t-bg, #FFFDF5)', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ width: '100%', maxWidth: 520, padding: '48px 24px' }}>

        {/* Greeting */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h1 style={{
            fontFamily: 'var(--font-heading, Outfit, sans-serif)',
            fontSize: 30,
            fontWeight: 800,
            color: 'var(--t-ink, #1E293B)',
            marginBottom: 8,
          }}>
            Hi {firstName}!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--t-mute, #475569)', lineHeight: 1.6 }}>
            Let's set up your first class. Students will join with a code you can share.
          </p>
        </div>

        {/* Form card */}
        <div className="t-card" style={{ padding: 28 }}>
          <form onSubmit={handleCreate}>
            {error && (
              <div style={{
                background: '#FFE4E6',
                border: '2px solid var(--t-ink, #1E293B)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 20,
                fontWeight: 600,
                fontSize: 14,
                color: '#9F1239',
              }}>
                {error}
              </div>
            )}

            <div className="t-form-group">
              <label className="t-label">
                Class name <span style={{ color: '#FF6F61' }}>*</span>
              </label>
              <input
                className="t-input"
                placeholder="e.g., Personal Finance, Period 2"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="t-form-group" style={{ marginBottom: 24 }}>
              <label className="t-label" style={{ display: 'flex', gap: 6 }}>
                Period
                <span style={{ fontWeight: 400, color: 'var(--t-mute, #475569)' }}>(optional)</span>
              </label>
              <input
                className="t-input"
                placeholder="e.g., Period 3"
                value={period}
                onChange={e => setPeriod(e.target.value)}
              />
            </div>

            <button
              className="t-btn"
              type="submit"
              disabled={busy}
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, minHeight: 48 }}
            >
              {busy ? 'Creating class…' : 'Create class →'}
            </button>
          </form>
        </div>

        {/* What happens next */}
        <div className="t-dashed-card" style={{ marginTop: 20, textAlign: 'center', fontSize: 13 }}>
          After creating your class you'll get a join code to share with students,
          then you can assign lessons and track their progress.
        </div>

      </main>
    </div>
  )
}
