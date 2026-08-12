import { Zap } from 'lucide-react'
import QuizzesClient from './QuizzesClient'
import { SITE, ORG, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Presentations.css'
import '@/app/(pages)/Quizzes.css'
import '@/components/Button.css'

export const metadata = {
  title: 'Financial Literacy Quizzes for Classrooms | Incentive',
  description: 'Run free financial literacy quizzes for your classroom or join one with a code. Create, share, and play quizzes on budgeting, investing, taxes, and more.',
  alternates: { canonical: `${SITE}/quizzes` },
  openGraph: {
    title: 'Financial Literacy Quizzes for Classrooms | Incentive',
    description: 'Run free financial literacy quizzes for your classroom or join one with a code. Create, share, and play quizzes on budgeting, investing, taxes, and more.',
    url: `${SITE}/quizzes`,
    type: 'website',
  },
}

const quizLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'incentive Quizzes',
  description: 'Live personal finance quizzes created and shared by educators and students. Join with a code or create your own.',
  url: `${SITE}/quizzes`,
  learningResourceType: 'Quiz',
  isAccessibleForFree: true,
  inLanguage: 'en-US',
  educationalLevel: 'Beginner',
  teaches: ['personal finance', 'financial literacy'],
  provider: ORG,
}

const crumbLd = breadcrumbLd([['Quizzes', '/quizzes']])

export default function QuizzesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <section className="quiz-page section">
        <div className="container">
          <div className="quiz-hero">
            <div className="pres-shape pres-shape--circle" />
            <div className="pres-shape pres-shape--triangle" />
            <div className="pres-shape pres-shape--square" />
            <div className="pres-icon-badge">
              <Zap size={28} strokeWidth={2.5} />
            </div>
            <h1>Join a Quiz</h1>
            <p className="pres-subtitle">
              Enter the code shared by your quiz creator to start.
            </p>
          </div>

          <QuizzesClient />
        </div>
      </section>
    </>
  )
}
