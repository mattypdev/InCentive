'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ── Create a new class ────────────────────────────────────────────────────

export async function createClass(input: {
  name: string
  period?: string
  grade?: string
  subject?: string
  preset?: string
  startsOn?: string
}): Promise<{ error?: string; groupId?: string; code?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_teacher')
    .eq('id', user.id)
    .single()
  if (!profile?.is_teacher) return { error: 'Teacher access required' }

  // Generate unique 4-char class code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 10; i++) {
    const candidate = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const { data: existing } = await supabase.from('groups').select('id').eq('code', candidate).single()
    if (!existing) { code = candidate; break }
  }
  if (!code) return { error: 'Could not generate unique code' }

  const { data: group, error } = await supabase.from('groups').insert({
    kind: 'class',
    name: input.name,
    code,
    owner_id: user.id,
    period: input.period ?? null,
    grade: input.grade ?? null,
    subject: input.subject ?? null,
    settings: { preset: input.preset ?? null },
  }).select('id, code').single()

  if (error || !group) return { error: error?.message ?? 'Could not create class' }

  // Add teacher as owner member
  await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id, role: 'owner' })

  // Seed class plan if preset given
  if (input.preset && input.startsOn) {
    const items = generatePlanItems(input.preset, input.startsOn)
    await supabase.from('class_plans').insert({
      group_id: group.id,
      preset: input.preset,
      starts_on: input.startsOn,
      items,
    })
  }

  return { groupId: group.id, code: group.code }
}

function generatePlanItems(preset: string, startsOn: string): object[] {
  // Simplified plan generation — real implementation populates per-day lesson items
  const items: object[] = []
  const start = new Date(startsOn)
  const islandWeeks: Record<string, number[]> = {
    '18-week': [2, 4, 4, 3, 2, 2, 1],
    '9-week':  [1, 2, 2, 2, 1, 1, 0],
    '5-day':   [1, 1, 1, 1, 0, 0, 0],
    'after-school': [2, 1, 1, 1, 1, 1, 0, 1],
  }
  const slugs = ['the-basics','banking-budgeting','credit-protection','taxes-investing','markets-business','finance-psychology','capstone']
  const weeks = islandWeeks[preset] ?? []
  let week = 0
  slugs.forEach((slug, i) => {
    const w = weeks[i] ?? 0
    for (let d = 0; d < w * 5; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + (week * 7) + d)
      if (date.getDay() === 0 || date.getDay() === 6) continue
      items.push({ date: date.toISOString().slice(0, 10), island: slug, kind: 'lesson' })
    }
    week += w
  })
  return items
}

// ── Archive a class ───────────────────────────────────────────────────────

export async function archiveClass(groupId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('groups')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', groupId)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }
  return {}
}

// ── Get teacher's classes ─────────────────────────────────────────────────

export async function getTeacherClasses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('groups')
    .select('id, name, code, period, grade, subject, settings, archived_at, created_at')
    .eq('owner_id', user.id)
    .eq('kind', 'class')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  return data ?? []
}

// ── Get student roster for a class ───────────────────────────────────────

export async function getClassStudents(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: members } = await supabase
    .from('group_members')
    .select('user_id, role, joined_at')
    .eq('group_id', groupId)
    .eq('role', 'student')

  if (!members?.length) return { students: [] }

  const userIds = members.map(m => m.user_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_initial, class_email, is_class_account')
    .in('id', userIds)

  const { data: streaks } = await supabase
    .from('streaks')
    .select('user_id, current, last_active_on')
    .in('user_id', userIds)

  return {
    students: members.map(m => {
      const p = profiles?.find(pr => pr.id === m.user_id)
      const s = streaks?.find(st => st.user_id === m.user_id)
      return { ...m, profile: p, streak: s }
    })
  }
}

// ── Get gradebook data for a class and unit ───────────────────────────────

