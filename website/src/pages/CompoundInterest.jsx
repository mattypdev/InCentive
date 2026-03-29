import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './Calculator.css'

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState('')
  const [monthly, setMonthly] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')

  const p = parseFloat(principal) || 0
  const m = parseFloat(monthly) || 0
  const r = (parseFloat(rate) || 0) / 100
  const t = parseFloat(years) || 0

  const monthlyRate = r / 12
  const months = t * 12
  let future = p
  if (monthlyRate > 0) {
    future = p * Math.pow(1 + monthlyRate, months) +
      m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  } else {
    future = p + m * months
  }
  const totalContributed = p + m * months
  const interestEarned = future - totalContributed

  const hasInput = p > 0 || m > 0

  return (
    <section className="calc-page section">
      <div className="container">
        <Link to="/resources" className="calc-back">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Resources
        </Link>

        <div className="calc-header">
          <h1>Compound Interest Calculator</h1>
          <p>See how your money grows over time with the power of compounding.</p>
        </div>

        <div className="calc-card">
          <div className="calc-field">
            <label className="calc-label" htmlFor="ci-principal">Initial Investment</label>
            <input
              id="ci-principal"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 1000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ci-monthly">Monthly Contribution</label>
            <input
              id="ci-monthly"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 200"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ci-rate">Annual Interest Rate (%)</label>
            <input
              id="ci-rate"
              className="calc-input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 7"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ci-years">Time Period (years)</label>
            <input
              id="ci-years"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 10"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>

          {hasInput && (
            <div className="calc-results">
              <h3>Your Results</h3>
              <div className="calc-result-grid">
                <div className="calc-result-item calc-result-item--secondary">
                  <div className="calc-result-value">{fmt(future)}</div>
                  <div className="calc-result-label">Future Value</div>
                </div>
                <div className="calc-result-item">
                  <div className="calc-result-value">{fmt(totalContributed)}</div>
                  <div className="calc-result-label">Total Contributed</div>
                </div>
                <div className="calc-result-item calc-result-item--accent">
                  <div className="calc-result-value">{fmt(interestEarned)}</div>
                  <div className="calc-result-label">Interest Earned</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
