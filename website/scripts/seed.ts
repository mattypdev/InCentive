/**
 * Seed script for local Supabase.
 * Run: npx ts-node --esm scripts/seed.ts
 * Or:  npx tsx scripts/seed.ts
 *
 * Requires env: SUPABASE_URL, SUPABASE_SERVICE_KEY
 * (copy from `supabase status` output)
 */
import { createClient } from '@supabase/supabase-js'
import { islands, units, lessons, islandUnitIds } from '../lib/content/islands.js'

const SUPABASE_URL     = process.env.SUPABASE_URL     ?? 'http://127.0.0.1:54321'
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_SERVICE) {
  console.error('Set SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── helpers ────────────────────────────────────────────────────────────────

async function run<T>(label: string, fn: () => Promise<T>): Promise<T> {
  process.stdout.write(`  ${label}... `)
  try {
    const result = await fn()
    console.log('✓')
    return result
  } catch (err) {
    console.log('✗')
    throw err
  }
}

// ── content seed ───────────────────────────────────────────────────────────

async function seedContent() {
  console.log('\n── Content ─────────────────────────────────')

  await run('islands', () =>
    sb.from('islands').upsert(
      islands.map(i => ({
        slug:      i.slug,
        title:     i.title,
        tagline:   i.tagline,
        sort:      i.order,
        art:       i.art,
        color:     i.color,
        standards: i.standards,
      })),
      { onConflict: 'slug' }
    ).throwOnError()
  )

  await run(`units (${units.length})`, () =>
    sb.from('units').upsert(
      units.map(u => ({
        id:           u.id,
        island:       u.island,
        slug:         u.slug,
        sort:         u.order,
        title:        u.title,
        summary:      u.summary,
        level:        u.level,
        cents_reward: u.centsReward,
      })),
      { onConflict: 'id' }
    ).throwOnError()
  )

  await run(`lessons (${lessons.length})`, () =>
    sb.from('lessons').upsert(
      lessons.map(l => ({
        id:           l.id,
        unit_id:      l.unitId,
        slug:         l.slug,
        sort:         l.order,
        title:        l.title,
        minutes:      l.minutes,
        cents_reward: l.centsReward,
        objective:    l.objective,
        steps:        l.steps,
      })),
      { onConflict: 'id' }
    ).throwOnError()
  )
}

// ── test users ────────────────────────────────────────────────────────────

const TEST_PASSWORD = 'Test1234!'

const TEST_USERS = [
  { email: 'student@test.incentive',       name: 'Alex Student',       flags: {} },
  { email: 'student13@test.incentive',     name: 'Sam Under13',        flags: { birth_year: new Date().getFullYear() - 12, consent_status: 'pending' as const } },
  { email: 'classstudent@test.incentive',  name: 'Jordan Class',       flags: { consent_status: 'school' as const } },
  { email: 'teacher@test.incentive',       name: 'Ms Rivera Teacher',  flags: { is_teacher: true } },
  { email: 'coteacher@test.incentive',     name: 'Mr Chen CoTeacher',  flags: { is_teacher: true } },
  { email: 'host@test.incentive',          name: 'Taylor Host',        flags: { is_host: true } },
  { email: 'applicant@test.incentive',     name: 'Pat Applicant',      flags: {} },
  { email: 'chapterlead@test.incentive',   name: 'Morgan Chapter',     flags: { is_chapter_lead: true } },
  { email: 'parent@test.incentive',        name: 'Casey Parent',       flags: { is_parent: true } },
  { email: 'admin@test.incentive',         name: 'Admin User',         flags: { is_admin: true } },
]

async function seedUsers() {
  console.log('\n── Test users ───────────────────────────────')

  for (const u of TEST_USERS) {
    await run(u.email, async () => {
      // Try to create auth user
      const { data, error } = await sb.auth.admin.createUser({
        email: u.email,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.name },
      })
      if (error && !error.message.includes('already been registered')) throw error

      const userId = data?.user?.id ?? (
        // User already exists — look up by email
        await sb.auth.admin.listUsers().then(({ data: list }) =>
          list.users.find(x => x.email === u.email)?.id
        )
      )
      if (!userId) throw new Error(`Could not resolve id for ${u.email}`)

      // Upsert profile
      await sb.from('profiles').upsert(
        {
          id:   userId,
          name: u.name,
          ...u.flags,
        },
        { onConflict: 'id' }
      ).throwOnError()
    })
  }
}

// ── ledger migration ──────────────────────────────────────────────────────
// One opening row per user = their current balance (from user_shop spent data
// or lesson_progress derived cents). For local seed this creates a $0 opening
// balance; the dry-run check compares counts before and after.

async function seedLedger() {
  console.log('\n── Ledger migration ─────────────────────────')

  await run('opening rows for existing profiles', async () => {
    const { data: profileIds } = await sb
      .from('profiles')
      .select('id')

    if (!profileIds?.length) return

    // Compute current balance from lesson_progress × reward map
    const { data: progress } = await sb
      .from('lesson_progress')
      .select('user_id, lesson_id, score')
      .eq('completed', true)

    const balanceByUser: Record<string, number> = {}
    if (progress) {
      for (const row of progress) {
        const rewardCents = 20 // all lessons are 20¢
        const pct = (row.score ?? 0) / 100
        balanceByUser[row.user_id] = (balanceByUser[row.user_id] ?? 0) + Math.round(rewardCents * pct)
      }
    }

    // Check user_shop for spent amounts
    const { data: shopData } = await sb
      .from('user_shop')
      .select('user_id, spent')

    const spentByUser: Record<string, number> = {}
    if (shopData) {
      for (const row of shopData) {
        spentByUser[row.user_id] = (spentByUser[row.user_id] ?? 0) + (row.spent ?? 0)
      }
    }

    const rows = profileIds.map(({ id: userId }) => ({
      user_id: userId,
      cents:   (balanceByUser[userId] ?? 0) - (spentByUser[userId] ?? 0),
      xp:      0,
      reason:  'migration',
      ref:     'opening_balance',
    }))

    // Insert only if no migration row exists yet
    for (const row of rows) {
      const { data: existing } = await sb
        .from('wallet_ledger')
        .select('id')
        .eq('user_id', row.user_id)
        .eq('reason', 'migration')
        .single()
      if (!existing) {
        await sb.from('wallet_ledger').insert(row).throwOnError()
      }
    }
  })
}

// ── dry-run check ─────────────────────────────────────────────────────────

async function dryRunCheck() {
  console.log('\n── Dry-run check ────────────────────────────')

  const [
    { count: islandCount },
    { count: unitCount },
    { count: lessonCount },
    { count: profileCount },
    { count: ledgerCount },
  ] = await Promise.all([
    sb.from('islands').select('*', { count: 'exact', head: true }),
    sb.from('units').select('*', { count: 'exact', head: true }),
    sb.from('lessons').select('*', { count: 'exact', head: true }),
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('wallet_ledger').select('*', { count: 'exact', head: true }),
  ])

  console.log(`  islands:  ${islandCount}  (expected 7)`)
  console.log(`  units:    ${unitCount}  (expected ${units.length})`)
  console.log(`  lessons:  ${lessonCount}  (expected ${lessons.length})`)
  console.log(`  profiles: ${profileCount}`)
  console.log(`  ledger:   ${ledgerCount}`)

  const ok =
    islandCount === 7 &&
    unitCount === units.length &&
    lessonCount === lessons.length
  console.log(ok ? '\n✅  Seed OK' : '\n❌  Counts mismatch — check above')
}

// ── main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding ${SUPABASE_URL}`)
  await seedContent()
  await seedUsers()
  await seedLedger()
  await dryRunCheck()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
