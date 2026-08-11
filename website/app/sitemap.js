import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://incentivefinance.org'

// Hardcoded per-URL content dates — update these when a page's content changes,
// not on every deploy (avoids crawlers re-indexing unchanged pages).
const D = {
  home:        '2026-08-11',
  calculators: '2026-08-11',
  articles:    '2026-08-11',
  about:       '2026-08-11',
  learn:       '2026-08-11',
  resources:   '2026-08-11',
  leaderboard: '2026-08-11',
  quizzes:     '2026-08-11',
}

export default async function sitemap() {
  const staticRoutes = [
    // Priority 1.0 — homepage
    { url: `${BASE_URL}/`,                      lastModified: D.home,        changeFrequency: 'weekly',  priority: 1.0 },

    // Priority 0.9 — highest search-intent tool pages + article index
    { url: `${BASE_URL}/compound-interest`,     lastModified: D.calculators, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/loan-calculator`,       lastModified: D.calculators, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/retirement-calculator`, lastModified: D.calculators, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/articles`,              lastModified: D.articles,    changeFrequency: 'weekly',  priority: 0.9 },

    // Priority 0.8 — individual articles (dynamic below) + about
    { url: `${BASE_URL}/about`,                 lastModified: D.about,       changeFrequency: 'monthly', priority: 0.8 },

    // Priority 0.7 — learn hub + resources
    { url: `${BASE_URL}/learn`,                 lastModified: D.learn,       changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/resources`,             lastModified: D.resources,   changeFrequency: 'monthly', priority: 0.7 },

    // Priority 0.6 — leaderboard (app feature, lower discovery value)
    { url: `${BASE_URL}/leaderboard`,           lastModified: D.leaderboard, changeFrequency: 'daily',   priority: 0.6 },

    // Priority 0.5 — quizzes (requires code, low organic search value)
    { url: `${BASE_URL}/quizzes`,               lastModified: D.quizzes,     changeFrequency: 'weekly',  priority: 0.5 },
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
        lastModified: article.updated_at ? new Date(article.updated_at) : D.articles,
        changeFrequency: 'monthly',
        priority: 0.8,
      }))
    }
  } catch {
    // silently skip article routes if Supabase is unavailable at build time
  }

  return [...staticRoutes, ...articleRoutes]
}
