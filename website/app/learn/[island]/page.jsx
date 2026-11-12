import { notFound, redirect } from 'next/navigation'
import IslandPageClient from './IslandPageClient'
import { islands, islandBySlug, unitsByIsland } from '@/lib/content/islands'
import { SITE, breadcrumbLd } from '@/lib/schema'
import { FLAGS } from '@/lib/flags'

export async function generateStaticParams() {
  return islands.map(i => ({ island: i.slug }))
}

export async function generateMetadata({ params }) {
  const { island: slug } = await params
  const isl = islandBySlug[slug]
  if (!isl) return {}
  return {
    title: `${isl.title} | Incentive`,
    description: isl.tagline,
    alternates: { canonical: `${SITE}/learn/${slug}` },
  }
}

export default async function IslandPage({ params }) {
  // Redirect to old /learn if islands flag is off (safety valve on prod)
  if (!FLAGS.islands) redirect('/learn')

  const { island: slug } = await params
  const isl = islandBySlug[slug]
  if (!isl) notFound()

  const units = unitsByIsland(slug)

  const crumbLd = breadcrumbLd([
    ['Learn', '/learn'],
    [isl.title, `/learn/${slug}`],
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <IslandPageClient island={isl} units={units} />
    </>
  )
}
