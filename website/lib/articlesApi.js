import { createClient } from './supabase/client'
import { slugify } from './slugify'

const supabase = createClient()

export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchArticle(id) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function fetchArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function createArticle({ title, body, author, cover_image_url }) {
  const base = slugify(title)
  let slug = base
  let attempt = 0

  while (true) {
    const { data, error } = await supabase
      .from('articles')
      .insert({ title, body, author, cover_image_url, slug, published_at: new Date().toISOString() })
      .select()
      .single()
    if (!error) return data
    if (error.code !== '23505') throw error  // 23505 = unique_violation
    attempt++
    slug = `${base}-${attempt + 1}`
  }
}

export async function updateArticle(id, patch) {
  const { data, error } = await supabase
    .from('articles')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}
