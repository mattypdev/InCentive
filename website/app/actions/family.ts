'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ── Create a family link code (teen/student) ──────────────────────────────

export async function createFamilyCode(share: {
  island?: boolean
  streak?: boolean
  scores?: boolean
  rank?: boolean
}): Promise<{ error?: string; code?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const code = `${rand(3)}-${rand(3)}`

  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase.from('link_codes').insert({
    code,
    child_id: user.id,
    share: {
      island: share.island ?? true,
      streak: share.streak ?? true,
      scores: share.scores ?? false,
      rank: share.rank ?? false,
    },
    expires_at,
  })

  if (error) return { error: error.message }
  return { code }
}

// ── Parent redeems a family code ──────────────────────────────────────────

export async function redeemFamilyCode(
  rawCode: string
): Promise<{ error?: string; childName?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const code = rawCode.toUpperCase()
  const { data: linkCode } = await supabase
    .from('link_codes')
    .select('child_id, share, expires_at, used_at')
    .eq('code', code)
    .single()

  if (!linkCode) return { error: 'Code not found' }
  if (linkCode.used_at) return { error: 'Code already used' }
  if (new Date(linkCode.expires_at) < new Date()) return { error: 'Code expired' }
  if (linkCode.child_id === user.id) return { error: 'Cannot link to yourself' }

  const { error: linkError } = await supabase.from('family_links').upsert({
    parent_id: user.id,
    child_id: linkCode.child_id,
    share: linkCode.share,
    status: 'active',
  }, { onConflict: 'parent_id,child_id' })

  if (linkError) return { error: linkError.message }

  await supabase.from('link_codes').update({ used_at: new Date().toISOString() }).eq('code', code)

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', linkCode.child_id)
    .single()

  return { childName: profile?.first_name ?? 'your child' }
}

// ── List linked children for the logged-in parent ─────────────────────────

export async function getLinkedChildren(): Promise<{
  childId: string; name: string; share: Record<string, boolean>; createdAt: string
}[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: links } = await supabase
    .from('family_links')
    .select('child_id, share, created_at')
    .eq('parent_id', user.id)
    .eq('status', 'active')

  if (!links?.length) return []

  const childIds = links.map(l => l.child_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name')
    .in('id', childIds)

  return links.map(l => ({
    childId: l.child_id,
    name: profiles?.find(p => p.id === l.child_id)?.first_name ?? 'Child',
    share: l.share,
    createdAt: l.created_at,
  }))
}

// ── Get family dashboard data for a child ────────────────────────────────

export async function getFamilyChildData(childId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { data: link } = await supabase
    .from('family_links')
    .select('share, status')
    .eq('parent_id', user.id)
    .eq('child_id', childId)
    .single()

  if (!link || link.status !== 'active') return { error: 'Not linked' }

  const [profileRes, streakRes, ledgerRes, attemptsRes, challengesRes] = await Promise.all([
    supabase.from('profiles').select('first_name, chapter_id').eq('id', childId).single(),
    supabase.from('streaks').select('current, longest').eq('user_id', childId).single(),
    supabase.from('wallet_ledger').select('cents').eq('user_id', childId),
    supabase.from('attempts')
      .select('completed_at, lesson_id')
      .eq('user_id', childId)
      .not('completed_at', 'is', null)
      .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('family_challenges')
      .select('*')
      .or(`parent_id.eq.${user.id},child_id.eq.${childId}`)
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const totalCents = (ledgerRes.data ?? []).reduce((s, r) => s + (r.cents ?? 0), 0)

  return {
    profile: profileRes.data,
    share: link.share,
    streak: streakRes.data?.current ?? 0,
    totalCents,
    lessonsThisWeek: attemptsRes.data?.length ?? 0,
    activeChallenge: challengesRes.data?.[0] ?? null,
  }
}

// ── Mark family kit activity as done ("We did it") ──────────────────────

export async function markActivityDone(
  childId: string,
  kitId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase.from('wallet_ledger').insert({
    user_id: childId,
    cents: 50,
    xp: 0,
    reason: 'family_activity',
    ref: kitId,
  })

  if (error && !error.message.includes('unique')) return { error: error.message }
  return {}
}

// ── Start a family challenge ──────────────────────────────────────────────

export async function startChallenge(
  childId: string,
  challengeKey: string,
  challengeTitle: string
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { data, error } = await supabase
    .from('family_challenges')
    .insert({ parent_id: user.id, child_id: childId, challenge_key: challengeKey, challenge_title: challengeTitle })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: data.id }
}

// ── Check in for a challenge day ────────────────────────────────────────

export async function checkIn(
  challengeId: string,
  role: 'parent' | 'child'
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { data: challenge } = await supabase
    .from('family_challenges')
    .select('parent_id, child_id, parent_days, child_days, started_at, completed_at')
    .eq('id', challengeId)
    .single()

  if (!challenge) return { error: 'Not found' }
  if (challenge.completed_at) return {}

  const dayNum = Math.floor((Date.now() - new Date(challenge.started_at).getTime()) / 86400000) + 1
  if (dayNum > 7) return { error: 'Challenge window closed' }

  const field = role === 'parent' ? 'parent_days' : 'child_days'
  const other = role === 'parent' ? 'child_days' : 'parent_days'
  const current: number[] = challenge[field] ?? []
  if (current.includes(dayNum)) return {}

  const updated = [...current, dayNum]
  const otherDays: number[] = challenge[other] ?? []
  const update: Record<string, unknown> = { [field]: updated }

  if (updated.length === 7 && otherDays.length === 7) {
    update.completed_at = new Date().toISOString()
    await supabase.from('wallet_ledger').insert({
      user_id: challenge.child_id,
      cents: 150,
      xp: 0,
      reason: 'family_challenge',
      ref: challengeId,
    })
  }

  const { error } = await supabase.from('family_challenges').update(update).eq('id', challengeId)
  if (error) return { error: error.message }
  return {}
}

// ── Create under-13 child account (parent creates) ────────────────────────

export async function createChildAccount(input: {
  firstName: string
  birthYear: number
  birthMonth: number
  username: string
  pin: string
}): Promise<{ error?: string; childId?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const admin = createAdminClient()
  const email = `${input.username.toLowerCase().replace(/\s+/g, '')}@family.incentivefinance.org`

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: input.pin,
    email_confirm: true,
    user_metadata: { first_name: input.firstName },
  })

  if (authError || !authData?.user) return { error: authError?.message ?? 'Could not create account' }

  await admin.from('profiles').update({
    first_name: input.firstName,
    birth_year: input.birthYear,
    birth_month: input.birthMonth,
    consent_status: 'approved',
    class_email: email,
    class_pin: input.pin,
    is_class_account: true,
  }).eq('id', authData.user.id)

  await supabase.from('family_links').insert({
    parent_id: user.id,
    child_id: authData.user.id,
    share: { island: true, streak: true, scores: true, rank: true },
    status: 'active',
  })

  return { childId: authData.user.id }
}

// ── Update sharing settings ───────────────────────────────────────────────

export async function updateSharing(
  childId: string,
  share: Record<string, boolean>
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase
    .from('family_links')
    .update({ share })
    .eq('parent_id', user.id)
    .eq('child_id', childId)

  if (error) return { error: error.message }
  return {}
}
