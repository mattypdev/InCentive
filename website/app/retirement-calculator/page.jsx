import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RetirementCalc from './RetirementCalc'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

export const metadata = {
  title: 'Free Retirement Savings Calculator | Incentive',
  description: 'Free retirement savings calculator. Adjust your age, savings balance, monthly contributions, and expected return to project what you\'ll have at retirement.',
  alternates: { canonical: `${SITE}/retirement-calculator` },
  openGraph: {
    title: 'Free Retirement Savings Calculator | Incentive',
    description: 'Free retirement savings calculator. Adjust your age, savings balance, monthly contributions, and expected return to project what you\'ll have at retirement.',
    url: `${SITE}/retirement-calculator`,
    type: 'website',
  },
}

const appLd = webAppLd({
  name: 'Retirement Calculator',
  description: 'Project your retirement savings based on current age, retirement age, existing savings, monthly contributions, and expected annual return.',
  url: `${SITE}/retirement-calculator`,
})

const crumbLd = breadcrumbLd([
  ['Resources', '/resources'],
  ['Retirement Calculator', '/retirement-calculator'],
])

export default function RetirementCalculatorPage() {
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
          <h1>Retirement Calculator</h1>
          <p>Plan ahead and see what it takes to retire on your terms.</p>
        </div>

        <RetirementCalc />
      </div>
    </section>
  )
}
