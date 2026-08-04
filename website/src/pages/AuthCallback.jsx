import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    // With implicit flow, the session is in the URL hash.
    // Supabase detects it automatically — just wait for the auth state.
    const errParam = new URLSearchParams(window.location.search).get('error_description')
      || new URLSearchParams(window.location.search).get('error')
    if (errParam) { setError(errParam); return }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        subscription.unsubscribe()
        navigate('/learn', { replace: true })
      }
    })

    // Also check if a session already exists (hash already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        navigate('/learn', { replace: true })
      }
    })

    const timeout = setTimeout(() => {
      subscription.unsubscribe()
      setError('Sign-in timed out. Make sure https://incentivefinance.org/auth/callback is in your Supabase redirect URL allowlist.')
    }, 8000)

    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [navigate])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100dvh', gap: 16, padding: '0 24px',
      fontFamily: 'var(--font-heading)', color: 'var(--foreground)', textAlign: 'center'
    }}>
      {error ? (
        <>
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Sign-in failed</p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', maxWidth: 420 }}>{error}</p>
          <a href="/" style={{ color: 'var(--accent)', fontWeight: 700 }}>Go home</a>
        </>
      ) : (
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Signing you in…</p>
      )}
    </div>
  )
}
