import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Sunday digest cron — called weekly via Vercel cron or external scheduler
// Sends a summary email to each parent with linked children

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Fetch all active family links with parent + child data
  const { data: links, error } = await supabase
    .from('family_links')
    .select(`
      id,
      parent_id,
      child_id,
      share,
      profiles!family_links_parent_id_fkey ( email, first_name ),
      child:profiles!family_links_child_id_fkey ( first_name )
    `)

  if (error) {
    console.error('[digest] fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!links || links.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  // Group links by parent so one email covers multiple children
  const byParent = new Map<string, { email: string; firstName: string; children: string[] }>()
  for (const link of links) {
    const parent = link.profiles as any
    const child = link.child as any
    if (!parent?.email) continue

    const existing = byParent.get(link.parent_id)
    if (existing) {
      existing.children.push(child?.first_name ?? 'your child')
    } else {
      byParent.set(link.parent_id, {
        email: parent.email,
        firstName: parent.first_name ?? 'there',
        children: [child?.first_name ?? 'your child'],
      })
    }
  }

  // Collect stats per child for the past week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const digests: Array<{ email: string; subject: string; body: string }> = []

  for (const [parentId, parent] of byParent) {
    const link = links.find(l => l.parent_id === parentId)
    if (!link) continue

    const childIds = links
      .filter(l => l.parent_id === parentId)
      .map(l => l.child_id)

    const { data: attempts } = await supabase
      .from('attempts')
      .select('user_id, score, created_at')
      .in('user_id', childIds)
      .gte('created_at', oneWeekAgo)

    const { data: streakRows } = await supabase
      .from('streaks')
      .select('user_id, current_streak')
      .in('user_id', childIds)

    const streakMap = new Map(streakRows?.map(r => [r.user_id, r.current_streak]) ?? [])

    const childLines = parent.children.map(childName => {
      const childId = links.find(l => l.parent_id === parentId && (l.child as any)?.first_name === childName)?.child_id
      const lessonsCount = attempts?.filter(a => a.user_id === childId).length ?? 0
      const streak = streakMap.get(childId ?? '') ?? 0
      return `${childName}: ${lessonsCount} lesson${lessonsCount !== 1 ? 's' : ''} this week · ${streak}-day streak`
    })

    digests.push({
      email: parent.email,
      subject: `${parent.children[0]}'s Incentive week in review`,
      body: [
        `Hi ${parent.firstName},`,
        '',
        `Here's what happened on Incentive this week:`,
        '',
        ...childLines,
        '',
        'Log in at incentivefinance.org/family to see details and ask questions.',
        '',
        '— The Incentive team',
      ].join('\n'),
    })
  }

  // Log digests (email sending wired up when email provider is configured)
  console.log(`[digest] prepared ${digests.length} digest(s)`)
  for (const d of digests) {
    console.log(`[digest] → ${d.email}: ${d.subject}`)
  }

  return NextResponse.json({ sent: digests.length, digests: digests.map(d => ({ email: d.email, subject: d.subject })) })
}
