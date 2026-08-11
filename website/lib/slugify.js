export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[''']/g, '')         // "don't" → "dont"
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '')
}
