'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = createClient()

    const errParam = new URLSearchParams(window.location.search).get('error_description')
      || new URLSearchParams(window.location.search).get('error')
    if (errParam) { setError(errParam); return }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        subscription.unsubscribe()
        router.replace('/learn')
      }
    })

    // Also check if a session already exists (hash already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        router.replace('/learn')
      }
    })

    const timeout = setTimeout(() => {
      subscription.unsubscribe()
      setError('Sign-in timed out. Make sure https://incentivefinance.org/auth/callback is in your Supabase redirect URL allowlist.')
    }, 8000)

    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [router])

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
