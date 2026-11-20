// Very small list covering the most common slurs/profanity.
// Not exhaustive — just catches obvious cases without a heavy dependency.
const BAD_WORDS = [
  'fuck','shit','ass','bitch','cunt','dick','cock','pussy','nigger','nigga',
  'faggot','fag','whore','slut','bastard','damn','retard','kike','spic','chink',
  'diddy','sus',
]

const RESERVED = ['admin','teacher','incentive','support','moderator','mod','staff']

/**
 * Returns an error string if invalid, or null if OK.
 * @param {string} raw
 * @param {{ maxLen?: number }} opts
 */
export function validateDisplayName(raw, { maxLen = 10 } = {}) {
  const v = raw.trim()
  if (!v) return 'Name is required.'
  if (v.length > maxLen) return `Name must be ${maxLen} characters or fewer.`
  if (!/^[a-zA-Z0-9 '_.-]+$/.test(v)) return 'Only letters, numbers, spaces, and . _ \' - are allowed.'
  if (/^\s|\s$/.test(v)) return 'Name cannot start or end with a space.'
  if (/\s{2,}/.test(v)) return 'No double spaces.'

  const lower = v.toLowerCase().replace(/[^a-z]/g, '')
  for (const word of BAD_WORDS) {
    if (lower.includes(word)) return 'That name isn\'t allowed.'
  }
  for (const word of RESERVED) {
    if (lower === word) return 'That name is reserved.'
  }

  return null
}