export async function getGradebook(groupId: string, unitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify teacher access
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()
  if (!membership || !['owner', 'co_teacher'].includes(membership.role)) {
    return { error: 'Not authorized' }
  }

  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', groupId)
    .eq('role', 'student')

  if (!members?.length) return { students: [], lessons: [], rows: [] }

  const userIds = members.map(m => m.user_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_initial')
    .in('id', userIds)

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .eq('unit_id', unitId)
    .order('order_index')

  const lessonIds = lessons?.map(l => l.id) ?? []

  const { data: attempts } = await supabase
    .from('attempts')
    .select('user_id, lesson_id, score, completed_at')
    .in('user_id', userIds)
    .in('lesson_id', lessonIds)
    .not('completed_at', 'is', null)

  // Best score per user per lesson
  const bestScores: Record<string, Record<string, number>> = {}
  for (const a of attempts ?? []) {
    if (!bestScores[a.user_id]) bestScores[a.user_id] = {}
    const cur = bestScores[a.user_id][a.lesson_id] ?? 0
    if ((a.score ?? 0) > cur) bestScores[a.user_id][a.lesson_id] = a.score ?? 0
  }

  const rows = profiles?.map(p => ({
    userId: p.id,
    name: `${p.first_name ?? ''} ${p.last_initial ?? ''}`.trim(),
    scores: Object.fromEntries(lessonIds.map(lid => [lid, bestScores[p.id]?.[lid] ?? null])),
  })) ?? []

  return { lessons: lessons ?? [], rows }
}

// ── Create assignment ─────────────────────────────────────────────────────

export async function createAssignment(input: {
  groupId: string
  unitId?: string
  lessonId?: string
  title?: string
  items?: object[]
  opensAt: string
  dueAt?: string
  isDraft?: boolean
  isReview?: boolean
  settings?: object
}): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Build the insert payload — omit unit_id/lesson_id when items array is used
  const hasItems = input.items && input.items.length > 0
  const payload: Record<string, unknown> = {
    group_id: input.groupId,
    assigned_by: user.id,
    opens_at: input.opensAt,
    due_at: input.dueAt ?? null,
    is_draft: input.isDraft ?? false,
    is_review: input.isReview ?? false,
    settings: input.settings ?? { retakes: true, best_score: true },
  }

  if (input.title) payload.title = input.title
  if (hasItems) {
    payload.items = input.items
  } else {
    payload.unit_id = input.unitId ?? null
    payload.lesson_id = input.lessonId ?? null
  }

  const { data, error } = await supabase.from('assignments').insert(payload).select('id').single()

  if (error || !data) return { error: error?.message ?? 'Could not create assignment' }
  return { id: data.id }
}

// ── Get assignments for a class ───────────────────────────────────────────

export async function getAssignments(groupId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('assignments')
    .select('id, unit_id, lesson_id, opens_at, due_at, settings, created_at')
    .eq('group_id', groupId)
    .order('due_at', { ascending: true })

  return data ?? []
}

// ── Save class plan ───────────────────────────────────────────────────────

export async function savePlan(
  groupId: string,
  preset: string,
  startsOn: string,
  items: object[]
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('class_plans').upsert({
    group_id: groupId,
    preset,
    starts_on: startsOn,
    items,
  }, { onConflict: 'group_id' })

  if (error) return { error: error.message }
  return {}
}

// ── Get class plan ────────────────────────────────────────────────────────

export async function getClassPlan(groupId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('class_plans')
    .select('preset, starts_on, items')
    .eq('group_id', groupId)
    .single()
  return data
}

// ─────────────────────────────────────────────────────────────────────────────
// Teacher Hub v2 — new actions
// ─────────────────────────────────────────────────────────────────────────────

// ── Get class overview data ───────────────────────────────────────────────

