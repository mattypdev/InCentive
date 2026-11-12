'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClass } from '@/app/actions/teach'

export default function NewClassPage() {
  const router = useRouter()
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
    <div className="teach-layout">
      <aside className="teach-sidebar">
        <div className="teach-class-box">
          <span className="teach-class-name" style={{ color: 'var(--muted-foreground)' }}>New class</span>
        </div>
        <Link href="/teach" className="teach-nav-link">← Back to hub</Link>
      </aside>
      <main className="teach-main">
        <div className="teach-h1row" style={{ marginBottom: 24 }}>
          <h1>Create a class</h1>
        </div>

        <form className="teach-wizard" onSubmit={handleCreate}>
          {error && (
            <div style={{ background: '#FFE4E6', border: '2px solid var(--foreground)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
              {error}
            </div>
          )}

          <div className="teach-form-group">
            <label>Class name <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input
              className="teach-form-input"
              placeholder="e.g., Personal Finance"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="teach-form-group">
            <label>Period <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>(optional)</span></label>
            <input
              className="teach-form-input"
              placeholder="e.g., Period 3"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Link href="/teach" className="teach-btn ghost">Cancel</Link>
            <button className="teach-btn" type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create class →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
