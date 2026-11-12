import { notFound } from 'next/navigation'
import { islands, unitsByIsland, lessonsByUnit } from '@/lib/content/islands'
import SwipeRoundClient from './SwipeRoundClient'

// Sample true/false cards for the Minimum Payments unit (u4-2)
// In the full build these come from a content DB; for M2 they're inline.
const SWIPE_CARDS = {
  'u4-2': [
    { id: 's1', statement: 'Paying your credit card on time means you never pay interest.', correct: false, explanation: 'On-time payments avoid late fees, not interest. Interest accrues on any balance you carry.' },
    { id: 's2', statement: 'Most of a minimum payment goes toward reducing your balance.', correct: false, explanation: 'At 24% APR, about $20 of a $25 minimum goes to interest on a $1,000 balance — only $5 reduces the balance.' },
    { id: 's3', statement: 'Doubling your minimum payment cuts payoff time more than in half.', correct: true, explanation: 'Going from $25 to $50/month cuts payoff from 81 months to 26 — less than a third of the time.' },
    { id: 's4', statement: 'A credit card statement is required by law to show a minimum payment warning.', correct: true, explanation: 'The CARD Act of 2009 requires this box on every statement that carries a balance.' },
    { id: 's5', statement: 'If you always pay the minimum, your balance will eventually reach $0 in less than a year.', correct: false, explanation: 'At 24% APR with a $1,000 balance, minimum payments take about 81 months — nearly 7 years.' },
    { id: 's6', statement: 'Paying the full statement balance every month means you pay $0 in interest.', correct: true, explanation: 'If you pay the full balance each billing cycle, the grace period applies and no interest is charged.' },
    { id: 's7', statement: 'Your credit card interest is calculated on your balance once per year.', correct: false, explanation: 'Interest is calculated monthly (APR ÷ 12). It accrues every month you carry a balance.' },
    { id: 's8', statement: 'A $1,000 balance at 24% APR costs $20 in interest the first month.', correct: true, explanation: '$1,000 × (24% ÷ 12) = $1,000 × 0.02 = $20 in monthly interest.' },
    { id: 's9', statement: 'Cash advances on a credit card typically have no interest.', correct: false, explanation: 'Cash advances usually have higher APRs and start accruing interest immediately — there\'s no grace period.' },
    { id: 's10', statement: 'Paying even $5 more than the minimum each month can save significant interest.', correct: true, explanation: 'Every extra dollar goes straight to principal, shortening the payoff timeline and reducing total interest.' },
  ],
}

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const out = []
  for (const island of islands) {
    for (const unit of unitsByIsland(island.slug)) {
      out.push({ island: island.slug, unit: unit.slug })
    }
  }
  return out
}

export default async function SwipeRoundPage({ params }) {
  const { island: islandSlug, unit: unitSlug } = await params

  const island = islands.find(i => i.slug === islandSlug)
  if (!island) notFound()

  const unit = unitsByIsland(islandSlug).find(u => u.slug === unitSlug)
  if (!unit) notFound()

  const cards = SWIPE_CARDS[unit.id] ?? generateGenericCards(unit, lessonsByUnit(unit.id))

  return (
    <SwipeRoundClient
      unit={unit}
      cards={cards.slice(0, 10)}
      backUrl={`/learn/${islandSlug}/${unitSlug}`}
    />
  )
}

function generateGenericCards(unit, lessons) {
  // Fallback: generate placeholder true/false cards based on lesson titles
  return lessons.slice(0, 10).map((l, i) => ({
    id: `g${i}`,
    statement: `${l.title} is covered in the ${unit.title} unit.`,
    correct: true,
    explanation: l.objective,
  }))
}
