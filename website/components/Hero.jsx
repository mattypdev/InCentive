import Link from 'next/link'
import { ArrowRight, HandHeart } from 'lucide-react'
import HeroLesson from './HeroLesson'
import './Hero.css'
import './Button.css'

function Squiggle({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
      <path
        d="M2 8 C 20 2, 40 12, 60 6 S 100 2, 120 8 S 160 12, 180 6 S 198 4, 198 4"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"
      />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-shape hero-shape--circle" />
        <div className="hero-shape hero-shape--dots" />
        <div className="hero-shape hero-shape--triangle" />
        <div className="hero-shape hero-shape--pill" />
        <div className="hero-shape hero-shape--square" />
      </div>

      <div className="hero-inner container">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn Money
            <br />
            Build{' '}
            <span className="hero-highlight">
              Confidence
              <Squiggle className="hero-squiggle" />
            </span>
          </h1>

          <p className="hero-subtitle">
            incentive makes personal finance approachable, interactive,
            and actually fun. Build real skills with courses designed for
            the way you learn.
          </p>

          <div className="hero-actions">
            <Link href="/learn" className="btn btn-primary">
              <span className="btn-label">Start Learning Free</span>
              <span className="btn-icon-badge"><ArrowRight size={18} strokeWidth={2.5} /></span>
            </Link>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScgWDzXExB0Xe86eI70V7-96cIr-A_0bcAXC41dGyyRl8JdXA/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <span className="btn-label">Volunteer Today</span>
              <span className="btn-icon-badge"><HandHeart size={18} strokeWidth={2.5} /></span>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-lesson-wrap">
            <div className="hero-nudge" aria-hidden="true">
              <span className="hero-nudge-label">Try it out!</span>
              <svg className="hero-nudge-arrow" viewBox="0 0 40 48" fill="none">
                <path d="M 8 4 C 4 20, 20 32, 32 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M 20 38 L 32 44 L 26 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <HeroLesson />
          </div>
        </div>
      </div>
    </section>
  )
}
