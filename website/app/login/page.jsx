'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

// Login is a modal now. Old /login links and auth-guarded pages land here,
// get sent to the homepage, and see the login modal pop open.
export default function LoginRedirect() {
  const { currentUser, loading, openLogin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (currentUser) {
      router.replace('/learn')
    } else {
      openLogin()
      router.replace('/')
    }
  }, [currentUser, loading, openLogin, router])

  return null
}
