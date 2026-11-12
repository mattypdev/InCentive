'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Plus, Inbox, BookOpen, Clock, GraduationCap
} from 'lucide-react'
import './Host.css'

const NAV = [
  { href: '/host',              label: 'My sessions',        icon: LayoutDashboard, exact: true },
  { href: '/host/sessions/new', label: 'New session',        icon: Plus },
  { href: '/host/requests',     label: 'Requests',           icon: Inbox,           badge: null },
  { href: '/host/kits',         label: 'Host kits',          icon: BookOpen },
  { href: '/host/hours',        label: 'Hours & certificate',icon: Clock },
  { href: '/host/training',     label: 'Training',           icon: GraduationCap },
]

export default function HostShell({ children, chapterName, sessionCount, hours, requestCount }) {
  const pathname = usePathname()

  return (
    <div className="host-layout">
      <aside className="host-sidebar">
        <div className="host-sidebar-header">
          <div className="host-sidebar-chapter">{chapterName ?? 'My Chapter'}</div>
          <div className="host-sidebar-stats">
            Host · {sessionCount ?? 0} sessions · {hours ?? 0} hrs
          </div>
        </div>

        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/host'
            || (href === '/host' && (pathname === '/host' || pathname === '/host/'))
          return (
            <Link
              key={href}
              href={href}
              className={`host-sidebar-link${active ? ' active' : ''}`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
              {badge != null && badge > 0 && (
                <span className="badge">{badge}</span>
              )}
              {label === 'Requests' && requestCount > 0 && (
                <span className="badge">{requestCount}</span>
              )}
            </Link>
          )
        })}

        <p className="host-sidebar-small">Chapter lead approves new hosts</p>
      </aside>

      <main className="host-main">
        {children}
      </main>
    </div>
  )
}
