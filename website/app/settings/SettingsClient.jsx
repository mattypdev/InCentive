'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import './Settings.css'

const SOUND_KEY = 'incentive_sound_enabled'
function readSound() { try { const v = localStorage.getItem(SOUND_KEY); return v === null ? true : v === 'true' } catch { return true } }
function writeSound(v) { try { localStorage.setItem(SOUND_KEY, String(v)) } catch {} }

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Phoenix',
]

export default function SettingsClient() {
  const { currentUser, profile, logOut, refreshProfile, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [name, setName]           = useState('')
  const [timezone, setTimezone]   = useState('America/Los_Angeles')
  const [sound, setSound]         = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Link email (class accounts only)
  const [linkEmail, setLinkEmail]       = useState('')
  const [linkPassword, setLinkPassword] = useState('')
  const [linking, setLinking]           = useState(false)
  const [linkMsg, setLinkMsg]           = useState('')
  const [linkError, setLinkError]       = useState('')

  useEffect(() => {
    if (!profile) return
    setName(profile.name ?? '')
    setTimezone(profile.timezone ?? 'America/Los_Angeles')
  }, [profile])

  useEffect(() => {
    setSound(readSound())
  }, [])

  useEffect(() => {
    if (!loading && !currentUser) router.replace('/login')
  }, [currentUser, loading, router])

  if (!currentUser) return null

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    const { error } = await supabase.from('profiles').upsert({
      id: currentUser.id,
      name: name.trim(),
      timezone,
    }, { onConflict: 'id' })
    writeSound(sound)
    if (error) {
      setSaveError(error.message || 'Could not save — please try again.')
      setSaving(false)
      return
    }
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDownload() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single()
    const { data: attempts } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', currentUser.id)
    const blob = new Blob([JSON.stringify({ profile: data, attempts }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'incentive-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleLinkEmail(e) {
    e.preventDefault()
    setLinkError('')
    setLinkMsg('')
    if (!linkEmail.trim() || !linkPassword) return
    if (linkPassword.length < 6) { setLinkError('Password must be at least 6 characters.'); return }
    setLinking(true)
    const { error } = await supabase.auth.updateUser({
      email: linkEmail.trim(),
      password: linkPassword,
    })
    if (error) {
      setLinkError(error.message.includes('already') ? 'That email is already in use.' : 'Could not link email. Try again.')
      setLinking(false)
      return
    }
    // Mark account as no longer class-only
    await supabase.from('profiles').update({ is_class_account: false }).eq('id', currentUser.id)
    await refreshProfile()
    setLinking(false)
    setLinkEmail('')
    setLinkPassword('')
    setLinkMsg('Email linked! Check your inbox to confirm the address.')
  }

  async function handleDelete() {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    await logOut()
    router.push('/')
  }

  return (
    <div className="settings-page container">
      <h1>Settings</h1>

      <section className="settings-section">
        <h2>Profile</h2>
        <form className="settings-form" onSubmit={handleSave}>
          <div className="settings-field">
            <label htmlFor="set-name">Display name</label>
            <input
              id="set-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="settings-field">
            <label htmlFor="set-tz">Timezone</label>
            <select id="set-tz" value={timezone} onChange={e => setTimezone(e.target.value)}>
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="settings-toggle-row">
            <label htmlFor="set-sound">Sound effects</label>
            <button
              id="set-sound"
              type="button"
              role="switch"
              aria-checked={sound}
              className={`settings-toggle ${sound ? 'on' : ''}`}
              onClick={() => setSound(v => !v)}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>
          {saveError && <p className="settings-error">{saveError}</p>}
          <button className="settings-save-btn" type="submit" disabled={saving}>
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      {profile?.is_class_account && (
        <section className="settings-section">
          <h2>Link an email</h2>
          <p className="settings-hint">
            You signed in with a class PIN. Add a real email and password so you can log in from any device — your progress stays intact.
          </p>
          <form className="settings-form" onSubmit={handleLinkEmail}>
            <div className="settings-field">
              <label htmlFor="link-email">Email</label>
              <input
                id="link-email"
                type="email"
                placeholder="you@example.com"
                value={linkEmail}
                onChange={e => setLinkEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="settings-field">
              <label htmlFor="link-password">New password</label>
              <input
                id="link-password"
                type="password"
                placeholder="At least 6 characters"
                value={linkPassword}
                onChange={e => setLinkPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            {linkError && <p className="settings-error">{linkError}</p>}
            {linkMsg   && <p className="settings-success">{linkMsg}</p>}
            <button className="settings-save-btn" type="submit" disabled={linking}>
              {linking ? 'Linking…' : 'Link email'}
            </button>
          </form>
        </section>
      )}

      <section className="settings-section">
        <h2>Account</h2>
        <p className="settings-email">{currentUser.email}</p>
        <div className="settings-account-actions">
          <button className="settings-link-btn" onClick={handleDownload} type="button">
            Download my data (JSON)
          </button>
          <button
            className={`settings-delete-btn ${deleteConfirm ? 'confirm' : ''}`}
            onClick={handleDelete}
            type="button"
          >
            {deleteConfirm ? 'Are you sure? Click again to confirm' : 'Delete account'}
          </button>
        </div>
      </section>
    </div>
  )
}
