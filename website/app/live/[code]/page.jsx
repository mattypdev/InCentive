import { Suspense } from 'react'
import PlayerClient from './PlayerClient'

export const metadata = { title: 'Live Session | Incentive' }

export default async function LiveSessionPage({ params }) {
  const { code } = await params
  return (
    <Suspense>
      <PlayerClient code={code?.toUpperCase()} />
    </Suspense>
  )
}
