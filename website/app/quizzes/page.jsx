import { Zap } from 'lucide-react'
import QuizzesClient from './QuizzesClient'
import '@/app/(pages)/Presentations.css'
import '@/app/(pages)/Quizzes.css'
import '@/components/Button.css'

export default function QuizzesPage() {
  return (
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
  )
}
