import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoanCalc from './LoanCalc'
import '@/app/(pages)/Calculator.css'

export default function LoanCalculatorPage() {
  return (
    <section className="calc-page section">
      <div className="container">
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
