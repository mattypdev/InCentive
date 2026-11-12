'use server'
import { createClient } from '@/lib/supabase/server'
import { scoreLiveAnswer } from '@/lib/scoring/live'

// ── Session creation ──────────────────────────────────────────────────────────

export async function createSession(input: {
  unitId?: string
  topic: string
  audience: string
  lengthMin: number
  devices: string
  groupSize: number
  enableCheck: boolean
  questionIds: string[]
  checkQuestionIds?: string[]
  runOfShow: object[]
  cohostIds?: string[]
  groupId?: string
}): Promise<{ error?: string; sessionId?: string; code?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase.from('profiles').select('is_host').eq('id', user.id).single()
  if (!profile?.is_host) return { error: 'Host access required' }

  // Generate unique 4-char code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code: string
  let attempts = 0
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const { data: existing } = await supabase.from('live_sessions').select('id').eq('code', code).single()
    if (!existing) break
    attempts++
  } while (attempts < 10)

  const { data, error } = await supabase.from('live_sessions').insert({
    host_id: user.id,
    unit_id: input.unitId ?? null,
    length_min: input.lengthMin,
    audience: input.audience,
    devices: input.devices,
    run_of_show: input.runOfShow,
    question_ids: input.questionIds,
    check_question_ids: input.checkQuestionIds ?? [],
    cohost_ids: input.cohostIds ?? [],
    group_id: input.groupId ?? null,
    code,
    status: 'draft',
    phase: 'draft',
  }).select('id, code').single()

  if (error || !data) return { error: error?.message ?? 'Could not create session' }
  return { sessionId: data.id, code: data.code }
}

// ── State machine transitions ─────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft:        ['lobby'],
  lobby:        ['before_check', 'question'],
  before_check: ['question'],
  question:     ['reveal'],
  reveal:       ['discussion', 'question', 'leaderboard', 'after_check', 'ended'],
  discussion:   ['question', 'leaderboard', 'after_check', 'ended'],
  leaderboard:  ['question', 'after_check', 'ended'],
  after_check:  ['ended'],
  ended:        [],
}

export async function transitionSession(
  sessionId: string,
  toPhase: string,
  meta?: object
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: session } = await supabase
    .from('live_sessions')
    .select('phase, host_id, cohost_ids')
    .eq('id', sessionId)
    .single()

  if (!session) return { error: 'Session not found' }
  const isHost = session.host_id === user.id || session.cohost_ids?.includes(user.id)
  if (!isHost) return { error: 'Not authorized' }

  const allowed = VALID_TRANSITIONS[session.phase] ?? []
  if (!allowed.includes(toPhase)) return { error: `Cannot transition from ${session.phase} to ${toPhase}` }

  const update: Record<string, unknown> = { phase: toPhase, ...meta }
  if (toPhase === 'question') {
    update.question_started_at = new Date().toISOString()
  }
  if (toPhase === 'lobby' || toPhase === 'ended') {
    update.status = toPhase === 'lobby' ? 'lobby' : 'ended'
  }
  if (toPhase === 'ended') {
    update.ended_at = new Date().toISOString()
    update.status = 'ended'
  }

  const { error } = await supabase.from('live_sessions').update(update).eq('id', sessionId)
  if (error) return { error: error.message }

  return {}
}

// ── Player join ───────────────────────────────────────────────────────────────

export async function joinSession(
  code: string,
  nickname?: string
): Promise<{ error?: string; playerId?: string; sessionId?: string; session?: object }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: session } = await supabase
    .from('live_sessions')
    .select('id, phase, run_of_show, question_ids, code, state')
    .eq('code', code.toUpperCase())
    .neq('status', 'draft')
    .single()

  if (!session) return { error: 'Session not found or not yet open' }

  // Check for existing player record
  if (user) {
    const { data: existing } = await supabase
      .from('live_players')
      .select('id')
      .eq('session_id', session.id)
      .eq('user_id', user.id)
      .single()
    if (existing) return { playerId: existing.id, sessionId: session.id, session }
  }

  const { data: player, error } = await supabase.from('live_players').insert({
    session_id: session.id,
    user_id: user?.id ?? null,
    nickname: nickname ?? null,
  }).select('id').single()

  if (error || !player) return { error: 'Could not join session' }
  return { playerId: player.id, sessionId: session.id, session }
}

