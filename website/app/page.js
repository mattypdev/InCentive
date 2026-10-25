import Link from 'next/link'
import {
  ArrowRight,
  Layers,
  Coins,
  Trophy,
  TrendingUp,
  Landmark,
  PiggyBank,
  Zap,
  MapPin,
  Plus,
} from 'lucide-react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'
import { levels, allUnits } from '@/data/levels'
import { chapters } from '@/data/chapters'
import '@/components/Button.css'
import '@/app/(pages)/Calculator.css'
import '@/app/(pages)/Home.css'

export const metadata = {
  title: 'Incentive — Learn Personal Finance & Earn Rewards',
  description: 'Incentive teaches you personal finance through interactive lessons and quizzes — and rewards you with real cents for every lesson you complete.',
  alternates: { canonical: 'https://incentivefinance.org' },
  openGraph: {
    title: 'Incentive — Learn Personal Finance & Earn Rewards',
    description: 'Interactive financial literacy lessons that pay you to learn.',
    url: 'https://incentivefinance.org',
    type: 'website',
  },
}

const lessonCount = allUnits.reduce((sum, u) => sum + (u.lessons?.length ?? 0), 0)

const steps = [
  {
    icon: Layers,
    color: 'var(--secondary)',
    title: 'Pick your level',
    body: 'Start with money basics or jump ahead. Every level builds on the last, from budgeting to investing.',
  },
  {
    icon: Coins,
    color: 'var(--tertiary)',
    title: 'Answer & earn cents',
    body: 'Short quizzes explain every answer. Get them right to earn cents and XP along the way.',
  },
  {
    icon: Trophy,
    color: 'var(--accent)',
    title: 'Level up',
    body: 'Track your progress, climb the leaderboard, and spend your cents in the shop.',
  },
]

const tools = [
  {
    icon: TrendingUp,
    title: 'Compound Interest',
    body: 'See how your money grows over time with the power of compounding.',
    color: 'var(--secondary)',
    path: '/compound-interest',
  },
  {
    icon: Landmark,
    title: 'Loan Calculator',
    body: 'Estimate monthly payments, total interest, and payoff timelines.',
    color: 'var(--accent)',
    path: '/loan-calculator',
  },
  {
    icon: PiggyBank,
    title: 'Retirement Calculator',
    body: 'Plan ahead and see what it takes to retire on your terms.',
    color: 'var(--tertiary)',
    path: '/retirement-calculator',
  },
]

const faqs = [
  {
    question: 'Is incentive really free?',
    answer: 'Yes. Every lesson, calculator, quiz, and article is free to use. You only need an account if you want to save your progress and cents.',
  },
  {
    question: 'Do I need an account to start learning?',
    answer: 'No. You can jump into lessons right away. Use the Log in button in the top right whenever you want to save your progress.',
  },
  {
    question: 'Who is incentive for?',
    answer: 'Anyone who wants to feel more confident with money. Lessons start from the very basics and work up to advanced investing and wealth building.',
  },
  {
    question: 'How can I get involved?',
    answer: 'Use the Volunteer Today button below to sign up. Volunteers help teach financial literacy in local schools, libraries, and community spaces.',
  },
]

const PATH_PREVIEW_COUNT = 8

export default function Home() {
  const pathPreview = levels.slice(0, PATH_PREVIEW_COUNT)
  const remainingLevels = levels.length - pathPreview.length

  return (
    <>
      <Hero />

      <Features />

      {/* ===== How it works ===== */}
      <section className="home-steps section">
        <div className="container">
          <div className="home-section-header">
            <p className="home-eyebrow">How it works</p>
            <h2>Three steps to money confidence</h2>
          </div>
          <ol className="home-steps-grid">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <li className="home-step" key={step.title} style={{ '--step-color': step.color }}>
                  <span className="home-step-number">{i + 1}</span>
                  <span className="home-step-icon"><Icon size={26} strokeWidth={2.5} /></span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ===== Learning path preview ===== */}
      <section className="home-path section">
        <div className="home-path-inner container">
          <div className="home-path-copy">
            <p className="home-eyebrow">The learning path</p>
            <h2>From your first budget to building wealth</h2>
            <p>
              {levels.length} levels take you step by step through banking, credit,
              taxes, investing, and beyond, with {lessonCount} short lessons along the way.
            </p>
            <Link href="/learn" className="btn btn-primary">
              <span className="btn-label">See the full path</span>
              <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
            </Link>
          </div>
          <ul className="home-path-list">
            {pathPreview.map(level => (
              <li className="home-path-level" key={level.id} style={{ '--level-color': level.color }}>
                <span className="home-path-num">{level.number}</span>
                <span className="home-path-text">
                  <span className="home-path-title">{level.title}</span>
                  <span className="home-path-sub">{level.subtitle}</span>
                </span>
              </li>
            ))}
            {remainingLevels > 0 && (
              <li className="home-path-level home-path-level--more">
                <span className="home-path-num"><Plus size={16} strokeWidth={3} /></span>
                <span className="home-path-text">
                  <span className="home-path-title">{remainingLevels} more levels</span>
                  <span className="home-path-sub">Up to complete mastery</span>
                </span>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* ===== Tools ===== */}
      <section className="home-tools section">
        <div className="container">
          <div className="home-section-header">
            <p className="home-eyebrow">Real-world tools</p>
            <h2>Run the numbers on your own money</h2>
          </div>
          <div className="home-tools-grid">
            {tools.map(tool => {
              const Icon = tool.icon
              return (
                <Link href={tool.path} className="home-tool" key={tool.path} style={{ '--tool-color': tool.color }}>
                  <span className="home-tool-icon"><Icon size={24} strokeWidth={2.5} /></span>
                  <h3>{tool.title}</h3>
                  <p>{tool.body}</p>
                  <span className="home-tool-link">
                    Open calculator <ArrowRight size={16} strokeWidth={2.5} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Quizzes + Chapters ===== */}
      <section className="home-community section">
        <div className="home-community-inner container">
          <div className="home-panel home-panel--quiz">
            <span className="home-panel-icon"><Zap size={26} strokeWidth={2.5} /></span>
            <h3>In a classroom?</h3>
            <p>
              Join a live quiz with the code your teacher or presenter shares,
              or create and share your own.
            </p>
            <Link href="/quizzes" className="btn btn-secondary">
              <span className="btn-label">Join a quiz</span>
              <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
            </Link>
          </div>

          <div className="home-panel home-panel--chapters">
            <span className="home-panel-icon"><MapPin size={26} strokeWidth={2.5} /></span>
            <h3>Student-led, coast to coast</h3>
            <p>
              incentive chapters bring financial education directly to schools
              and communities.
            </p>
            <ul className="home-chapter-list">
              {chapters.map(ch => (
                <li key={ch.id}>{ch.name}</li>
              ))}
            </ul>
            <Link href="/about" className="btn btn-secondary">
              <span className="btn-label">Meet the team</span>
              <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="home-faq section">
        <div className="home-faq-inner container">
          <p className="home-eyebrow">Questions</p>
          <FAQ items={faqs} heading="Frequently asked" />
        </div>
      </section>

      <CTA />
    </>
  )
}
