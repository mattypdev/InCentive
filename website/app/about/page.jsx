import ChapterMap from './ChapterMap'
import '@/components/Hero.css'
import '@/app/(pages)/About.css'

const SITE = 'https://incentivefinance.org'

export const metadata = {
  title: 'About Incentive: Student-Led Financial Literacy Nonprofit',
  description: 'Founded by Sathvik Vadlakunta and Matthew Park, Incentive brings free financial literacy to high school students. Meet the co-founders, team, and board of advisors.',
  alternates: { canonical: `${SITE}/about` },
  openGraph: {
    title: 'About Incentive: Student-Led Financial Literacy Nonprofit',
    description: 'Founded by Sathvik Vadlakunta and Matthew Park, Incentive brings free financial literacy to high school students. Meet the co-founders, team, and board of advisors.',
    url: `${SITE}/about`,
    type: 'profile',
  },
}

const org = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'Incentive',
  url: SITE,
}

const teamLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sathvik Vadlakunta',
    jobTitle: 'Co-Founder',
    worksFor: org,
    url: `${SITE}/about`,
    image: `${SITE}/images/sathvik-vadlakunta.jpeg`,
    sameAs: [
      'https://www.linkedin.com/in/sathvik-vadlakunta-239b03379/',
      'https://www.instagram.com/sathvik.vadlakunta/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matthew Park',
    jobTitle: 'Co-Founder',
    worksFor: org,
    url: `${SITE}/about`,
    image: `${SITE}/images/matthew-park.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/matthew-park-11b036309/',
      'https://www.instagram.com/mattyp.21/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Esha Yarram',
    jobTitle: 'Social Media Coordinator',
    worksFor: org,
    url: `${SITE}/about`,
    image: `${SITE}/images/esha-yarram.jpeg`,
    sameAs: [
      'https://www.linkedin.com/in/esha-yarram-713ab6379/',
      'https://www.instagram.com/eshayarram/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Frederick Steinmann',
    jobTitle: 'Assistant Research Professor at UNR',
    worksFor: { '@type': 'CollegeOrUniversity', name: 'University of Nevada, Reno' },
    url: `${SITE}/about`,
    image: `${SITE}/images/advisor.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/fredsteinmann/',
    ],
  },
]

const aboutPageLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Incentive',
  description: 'Founded by Sathvik Vadlakunta and Matthew Park, Incentive is a student-led nonprofit providing free financial literacy education to high school students.',
  url: `${SITE}/about`,
  mainEntity: org,
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }} />
      {teamLd.map(person => (
        <script key={person.name} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      ))}

      {/* ── HERO ── */}
      <section className="about-hero section">
        <div className="container">
          <div className="about-hero-text">
            <div className="about-hero-shapes">
              <div className="about-shape about-shape--circle" />
              <div className="about-shape about-shape--triangle" />
              <div className="about-shape about-shape--square" />
            </div>
            <h1 className="about-hero-title">
              The <span className="about-quote-accent">&ldquo;</span>Incentive<span className="about-quote-accent">&rdquo;</span> behind in<span className="brand-highlight">cent</span>ive
            </h1>
            <blockquote className="about-hero-quote">
              <p>
                The financial preparedness of our nation&apos;s youth is essential to their
                well-being and of vital importance to our economic future.
              </p>
              <cite>— <a href="https://en.wikipedia.org/wiki/Ben_Bernanke" target="_blank" rel="noopener noreferrer" className="about-cite-link">Ben Bernanke</a></cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="about-mission section">
        <div className="container">
          <div className="about-section-label">
            Our <span className="hero-highlight">Mission<svg className="hero-squiggle" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none"><path d="M2 8 C 20 2, 40 12, 60 6 S 100 2, 120 8 S 160 12, 180 6 S 198 4, 198 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/></svg></span>
          </div>
          <h2 className="about-mission-headline">
            Giving students the tools to lead,<br />teach, and make change.
          </h2>
          <div className="about-mission-body">
            <p>
              incentive is a student-led non-profit that is changing the way financial
              literacy education is brought to the classroom. With extensive opportunities
              for high school students to take rigorous leadership positions within their
              community, incentive gives these student educators a platform to make
              lasting change in their community.
            </p>
            <p>
              Instead of obsolete, old, and tiring systems that don&apos;t give students what
              they need, incentive brings a spark of youth into financial education for
              everyone. Every high schooler who joins incentive walks away with more than
              community service hours. They develop the ability to communicate complex
              ideas clearly, lead a room with confidence, take initiative, and build
              something that has real impact in their community.
            </p>
            <p>
              But at the same time, the same students being taught financial literacy
              have the opportunity to return the gesture and keep the cycle going.
              incentive isn&apos;t just a &quot;one-off&quot; project, it&apos;s a movement of student
              leaders and educators ready to make that next step to ensure financial
              freedom for everyone. From budgeting basics to investing fundamentals, our
              tools are designed to make learning about money feel approachable and
              exciting.
            </p>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-team section">
        <div className="container">
          <div className="about-section-label">
            Our <span className="hero-highlight">Team<svg className="hero-squiggle" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none"><path d="M2 8 C 20 2, 40 12, 60 6 S 100 2, 120 8 S 160 12, 180 6 S 198 4, 198 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/></svg></span>
          </div>

          <div className="about-team-group about-team-group--founders">
            <h3>Co-Founders</h3>
            <div className="about-team-grid">
              <div className="about-person-card">
                <div className="about-person-photo">
                  <img src="/images/sathvik-vadlakunta.jpeg" alt="Sathvik Vadlakunta" />
                </div>
                <h4>Sathvik Vadlakunta</h4>
                <p className="about-person-role">Co-Founder</p>
                <div className="about-person-socials">
                  <a href="https://www.instagram.com/sathvik.vadlakunta/" target="_blank" rel="noopener noreferrer" className="about-social-btn" aria-label="Sathvik Instagram">
                    <img src="/images/instagram-logo.svg" alt="Instagram" />
                  </a>
                  <a href="https://www.linkedin.com/in/sathvik-vadlakunta-239b03379/" target="_blank" rel="noopener noreferrer" className="about-social-btn about-social-btn--linkedin" aria-label="Sathvik LinkedIn">
                    <img src="/images/linkedin-logo.jpg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
              <div className="about-person-card">
                <div className="about-person-photo">
                  <img src="/images/matthew-park.jpg" alt="Matthew Park" />
                </div>
                <h4>Matthew Park</h4>
                <p className="about-person-role">Co-Founder</p>
                <div className="about-person-socials">
                  <a href="https://www.instagram.com/mattyp.21/" target="_blank" rel="noopener noreferrer" className="about-social-btn" aria-label="Matthew Instagram">
                    <img src="/images/instagram-logo.svg" alt="Instagram" />
                  </a>
                  <a href="https://www.linkedin.com/in/matthew-park-11b036309/" target="_blank" rel="noopener noreferrer" className="about-social-btn about-social-btn--linkedin" aria-label="Matthew LinkedIn">
                    <img src="/images/linkedin-logo.jpg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="about-team-group">
            <h3>Social Media</h3>
            <div className="about-team-grid">
              <div className="about-person-card">
                <div className="about-person-photo">
                  <img src="/images/esha-yarram.jpeg" alt="Esha Yarram" />
                </div>
                <h4>Esha Yarram</h4>
                <p className="about-person-role">Social Media Coordinator</p>
                <div className="about-person-socials">
                  <a href="https://www.instagram.com/eshayarram/" target="_blank" rel="noopener noreferrer" className="about-social-btn" aria-label="Esha Instagram">
                    <img src="/images/instagram-logo.svg" alt="Instagram" />
                  </a>
                  <a href="https://www.linkedin.com/in/esha-yarram-713ab6379/" target="_blank" rel="noopener noreferrer" className="about-social-btn about-social-btn--linkedin" aria-label="Esha LinkedIn">
                    <img src="/images/linkedin-logo.jpg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="about-team-group">
            <h3>Board of Advisors</h3>
            <div className="about-team-grid">
              <div className="about-person-card">
                <div className="about-person-photo">
                  <img src="/images/advisor.jpg" alt="Frederick Steinmann" />
                </div>
                <h4>Frederick Steinmann</h4>
                <p className="about-person-role">Assistant Research Professor at UNR</p>
                <div className="about-person-socials">
                  <a href="https://www.linkedin.com/in/fredsteinmann/" target="_blank" rel="noopener noreferrer" className="about-social-btn about-social-btn--linkedin" aria-label="Frederick LinkedIn">
                    <img src="/images/linkedin-logo.jpg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTERS ── */}
      <section className="about-chapters section">
        <div className="container">
          <div className="about-section-label">
            Our <span className="hero-highlight">Chapters<svg className="hero-squiggle" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none"><path d="M2 8 C 20 2, 40 12, 60 6 S 100 2, 120 8 S 160 12, 180 6 S 198 4, 198 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/></svg></span>
          </div>
          <p className="about-chapters-sub">
            Click a pin on the map to learn more about each chapter.
          </p>

          <ChapterMap />
        </div>
      </section>
    </>
  )
}
