import Link from 'next/link'
import '@/components/Button.css'

export const metadata = {
  title: '404 — Page Not Found | Incentive',
}

export default function NotFound() {
  return (
    <section style={{
      minHeight: 'calc(100dvh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'var(--accent)',
          marginBottom: '16px',
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--foreground)',
          marginBottom: '12px',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--muted-foreground)',
          lineHeight: 1.7,
          marginBottom: '36px',
        }}>
          This URL doesn&apos;t exist. It may have been moved, deleted, or you may have followed a broken link.
        </p>

        <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <span className="btn-label">Back to home</span>
        </Link>
      </div>
    </section>
  )
}
