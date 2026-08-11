import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CompoundInterestCalc from './CompoundInterestCalc'
import '@/app/(pages)/Calculator.css'

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
      </div>
    </section>
  )
}
