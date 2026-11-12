import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeachShell from '../../TeachShell'
import NewAssignmentClient from './NewAssignmentClient'

export const metadata = { title: 'New Assignment · Incentive Teach' }

export default async function NewAssignmentPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/teach/assignments/new')

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

  // Load content
  const [islandsRes, unitsRes, lessonsRes] = await Promise.all([
    supabase.from('islands').select('slug, title, color, sort').order('sort'),
    supabase.from('units').select('id, island, title, sort').order('sort'),
    supabase.from('lessons').select('id, unit_id, title, sort').order('sort'),
  ])

  const islands = islandsRes.data ?? []
  const units   = unitsRes.data ?? []
  const lessons = lessonsRes.data ?? []

  // { slug → { island, units: [{ unit, lessons: [] }] } }
  const content = islands.map(isl => ({
    ...isl,
    units: units
      .filter(u => u.island === isl.slug)
      .map(unit => ({
        ...unit,
        lessons: lessons.filter(l => l.unit_id === unit.id),
      })),
  }))

  // Student list for "choose students" toggle
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', activeClass.id)
    .eq('role', 'student')

  const studentIds = (members ?? []).map(m => m.user_id)
  let students = []
  if (studentIds.length) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_initial')
      .in('id', studentIds)
    students = (profiles ?? []).map(p => ({
      id: p.id,
      name: `${p.first_name ?? ''} ${p.last_initial ? p.last_initial + '.' : ''}`.trim(),
    }))
  }

  return (
    <div className="teach-layout">
      <TeachShell activeHref="/teach/assignments" classId={activeClass.id} />
      <NewAssignmentClient
        groupId={activeClass.id}
        content={content}
        students={students}
        backHref={`/teach/assignments?class=${activeClass.id}`}
      />
    </div>
  )
}
