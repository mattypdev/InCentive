'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ── Class join ────────────────────────────────────────────────────────────────

export async function lookupClassCode(code: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, code')
    .eq('code', code.toUpperCase())
    .eq('kind', 'class')
    .is('archived_at', null)
    .single()
  if (error || !data) return { error: 'Class not found. Check the code and try again.' }
  return { group: data }
}

export async function joinClass(
  code: string,
  firstName: string,
  lastInitial: string
): Promise<{ error?: string; pin?: string; email?: string }> {
  const upper = code.toUpperCase()

  const supabase = await createClient()
  const admin = createAdminClient()

  // Verify the class exists
  const { data: group, error: gErr } = await supabase
    .from('groups')
    .select('id')
    .eq('code', upper)
    .eq('kind', 'class')
    .is('archived_at', null)
    .single()
  if (gErr || !group) return { error: 'Class code not found.' }

  // Build synthetic email + 6-digit PIN (min 6 chars required by Supabase auth)
  const namePart = (firstName.trim().toLowerCase() + lastInitial.trim().toLowerCase())
    .replace(/[^a-z]/g, '')
    .slice(0, 8)
  const pin = String(Math.floor(100000 + Math.random() * 900000))
  const email = `${namePart}.${upper.toLowerCase()}@class.incentivefinance.org`

  // Create auth user
  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email,
    password: pin,
    email_confirm: true,
    user_metadata: { full_name: `${firstName} ${lastInitial}.` },
  })
  if (authErr) {
    // If the email already exists, generate a new unique suffix
    if (authErr.message?.includes('already been registered')) {
      return { error: 'That name is already in this class. Try a different nickname.' }
    }
    return { error: 'Could not create account. Please try again.' }
  }

  const userId = authData.user.id

  // Use admin client for DB writes so RLS doesn't block the new user's row
  const [profileRes, memberRes] = await Promise.all([
    admin.from('profiles').upsert({
      id: userId,
      first_name: firstName.trim(),
      last_initial: lastInitial.trim().toUpperCase(),
      name: `${firstName.trim()} ${lastInitial.trim().toUpperCase()}.`,
      is_class_account: true,
      class_pin: pin,
      class_email: email,
      consent_status: 'school',
    }, { onConflict: 'id' }),
    admin.from('group_members').insert({
      group_id: group.id,
      user_id: userId,
      role: 'student',
    }),
  ])

  if (profileRes.error || memberRes.error) {
    // Rollback the auth user to keep things clean
    await admin.auth.admin.deleteUser(userId)
    return { error: 'Could not save account. Please try again.' }
  }

  return { pin, email }
}

// ── Under-13 consent ──────────────────────────────────────────────────────────

export async function requestParentConsent(
  childId: string,
  parentEmail: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const crypto = await import('crypto')

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase.from('parent_consents').insert({
    child_id: childId,
    parent_email: parentEmail,
    token_hash: tokenHash,
    status: 'pending',
    expires_at: expiresAt,
  })
  if (error) return { error: 'Could not send consent email.' }

  // Update child profile
  await supabase.from('profiles').update({ consent_status: 'pending' }).eq('id', childId)

  // In production: send email to parentEmail with token
  // For local dev: log the token
  console.log(`[dev] Consent token for ${parentEmail}: ${token}`)
  console.log(`[dev] Consent URL: http://localhost:3000/consent/${token}`)

  return {}
}

export async function getClassEmail(
  username: string,
  pin: string
): Promise<{ error?: string; email?: string }> {
  const admin = createAdminClient()
  const email = `${username.trim().toLowerCase()}@class.incentivefinance.org`

  const { data, error } = await admin
    .from('profiles')
    .select('class_email, class_pin')
    .eq('is_class_account', true)
    .eq('class_email', email)
    .single()

  if (error || !data) return { error: 'Username or PIN not found.' }
  if (data.class_pin !== pin) return { error: 'Username or PIN not found.' }
  return { email: data.class_email }
}

export async function decideConsent(
  token: string,
  decision: 'approved' | 'declined'
): Promise<{ error?: string; childName?: string }> {
  const supabase = await createClient()
  const crypto = await import('crypto')

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const { data: consent, error } = await supabase
    .from('parent_consents')
    .select('id, child_id, status, expires_at')
    .eq('token_hash', tokenHash)
    .single()

  if (error || !consent) return { error: 'Invalid or expired link.' }
  if (consent.status !== 'pending') return { error: 'This link has already been used.' }
  if (new Date(consent.expires_at) < new Date()) return { error: 'This link has expired.' }

  await supabase.from('parent_consents')
    .update({ status: decision, decided_at: new Date().toISOString() })
    .eq('id', consent.id)

  const newStatus = decision === 'approved' ? 'approved' : 'declined'
  await supabase.from('profiles')
    .update({ consent_status: newStatus })
    .eq('id', consent.child_id)

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', consent.child_id)
    .single()

  return { childName: profile?.first_name ?? 'your child' }
}
