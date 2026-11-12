import { notFound } from 'next/navigation'
import { islands, unitsByIsland, lessonsByUnit } from '@/lib/content/islands'
import UnitCheckClient from './UnitCheckClient'

// Unit Check questions for Credit Cards unit (u4-2)
// In the full build these are pulled from the questions table; for M2 they're inline.
const UNIT_CHECK_QUESTIONS = {
  'u4-2': [
    {
      questionId: 'uc-u4-2-q1', type: 'mc',
      prompt: 'What does APR stand for?',
      explanation: 'APR stands for Annual Percentage Rate — the yearly interest rate charged on a balance.',
      config: { options: [{id:'a',text:'Annual Payment Rate'},{id:'b',text:'Annual Percentage Rate'},{id:'c',text:'Adjusted Principal Rate'},{id:'d',text:'Accrued Payment Ratio'}], correct: 'b' },
    },
    {
      questionId: 'uc-u4-2-q2', type: 'mc',
      prompt: 'A $1,000 balance at 24% APR. How much interest accrues in one month?',
      explanation: '$1,000 × (24% ÷ 12) = $1,000 × 0.02 = $20.',
      config: { options: [{id:'a',text:'$24'},{id:'b',text:'$2'},{id:'c',text:'$20'},{id:'d',text:'$240'}], correct: 'c' },
    },
    {
      questionId: 'uc-u4-2-q3', type: 'mc',
      prompt: 'What is the credit card grace period?',
      explanation: 'The grace period is the time between the statement close date and the due date — typically 21–25 days. If you pay in full before the due date, no interest is charged.',
      config: { options: [{id:'a',text:'The time before you get charged a late fee'},{id:'b',text:'The period where you can dispute charges'},{id:'c',text:'The time between statement close and due date, during which no interest accrues if paid in full'},{id:'d',text:'A 90-day window to cancel a purchase'}], correct: 'c' },
    },
    {
      questionId: 'uc-u4-2-q4', type: 'mc',
      prompt: 'Which action eliminates your credit card grace period?',
      explanation: 'Taking a cash advance or carrying a balance from the previous month removes the grace period — interest starts accruing immediately on new purchases.',
      config: { options: [{id:'a',text:'Making a purchase over $500'},{id:'b',text:'Carrying a balance from the previous month'},{id:'c',text:'Making two payments in one month'},{id:'d',text:'Having an authorized user'}], correct: 'b' },
    },
    {
      questionId: 'uc-u4-2-q5', type: 'slider',
      prompt: 'You have $1,000 at 24% APR and pay $25/month. About how many months to pay it off?',
      explanation: 'At minimum payments, it takes about 81 months — nearly 7 years.',
      config: { min: 0, max: 120, correct: 81, unit: 'months', tolerance: 0.20 },
    },
    {
      questionId: 'uc-u4-2-q6', type: 'mc',
      prompt: 'What does "cash back" mean on a rewards credit card?',
      explanation: 'Cash back returns a percentage of spending as a reward — typically 1–5%. It\'s only beneficial if you pay in full each month; otherwise interest wipes out the reward.',
      config: { options: [{id:'a',text:'You receive actual cash at an ATM from purchases'},{id:'b',text:'A percentage of spending is returned as a statement credit or deposit'},{id:'c',text:'The card refunds any purchase within 30 days'},{id:'d',text:'Cash purchases earn double rewards'}], correct: 'b' },
    },
    {
      questionId: 'uc-u4-2-q7', type: 'mc',
      prompt: 'Credit utilization is 30% of your FICO score. If your limit is $5,000, what balance keeps you under 30% utilization?',
      explanation: '30% of $5,000 = $1,500. Staying at or below this helps your credit score.',
      config: { options: [{id:'a',text:'$500'},{id:'b',text:'$1,500'},{id:'c',text:'$2,500'},{id:'d',text:'$4,000'}], correct: 'b' },
    },
    {
      questionId: 'uc-u4-2-q8', type: 'spot_mistake',
      prompt: 'Tap the line on this pay stub that can\'t be right.',
      explanation: 'Net pay can\'t exceed gross pay. The statement shows net = $620 on gross = $600, which is impossible.',
      config: {
        title: 'PAY STUB · Oct 1–15',
        rows: [
          { id: 'gross', label: 'Gross pay', value: '$600.00' },
          { id: 'fed', label: 'Federal income tax', value: '−$36.00' },
          { id: 'ss', label: 'Social Security 6.2%', value: '−$37.20' },
          { id: 'med', label: 'Medicare 1.45%', value: '−$8.70' },
          { id: 'net', label: 'Net pay', value: '$620.00' },
        ],
        correct: 'net',
      },
    },
    {
      questionId: 'uc-u4-2-q9', type: 'mc',
      prompt: 'You\'re comparing two cards: Card A earns 2% cash back, Card B earns 1.5%. You spend $500/month. Which earns more annually?',
      explanation: 'Card A: 2% × $500 × 12 = $120/year. Card B: 1.5% × $500 × 12 = $90/year. Card A earns $30 more.',
      config: { options: [{id:'a',text:'Card A ($120/year)'},{id:'b',text:'Card B ($90/year)'},{id:'c',text:'Both earn the same'},{id:'d',text:'It depends on the interest rate'}], correct: 'a' },
    },
    {
      questionId: 'uc-u4-2-q10', type: 'mc',
      prompt: 'What is a balance transfer?',
      explanation: 'A balance transfer moves debt from one card to another — usually to take advantage of a 0% intro APR offer. A transfer fee (typically 3–5%) applies.',
      config: { options: [{id:'a',text:'Moving money from checking to a credit card'},{id:'b',text:'Moving debt from one card to another, often for a lower rate'},{id:'c',text:'Transferring a card to another person'},{id:'d',text:'Splitting a balance between two cards automatically'}], correct: 'b' },
    },
  ],
}

export async function generateStaticParams() {
  const out = []
  for (const island of islands) {
    for (const unit of unitsByIsland(island.slug)) {
      out.push({ island: island.slug, unit: unit.slug })
    }
  }
  return out
}

export default async function UnitCheckPage({ params }) {
  const { island: islandSlug, unit: unitSlug } = await params

  const island = islands.find(i => i.slug === islandSlug)
  if (!island) notFound()

  const unit = unitsByIsland(islandSlug).find(u => u.slug === unitSlug)
  if (!unit) notFound()

  const questions = UNIT_CHECK_QUESTIONS[unit.id] ?? []

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted-foreground)' }}>
        No Unit Check available for this unit yet.
      </div>
    )
  }

  return (
    <UnitCheckClient
      unit={unit}
      questions={questions}
      backUrl={`/learn/${islandSlug}/${unitSlug}`}
    />
  )
}