export async function getClassOverview(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const fiveDaysAgo  = new Date(Date.now() - 5 * 86400000).toISOString()
  const now = new Date().toISOString()

  // Student IDs
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', groupId)
    .eq('role', 'student')
  if (!members) return null

  const studentIds = members.map(m => m.user_id)
  if (!studentIds.length) {
    return {
      kpis: { activeThisWeek: 0, avgScore: null, lessonsFinished: 0, onTimeRate: null },
      dueSoon: [],
      needsAttention: [],
      mostMissed: null,
      masteryByUnit: [],
      recentActivity: [],
    }
  }

  // KPIs
  const [lpWeekRes, lpAllRes, assignRes] = await Promise.all([
    supabase.from('lesson_progress').select('user_id, score, completed').in('user_id', studentIds).gte('updated_at', sevenDaysAgo),
    supabase.from('lesson_progress').select('user_id, score, completed, lesson_id').in('user_id', studentIds),
    supabase.from('assignments').select('id, title, opens_at, due_at, items, lesson_id, unit_id').eq('group_id', groupId).eq('is_draft', false).not('due_at', 'is', null).gte('due_at', now).order('due_at'),
  ])

  const lpWeek = lpWeekRes.data ?? []
  const lpAll  = lpAllRes.data ?? []
  const assignments = assignRes.data ?? []

  const activeUsers = new Set(lpWeek.map(r => r.user_id))
  const completed   = lpAll.filter(r => r.completed)
  const scores      = completed.map(r => r.score).filter(s => s != null) as number[]
  const avgScore    = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

  // On-time: lesson_progress where completed = true (simplification — no per-student due_at here)
  // We approximate: on-time rate = completed / total assigned (placeholder until per-student due tracking)
  const onTimeRate = null // No per-student due_at in lesson_progress

  const kpis = {
    activeThisWeek: activeUsers.size,
    avgScore,
    lessonsFinished: completed.length,
    onTimeRate,
  }

  // Due soon — assignments with due date in future
  const dueSoon = assignments.slice(0, 5)

  // Needs attention — students with low scores or no activity
  const { data: streaks } = await supabase
    .from('streaks')
    .select('user_id, last_active_on')
    .in('user_id', studentIds)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_initial')
    .in('id', studentIds)

  const needsAttention: Array<{ userId: string; name: string; reason: string; kind: string }> = []

  for (const p of profiles ?? []) {
    const streak = streaks?.find(s => s.user_id === p.id)
    const lastActive = streak?.last_active_on ? new Date(streak.last_active_on) : null
    const daysInactive = lastActive ? Math.floor((Date.now() - lastActive.getTime()) / 86400000) : 999
    const name = `${p.first_name ?? ''} ${p.last_initial ?? '.'}`.trim()

    if (daysInactive >= 5) {
      needsAttention.push({ userId: p.id, name, reason: `No activity · ${daysInactive === 999 ? 'never' : daysInactive + ' days'}`, kind: 'inactive' })
      continue
    }

    const userScores = completed.filter(lp => lp.user_id === p.id).map(lp => lp.score as number)
    if (userScores.length) {
      const avg = userScores.reduce((a, b) => a + b, 0) / userScores.length
      if (avg < 60) {
        needsAttention.push({ userId: p.id, name, reason: `Under 60% · ${userScores.length} lesson${userScores.length !== 1 ? 's' : ''}`, kind: 'lowScore' })
      }
    }
  }

  // Most-missed question (from answers this week)
  const { data: attemptsWeek } = await supabase
    .from('attempts')
    .select('id, user_id')
    .in('user_id', studentIds)
    .gte('completed_at', sevenDaysAgo)

  let mostMissed = null
  if (attemptsWeek?.length) {
    const attemptIds = attemptsWeek.map(a => a.id)
    const { data: answers } = await supabase
      .from('answers')
      .select('question_id, correct')
      .in('attempt_id', attemptIds)

    if (answers?.length) {
      const qMap: Record<string, { total: number; correct: number }> = {}
      for (const a of answers) {
        if (!qMap[a.question_id]) qMap[a.question_id] = { total: 0, correct: 0 }
        qMap[a.question_id].total++
        if (a.correct) qMap[a.question_id].correct++
      }
      const worst = Object.entries(qMap)
        .filter(([, v]) => v.total >= 3)
        .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))[0]
      if (worst) {
        mostMissed = {
          questionId: worst[0],
          correctRate: Math.round((worst[1].correct / worst[1].total) * 100),
          total: worst[1].total,
          distribution: answers.filter(a => a.question_id === worst[0]).reduce((acc, a) => {
            const key = a.correct ? 'correct' : 'wrong'
            acc[key] = (acc[key] ?? 0) + 1
            return acc
          }, {} as Record<string, number>),
        }
      }
    }
  }

  // Mastery by unit
  const { data: units } = await supabase
    .from('units')
    .select('id, title, island')
    .order('sort')

  const masteryByUnit = (units ?? []).map(unit => {
    const lessons = lpAll.filter(lp => lp.lesson_id?.startsWith(unit.id + '-'))
    const scores = lessons.filter(l => l.completed).map(l => l.score as number).filter(s => s != null)
    return {
      unitId: unit.id,
      title: unit.title,
      avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    }
  }).filter(u => u.avgScore !== null)

  // Recent activity — last 10 lesson_progress entries
  const { data: recent } = await supabase
    .from('lesson_progress')
    .select('user_id, lesson_id, score, completed, updated_at')
    .in('user_id', studentIds)
    .order('updated_at', { ascending: false })
    .limit(10)

  const recentActivity = (recent ?? []).map(r => {
    const p = profiles?.find(pr => pr.id === r.user_id)
    return {
      userId: r.user_id,
      name: p ? `${p.first_name ?? ''} ${p.last_initial ?? '.'}`.trim() : 'Student',
      lessonId: r.lesson_id,
      score: r.score,
      completed: r.completed,
      updatedAt: r.updated_at,
    }
  })

  return { kpis, dueSoon, needsAttention, mostMissed, masteryByUnit, recentActivity }
}

