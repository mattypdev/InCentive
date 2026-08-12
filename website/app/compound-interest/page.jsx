import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import CompoundInterestCalc from './CompoundInterestCalc'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

export const metadata = {
  title: 'Compound Interest Calculator — Incentive',
  description: 'Calculate how your money grows with compound interest. Adjust principal, monthly contributions, rate, and time to see your personalised growth chart.',
  alternates: { canonical: `${SITE}/compound-interest` },
  openGraph: {
    title: 'Compound Interest Calculator — Incentive',
    description: 'See your money grow with compound interest. Adjust principal, monthly contributions, rate, and time.',
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
      </div>
    </section>
  )
}
