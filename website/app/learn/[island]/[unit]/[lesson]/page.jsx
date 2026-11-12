// Full lesson player at /learn/{island}/{unit}/{lesson}
import { notFound } from 'next/navigation'
import { islands, lessonsByUnit, unitsByIsland } from '@/lib/content/islands'
import LessonPlayerShell from './LessonPlayerShell'

export async function generateStaticParams() {
  const out = []
  for (const island of islands) {
    for (const unit of unitsByIsland(island.slug)) {
      for (const lesson of lessonsByUnit(unit.id)) {
        out.push({ island: island.slug, unit: unit.slug, lesson: lesson.slug })
      }
    }
  }
  return out
}

export async function generateMetadata({ params }) {
  const { island: islandSlug, unit: unitSlug, lesson: lessonSlug } = await params
  const unit = unitsByIsland(islandSlug)?.find(u => u.slug === unitSlug)
  const lesson = unit ? lessonsByUnit(unit.id).find(l => l.slug === lessonSlug) : null
  if (!lesson) return {}
  return {
    title: `${lesson.title} | Incentive`,
    description: lesson.objective,
  }
}

export default async function LessonSlugPage({ params }) {
  const { island: islandSlug, unit: unitSlug, lesson: lessonSlug } = await params

  const island = islands.find(i => i.slug === islandSlug)
  if (!island) notFound()

  const unit = unitsByIsland(islandSlug).find(u => u.slug === unitSlug)
  if (!unit) notFound()

  const lesson = lessonsByUnit(unit.id).find(l => l.slug === lessonSlug)
  if (!lesson) notFound()

  // Use new LessonPlayer if lesson has steps, otherwise fall back to legacy bridge
  if (lesson.steps.length > 0) {
    return (
      <LessonPlayerShell
        lesson={lesson}
        islandSlug={islandSlug}
        unitSlug={unitSlug}
        backUrl={`/learn/${islandSlug}/${unitSlug}`}
      />
    )
  }

  // Legacy bridge for lessons without steps
  const { default: LessonRouteClient } = await import('./LessonRouteClient')
  return (
    <LessonRouteClient
      unitId={unit.id}
      lessonId={lesson.id}
      islandSlug={islandSlug}
      unitSlug={unitSlug}
      backUrl={`/learn/${islandSlug}`}
    />
  )
}
