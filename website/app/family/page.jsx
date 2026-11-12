import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLinkedChildren, getFamilyChildData } from '@/app/actions/family'

export const metadata = { title: 'Family · Incentive' }

const ISLAND_NAMES = [
  'The Basics', 'Banking', 'Credit', 'Taxes', 'Markets', 'Finance & Psych.', 'Capstone'
]

const ASK_QUESTIONS = [
  {
    q: '"If you only paid the minimum on a $1,000 card, how long would it take to pay off?"',
    a: 'A good answer: years, not months. About 7 years at 24% APR.',
  },
  {
    q: '"What\'s the difference between paying on time and paying in full?"',
    a: 'On time avoids late fees. In full avoids interest.',
  },
  {
    q: '"Have you seen a card offer in the mail? What\'s the APR?"',
    a: 'No right answer. Look one up together.',
  },
]

export default async function FamilyPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/family')

  const params = await searchParams
  const childIdParam = params?.child

  const children = await getLinkedChildren()

  // Redirect to link page if no children linked
  if (!children.length) {
    return (
      <main className="family-main">
        <div className="family-h1row" style={{ marginBottom: 20 }}>
          <h1>Family</h1>
        </div>
        <div className="family-box" style={{ maxWidth: 480 }}>
          <h3>No children linked yet</h3>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: 16, fontSize: 14 }}>
            Ask your child to go to their Wallet → Family and share their family code with you.
            Or, if you are creating an account for a child under 13, you can do that directly.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/family/link" className="family-btn">
              Enter a family code
            </Link>
            <Link href="/family/child/new" className="family-btn ghost">
              Create under-13 account
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const activeChild = childIdParam
    ? children.find(c => c.childId === childIdParam) ?? children[0]
    : children[0]

  const data = await getFamilyChildData(activeChild.childId)

  if ('error' in data) {
    return (
      <main className="family-main">
        <p style={{ color: 'var(--accent)' }}>Error: {data.error}</p>
      </main>
    )
  }

  const { profile, share, streak, totalCents, lessonsThisWeek, activeChallenge } = data

  const islandStates = ISLAND_NAMES.map((name, i) => ({
    name,
    state: i < 2 ? 'done' : i === 2 ? 'current' : 'future',
  }))

  return (
    <main className="family-main">

      {/* Header */}
      <div className="family-h1row">
        <div>
          <h1>{profile?.first_name ? `${profile.first_name}'s money journey` : 'Family'}</h1>
          <p className="family-h1row-meta">
            Linked {new Date(activeChild.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} ·{' '}
            {profile?.first_name ?? 'Your child'} shares: progress, streak, current topic
          </p>
        </div>
        {children.length > 1 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {children.map(c => (
              <Link
                key={c.childId}
                href={`/family?child=${c.childId}`}
                className={`family-btn${c.childId === activeChild.childId ? '' : ' ghost'}`}
                style={{ fontSize: 13, padding: '4px 12px', marginTop: 0 }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
        <div className="family-spacer" />
        <button className="family-btn ghost" style={{ fontSize: 13, marginTop: 0 }}>Email settings</button>
      </div>

      {/* Main 3-column grid */}
      <div className="family-grid">

        {/* Column 1: Where they are + what you can see */}
        <div>
          <div className="family-box">
            <h3>Where {profile?.first_name ?? 'your child'} is</h3>
            <div className="family-isles">
              {islandStates.map((isle, i) => (
                <div key={isle.name} className={`family-isle ${isle.state}`}>
                  <img src={`/islands/island-${i}.png`} alt={isle.name} />
                  <span>{isle.name} {isle.state === 'done' ? '✓' : isle.state === 'current' ? '· now' : ''}</span>
                </div>
              ))}
            </div>
            <div className="family-kv">
              <div className="family-kv-cell">
                <span className="family-kv-val">{streak}</span>
                <span className="family-kv-label">day streak</span>
              </div>
              <div className="family-kv-cell">
                <span className="family-kv-val">{lessonsThisWeek}</span>
                <span className="family-kv-label">lessons this wk</span>
              </div>
              <div className="family-kv-cell">
                <span className="family-kv-val">2 of 6</span>
                <span className="family-kv-label">islands done</span>
              </div>
            </div>
            <div style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
              <strong>This week {profile?.first_name ?? 'they'} {lessonsThisWeek > 0 ? `completed ${lessonsThisWeek} lesson${lessonsThisWeek !== 1 ? 's' : ''}` : 'is'} learning:</strong>{' '}
              how credit cards charge interest, and why paying only the minimum takes years.
            </div>
          </div>

          <div className="family-box" style={{ marginTop: 14 }}>
            <h3>What you can and can't see</h3>
            <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
              <strong style={{ color: '#22C55E' }}>Shared:</strong>{' '}
              current island, lessons completed, streak, this week's topic
              <br />
              <strong style={{ color: 'var(--accent)' }}>Private:</strong>{' '}
              individual quiz answers, class rank, teacher comments
              <br />
              <span style={{ color: 'var(--muted-foreground)' }}>
                {profile?.first_name ?? 'Your child'} controls this link and can change what&apos;s shared.
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Ask at dinner */}
        <div className="family-box">
          <h3>Ask at dinner · 3 questions</h3>
          {ASK_QUESTIONS.map((q, i) => (
            <div key={i} className="family-ask-card" style={i === ASK_QUESTIONS.length - 1 ? { marginBottom: 0 } : {}}>
              {q.q}
              <small className="family-ask-answer">{q.a}</small>
            </div>
          ))}
        </div>

        {/* Column 3: Try at home + Challenge + Promise */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Try at home */}
          <div className="family-try-card">
            <h3>Try at home · 15 min</h3>
            <div className="family-try-title">Payoff Detective</div>
            <p style={{ fontSize: 12.5, lineHeight: 1.45, marginBottom: 10, color: 'var(--foreground)' }}>
              Find the APR and minimum payment on a real statement or card offer. Then use {profile?.first_name ?? 'their'}&apos;s payoff slider together.
            </p>
            <button className="family-btn" style={{ width: '100%', marginTop: 0 }}>
              We did it · +50¢ for {profile?.first_name ?? 'them'}
            </button>
          </div>

          {/* Family challenge */}
          {activeChallenge ? (
            <div className="family-challenge-card">
              <div className="family-chal-label">FAMILY CHALLENGE · DAY {activeChallenge.parent_days?.length + 1 ?? 1}</div>
              <div className="family-chal-title">{activeChallenge.challenge_title}</div>
              <div className="family-who">
                <span>{profile?.first_name ?? 'Alex'}</span>
                <div className="family-dots">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className={`family-dot${(activeChallenge.child_days ?? []).includes(i + 1) ? ' done' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="family-who">
                <span>You</span>
                <div className="family-dots">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className={`family-dot${(activeChallenge.parent_days ?? []).includes(i + 1) ? ' done' : ''}`} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12.5, marginTop: 8 }}>
                <strong>Finish all 7 days together:</strong> {profile?.first_name ?? 'your child'} earns 150¢ and the family badge.
              </div>
              <button className="family-btn" style={{ marginTop: 8 }}>+ Check in today</button>
            </div>
          ) : (
            <div className="family-box">
              <h3>Family challenge</h3>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 10 }}>
                Start a 7-day challenge together. Finishing all 7 days earns {profile?.first_name ?? 'your child'} 150¢ and a family badge.
              </p>
              <Link href="/family/challenges" className="family-btn" style={{ display: 'inline-block' }}>
                Browse challenges →
              </Link>
            </div>
          )}

          {/* Family promise */}
          <div className="family-box">
            <h3>Family promise (optional)</h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--foreground)' }}>
              Make a promise tied to an island. It shows as a gift box on{' '}
              {profile?.first_name ?? 'their'}&apos;s map. You mark it fulfilled.
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 6 }}>
              Incentive never handles money. This is a promise between you and{' '}
              {profile?.first_name ?? 'your child'}.
            </p>
            <button className="family-btn ghost" style={{ fontSize: 13, marginTop: 10 }}>+ Add a promise</button>
          </div>
        </div>
      </div>
    </main>
  )
}
