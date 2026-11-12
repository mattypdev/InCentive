export function scoreLiveAnswer(
  correct: boolean,
  msElapsed: number,
  limitMs: number,
  streakCount: number
): number {
  if (!correct) return 0
  const speedBonus = Math.round(500 * (1 - Math.min(msElapsed, limitMs) / limitMs))
  const base = 500 + speedBonus
  const streakBonus = Math.min(Math.floor(streakCount) * 100, 300)
  return base + streakBonus
}
