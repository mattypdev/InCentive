import { notFound } from 'next/navigation'
import Link from 'next/link'
import { decideConsent } from '@/app/actions/auth'

export const metadata = { title: 'Parental Consent | Incentive' }

// This page is rendered server-side. A GET request = approval prompt.
// The approve/decline actions are handled via form POSTs using Server Actions.

export default async function ConsentPage({ params, searchParams }) {
  const { token } = await params
  const action = (await searchParams)?.action

  // If action is present, process the decision
  if (action === 'approve' || action === 'decline') {
    const result = await decideConsent(token, action === 'approve' ? 'approved' : 'declined')
    if (result.error) {
      return (
        <ConsentLayout>
          <h1>Link not valid</h1>
          <p>{result.error}</p>
          <Link href="/">Go to Incentive →</Link>
        </ConsentLayout>
      )
    }
    return (
      <ConsentLayout>
        <h1>{action === 'approve' ? '✅ Access approved' : 'Access declined'}</h1>
        <p>
          {action === 'approve'
            ? `${result.childName}'s progress on Incentive will now be saved. They'll see your approval the next time they open the app.`
            : `We've received your decision. ${result.childName}'s account has been removed. No data was saved.`}
        </p>
        <Link href="/">Learn more about Incentive →</Link>
      </ConsentLayout>
    )
  }

  return (
    <ConsentLayout>
      <p className="consent-brand">in<span>cent</span>ive</p>
      <h1>A parent&apos;s permission is needed</h1>
      <p>
        Your child wants to use <strong>Incentive</strong>, a free financial literacy
        learning app for students. They&apos;re under 13, so we need your approval
        before we save any of their progress.
      </p>
      <p>
        Incentive does not sell data and does not display ads.
        You can revoke access at any time by contacting us.
      </p>
      <div className="consent-actions">
        <a
          href={`/consent/${token}?action=approve`}
          className="consent-btn consent-btn--approve"
        >
          ✅ Approve access
        </a>
        <a
          href={`/consent/${token}?action=decline`}
          className="consent-btn consent-btn--decline"
        >
          Decline
        </a>
      </div>
      <p className="consent-fine">
        Questions? Email us at <a href="mailto:hello@incentivefinance.org">hello@incentivefinance.org</a>
      </p>
    </ConsentLayout>
  )
}

function ConsentLayout({ children }) {
  return (
    <>
      <style>{`
        .consent-page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--background);
        }
        .consent-card {
          max-width: 520px;
          width: 100%;
          background: var(--card);
          border: 2px solid var(--foreground);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 4px 4px 0 var(--foreground);
        }
        .consent-brand {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.563rem;
          color: var(--foreground);
          margin-bottom: 20px;
        }
        .consent-brand span { color: var(--accent); }
        .consent-card h1 { font-size: 1.953rem; margin-bottom: 16px; }
        .consent-card p {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--muted-foreground);
          margin-bottom: 16px;
        }
        .consent-card p strong { color: var(--foreground); }
        .consent-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 28px 0 20px;
        }
        .consent-btn {
          display: block;
          text-align: center;
          padding: 14px 28px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          border-radius: 9999px;
          border: 2px solid var(--foreground);
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .consent-btn:hover {
          transform: translate(-2px,-2px);
          box-shadow: 4px 4px 0 var(--foreground);
        }
        .consent-btn--approve {
          background: var(--accent);
          color: #fff;
        }
        .consent-btn--decline {
          background: transparent;
          color: var(--foreground);
        }
        .consent-fine {
          font-size: 0.75rem !important;
          color: var(--muted-foreground);
        }
        .consent-fine a { color: var(--secondary); }
        .consent-card a:not(.consent-btn) {
          color: var(--secondary);
          font-family: var(--font-heading);
          font-weight: 700;
        }
      `}</style>
      <div className="consent-page">
        <div className="consent-card">
          {children}
        </div>
      </div>
    </>
  )
}
