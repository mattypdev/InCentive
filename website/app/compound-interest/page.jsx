import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CompoundInterestCalc from './CompoundInterestCalc'
import CompoundInterestContent from './CompoundInterestContent'
import '@/app/(pages)/Calculator.css'

export const metadata = {
  title: 'Compound Interest Calculator — Incentive',
  description: 'Calculate how your money grows with compound interest. Includes monthly contributions, a growth chart, and a plain-English guide to the formula, the Rule of 72, and why starting early matters.',
  alternates: { canonical: 'https://incentivefinance.org/compound-interest' },
  openGraph: {
    title: 'Compound Interest Calculator — Incentive',
    description: 'See your money grow with compound interest. Adjust principal, monthly contributions, rate, and time — then read the full guide below.',
    url: 'https://incentivefinance.org/compound-interest',
    type: 'website',
  },
}

export default function CompoundInterestPage() {
  return (
    <section className="calc-page section">
      <div className="container">
        <Link href="/resources" className="calc-back">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Resources
        </Link>

        <div className="calc-header">
          <h1>Compound Interest Calculator</h1>
          <p>See how your money grows over time with the power of compounding.</p>
        </div>

        <CompoundInterestCalc />
        <CompoundInterestContent />
      </div>
    </section>
  )
}
