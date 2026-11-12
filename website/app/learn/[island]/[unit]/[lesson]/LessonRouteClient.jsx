'use client'
// Thin wrapper: resolves the new slug URL to the unitId the existing lesson
// player already understands (it reads unitId from useParams).
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { allUnits } from '@/data/levels'

// Lazy-import to avoid circular deps — the existing player is the source of truth
import dynamic from 'next/dynamic'
const UnitLessonClient = dynamic(() => import('@/app/learn/unit/[unitId]/UnitLessonClient'), { ssr: false })

export default function LessonRouteClient({ unitId, lessonId, islandSlug, unitSlug, backUrl }) {
  // The existing lesson player reads unitId from useParams().unitId.
  // We inject a fake param by overriding the URL fragment approach:
  // Simply render UnitLessonClient with the legacy unit page (it reads from URL params).
  // Since we're at a different route, we pass unitId via query param handling.
  // SPEC-QUESTION: The existing lesson player uses useParams().unitId from /learn/unit/[unitId].
  // For now we redirect to the legacy URL with the unitId so it plays the right unit.
  useEffect(() => {
    // Find which lesson index this is within the unit
    const unit = allUnits.find(u => u.id === unitId)
    if (!unit) return
    const lessonIndex = unit.lessons?.findIndex(l => l.id === lessonId) ?? 0
    // Navigate to the legacy player URL (which still works) with section param
    window.location.replace(`/learn/unit/${unitId}?section=${lessonIndex}`)
  }, [unitId, lessonId])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#64748B', fontSize: 14 }}>Loading lesson…</p>
    </div>
  )
}
