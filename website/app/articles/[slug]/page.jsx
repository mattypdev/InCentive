import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { ORG, SITE, breadcrumbLd } from '@/lib/schema'
import { slugify } from '@/lib/slugify'
import '@/app/(pages)/Articles.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
}

function wordCount(html) {
  return stripHtml(html).split(/\s+/).filter(Boolean).length
}

const resolveArticle = cache(async (slug) => {
  const supabase = await createClient()

  const { data: bySlug } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()
  if (bySlug) return { article: bySlug, redirect: null }

  if (/^\d+$/.test(slug)) {
    const { data: byId } = await supabase
      .from('articles')
      .select('*')
      .eq('id', slug)
      .single()
    if (byId) return { article: byId, redirect: byId.slug ? `/articles/${byId.slug}` : null }
  }

  return { article: null, redirect: null }
})

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { article } = await resolveArticle(slug)
  if (!article) return { title: 'Article Not Found | Incentive' }

  const raw = stripHtml(article.body)
  const description = raw.length > 155 ? raw.slice(0, 155).replace(/\s+\S*$/, '') : raw
  const canonical = `${SITE}/articles/${article.slug ?? slug}`

  return {
    title: `${article.title} | Incentive`,
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
  const { slug } = await params
  const { article, redirect } = await resolveArticle(slug)

  if (redirect) permanentRedirect(redirect)
  if (!article) notFound()

  const canonical = `${SITE}/articles/${article.slug ?? slug}`
  const description = stripHtml(article.body).slice(0, 155)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    datePublished: article.published_at,
    dateModified: article.published_at,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    wordCount: wordCount(article.body),
    url: canonical,
    ...(article.cover_image_url ? { image: article.cover_image_url } : {}),
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author,
          url: `${SITE}/authors/${slugify(article.author)}`,
        }
      : { '@type': 'Organization', ...ORG },
    publisher: ORG,
  }

  const crumbLd = breadcrumbLd([
    ['Articles', '/articles'],
    [article.title, `/articles/${article.slug ?? slug}`],
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
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
