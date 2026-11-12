// ─── Teacher Hub utilities ─────────────────────────────────────────────────

/** Format a timestamp as relative time (e.g. "2 hr ago", "Today", "6 days ago") */
export function relativeTime(ts: string | null | undefined): string {
  if (!ts) return '—'
  const ms = Date.now() - new Date(ts).getTime()
  if (ms < 0) return 'just now'
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const wks = Math.floor(days / 7)
  if (wks < 4) return `${wks} wk ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Score → CSS class name (.m4 / .m3 / .m2 / .m1 / .m0) */
export function scoreClass(score: number | null | undefined): string {
  if (score == null) return 'm0'
  if (score >= 90) return 'm4'
  if (score >= 70) return 'm3'
  if (score >= 50) return 'm2'
  return 'm1'
}

/** Score display text */
export function scoreLabel(score: number | null | undefined): string {
  if (score == null) return '—'
  return `${score}%`
}

/** Deterministic avatar background from student ID */
const AVATAR_COLORS = ['#CCFBF1', '#E0F2FE', '#FFE9E6', '#FEF3C7', '#EDE9FE', '#DCFCE7']

export function avatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xFFFFFFFF
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/** Student initials from first_name + last_initial */
export function initials(firstName: string | null | undefined, lastInitial: string | null | undefined): string {
  const f = (firstName ?? 'S')[0] ?? 'S'
  const l = (lastInitial ?? 'S')[0] ?? 'S'
  return (f + l).toUpperCase()
}

/** Display name: "Aisha K." */
export function displayName(firstName: string | null | undefined, lastInitial: string | null | undefined): string {
  const f = firstName ?? 'Student'
  const l = lastInitial ? `${lastInitial}.` : ''
  return `${f} ${l}`.trim()
}

/** Greeting based on hour */
export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
