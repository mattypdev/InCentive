import HostShell from '@/app/host/HostShell'
import SessionBuilderClient from './SessionBuilderClient'

export const metadata = { title: 'New session | Host | Incentive' }

export default function NewSessionPage() {
  return (
    <HostShell>
      <SessionBuilderClient />
    </HostShell>
  )
}