// ── Get progress grid (all students × all units) ──────────────────────────

export async function getProgressGrid(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: members } = await supabase
    .from('group_members')
    .select('user_id, joined_at')
    .eq('group_id', groupId)
    .eq('role', 'student')

  if (!members?.length) return { students: [], units: [], scores: {} }

  const studentIds = members.map(m => m.user_id)

  const [profilesRes, unitsRes, lpRes] = await Promise.all([
    supabase.from('profiles').select('id, first_name, last_initial').in('id', studentIds),
    supabase.from('units').select('id, title, island').order('sort'),
    supabase.from('lesson_progress').select('user_id, lesson_id, score, completed').in('user_id', studentIds),
  ])

  const profiles = profilesRes.data ?? []
  const units = unitsRes.data ?? []
  const lp = lpRes.data ?? []

  // Build scores: for each student + unit, best completed score
  const scores: Record<string, Record<string, number | null>> = {}
  for (const p of profiles) {
    scores[p.id] = {}
    for (const unit of units) {
      const lessons = lp.filter(l => l.user_id === p.id && l.lesson_id?.startsWith(unit.id + '-') && l.completed)
      if (!lessons.length) {
        scores[p.id][unit.id] = null
      } else {
        const avg = lessons.reduce((a, b) => a + (b.score ?? 0), 0) / lessons.length
        scores[p.id][unit.id] = Math.round(avg)
      }
    }
  }

  const students = profiles.map(p => ({
    id: p.id,
    name: `${p.first_name ?? ''} ${p.last_initial ?? '.'}`.trim(),
  }))

  return { students, units, scores }
}

// ── Get student detail ────────────────────────────────────────────────────

export async function getStudentDetail(groupId: string, studentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profileRes, memberRes, lpRes, streakRes, assignRes] = await Promise.all([
    supabase.from('profiles').select('id, first_name, last_initial, class_email, is_class_account').eq('id', studentId).single(),
    supabase.from('group_members').select('joined_at').eq('group_id', groupId).eq('user_id', studentId).single(),
    supabase.from('lesson_progress').select('lesson_id, score, completed, updated_at').eq('user_id', studentId),
    supabase.from('streaks').select('current, last_active_on').eq('user_id', studentId).single(),
    supabase.from('assignments').select('id, title, due_at, opens_at').eq('group_id', groupId).eq('is_draft', false).not('due_at', 'is', null).gte('due_at', new Date().toISOString()),
  ])

  const profile = profileRes.data
  if (!profile) return null

  const lp = lpRes.data ?? []
  const completed = lp.filter(l => l.completed)
  const scores = completed.map(l => l.score as number).filter(s => s != null)
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

  // Class median for comparison
  const { data: classMembers } = await supabase.from('group_members').select('user_id').eq('group_id', groupId).eq('role', 'student')
  const classIds = (classMembers ?? []).map(m => m.user_id).filter(id => id !== studentId)
  const { data: classLp } = classIds.length ? await supabase.from('lesson_progress').select('score').in('user_id', classIds).eq('completed', true) : { data: [] }
  const classScores = (classLp ?? []).map(l => l.score as number).filter(s => s != null)
  const classMedian = classScores.length ? classScores.sort((a, b) => a - b)[Math.floor(classScores.length / 2)] : null

  const kpis = {
    lessonsFinished: completed.length,
    classMedianLessons: classIds.length,
    avgScore,
    classMedianScore: classMedian,
    streak: streakRes.data?.current ?? 0,
    lastActive: streakRes.data?.last_active_on ?? null,
  }

  // Island progress
  const { data: islands } = await supabase.from('islands').select('slug, title').order('sort')
  const { data: lessons } = await supabase.from('lessons').select('id, unit_id, title').order('sort')

  const islandProgress = (islands ?? []).map(island => {
    const islandLessons = (lessons ?? []).filter(l => l.unit_id?.startsWith(island.slug.replace(/-/g, '')))
    // Simpler: check lesson_id prefix
    const done = lp.filter(l => l.completed && l.lesson_id && lessons?.find(ls => ls.id === l.lesson_id && ls.unit_id?.includes(island.slug.replace(/-/g, '')))).length
    const total = islandLessons.length
    return { island: island.slug, title: island.title, done, total }
  })

  // Recent work
  const recentWork = lp
    .filter(l => l.completed)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10)
    .map(l => ({
      lessonId: l.lesson_id,
      lessonTitle: lessons?.find(ls => ls.id === l.lesson_id)?.title ?? l.lesson_id,
      score: l.score,
      updatedAt: l.updated_at,
    }))

  // Missed concepts from answers
  const { data: attempts } = await supabase.from('attempts').select('id').eq('user_id', studentId)
  let missedConcepts: Array<{ questionId: string; count: number }> = []
  if (attempts?.length) {
    const { data: wrongAnswers } = await supabase
      .from('answers')
      .select('question_id')
      .in('attempt_id', attempts.map(a => a.id))
      .eq('correct', false)
    const qCounts: Record<string, number> = {}
    for (const a of wrongAnswers ?? []) {
      qCounts[a.question_id] = (qCounts[a.question_id] ?? 0) + 1
    }
    missedConcepts = Object.entries(qCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([questionId, count]) => ({ questionId, count }))
  }

  return {
    profile: {
      id: profile.id,
      name: `${profile.first_name ?? ''} ${profile.last_initial ?? '.'}`.trim(),
      initials: `${(profile.first_name ?? 'S')[0]}${(profile.last_initial ?? 'S')[0]}`.toUpperCase(),
      classEmail: profile.class_email,
      isClassAccount: profile.is_class_account,
      joinedAt: memberRes.data?.joined_at ?? null,
      lastActive: streakRes.data?.last_active_on ?? null,
    },
    kpis,
    missedConcepts,
    recentWork,
    islandProgress,
    openAssignments: assignRes.data ?? [],
  }
}

