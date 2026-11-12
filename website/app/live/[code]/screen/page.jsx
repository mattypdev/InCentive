import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProjectorClient from './ProjectorClient'

export const metadata = { title: 'Projector | Incentive' }

export default async function ProjectorPage({ params }) {
  const { code } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('live_sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .neq('status', 'draft')
    .single()

  if (!session) notFound()

  let questions = []
  if (session.question_ids?.length) {
    const { data } = await supabase
      .from('questions')
      .select('id, prompt, question, options, answer, correct_index, explanation')
      .in('id', session.question_ids)
    questions = data ?? []
  }

  return <ProjectorClient initialSession={session} initialQuestions={questions} />
}
