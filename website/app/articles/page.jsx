import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Calendar, User } from 'lucide-react'
import '@/app/(pages)/Articles.css'

export const metadata = {
  title: 'Articles — Incentive',
  description: 'Personal finance articles on budgeting, investing, taxes, and more. Learn how to manage and grow your money.',
  alternates: { canonical: 'https://incentivefinance.org/articles' },
  openGraph: {
    title: 'Articles — Incentive',
    description: 'Personal finance articles on budgeting, investing, taxes, and more.',
    url: 'https://incentivefinance.org/articles',
    type: 'website',
  },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function excerpt(body, max = 180) {
  if (!body) return ''
  const plain = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return plain.length > max ? plain.slice(0, max).trimEnd() + '…' : plain
}

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: articles = [], error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })

  return (
    <main>
      <section className="articles-hero section">
        <div className="container">
          <h1 className="articles-title">
            in<span className="brand-highlight">cent</span>ive Articles
          </h1>
          <p className="articles-subtitle">
            Financial literacy insights, tips, and stories from our team.
          </p>
        </div>
      </section>

      <section className="articles-list section">
        <div className="container">
          {error && <p className="articles-empty">Failed to load articles.</p>}
          {!error && (!articles || articles.length === 0) && (
            <p className="articles-empty">No articles yet — check back soon.</p>
          )}
          <div className="articles-grid">
            {(articles ?? []).map(a => (
              <Link key={a.id} href={`/articles/${a.id}`} className="article-card">
                <div className="article-card-body">
                  <h2 className="article-card-title">{a.title}</h2>
                  <p className="article-card-excerpt">{excerpt(a.body)}</p>
                </div>
                <div className="article-card-meta">
                  {a.author && (
                    <span className="article-meta-item">
                      <User size={13} strokeWidth={2} />
                      {a.author}
                    </span>
                  )}
                  <span className="article-meta-item">
                    <Calendar size={13} strokeWidth={2} />
                    {formatDate(a.published_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