// ── Get assignment detail ─────────────────────────────────────────────────

export async function getAssignmentDetail(assignmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, group_id, title, unit_id, lesson_id, items, opens_at, due_at, is_draft, is_review, settings')
    .eq('id', assignmentId)
    .single()
  if (!assignment) return null

  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', assignment.group_id)
    .eq('role', 'student')
  const studentIds = (members ?? []).map(m => m.user_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_initial')
    .in('id', studentIds)

  // Get lesson_progress for the specific lesson (if single lesson assignment)
  const lessonId = assignment.lesson_id ?? (Array.isArray(assignment.items) && assignment.items.length === 1 ? (assignment.items[0] as any)?.id : null)

  let studentRows: Array<{
    userId: string; name: string; score: number | null; status: string
  }> = []

  if (lessonId) {
    const { data: lp } = await supabase
      .from('lesson_progress')
      .select('user_id, score, completed')
      .in('user_id', studentIds)
      .eq('lesson_id', lessonId)

    studentRows = (profiles ?? []).map(p => {
      const progress = lp?.find(l => l.user_id === p.id)
      return {
        userId: p.id,
        name: `${p.first_name ?? ''} ${p.last_initial ?? '.'}`.trim(),
        score: progress?.score ?? null,
        status: !progress ? 'not-started' : progress.completed ? 'done' : 'started',
      }
    })
  } else {
    studentRows = (profiles ?? []).map(p => ({
      userId: p.id,
      name: `${p.first_name ?? ''} ${p.last_initial ?? '.'}`.trim(),
      score: null,
      status: 'not-started',
    }))
  }

  const doneCount    = studentRows.filter(r => r.status === 'done').length
  const scores       = studentRows.filter(r => r.score !== null).map(r => r.score as number)
  const avgScore     = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const notStarted   = studentRows.filter(r => r.status === 'not-started').length
  const under60      = studentRows.filter(r => r.score !== null && (r.score as number) < 60).length

  const kpis = {
    done: doneCount,
    total: studentIds.length,
    avgScore,
    notStarted,
    under60,
  }

  // Question stats (if single lesson)
  let questionStats: Array<{ questionId: string; correctRate: number; total: number }> = []
  if (lessonId) {
    const { data: attempts } = await supabase
      .from('attempts')
      .select('id')
      .in('user_id', studentIds)
      .eq('lesson_id', lessonId)
    if (attempts?.length) {
      const { data: answers } = await supabase
        .from('answers')
        .select('question_id, correct')
        .in('attempt_id', attempts.map(a => a.id))
      const qMap: Record<string, { total: number; correct: number }> = {}
      for (const a of answers ?? []) {
        if (!qMap[a.question_id]) qMap[a.question_id] = { total: 0, correct: 0 }
        qMap[a.question_id].total++
        if (a.correct) qMap[a.question_id].correct++
      }
      questionStats = Object.entries(qMap)
        .map(([questionId, v]) => ({
          questionId,
          correctRate: Math.round((v.correct / v.total) * 100),
          total: v.total,
        }))
        .sort((a, b) => a.correctRate - b.correctRate)
    }
  }

  return { assignment, kpis, studentRows, questionStats }
}

// ── Nudge students ────────────────────────────────────────────────────────

export async function nudgeStudents(
  assignmentId: string,
  studentIds: string[]
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const nudgeUntil = new Date(Date.now() + 7 * 86400000).toISOString()
  const { error } = await supabase
    .from('assignments')
    .update({ nudge_until: nudgeUntil })
    .eq('id', assignmentId)
  if (error) return { error: error.message }
  return {}
}

// ── Create review assignment ──────────────────────────────────────────────

export async function createReviewAssignment(
  groupId: string,
  studentIds: string[],
  questionIds: string[],
  title: string
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase.from('assignments').insert({
    group_id: groupId,
    assigned_by: user.id,
    title: title || `Review: ${questionIds.length} questions`,
    items: questionIds.map(qid => ({ type: 'question', id: qid })),
    target_user_ids: studentIds.length ? studentIds : null,
    opens_at: new Date().toISOString(),
    is_review: true,
    settings: { retakes: true, best_score: true },
  }).select('id').single()

  if (error || !data) return { error: error?.message ?? 'Could not create review' }
  return { id: data.id }
}

// ── Add students by name ──────────────────────────────────────────────────

export async function addStudentsByName(
  groupId: string,
  names: string[]
): Promise<{ error?: string; added?: number; credentials?: { name: string; username: string; pin: string }[] }> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: group } = await supabase.from('groups').select('id, code').eq('id', groupId).eq('owner_id', user.id).single()
  if (!group) return { error: 'Group not found or not authorized' }

  let added = 0
  const credentials: { name: string; username: string; pin: string }[] = []
  const errors: string[] = []

  for (const rawName of names) {
    const name = rawName.trim()
    if (!name) continue

    const parts = name.split(/\s+/)
    const firstName = parts[0]
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : ''

    const namePart = (firstName.toLowerCase() + lastInitial.toLowerCase()).replace(/[^a-z]/g, '').slice(0, 8)
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    const email = `${namePart}.${group.code.toLowerCase()}@class.incentivefinance.org`

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: pin,
      email_confirm: true,
      user_metadata: { full_name: `${firstName} ${lastInitial}.` },
    })
    if (authError || !authData?.user) {
      if (authError?.message?.includes('already been registered')) {
        errors.push(`${name}: already exists`)
      } else {
        errors.push(`${name}: ${authError?.message ?? 'unknown error'}`)
      }
      continue
    }

    const userId = authData.user.id

    await Promise.all([
      adminClient.from('profiles').upsert({
        id: userId,
        first_name: firstName,
        last_initial: lastInitial || null,
        name: `${firstName}${lastInitial ? ' ' + lastInitial + '.' : ''}`,
        class_email: email,
        class_pin: pin,
        is_class_account: true,
        consent_status: 'school',
      }, { onConflict: 'id' }),
      adminClient.from('group_members').insert({
        group_id: groupId,
        user_id: userId,
        role: 'student',
      }),
    ])

    credentials.push({ name: `${firstName}${lastInitial ? ' ' + lastInitial + '.' : ''}`, username: `${namePart}.${group.code.toLowerCase()}`, pin })
    added++
  }

  if (errors.length && !added) return { error: errors.join('; ') }
  return { added, credentials }
}

// ── Rename class ──────────────────────────────────────────────────────────

export async function renameClass(
  groupId: string,
  name: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('groups')
    .update({ name })
    .eq('id', groupId)
    .eq('owner_id', user.id)
  if (error) return { error: error.message }
  return {}
}

// ── Invite co-teacher by email ────────────────────────────────────────────

export async function inviteCoTeacher(
  groupId: string,
  email: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Look up the teacher by email
  const { data: target } = await supabase
    .from('profiles')
    .select('id')
    .eq('class_email', email)
    .single()

  if (!target) return { error: 'No account found with that email' }

  const { error } = await supabase.from('group_members').insert({
    group_id: groupId,
    user_id: target.id,
    role: 'co_teacher',
  })
  if (error) return { error: error.message }
  return {}
}
