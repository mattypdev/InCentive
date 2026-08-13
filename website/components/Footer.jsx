import Link from 'next/link'
import { Mail } from 'lucide-react'
import './Footer.css'

function InstagramIcon({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function LinkedinIcon({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

const socials = [
  { icon: InstagramIcon, href: 'https://www.instagram.com/incentive.finance/', label: 'Instagram' },
  { icon: LinkedinIcon,  href: 'https://www.linkedin.com/company/incentive-finance/', label: 'LinkedIn' },
  { icon: Mail,          href: 'mailto:incentivefinanceinfo@gmail.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <Link href="/" className="footer-logo" aria-label="incentive home">
          in<span className="brand-highlight">cent</span>ive
        </Link>
        <p className="footer-tagline">
          Making financial literacy accessible, engaging, and fun for everyone.
        </p>
        <div className="footer-socials">
          {socials.map((social) => {
            const SocialIcon = social.icon
            return (
              <a
                key={social.label}
                href={social.href}
                className="footer-social-link"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon size={18} strokeWidth={2.5} />
              </a>
            )
          })}
        </div>
        <p className="footer-nonprofit">
          Incentive is a student-led nonprofit organization.
        </p>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} incentive. All rights reserved.</p>
      </div>
    </footer>
  )
}
