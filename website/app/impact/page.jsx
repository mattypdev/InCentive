import '@/app/(pages)/Impact.css'

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

const press = [
  {
    name: 'SEE Change Magazine',
    logo: '/see-change.png',
    href: 'https://seechangemagazine.com',
    dark: false,
  },
  {
    name: 'This is Reno',
    logo: '/this-is-reno.webp',
    href: 'https://thisisreno.com',
    dark: false,
  },
  {
    name: 'Education Innovators Podcast',
    logo: '/eip-podcast.jpeg',
    href: 'https://www.buzzsprout.com/1427981',
    dark: true,
  },
]

export default function ImpactPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="impact-hero section">
        <div className="container impact-hero-inner">
          <p className="home-eyebrow">Our reach</p>
          <h1 className="impact-heading">Real change.<br />Real communities.</h1>
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

          {/* Featured: KTVN video */}
          <div className="impact-feature">
            <div className="impact-feature-label">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ktvn2.png" alt="KTVN 2 News Nevada" className="impact-feature-logo" />
            </div>
            <div className="impact-feature-video-wrap">
              <video
                className="impact-feature-video"
                controls
                preload="metadata"
                playsInline
              >
                <source src="https://cdn.field59.com/KTVN/1792543323-bc31a46bd94eb5fe60c6c9f967c9095c8d699d07_fl9-720p.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Other press logos */}
          <div className="impact-logos">
            {press.map(p => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`impact-logo-item${p.dark ? ' impact-logo-item--dark' : ''}`}
                aria-label={p.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={p.name} className="impact-logo-img" />
                <span className="impact-logo-name">{p.name}</span>
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
