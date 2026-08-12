import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoanCalc from './LoanCalc'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

export const metadata = {
  title: 'Free Loan Payment Calculator | Incentive',
  description: 'Free loan payment calculator. Enter your loan amount, interest rate, and repayment term to estimate your monthly payment, total interest, and payoff timeline.',
  alternates: { canonical: `${SITE}/loan-calculator` },
  openGraph: {
    title: 'Free Loan Payment Calculator | Incentive',
    description: 'Free loan payment calculator. Enter your loan amount, interest rate, and repayment term to estimate your monthly payment, total interest, and payoff timeline.',
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
