const SITE         = 'https://incentivefinance.org'
const SUPABASE_URL = 'https://vecwhxowbtmbnyjvwjpn.supabase.co'
const SUPABASE_KEY = 'sb_publishable_yx-D2323BzpcDlkDvqdD3w_Da6Pl1wx'

const STATIC_ROUTES = [
  { path: '/',          changefreq: 'weekly',  priority: '1.0' },
  { path: '/articles',  changefreq: 'daily',   priority: '0.9' },
  { path: '/learn',     changefreq: 'weekly',  priority: '0.8' },
  { path: '/quizzes',   changefreq: 'weekly',  priority: '0.7' },
  { path: '/resources', changefreq: 'monthly', priority: '0.6' },
  { path: '/about',     changefreq: 'monthly', priority: '0.5' },
]

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html) {
  return (html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function staticEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

function articleEntry(a, today) {
  const loc      = `${SITE}/articles/${a.id}`
  const lastmod  = a.published_at ? a.published_at.slice(0, 10) : today
  const pubDate  = a.published_at ?? today
  const title    = escapeXml(a.title)
  const author   = a.author ? escapeXml(a.author) : null
  const bodyText = stripHtml(a.body ?? '')
  // First 300 chars of plain text as a snippet Google can use for context
  const snippet  = escapeXml(bodyText.slice(0, 300))

  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>0.8</priority>`,
    `    <news:news>`,
    `      <news:publication>`,
    `        <news:name>Incentive</news:name>`,
    `        <news:language>en</news:language>`,
    `      </news:publication>`,
    `      <news:publication_date>${pubDate}</news:publication_date>`,
    `      <news:title>${title}</news:title>`,
    `    </news:news>`,
    author ? `    <author>${author}</author>` : '',
    snippet ? `    <description>${snippet}</description>` : '',
    '  </url>',
  ].filter(Boolean).join('\n')
}

export default async function handler(req, res) {
  let articles = []
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=id,title,body,author,published_at&order=published_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )
    if (r.ok) articles = await r.json()
  } catch {}

  const today = new Date().toISOString().slice(0, 10)

  const entries = [
    ...STATIC_ROUTES.map(r =>
      staticEntry({ loc: `${SITE}${r.path}`, lastmod: today, changefreq: r.changefreq, priority: r.priority })
    ),
    ...articles.map(a => articleEntry(a, today)),
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n')

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
