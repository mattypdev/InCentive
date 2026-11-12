import { Suspense } from 'react'
import JoinClient from './JoinClient'

export const metadata = {
  title: 'Join a class | Incentive',
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinClient />
    </Suspense>
  )
}
