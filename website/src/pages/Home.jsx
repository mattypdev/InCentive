import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Incentive — Learn Personal Finance &amp; Earn Rewards</title>
        <meta name="description" content="Incentive teaches you personal finance through interactive lessons and quizzes — and rewards you with real cents for every lesson you complete." />
        <link rel="canonical" href="https://incentivefinance.org" />
        <meta property="og:title"       content="Incentive — Learn Personal Finance & Earn Rewards" />
        <meta property="og:description" content="Interactive financial literacy lessons that pay you to learn." />
        <meta property="og:url"         content="https://incentivefinance.org" />
        <meta property="og:type"        content="website" />
      </Helmet>
      <Hero />
      <Features />
      <CTA />
    </>
  )
}
