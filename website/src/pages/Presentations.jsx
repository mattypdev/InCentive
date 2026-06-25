import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Zap } from 'lucide-react'
import Button from '../components/Button'
import './Presentations.css'

const VALID_CODES = ['BUDGET', 'INVEST']

export default function PresentationsPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleJoin(e) {
    e.preventDefault()
    const normalized = code.trim().toUpperCase()
    if (VALID_CODES.includes(normalized)) {
      navigate(`/presentations/${normalized}`)
    } else {
      setError('Invalid code. Please try again.')
    }
  }

  return (
    <section className="pres-page section">
      <div className="container">
        <div className="pres-hero">
          <div className="pres-shape pres-shape--circle" />
          <div className="pres-shape pres-shape--triangle" />
          <div className="pres-shape pres-shape--square" />

          <div className="pres-icon-badge">
            <Zap size={28} strokeWidth={2.5} />
          </div>
          <h1>Join a Presentation</h1>
          <p className="pres-subtitle">
            Enter the code shared by your presenter to join an interactive
            financial literacy experience.
          </p>
        </div>

        <form className="pres-join-card" onSubmit={handleJoin}>
          <label className="pres-label" htmlFor="pres-code">
            Presentation Code
          </label>
          <input
            id="pres-code"
            className={`pres-code-input ${error ? 'pres-code-input--error' : ''}`}
            type="text"
            placeholder="ENTER CODE"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError('')
            }}
            maxLength={10}
            autoComplete="off"
          />
          {error && <p className="pres-error">{error}</p>}
          <Button variant="primary" icon={Play}>
            Join Presentation
          </Button>
        </form>

        <div className="pres-demos">
          <p className="pres-demos-label">Try a demo presentation</p>
          <div className="pres-demos-grid">
            <button
              className="pres-demo-card pres-demo-card--budget"
              onClick={() => navigate('/presentations/BUDGET')}
            >
              <span className="pres-demo-code">BUDGET</span>
              <span className="pres-demo-title">Budget Like a Boss</span>
              <span className="pres-demo-desc">
                Master budgeting with the 50/30/20 rule
              </span>
            </button>
            <button
              className="pres-demo-card pres-demo-card--invest"
              onClick={() => navigate('/presentations/INVEST')}
            >
              <span className="pres-demo-code">INVEST</span>
              <span className="pres-demo-title">Investing 101</span>
              <span className="pres-demo-desc">
                Learn how to grow your money over time
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