// ── Answer submission ─────────────────────────────────────────────────────────

export async function submitLiveAnswer(
  sessionId: string,
  playerId: string,
  questionId: string,
  answer: unknown,
  correct: boolean,
  msElapsed: number,
  phase: 'pre' | 'game' | 'post',
  streakCount: number
): Promise<{ error?: string; points?: number }> {
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('live_sessions')
    .select('question_limit_ms')
    .eq('id', sessionId)
    .single()

  const limitMs = session?.question_limit_ms ?? 30000
  const points = scoreLiveAnswer(correct, msElapsed, limitMs, streakCount)

  const { error } = await supabase.from('live_responses').insert({
    session_id: sessionId,
    player_id: playerId,
    question_id: questionId,
    phase,
    answer: JSON.stringify(answer),
    correct,
    points,
    ms: msElapsed,
    source: 'phone',
  })

  if (error) return { error: error.message }

  // Award cents: 5¢ per correct answer, max 50¢ per session
  if (correct && phase === 'game') {
    const { data: player } = await supabase.from('live_players').select('user_id').eq('id', playerId).single()
    if (player?.user_id) {
      const { data: existing } = await supabase
        .from('live_responses')
        .select('id')
        .eq('session_id', sessionId)
        .eq('player_id', playerId)
        .eq('correct', true)
        .eq('phase', 'game')
      const correctSoFar = (existing?.length ?? 0)
      if (correctSoFar <= 10) {
        await supabase.from('wallet_ledger').insert({
          user_id: player.user_id,
          cents: 5,
          xp: 0,
          reason: 'live_correct',
          ref: sessionId,
        })
      }
    }
  }

  return { points }
}

// ── Paper votes ───────────────────────────────────────────────────────────────

export async function addPaperVotes(
  sessionId: string,
  questionId: string,
  votes: Record<string, number>
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const update: Record<string, unknown> = {}
  for (const [choice, count] of Object.entries(votes)) {
    if (count <= 0) continue
    await supabase.from('live_responses').insert({
      session_id: sessionId,
      player_id: null,
      question_id: questionId,
      phase: 'game',
      answer: JSON.stringify(choice),
      correct: false,
      points: 0,
      source: 'paper',
      paper_count: count,
    })
  }

  return {}
}

// ── Session report ────────────────────────────────────────────────────────────

export async function getSessionReport(sessionId: string) {
  const supabase = await createClient()

  const [{ data: session }, { data: players }, { data: responses }] = await Promise.all([
    supabase.from('live_sessions').select('*').eq('id', sessionId).single(),
    supabase.from('live_players').select('*').eq('session_id', sessionId),
    supabase.from('live_responses').select('*').eq('session_id', sessionId),
  ])

  if (!session) return { error: 'Session not found' }

  const gameResponses = responses?.filter(r => r.phase === 'game') ?? []
  const preResponses  = responses?.filter(r => r.phase === 'pre') ?? []
  const postResponses = responses?.filter(r => r.phase === 'post') ?? []

  const totalPlayers = players?.filter(p => !p.removed).length ?? 0
  const phoneCount   = players?.filter(p => !p.removed && p.user_id).length ?? 0

  const correctGame = gameResponses.filter(r => r.correct && r.source === 'phone')
  const totalGame   = gameResponses.filter(r => r.source === 'phone')
  const gameAccuracy = totalGame.length ? Math.round(correctGame.length / totalGame.length * 100) : 0

  const preAccuracy  = preResponses.length
    ? Math.round(preResponses.filter(r => r.correct).length / preResponses.length * 100) : null
  const postAccuracy = postResponses.length
    ? Math.round(postResponses.filter(r => r.correct).length / postResponses.length * 100) : null

  return {
    session,
    stats: {
      totalPlayers,
      phoneCount,
      paperCount: totalPlayers - phoneCount,
      gameAccuracy,
      preAccuracy,
      postAccuracy,
      learningGain: preAccuracy != null && postAccuracy != null ? postAccuracy - preAccuracy : null,
    },
    players: players ?? [],
    responses: responses ?? [],
  }
}
