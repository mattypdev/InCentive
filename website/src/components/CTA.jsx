import { ArrowRight } from 'lucide-react'
import Button from './Button'
import './CTA.css'

export default function CTA() {
  return (
    <section className="cta section" id="cta">
      {/* Confetti shapes */}
      <div className="cta-confetti" aria-hidden="true">
        <span className="confetti confetti--circle confetti--1" />
        <span className="confetti confetti--triangle confetti--2" />
        <span className="confetti confetti--square confetti--3" />
        <span className="confetti confetti--circle confetti--4" />
        <span className="confetti confetti--triangle confetti--5" />
        <span className="confetti confetti--square confetti--6" />
      </div>

      <div className="cta-inner container">
        <h2 className="cta-title">
          Want to help us make a&nbsp;difference?
        </h2>
        <p className="cta-subtitle">
          Join our mission to equip people with the financial knowledge they
          deserve. By volunteering in your local schools, libraries, and
          community spaces, you can help break down barriers and build lasting
          confidence around money.
        </p>
        <Button
          variant="primary"
          icon={ArrowRight}
          href="https://docs.google.com/forms/d/e/1FAIpQLScgWDzXExB0Xe86eI70V7-96cIr-A_0bcAXC41dGyyRl8JdXA/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn"
        >
          Volunteer Today
        </Button>
      </div>
    </section>
  )
}
