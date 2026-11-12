'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Library, HelpCircle, Wallet } from 'lucide-react'
import './BottomTabBar.css'

const TABS = [
  { label: 'Learn',   href: '/learn',   Icon: BookOpen },
  { label: 'Library', href: '/library', Icon: Library },
  { label: 'Quizzes', href: '/quizzes', Icon: HelpCircle },
  { label: 'Wallet',  href: '/progress', Icon: Wallet },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="bottom-tab-bar" aria-label="Main navigation">
      {TABS.map(({ label, href, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} className={`bottom-tab${active ? ' bottom-tab--active' : ''}`}>
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
