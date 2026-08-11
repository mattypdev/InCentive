import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://incentivefinance.org'

export default async function sitemap() {
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE_URL}/quizzes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/compound-interest`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/loan-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/retirement-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let articleRoutes = []
  try {
    const supabase = await createClient()
    const { data: articles } = await supabase
      .from('articles')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })

    if (articles) {
      articleRoutes = articles.map(article => ({
        url: `${BASE_URL}/articles/${article.id}`,
        lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
    }
  } catch {
    // silently skip article routes if Supabase is unavailable at build time
  }

  return [...staticRoutes, ...articleRoutes]
}
