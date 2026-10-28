import '@/app/(pages)/Impact.css'
import MediaGallery from './MediaGallery'

const articles = [
  {
    outlet: 'This is Reno',
    logo: '/this-is-reno.webp',
    image: '/davidson-academy.png',
    title: 'Taking the initiative to create incentive: Reno high school students launch a nation-wide financial literacy nonprofit',
    date: 'September 27, 2026',
    href: 'https://thisisreno.com/2026/09/students-launch-incentive-financial-literacy/',
  },
  {
    outlet: 'SEE Change Magazine',
    logo: '/see-change.png',
    image: '/workshop-reno.png',
    title: 'Student-Led Initiative Makes Financial Education Accessible & Fun',
    date: null,
    href: 'https://www.seechangemagazine.com/tag/financial-education/',
  },
]

const SITE = 'https://incentivefinance.org'

export const metadata = {
  title: 'Our Impact — Incentive',
  description: 'Incentive has reached over one million people, taught 1,200 students, and built chapters across 6 states. See our press coverage and community partners.',
  alternates: { canonical: `${SITE}/impact` },
  openGraph: {
    title: 'Our Impact — Incentive',
    description: 'Reaching 1M+ people, teaching 1,200 students, and growing across 6 states.',
    url: `${SITE}/impact`,
    type: 'website',
  },
}

const stats = [
  { value: '1M+',   label: 'People reached',      color: 'var(--accent)'    },
  { value: '1,200', label: 'Students taught',      color: 'var(--secondary)' },
  { value: '6',     label: 'States with chapters', color: 'var(--tertiary)'  },
]

export default function ImpactPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="impact-hero section">
        <div className="container impact-hero-inner">
          <p className="home-eyebrow">Our reach</p>
          <p className="impact-subheading">
            incentive started in one classroom. Today we're reaching students,
            families, and community organizations across the country.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="impact-stats-section section">
        <div className="container">
          <div className="impact-stats">
            {stats.map(s => (
              <div className="impact-stat" key={s.label} style={{ '--stat-color': s.color }}>
                <span className="impact-stat-value">{s.value}</span>
                <span className="impact-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press ── */}
      <section className="impact-press-section section">
        <div className="container">
          <div className="impact-rule-label">
            <span className="impact-rule" />
            <span className="impact-rule-text">News / Media</span>
            <span className="impact-rule" />
          </div>
          <MediaGallery />
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="impact-articles-section section">
        <div className="container">
          <div className="impact-rule-label">
            <span className="impact-rule" />
            <span className="impact-rule-text">Articles</span>
            <span className="impact-rule" />
          </div>
          <div className="impact-articles">
            {articles.map(a => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="impact-article-btn"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt="" className="impact-article-thumb" />
                <div className="impact-article-body">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.logo} alt={a.outlet} className="impact-article-logo" />
                  <span className="impact-article-title">{a.title}</span>
                  <span className="impact-article-meta">{a.outlet}{a.date ? ` · ${a.date}` : ''}</span>
                  <span className="impact-article-arrow">↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="impact-partners-section section">
        <div className="container">
          <div className="impact-rule-label">
            <span className="impact-rule" />
            <span className="impact-rule-text">Community partners</span>
            <span className="impact-rule" />
          </div>
          <div className="impact-partner-wrap">
            <a
              href="https://safeembrace.org"
              target="_blank"
              rel="noopener noreferrer"
              className="impact-partner-card"
              aria-label="Safe Embrace"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/safe-embrace.jpg" alt="Safe Embrace" className="impact-logo-img impact-partner-img" />
              <div className="impact-partner-text">
                <strong>Safe Embrace</strong>
                <p>Bringing financial literacy to survivors of domestic violence in our community.</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
