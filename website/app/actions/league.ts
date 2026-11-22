'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { allUnits } from '@/data/levels'

// Same reward map used by AuthContext / Navbar
const rewardMap: Record<string, number> = {}
allUnits.forEach((u: any) => {
  rewardMap[u.id] = u.centsReward ?? 0
  if (u.lessons) u.lessons.forEach((l: any) => { rewardMap[l.id] = l.centsReward ?? 0 })
})

function computeXP(rows: { lesson_id: string; score: number | null }[]): number {
  let total = 0
  for (const r of rows) {
    const pct = (r.score ?? 0) / 100
    if (rewardMap[r.lesson_id] !== undefined) {
      total += Math.round(rewardMap[r.lesson_id] * pct)
    } else if (r.lesson_id === 'capstone') {
      total += Math.round(400 * pct)
    } else if (r.lesson_id.endsWith('-test')) {
      total += Math.round(200 * pct)
    }
  }
  return total
}

export interface LeaderboardEntry {
  id: string
  name: string | null
  first_name: string | null
  last_initial: string | null
  xp: number
  streak_count: number
}

export interface LeaderboardData {
  me: (LeaderboardEntry & { hide_from_leaderboard: boolean; streak_best: number }) | null
  users: LeaderboardEntry[]
  classUserIds: string[]
  weeklyActiveDays: number[] // 1=Mon…7=Sun
}

export async function getLeaderboardData(userId: string): Promise<LeaderboardData> {
  const admin = createAdminClient()

  const [profilesRes, progressRes, membershipRes] = await Promise.all([
    admin.from('profiles')
      .select('id, name, first_name, last_initial, streak_count'),
    admin.from('lesson_progress')
      .select('user_id, lesson_id, score')
      .eq('completed', true),
    admin.from('group_members')
      .select('group_id')
      .eq('user_id', userId)
      .eq('role', 'student')
      .limit(1)
      .maybeSingle(),
  ])

  const profiles = profilesRes.data ?? []
  const progress = progressRes.data ?? []

  // Group lesson_progress rows by user
  const progressByUser = new Map<string, { lesson_id: string; score: number | null }[]>()
  for (const row of progress) {
    if (!progressByUser.has(row.user_id)) progressByUser.set(row.user_id, [])
    progressByUser.get(row.user_id)!.push({ lesson_id: row.lesson_id, score: row.score })
  }

  // hide_from_leaderboard and streak_best added by migration — may not exist yet
  type ExtendedRow = { id: string; hide_from_leaderboard: boolean; streak_best: number }
  let extended: ExtendedRow[] = []
  try {
    const { data, error } = await admin.from('profiles')
      .select('id, hide_from_leaderboard, streak_best')
    if (!error && data) extended = data as ExtendedRow[]
  } catch {}
  const extMap = new Map(extended.map(r => [r.id, r]))

  const me = profiles.find(p => p.id === userId) ?? null

  // Fetch classmates if the user is in a class
  let classUserIds: string[] = []
  if (membershipRes.data?.group_id) {
    const { data: classMembers } = await admin
      .from('group_members')
      .select('user_id')
      .eq('group_id', membershipRes.data.group_id)
      .eq('role', 'student')
    classUserIds = (classMembers ?? []).map(m => m.user_id)
  }

  // Weekly active days for the logged-in user
  let weeklyActiveDays: number[] = []
  try {
    const weekStart = new Date()
    const dow = weekStart.getUTCDay()
    weekStart.setUTCDate(weekStart.getUTCDate() - (dow === 0 ? 6 : dow - 1))
    weekStart.setUTCHours(0, 0, 0, 0)
    const { data: activity } = await admin
      .from('lesson_progress')
      .select('updated_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('updated_at', weekStart.toISOString())
    const daySet = new Set<number>()
    for (const r of activity ?? []) {
      const d = new Date(r.updated_at).getUTCDay()
      daySet.add(d === 0 ? 7 : d)
    }
    weeklyActiveDays = Array.from(daySet).sort()
  } catch {}

  const users: LeaderboardEntry[] = profiles
    .filter(p => !(extMap.get(p.id)?.hide_from_leaderboard) || p.id === userId)
    .map(p => ({
      id: p.id,
      name: p.name,
      first_name: p.first_name,
      last_initial: p.last_initial,
      xp: computeXP(progressByUser.get(p.id) ?? []),
      streak_count: p.streak_count ?? 0,
    }))
    .filter(p => p.xp > 0 || p.id === userId)

  const meExt = me ? extMap.get(me.id) : null

  return {
    me: me ? {
      id: me.id,
      name: me.name,
      first_name: me.first_name,
      last_initial: me.last_initial,
      xp: computeXP(progressByUser.get(me.id) ?? []),
      streak_count: me.streak_count ?? 0,
      streak_best: meExt?.streak_best ?? me.streak_count ?? 0,
      hide_from_leaderboard: meExt?.hide_from_leaderboard ?? false,
    } : null,
    users,
    classUserIds,
    weeklyActiveDays,
  }
}

export async function updateLeagueVisibility(hide: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const admin = createAdminClient()
  await admin.from('profiles').update({ hide_from_leaderboard: hide }).eq('id', user.id)
}
