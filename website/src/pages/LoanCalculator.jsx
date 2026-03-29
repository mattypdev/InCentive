import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './Calculator.css'

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('')
  const [term, setTerm] = useState('')

  const a = parseFloat(amount) || 0
  const r = (parseFloat(rate) || 0) / 100 / 12
  const n = (parseFloat(term) || 0) * 12

  let monthlyPayment = 0
  let totalPaid = 0
  let totalInterest = 0

  if (a > 0 && n > 0) {
    if (r > 0) {
      monthlyPayment = a * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    } else {
      monthlyPayment = a / n
    }
    totalPaid = monthlyPayment * n
    totalInterest = totalPaid - a
  }

  const hasInput = a > 0

  return (
    <section className="calc-page section">
      <div className="container">
        <Link to="/resources" className="calc-back">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Resources
        </Link>

        <div className="calc-header">
          <h1>Loan Calculator</h1>
          <p>Estimate monthly payments, total interest, and payoff timelines.</p>
        </div>

        <div className="calc-card">
          <div className="calc-field">
            <label className="calc-label" htmlFor="loan-amount">Loan Amount</label>
            <input
              id="loan-amount"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 25000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="loan-rate">Annual Interest Rate (%)</label>
            <input
              id="loan-rate"
              className="calc-input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 5.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="loan-term">Loan Term (years)</label>
            <input
              id="loan-term"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 5"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>

          {hasInput && n > 0 && (
            <div className="calc-results">
              <h3>Your Results</h3>
              <div className="calc-result-grid">
                <div className="calc-result-item calc-result-item--secondary">
                  <div className="calc-result-value">{fmt(monthlyPayment)}</div>
                  <div className="calc-result-label">Monthly Payment</div>
                </div>
                <div className="calc-result-item">
                  <div className="calc-result-value">{fmt(totalPaid)}</div>
                  <div className="calc-result-label">Total Paid</div>
                </div>
                <div className="calc-result-item calc-result-item--accent">
                  <div className="calc-result-value">{fmt(totalInterest)}</div>
                  <div className="calc-result-label">Total Interest</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
