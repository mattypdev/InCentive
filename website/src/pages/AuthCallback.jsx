import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code  = params.get('code')
    const errMsg = params.get('error_description') || params.get('error')

    if (errMsg) {
      setError(errMsg)
      return
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error: err }) => {
          if (err) { setError(err.message); return }
          if (data?.session) navigate('/learn', { replace: true })
          else setError('No session returned — check Supabase email confirmation settings.')
        })
    } else {
      // No code in URL — fall back to checking existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) navigate('/learn', { replace: true })
        else setError('No auth code in URL. Make sure the redirect URL in Supabase matches exactly: ' + window.location.origin + '/auth/callback')
      })
    }
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
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', maxWidth: 400 }}>{error}</p>
          <a href="/" style={{ color: 'var(--accent)', fontWeight: 700 }}>Go home</a>
        </>
      ) : (
        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Signing you in…</p>
      )}
    </div>
  )
}
