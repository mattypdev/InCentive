'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface LeaderboardEntry {
  id: string
  name: string | null
  first_name: string | null
  last_initial: string | null
  xp: number
  weekly_xp: number
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

  // Core query — only columns that exist in every environment
  const [profilesRes, membershipRes] = await Promise.all([
    admin.from('profiles')
      .select('id, name, first_name, last_initial, xp, streak_count')
      .order('xp', { ascending: false }),
    admin.from('group_members')
      .select('group_id')
      .eq('user_id', userId)
      .eq('role', 'student')
      .limit(1)
      .maybeSingle(),
  ])

  const all = profilesRes.data ?? []

  // Extended columns added by migration — may not exist in production yet
  type ExtendedRow = { id: string; weekly_xp: number; hide_from_leaderboard: boolean; streak_best: number }
  let extended: ExtendedRow[] = []
  try {
    const { data, error } = await admin.from('profiles')
      .select('id, weekly_xp, hide_from_leaderboard, streak_best')
    if (!error && data) extended = data as ExtendedRow[]
  } catch {}
  const extMap = new Map(extended.map(r => [r.id, r]))

  const me = all.find(p => p.id === userId) ?? null

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

  // Weekly active days from lesson_progress (best-effort — skip if column missing)
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

  const users: LeaderboardEntry[] = all
    .filter(p => !(extMap.get(p.id)?.hide_from_leaderboard) || p.id === userId)
    .map(p => ({
      id: p.id,
      name: p.name,
      first_name: p.first_name,
      last_initial: p.last_initial,
      xp: p.xp ?? 0,
      weekly_xp: extMap.get(p.id)?.weekly_xp ?? 0,
      streak_count: p.streak_count ?? 0,
    }))

  const meExt = me ? extMap.get(me.id) : null

  return {
    me: me ? {
      id: me.id,
      name: me.name,
      first_name: me.first_name,
      last_initial: me.last_initial,
      xp: me.xp ?? 0,
      weekly_xp: meExt?.weekly_xp ?? 0,
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
