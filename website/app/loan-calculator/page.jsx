import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoanCalc from './LoanCalc'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

export const metadata = {
  title: 'Loan Calculator — Incentive',
  description: 'Estimate monthly payments, total interest, and payoff timelines for any loan. Adjust amount, rate, and term to plan your borrowing.',
  alternates: { canonical: `${SITE}/loan-calculator` },
  openGraph: {
    title: 'Loan Calculator — Incentive',
    description: 'Estimate monthly payments, total interest, and payoff timelines for any loan.',
    url: `${SITE}/loan-calculator`,
    type: 'website',
  },
}

const appLd = webAppLd({
  name: 'Loan Calculator',
  description: 'Estimate monthly loan payments, total interest paid, and payoff timeline based on loan amount, interest rate, and term.',
  url: `${SITE}/loan-calculator`,
})

const crumbLd = breadcrumbLd([
  ['Resources', '/resources'],
  ['Loan Calculator', '/loan-calculator'],
])

export default function LoanCalculatorPage() {
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
          <h1>Loan Calculator</h1>
          <p>Estimate monthly payments, total interest, and payoff timelines.</p>
        </div>

        <LoanCalc />
      </div>
    </section>
  )
}
