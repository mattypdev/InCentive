'use server'

import { createClient } from '@/lib/supabase/server'

export async function startAttempt(lessonId: string): Promise<{ attemptId: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { attemptId: null }

  // Check for existing in-progress attempt
  const { data: existing } = await supabase
    .from('attempts')
    .select('id, step_index')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .is('completed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) return { attemptId: existing.id }

  const { data, error } = await supabase
    .from('attempts')
    .insert({ user_id: user.id, lesson_id: lessonId, step_index: 0 })
    .select('id')
    .single()

  if (error || !data) return { attemptId: null }
  return { attemptId: data.id }
}

export async function resumeAttempt(lessonId: string): Promise<{ attemptId: string | null; stepIndex: number; answers: Record<string, unknown> }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { attemptId: null, stepIndex: 0, answers: {} }

  const { data } = await supabase
    .from('attempts')
    .select('id, step_index, state')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .is('completed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return { attemptId: null, stepIndex: 0, answers: {} }
  return {
    attemptId: data.id,
    stepIndex: data.step_index ?? 0,
    answers: (data.state as Record<string, unknown>) ?? {},
  }
}

export async function saveStep(attemptId: string, stepIndex: number, state?: Record<string, unknown>): Promise<void> {
  if (!attemptId) return
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('attempts')
    .update({ step_index: stepIndex, state: state ?? null })
    .eq('id', attemptId)
    .eq('user_id', user.id)
}

export async function saveAnswer(
  attemptId: string,
  questionId: string,
  response: unknown,
  credit: number,
  misconception?: string,
  ms?: number,
): Promise<void> {
  if (!attemptId) return
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('answers').upsert({
    attempt_id: attemptId,
    question_id: questionId,
    response: response as object,
    correct: credit === 1,
    credit,
    misconception: misconception ?? null,
    ms: ms ?? null,
  }, { onConflict: 'attempt_id,question_id' })

  // Missed questions go to review queue (due tomorrow)
  if (credit < 1) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dueOn = tomorrow.toISOString().slice(0, 10)
    await supabase.from('review_queue').upsert({
      user_id: user.id,
      question_id: questionId,
      due_on: dueOn,
      interval_days: 1,
    }, { onConflict: 'user_id,question_id' })
  }
}

export async function finishLesson(
  attemptId: string,
  lessonId: string,
  totalCredit: number,
  numGraded: number,
): Promise<{ centsAwarded: number; xpAwarded: number; alreadyDone: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { centsAwarded: 0, xpAwarded: 0, alreadyDone: false }

  const score = numGraded > 0 ? totalCredit / numGraded : 1
  const perfect = totalCredit === numGraded && numGraded > 0

  // Mark attempt complete
  await supabase
    .from('attempts')
    .update({ completed_at: new Date().toISOString(), score, cents_awarded: perfect ? 25 : 20, xp_awarded: 10 })
    .eq('id', attemptId)
    .eq('user_id', user.id)

  // Award lesson completion (unique constraint prevents double-award)
  const { error: lessonErr } = await supabase.from('wallet_ledger').insert({
    user_id: user.id,
    cents: 20,
    xp: 10,
    reason: 'lesson',
    ref: lessonId,
  })
  const alreadyDone = !!(lessonErr && lessonErr.code === '23505')

  let centsAwarded = alreadyDone ? 0 : 20
  let xpAwarded = alreadyDone ? 0 : 10

  // Bonus for perfect score
  if (perfect && !alreadyDone) {
    const { error: perfectErr } = await supabase.from('wallet_ledger').insert({
      user_id: user.id,
      cents: 5,
      xp: 2,
      reason: 'lesson',
      ref: `${lessonId}:perfect`,
    })
    if (!perfectErr) { centsAwarded += 5; xpAwarded += 2 }
  }

  // Update streak
  if (!alreadyDone) {
    await updateStreak(user.id, supabase)
  }

  // Also update legacy lesson_progress for compatibility
  await supabase.from('lesson_progress').upsert({
    user_id: user.id,
    lesson_id: lessonId,
    score: Math.round(score * 100),
    completed: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })

  return { centsAwarded, xpAwarded, alreadyDone }
}

async function updateStreak(userId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const todayStr = new Date().toISOString().slice(0, 10)

  const { data: existing } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!existing) {
    await supabase.from('streaks').insert({
      user_id: userId,
      current: 1,
      longest: 1,
      last_active_on: todayStr,
    })
    return
  }

  if (existing.last_active_on === todayStr) return  // already counted today

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const isConsecutive = existing.last_active_on === yesterdayStr
  const newCurrent = isConsecutive ? existing.current + 1 : 1
  const newLongest = Math.max(existing.longest, newCurrent)

  await supabase.from('streaks').update({
    current: newCurrent,
    longest: newLongest,
    last_active_on: todayStr,
  }).eq('user_id', userId)
}
