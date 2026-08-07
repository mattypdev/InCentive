const SITE = 'https://incentivefinance.org'

const STATIC_ROUTES = [
  { path: '/',          changefreq: 'weekly',  priority: '1.0' },
  { path: '/articles',  changefreq: 'daily',   priority: '0.9' },
  { path: '/learn',     changefreq: 'weekly',  priority: '0.8' },
  { path: '/quizzes',   changefreq: 'weekly',  priority: '0.7' },
  { path: '/resources', changefreq: 'monthly', priority: '0.6' },
  { path: '/about',     changefreq: 'monthly', priority: '0.5' },
]

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod    ? `    <lastmod>${lastmod}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority   ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n')
}

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey     = process.env.VITE_SUPABASE_ANON_KEY

  let articles = []
  if (supabaseUrl && anonKey) {
    try {
      const r = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=id,published_at&order=published_at.desc`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
      )
      if (r.ok) articles = await r.json()
    } catch {}
  }

  const today = new Date().toISOString().slice(0, 10)

  const entries = [
    ...STATIC_ROUTES.map(r => urlEntry({ loc: `${SITE}${r.path}`, changefreq: r.changefreq, priority: r.priority, lastmod: today })),
    ...articles.map(a => urlEntry({
      loc:        `${SITE}/articles/${a.id}`,
      lastmod:    a.published_at ? a.published_at.slice(0, 10) : today,
      changefreq: 'monthly',
      priority:   '0.8',
    })),
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n')

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
