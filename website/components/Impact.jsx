import './Impact.css'

const stats = [
  {
    value: '1M+',
    label: 'People reached',
    color: 'var(--accent)',
  },
  {
    value: '1,200',
    label: 'Students taught',
    color: 'var(--secondary)',
  },
  {
    value: '6',
    label: 'States with chapters',
    color: 'var(--tertiary)',
  },
]

const press = [
  {
    name: 'SEE Change Magazine',
    logo: '/see-change.png',
    href: 'https://seechangemagazine.com',
  },
  {
    name: 'This is Reno',
    logo: '/this-is-reno.webp',
    href: 'https://thisisreno.com',
  },
  {
    name: 'Education Innovators Podcast',
    logo: '/eip-podcast.jpeg',
    href: 'https://www.buzzsprout.com/1427981',
  },
  {
    name: 'KTVN 2 News Nevada',
    logo: '/ktvn2.png',
    href: 'https://www.ktvn.com',
  },
]

export default function Impact() {
  return (
    <section className="impact section" id="impact">
      <div className="container">

        <div className="home-section-header">
          <p className="home-eyebrow">Real-world impact</p>
          <h2>Changing how young people think about money</h2>
          <p className="impact-header-sub">
            From classrooms to living rooms, incentive is meeting students where they are.
          </p>
        </div>

        <div className="impact-stats">
          {stats.map(s => (
            <div className="impact-stat" key={s.label} style={{ '--stat-color': s.color }}>
              <span className="impact-stat-value">{s.value}</span>
              <span className="impact-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="impact-press-wrap">
          <p className="impact-divider-label">As seen in</p>
          <div className="impact-press">
            {press.map(p => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="impact-logo-card"
                aria-label={p.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={p.name} className="impact-logo-img" />
              </a>
            ))}
          </div>
        </div>

        <div className="impact-partners-wrap">
          <p className="impact-divider-label">Our partners</p>
          <div className="impact-partners">
            <a
              href="https://safeembrace.org"
              target="_blank"
              rel="noopener noreferrer"
              className="impact-logo-card impact-partner-card"
              aria-label="Safe Embrace"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/safe-embrace.jpg" alt="Safe Embrace" className="impact-logo-img impact-partner-img" />
              <p className="impact-partner-desc">
                Partnering with Safe Embrace to bring financial literacy to survivors of domestic violence.
              </p>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
