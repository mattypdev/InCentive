import Link from 'next/link'
import { TrendingUp, Landmark, PiggyBank, FileText, Download } from 'lucide-react'
import Button from '@/components/Button'
import '@/app/(pages)/Resources.css'

const tools = [
  {
    icon: TrendingUp,
    title: 'Compound Interest Calculator',
    description: 'See how your money grows over time with the power of compounding.',
    color: 'var(--secondary)',
    path: '/compound-interest',
  },
  {
    icon: Landmark,
    title: 'Loan Calculator',
    description: 'Estimate monthly payments, total interest, and payoff timelines.',
    color: 'var(--accent)',
    path: '/loan-calculator',
  },
  {
    icon: PiggyBank,
    title: 'Retirement Calculator',
    description: 'Plan ahead and see what it takes to retire on your terms.',
    color: 'var(--tertiary)',
    path: '/retirement-calculator',
  },
]

export const metadata = {
  title: 'Free Money Calculators and Teaching Tools | Incentive',
  description: 'Free financial calculators and classroom teaching tools from Incentive. Calculate compound interest, loan payments, and retirement savings — no sign-up needed.',
  alternates: { canonical: 'https://incentivefinance.org/resources' },
  openGraph: {
    title: 'Free Money Calculators and Teaching Tools | Incentive',
    description: 'Free financial calculators and classroom teaching tools from Incentive. Calculate compound interest, loan payments, and retirement savings — no sign-up needed.',
    url: 'https://incentivefinance.org/resources',
    type: 'website',
  },
}

export default function ResourcesPage() {
  return (
    <>
      <section className="resources-hero section">
        <div className="container">
          <h1>Resources</h1>
          <p className="resources-hero-sub">
            Interactive tools and materials to sharpen your financial skills.
          </p>
        </div>
      </section>

      <section className="tools-section section">
        <div className="tools-grid container">
          {tools.map((tool) => {
            const ToolIcon = tool.icon
            return (
              <Link href={tool.path} className="tool-card" key={tool.path}>
                <div
                  className="tool-card-icon"
                  style={{ backgroundColor: tool.color }}
                >
                  <ToolIcon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="tool-card-title">{tool.title}</h3>
                <p className="tool-card-desc">{tool.description}</p>
                <span className="tool-card-cta">Try it &rarr;</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="resources-pdf section" id="presentation">
        <div className="container">
          <div className="pdf-header">
            <div className="pdf-icon-badge">
              <FileText size={24} strokeWidth={2.5} />
            </div>
            <h2>Our Presentation</h2>
            <p className="pdf-subtitle">
              Explore our latest presentation on building financial confidence.
            </p>
          </div>

          <div className="pdf-embed-wrapper">
            <iframe
              src="/financial-literacy-presentation.pdf"
              className="pdf-embed"
              title="Financial Literacy Presentation"
            />
          </div>

          <div className="pdf-download-bar">
            <Button
              variant="secondary"
              icon={Download}
              href="/financial-literacy-presentation.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
