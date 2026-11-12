'use client'
import { useState } from 'react'
import Link from 'next/link'
import { startChallenge } from '@/app/actions/family'

const CHALLENGES = [
  {
    key: 'track_purchases',
    title: 'Track every purchase',
    description: 'Write down every purchase your family makes for a full week — cash, card, or app.',
    icon: '📋',
    topic: 'Spending',
    days: 7,
  },
  {
    key: 'grocery_budget',
    title: 'Plan a $100 grocery week',
    description: 'Before the next shop, write a list and estimate prices. Compare your estimate to the final receipt.',
    icon: '🛒',
    topic: 'Budgeting',
    days: 7,
  },
  {
    key: 'cancel_subscriptions',
    title: 'Find subscriptions to cut',
    description: 'Find three subscriptions in your bank or email. Decide together: keep, cancel, or downgrade each one.',
    icon: '✂️',
    topic: 'Saving',
    days: 7,
  },
  {
    key: 'compare_phone_plans',
    title: 'Compare two phone plans',
    description: 'Pull up two carrier websites together. Build a side-by-side comparison: price, data, fees.',
    icon: '📱',
    topic: 'Comparison shopping',
    days: 7,
  },
  {
    key: 'read_paystub',
    title: 'Read a real pay stub',
    description: 'Look at a real pay stub or utility bill together. Find the gross amount, deductions, and net.',
    icon: '📄',
    topic: 'Income & Taxes',
    days: 7,
  },
  {
    key: 'savings_goal',
    title: 'Pick a savings goal',
    description: 'Choose a goal together — small or large. Open or find a savings account and make a first deposit.',
    icon: '🏦',
    topic: 'Saving',
    days: 7,
  },
  {
    key: 'spot_ads',
    title: 'Spot spending tricks',
    description: 'Find three ads or store tactics designed to make you spend more. Name the technique for each one.',
    icon: '👀',
    topic: 'Psychology of money',
    days: 7,
  },
]

export default function ChallengesPage() {
  const [starting, setStarting] = useState(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(null)

  async function handleStart(challenge) {
    setError('')
    setStarting(challenge.key)
    const result = await startChallenge(null, challenge.key, challenge.title)
    setStarting(null)
    if (result?.error) {
      setError(result.error)
    } else {
      setStarted(challenge.key)
    }
  }

  return (
    <main className="family-main">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <Link href="/family" style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600 }}>
          ← Back to dashboard
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, margin: '16px 0 4px' }}>
          Family challenges
        </h1>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 24, fontSize: 14 }}>
          7-day challenges you both complete together. Finishing all 7 days earns your child 150¢ and a family badge.
        </p>

        {error && (
          <div style={{ background: '#FFE4E6', border: '2px solid var(--foreground)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
            {error}
          </div>
        )}

        <div className="family-challenge-grid">
          {CHALLENGES.map(c => {
            const isDone = started === c.key
            return (
              <div key={c.key} className="family-chal-card">
                <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                <div className="family-chal-label">{c.topic.toUpperCase()} · 7 DAYS</div>
                <div className="family-chal-title">{c.title}</div>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--foreground)', marginBottom: 12 }}>
                  {c.description}
                </p>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 10 }}>
                  <strong style={{ color: '#EC4899' }}>Reward:</strong> 150¢ + family badge on completion
                </div>

                <div className="family-days-grid">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i}>
                      <span className="family-day-box" />
                      {d}
                    </div>
                  ))}
                </div>

                {isDone ? (
                  <button className="family-btn" style={{ width: '100%', marginTop: 12, background: '#22C55E' }} disabled>
                    Challenge started ✓
                  </button>
                ) : (
                  <button
                    className="family-btn"
                    style={{ width: '100%', marginTop: 12 }}
                    disabled={starting === c.key}
                    onClick={() => handleStart(c)}
                  >
                    {starting === c.key ? 'Starting…' : 'Start this challenge →'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
