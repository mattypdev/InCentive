import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message)
        return
      }
      if (session) {
        navigate('/learn', { replace: true })
      } else {
        // Session not ready yet — listen for it
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
          if (s) {
            subscription.unsubscribe()
            navigate('/learn', { replace: true })
          }
        })
        // Fallback if nothing fires after 5s
        setTimeout(() => {
          subscription.unsubscribe()
          navigate('/', { replace: true })
        }, 5000)
      }
    })
  }, [navigate])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100dvh', gap: 16,
      fontFamily: 'var(--font-heading)', color: 'var(--foreground)'
    }}>
      {error
        ? <><p style={{ fontWeight: 700 }}>Sign-in failed</p><p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>{error}</p><a href="/" style={{ color: 'var(--accent)' }}>Go home</a></>
        : <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Signing you in…</p>
      }
    </div>
  )
}
