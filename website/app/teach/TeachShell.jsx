import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Home, ClipboardList, BarChart2, Users, Settings, Plus } from 'lucide-react'

const NAV = [
  { href: '/teach',             label: 'Overview',     icon: Home },
  { href: '/teach/assignments', label: 'Assignments',  icon: ClipboardList },
  { href: '/teach/progress',    label: 'Progress',     icon: BarChart2 },
  { href: '/teach/students',    label: 'Students',     icon: Users },
]

export default async function TeachShell({ activeHref, classId, assignmentCount }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let classes = []
  let activeClass = null
  let studentCount = 0

  if (user) {
    const { data } = await supabase
      .from('groups')
      .select('id, name, code, period')
      .eq('owner_id', user.id)
      .eq('kind', 'class')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
    classes = data ?? []
    activeClass = classId ? classes.find(c => c.id === classId) : classes[0]

    if (activeClass) {
      const { count } = await supabase
        .from('group_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('group_id', activeClass.id)
        .eq('role', 'student')
      studentCount = count ?? 0
    }
  }

  // Active assignment count for badge (passed from page or queried here)
  let badge = assignmentCount ?? null
  if (badge === null && activeClass) {
    const { count } = await supabase
      .from('assignments')
      .select('id', { count: 'exact', head: true })
      .eq('group_id', activeClass.id)
      .eq('is_draft', false)
      .gt('opens_at', new Date(0).toISOString())
    badge = count ?? 0
  }

  const q = activeClass ? `?class=${activeClass.id}` : ''

  // Check if the active route matches — handle exact match and prefix match
  function isActive(href) {
    if (href === '/teach') return activeHref === '/teach'
    return activeHref === href || activeHref?.startsWith(href + '/')
  }

  return (
    <aside className="t-side">
      {/* Class switcher */}
      {activeClass ? (
        <div className="t-cls">
          <span className="t-cls-name">
            {activeClass.period ? `${activeClass.period} · ` : ''}{activeClass.name}
          </span>
          <span className="t-cls-meta">
            {studentCount} student{studentCount !== 1 ? 's' : ''} · code {activeClass.code}
          </span>
        </div>
      ) : (
        <div className="t-cls" style={{ opacity: 0.5 }}>
          <span className="t-cls-name">No class yet</span>
        </div>
      )}

      {/* Nav links */}
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={activeClass ? `${href}${q}` : href}
          className={`t-nav-link${isActive(href) ? ' on' : ''}`}
        >
          <Icon size={17} />
          {label}
          {label === 'Assignments' && badge !== null && badge > 0 && (
            <span className="t-count">{badge}</span>
          )}
        </Link>
      ))}

      <div className="t-side-gap" />

      {/* Footer links */}
      <div className="t-side-footer">
        <Link href={activeClass ? `/teach/students${q}` : '/teach/students'} className="t-nav-link">
          <Settings size={15} />
          Class settings
        </Link>
        <Link href="/teach/classes/new" className="t-nav-link">
          <Plus size={15} />
          New class
        </Link>
      </div>
    </aside>
  )
}
