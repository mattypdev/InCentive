const KEY = 'incentive_streak'

// YYYY-MM-DD in local time (avoids UTC-date drift)
function todayStr() {
  return new Date().toLocaleDateString('en-CA')
}

export function readStreak() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null') ?? { count: 0, lastDate: null }
  } catch {
    return { count: 0, lastDate: null }
  }
}

function writeStreak(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function clearStreak() {
  try { localStorage.removeItem(KEY) } catch {}
}

// Call on lesson complete. Returns { count, isNew }.
// isNew = true only the first time a lesson is finished on a given calendar day.
export function advanceStreak() {
  const t = todayStr()
  const { count, lastDate } = readStreak()
  if (lastDate === t) return { count, isNew: false }

  const prev = new Date()
  prev.setDate(prev.getDate() - 1)
  const yStr = prev.toLocaleDateString('en-CA')

  const newCount = lastDate === yStr ? count + 1 : 1
  writeStreak({ count: newCount, lastDate: t })
  return { count: newCount, isNew: true }
}

// Last count the user has already seen an animation for — prevents replaying on reload.
const SEEN_KEY = 'incentive_streak_seen'
export function getSeenCount() {
  try { return parseInt(localStorage.getItem(SEEN_KEY) ?? '0', 10) || 0 } catch { return 0 }
}
export function setSeenCount(n) {
  try { localStorage.setItem(SEEN_KEY, String(n)) } catch {}
}

// True when the user has a streak, hasn't acted today, and it's past 8 PM local time.
export function isAtRisk() {
  try {
    const { count, lastDate } = readStreak()
    if (!count) return false
    if (lastDate === todayStr()) return false
    return new Date().getHours() >= 20
  } catch { return false }
}
