import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './Calculator.css'

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function RetirementCalculator() {
  const [age, setAge] = useState('')
  const [retireAge, setRetireAge] = useState('')
  const [savings, setSavings] = useState('')
  const [monthly, setMonthly] = useState('')
  const [rate, setRate] = useState('')

  const currentAge = parseFloat(age) || 0
  const targetAge = parseFloat(retireAge) || 0
  const s = parseFloat(savings) || 0
  const m = parseFloat(monthly) || 0
  const r = (parseFloat(rate) || 0) / 100

  const yearsToRetire = targetAge - currentAge
  const months = yearsToRetire * 12
  const monthlyRate = r / 12

  let futureValue = 0
  if (yearsToRetire > 0) {
    if (monthlyRate > 0) {
      futureValue = s * Math.pow(1 + monthlyRate, months) +
        m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    } else {
      futureValue = s + m * months
    }
  }

  const totalContributed = s + m * months
  const interestEarned = futureValue - totalContributed

  const hasInput = yearsToRetire > 0 && (s > 0 || m > 0)

  return (
    <section className="calc-page section">
      <div className="container">
        <Link to="/resources" className="calc-back">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Resources
        </Link>

        <div className="calc-header">
          <h1>Retirement Calculator</h1>
          <p>Plan ahead and see what it takes to retire on your terms.</p>
        </div>

        <div className="calc-card">
          <div className="calc-field">
            <label className="calc-label" htmlFor="ret-age">Current Age</label>
            <input
              id="ret-age"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ret-retire">Retirement Age</label>
            <input
              id="ret-retire"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 65"
              value={retireAge}
              onChange={(e) => setRetireAge(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ret-savings">Current Savings</label>
            <input
              id="ret-savings"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 10000"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ret-monthly">Monthly Contribution</label>
            <input
              id="ret-monthly"
              className="calc-input"
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="ret-rate">Expected Annual Return (%)</label>
            <input
              id="ret-rate"
              className="calc-input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 7"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          {hasInput && (
            <div className="calc-results">
              <h3>Your Results</h3>
              <div className="calc-result-grid">
                <div className="calc-result-item calc-result-item--secondary">
                  <div className="calc-result-value">{fmt(futureValue)}</div>
                  <div className="calc-result-label">At Retirement</div>
                </div>
                <div className="calc-result-item">
                  <div className="calc-result-value">{fmt(totalContributed)}</div>
                  <div className="calc-result-label">Total Contributed</div>
                </div>
                <div className="calc-result-item calc-result-item--tertiary">
                  <div className="calc-result-value">{fmt(interestEarned)}</div>
                  <div className="calc-result-label">Growth from Returns</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
