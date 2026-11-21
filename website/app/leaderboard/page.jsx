import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLeaderboardData } from '@/app/actions/league'
import LeaderboardClient from './LeagueClient'

export const metadata = { title: 'Leaderboard · Incentive' }

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/leaderboard')

  const data = await getLeaderboardData(user.id)
  return <LeaderboardClient data={data} userId={user.id} />
}
