import Hero from '@/components/Hero'
import Features from '@/components/Features'
import CTA from '@/components/CTA'

export const metadata = {
  title: 'Incentive — Learn Personal Finance & Earn Rewards',
  description: 'Incentive teaches you personal finance through interactive lessons and quizzes — and rewards you with real cents for every lesson you complete.',
  alternates: { canonical: 'https://incentivefinance.org' },
  openGraph: {
    title: 'Incentive — Learn Personal Finance & Earn Rewards',
    description: 'Interactive financial literacy lessons that pay you to learn.',
    url: 'https://incentivefinance.org',
    type: 'website',
  },
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  )
}
