import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConsoleClient from './ConsoleClient'

export const metadata = { title: 'Console | Host | Incentive' }

export default async function ConsolePage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('live_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!session) notFound()

  const isHost = session.host_id === user.id || session.cohost_ids?.includes(user.id)
  if (!isHost) redirect('/host')

  // Fetch question data for the console
  let questions = []
  if (session.question_ids?.length) {
    const { data: qData } = await supabase
      .from('questions')
      .select('id, prompt, question, options, answer, correct_index, explanation, host_notes')
      .in('id', session.question_ids)
    questions = qData ?? []
  }

  return <ConsoleClient session={session} questions={questions} />
}
