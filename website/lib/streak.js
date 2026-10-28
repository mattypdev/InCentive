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
