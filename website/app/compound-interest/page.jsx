import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import CompoundInterestCalc from './CompoundInterestCalc'
import FAQ from '@/components/FAQ'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

const faqItems = [
  {
    question: 'What is compound interest?',
    answer: 'Compound interest is interest calculated on both your original deposit and the interest you have already earned. Unlike simple interest—which only ever applies to your starting amount—compound interest snowballs: each period, your earnings generate their own earnings. A $1,000 deposit at 7% for 30 years grows to $7,612 with compounding versus $3,100 with simple interest.',
  },
  {
    question: 'How does this compound interest calculator work?',
    answer: 'Enter your starting principal, how much you plan to add each month, your expected annual interest rate, and how many years you plan to save or invest. The calculator applies the standard compound interest formula—A = P(1 + r/n)^nt—and shows your projected balance, total contributions, and total interest earned on a growth chart.',
  },
  {
    question: 'What annual return rate should I use?',
    answer: 'Use 7% for a broad stock market index fund (the S&P 500\'s historical average after inflation), 4–5% for a high-yield savings account, and 3–4% for a conservative bond-heavy portfolio. Be skeptical of projections above 10%—those rarely reflect real after-fee, after-inflation returns over long periods.',
  },
  {
    question: 'How much does compounding frequency affect my balance?',
    answer: 'Less than most people expect. A $10,000 deposit at 6% over 20 years grows to $32,071 compounded annually and $33,198 compounded daily—a difference of about $1,127. The interest rate matters far more than frequency. When comparing accounts, use APY (Annual Percentage Yield), which already accounts for compounding frequency.',
  },
  {
    question: 'What is the Rule of 72?',
    answer: 'The Rule of 72 is a mental math shortcut: divide 72 by your annual interest rate to estimate how many years it takes your money to double. At 6%, your money doubles in 12 years (72 ÷ 6). At 9%, it doubles in 8 years. The rule also works in reverse for debt—a 24% credit card doubles what you owe in just 3 years.',
  },
  {
    question: 'Is compound interest the same as APY?',
    answer: 'APY (Annual Percentage Yield) is the rate that already incorporates compounding. A 6% nominal rate compounded monthly has an APY of about 6.17%. When comparing savings accounts or CDs, always compare APY rather than the nominal rate—it tells you the true annual return with compounding already factored in.',
  },
  {
    question: 'Why does starting at 22 beat starting at 32?',
    answer: 'Time is the single most powerful variable in compound interest. Investing $200 per month at 7% starting at 22 produces about $655,500 by retirement at 65. Starting at 32 with the same amount produces about $308,800—roughly half—despite contributing only $24,000 less in total. The 10-year head start generates $346,700 more because compound growth is exponential, not linear.',
  },
  {
    question: 'Can compound interest work against me?',
    answer: 'Yes. Credit cards and payday loans compound interest on what you owe, not what you save. A $5,000 credit card balance at 24% APR compounding daily doubles to $10,000 in about 3 years if you only make minimum payments. The same math that builds long-term wealth accelerates debt. Paying off high-interest debt should come before prioritizing investments.',
  },
]

export const metadata = {
  title: 'Free Compound Interest Calculator | Incentive',
  description: 'Free compound interest calculator — enter your principal, monthly contribution, rate, and years to see exactly how your savings or investments will grow.',
  alternates: { canonical: `${SITE}/compound-interest` },
  openGraph: {
    title: 'Free Compound Interest Calculator | Incentive',
    description: 'Free compound interest calculator — enter your principal, monthly contribution, rate, and years to see exactly how your savings or investments will grow.',
    url: `${SITE}/compound-interest`,
    type: 'website',
  },
}

const appLd = webAppLd({
  name: 'Compound Interest Calculator',
  description: 'Calculate how money grows over time with compound interest, including monthly contributions and a visual growth chart.',
  url: `${SITE}/compound-interest`,
})

const crumbLd = breadcrumbLd([
  ['Resources', '/resources'],
  ['Compound Interest Calculator', '/compound-interest'],
])

export default function CompoundInterestPage() {
  return (
    <section className="calc-page section">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />

        <Link href="/resources" className="calc-back">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Resources
        </Link>

        <div className="calc-header">
          <h1>Compound Interest Calculator</h1>
          <p>See how your money grows over time with the power of compounding.</p>
        </div>

        <CompoundInterestCalc />

        <div className="calc-article-link">
          <BookOpen size={20} strokeWidth={2} />
          <div>
            <p className="calc-article-link-label">Want the full explanation?</p>
            <Link href="/articles/how-compound-interest-works" className="calc-article-link-anchor">
              Read our guide — How Compound Interest Works →
            </Link>
          </div>
        </div>

        <FAQ items={faqItems} />
      </div>
    </section>
  )
}
