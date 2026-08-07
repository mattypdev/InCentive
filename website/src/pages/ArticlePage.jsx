import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchArticle } from '../lib/articlesApi'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import './Articles.css'

const SITE = 'https://incentivefinance.org'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
}

export default function ArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetchArticle(id)
      .then(setArticle)
      .catch(() => setError('Article not found.'))
  }, [id])

  if (error) return (
    <main>
      <section className="section">
        <div className="container article-page">
          <p>{error}</p>
          <Link to="/articles" className="article-back"><ArrowLeft size={14} /> Back to Articles</Link>
        </div>
      </section>
    </main>
  )

  if (!article) return (
    <main>
      <section className="section">
        <div className="container article-page">
          <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p>
        </div>
      </section>
    </main>
  )

  const description = stripHtml(article.body).slice(0, 155)
  const canonical   = `${SITE}/articles/${id}`

  return (
    <main>
      <Helmet>
        <title>{article.title} — Incentive</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url"         content={canonical} />
        {article.cover_image_url && <meta property="og:image" content={article.cover_image_url} />}
        <meta property="og:site_name"   content="Incentive" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={article.title} />
        <meta name="twitter:description" content={description} />
        {article.cover_image_url && <meta name="twitter:image" content={article.cover_image_url} />}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description,
          datePublished: article.published_at,
          author: article.author ? { '@type': 'Person', name: article.author } : undefined,
          image: article.cover_image_url || undefined,
          publisher: { '@type': 'Organization', name: 'Incentive', url: SITE },
          url: canonical,
        })}</script>
      </Helmet>
      <section className="section">
        <div className="container article-page">
          <Link to="/articles" className="article-back">
            <ArrowLeft size={14} /> Back to Articles
          </Link>
          <h1 className="article-heading">{article.title}</h1>
          <div className="article-meta">
            {article.author && (
              <span className="article-meta-item">
                <User size={14} strokeWidth={2} />
                {article.author}
              </span>
            )}
            <span className="article-meta-item">
              <Calendar size={14} strokeWidth={2} />
              {formatDate(article.published_at)}
            </span>
          </div>
          {article.cover_image_url && (
            <img src={article.cover_image_url} alt="" className="article-cover" />
          )}
          <div
            className="article-body article-body--html"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>
      </section>
    </main>
  )
}
