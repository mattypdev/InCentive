'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSession } from '@/app/actions/host'

const AUDIENCES = ['Middle school', 'High school', 'Adults', 'Mixed']
const LENGTHS   = [30, 45, 60]
const DEVICES   = ['Phones', 'Computers', 'Paper only', 'Mixed']

function buildRunOfShow(topic, lengthMin, enableCheck) {
  const segments = []
  if (enableCheck) segments.push({ type: 'before_check', label: 'Before-check', min: 5 })
  segments.push({ type: 'welcome',   label: 'Welcome',   min: 3 })
  segments.push({ type: 'story',     label: 'Story',     min: Math.max(5, Math.round(lengthMin * 0.2)) })
  segments.push({ type: 'live_game', label: 'Live game', min: Math.max(10, Math.round(lengthMin * 0.4)) })
  segments.push({ type: 'activity',  label: 'Activity',  min: Math.max(5, Math.round(lengthMin * 0.2)) })
  if (enableCheck) segments.push({ type: 'after_check', label: 'After-check', min: 5 })
  segments.push({ type: 'money_move', label: 'Money Move', min: 3 })
  return segments.map(s => ({ ...s, topic }))
}

export default function SessionBuilderClient() {
  const router = useRouter()
  const [topic, setTopic]           = useState('')
  const [audience, setAudience]     = useState('High school')
  const [lengthMin, setLengthMin]   = useState(45)
  const [devices, setDevices]       = useState('Phones')
  const [groupSize, setGroupSize]   = useState(25)
  const [enableCheck, setEnableCheck] = useState(true)
  const [busy, setBusy]             = useState(false)
  const [error, setError]           = useState('')

  const runOfShow = buildRunOfShow(topic || 'Session', lengthMin, enableCheck)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!topic.trim()) { setError('Please enter a topic.'); return }
    setBusy(true)
    setError('')

    const result = await createSession({
      topic: topic.trim(),
      audience,
      lengthMin,
      devices,
      groupSize,
      enableCheck,
      questionIds: [],
      checkQuestionIds: [],
      runOfShow,
    })

    if (result.error) {
      setError(result.error)
      setBusy(false)
      return
    }

    router.push(`/host/sessions/${result.sessionId}/console`)
  }

  return (
    <>
      <h1 className="host-page-title">New session</h1>
      <p className="host-page-sub">Configure your session and we'll build the run-of-show.</p>

      <form className="host-builder-form" onSubmit={handleSubmit}>
        <div className="host-form-field full">
          <label htmlFor="sb-topic">Topic</label>
          <input
            id="sb-topic"
            type="text"
            placeholder="e.g. Credit cards and minimum payments"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
          />
        </div>

        <div className="host-form-field">
          <label>Audience</label>
          <div className="host-pills">
            {AUDIENCES.map(a => (
              <button
                key={a}
                type="button"
                className={`host-pill${audience === a ? ' selected' : ''}`}
                onClick={() => setAudience(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="host-form-field">
          <label>Length (minutes)</label>
          <div className="host-pills">
            {LENGTHS.map(l => (
              <button
                key={l}
                type="button"
                className={`host-pill${lengthMin === l ? ' selected' : ''}`}
                onClick={() => setLengthMin(l)}
              >
                {l} min
              </button>
            ))}
          </div>
        </div>

        <div className="host-form-field">
          <label>Devices</label>
          <div className="host-pills">
            {DEVICES.map(d => (
              <button
                key={d}
                type="button"
                className={`host-pill${devices === d ? ' selected' : ''}`}
                onClick={() => setDevices(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="host-form-field">
          <label htmlFor="sb-size">Group size (est.)</label>
          <input
            id="sb-size"
            type="number"
            min={1}
            max={300}
            value={groupSize}
            onChange={e => setGroupSize(Number(e.target.value))}
          />
        </div>

        <div className="host-toggle-row full">
          <div>
            <div className="host-toggle-label">Before &amp; after check</div>
            <div className="host-toggle-sub">3 questions each — shows learning gain in the report</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enableCheck}
            className={`settings-toggle ${enableCheck ? 'on' : ''}`}
            onClick={() => setEnableCheck(v => !v)}
          >
            <span className="settings-toggle-knob" />
          </button>
        </div>

        {/* Run-of-show preview */}
        <div className="host-form-field full">
          <label>Run of show</label>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '14px',
            background: 'var(--muted)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}>
            {runOfShow.map((seg, i) => (
              <div key={i} style={{
                padding: '8px 14px',
                background: 'var(--card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontSize: 'var(--text-sm)',
              }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{seg.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{seg.min} min</div>
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 700, gridColumn: '1/-1' }}>{error}</p>}

        <div className="host-submit-row">
          <button className="host-submit-btn" type="submit" disabled={busy}>
            {busy ? 'Creating…' : 'Create session'}
          </button>
          <Link href="/host" className="host-secondary-btn">Cancel</Link>
        </div>
      </form>
    </>
  )
}
