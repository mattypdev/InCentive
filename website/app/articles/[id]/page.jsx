import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import '@/app/(pages)/Articles.css'

const SITE = 'https://incentivefinance.org'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title, body, cover_image_url, published_at, author')
    .eq('id', id)
    .single()

  if (!article) return { title: 'Article Not Found — Incentive' }

  const description = stripHtml(article.body).slice(0, 155)
  const canonical = `${SITE}/articles/${id}`

  return {
    title: `${article.title} — Incentive`,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: article.title,
      description,
      url: canonical,
      siteName: 'Incentive',
      ...(article.cover_image_url ? { images: [{ url: article.cover_image_url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      ...(article.cover_image_url ? { images: [article.cover_image_url] } : {}),
    },
  }
}

export default async function ArticlePage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !article) notFound()

  const description = stripHtml(article.body).slice(0, 155)
  const canonical = `${SITE}/articles/${id}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    datePublished: article.published_at,
    author: article.author ? { '@type': 'Person', name: article.author } : undefined,
    image: article.cover_image_url || undefined,
    publisher: { '@type': 'Organization', name: 'Incentive', url: SITE },
    url: canonical,
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="section">
        <div className="container article-page">
          <Link href="/articles" className="article-back">
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
