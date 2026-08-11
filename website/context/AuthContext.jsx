'use client'
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { allUnits } from '@/data/levels'
import { clearStoredProgress } from '@/lib/guestProgress'
import { clearShopData } from '@/lib/shop'
import { loadShopFromCloud } from '@/lib/shopSync'

const AuthContext = createContext(null)

// ── Cache helpers ──────────────────────────────────────────────────────────
// We persist { userId, profile } to localStorage so the navbar and any other
// auth-aware UI can restore the correct state synchronously before the first
// paint, avoiding any flash of the wrong (guest) state on reload.

const CACHE_KEY = 'incentive_auth_cache'

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') }
  catch { return null }
}

function writeCache(userId, profile) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ userId, profile })) }
  catch {}
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

// ── XP helpers ────────────────────────────────────────────────────────────

const rewardMap = {}
allUnits.forEach(u => {
  rewardMap[u.id] = u.centsReward ?? 0
  if (u.lessons) u.lessons.forEach(l => { rewardMap[l.id] = l.centsReward ?? 0 })
})

function computeXP(rows) {
  let total = 0
  rows.forEach(r => {
    const pct = (r.score ?? 0) / 100
    if (rewardMap[r.lesson_id] !== undefined) {
      total += Math.round(rewardMap[r.lesson_id] * pct)
    } else if (r.lesson_id === 'capstone') {
      total += Math.round(200 * pct)
    } else if (r.lesson_id.endsWith('-test')) {
      total += Math.round(100 * pct)
    }
  })
  return total
}

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile,     setProfile]     = useState(null)
  const [loading,     setLoading]     = useState(true)
  const supabase = createClient()

  // Restore cached state before the browser paints so the UI is immediately
  // correct on reload. useLayoutEffect fires synchronously after the DOM is
  // updated but before paint — no flash of the guest state.
  useLayoutEffect(() => {
    const cached = readCache()
    if (cached?.userId) {
      setCurrentUser(prev => prev ?? { id: cached.userId })
      if (cached.profile) setProfile(prev => prev ?? cached.profile)
    }
  }, [])

  async function fetchProfile(userId) {
    const [{ data: profileData }, { data: progressData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('lesson_progress').select('lesson_id, score').eq('user_id', userId).eq('completed', true),
    ])
    const xp      = progressData ? computeXP(progressData) : 0
    const updated = { ...(profileData ?? {}), xp }
    setProfile(updated)
    writeCache(userId, updated)
    loadShopFromCloud(userId)
  }

  async function ensureProfile(user) {
    const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single()
    if (!existing) {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || ''
      await supabase.from('profiles').upsert({ id: user.id, name }, { onConflict: 'id' })
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null
      setCurrentUser(user)
      if (user) {
        await ensureProfile(user)
        fetchProfile(user.id)
      } else {
        // Session gone — wipe cached state so a stale cache doesn't linger
        setProfile(null)
        clearCache()
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setCurrentUser(session?.user ?? null)
      if (session?.user) {
        if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
          await ensureProfile(session.user)
          if (_event === 'SIGNED_IN' && session.user.app_metadata?.provider !== 'email') {
            window.location.href = '/learn'
          }
        }
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        clearCache()
        clearStoredProgress()
        clearShopData()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (!data.session) throw new Error('CHECK_EMAIL')
    await supabase.from('profiles').upsert({ id: data.user.id, name }, { onConflict: 'id' })
    await fetchProfile(data.user.id)
  }

  async function logIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.user) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('id', data.user.id).single()
      if (!existing) {
        await supabase.from('profiles').insert({ id: data.user.id, name: data.user.email.split('@')[0] })
      }
      setCurrentUser(data.user)
      await fetchProfile(data.user.id)
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw error
  }

  async function logOut() {
    await supabase.auth.signOut()
    clearCache()
  }

  async function refreshProfile() { if (currentUser) await fetchProfile(currentUser.id) }

  function bumpXP(amount) {
    setProfile(prev => prev ? { ...prev, xp: (prev.xp ?? 0) + amount } : { xp: amount })
  }

  function setXP(amount) {
    setProfile(prev => prev ? { ...prev, xp: amount } : { xp: amount })
  }

  return (
    <AuthContext.Provider value={{ currentUser, profile, loading, signUp, logIn, logOut, signInWithGoogle, refreshProfile, bumpXP, setXP }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export function useAuth() {
  return useContext(AuthContext)
}
