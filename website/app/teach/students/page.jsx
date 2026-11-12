import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeachShell from '../TeachShell'
import StudentsClient from './StudentsClient'

export const metadata = { title: 'Students · Incentive Teach' }

export default async function StudentsPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach/students')

  const params = await searchParams
  const classId = params?.class

  const { data: classes } = await supabase
    .from('groups')
    .select('id, name, code, period')
    .eq('owner_id', user.id)
    .eq('kind', 'class')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  if (!classes?.length) redirect('/teach/classes/new')
  const activeClass = classId ? classes.find(c => c.id === classId) : classes[0]
  if (!activeClass) redirect('/teach/classes/new')

  // Load members
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id, role, joined_at')
    .eq('group_id', activeClass.id)
    .neq('role', 'owner')

  const studentMembers = (members ?? []).filter(m => m.role === 'student')
  const studentIds = studentMembers.map(m => m.user_id)

  let students = []
  if (studentIds.length) {
    const [profilesRes, streaksRes, lpRes] = await Promise.all([
      supabase.from('profiles').select('id, first_name, last_initial, class_email, is_class_account').in('id', studentIds),
      supabase.from('streaks').select('user_id, last_active_on').in('user_id', studentIds),
      supabase.from('lesson_progress').select('user_id, score, completed').in('user_id', studentIds).eq('completed', true),
    ])

    const profiles = profilesRes.data ?? []
    const streaks = streaksRes.data ?? []
    const lp = lpRes.data ?? []

    students = studentMembers.map(m => {
      const p = profiles.find(pr => pr.id === m.user_id)
      const st = streaks.find(s => s.user_id === m.user_id)
      const userLp = lp.filter(l => l.user_id === m.user_id)
      const userScores = userLp.map(l => l.score).filter(s => s != null)
      const avgScore = userScores.length ? Math.round(userScores.reduce((a, b) => a + b, 0) / userScores.length) : null
      const lastActive = st?.last_active_on ?? null
      const daysAgo = lastActive ? Math.floor((Date.now() - new Date(lastActive).getTime()) / 86400000) : null
      return {
        id: m.user_id,
        name: p ? `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim() : 'Unknown',
        username: p?.class_email ?? null,
        isClassAccount: p?.is_class_account ?? false,
        joinedAt: m.joined_at,
        lastActiveDaysAgo: daysAgo,
        lessonsCount: userLp.length,
        avgScore,
        hasJoined: !!p,
      }
    })
  }

  // Co-teachers
  const coTeachers = (members ?? []).filter(m => m.role === 'co_teacher')

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach/students" classId={activeClass.id} />
      <StudentsClient
        activeClass={activeClass}
        students={students}
        coTeachers={coTeachers}
      />
    </div>
  )
}
