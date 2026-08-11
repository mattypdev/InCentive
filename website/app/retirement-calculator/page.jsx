import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RetirementCalc from './RetirementCalc'
import '@/app/(pages)/Calculator.css'

export default function RetirementCalculatorPage() {
  return (
    <section className="calc-page section">
      <div className="container">
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
