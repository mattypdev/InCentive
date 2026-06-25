import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy,
  Sparkles, Target, PiggyBank, TrendingUp, Wallet, Shield,
  Lightbulb, BarChart3, Percent, Zap, RotateCcw,
} from 'lucide-react'
import Button from '../components/Button'
import './Presentations.css'

const QUESTION_TIME = 20
const CIRCLE_R = 20
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R

const iconMap = {
  PiggyBank, TrendingUp, Wallet, Shield, Target,
  Lightbulb, BarChart3, Percent, Sparkles, Zap,
}

const presentations = {
  BUDGET: {
    title: 'Budget Like a Boss',
    description: 'Master the art of managing your money!',
    slides: [
      {
        type: 'content',
        title: 'Welcome to Budget Like a Boss!',
        body: "Ready to take control of your finances? In this interactive session, we'll cover smart budgeting strategies that will help you make every dollar count. Answer questions along the way to test your knowledge and earn points!",
        icon: 'PiggyBank',
        accent: 'var(--tertiary)',
      },
      {
        type: 'question',
        question: 'According to the popular 50/30/20 rule, what percentage of your income should go toward needs like rent and groceries?',
        options: ['20%', '30%', '50%', '80%'],
        correct: 2,
        explanation: 'The 50/30/20 rule suggests allocating 50% of your after-tax income to needs like housing, food, and utilities.',
      },
      {
        type: 'content',
        title: 'The 50/30/20 Rule',
        body: "50% goes to needs (rent, groceries, utilities, insurance). 30% goes to wants (dining out, entertainment, hobbies). 20% goes to savings and debt repayment. This simple framework helps you balance enjoying life today while building for tomorrow.",
        icon: 'Wallet',
        accent: 'var(--accent)',
      },
      {
        type: 'question',
        question: 'You earn $3,000 per month after taxes. Following the 50/30/20 rule, how much should you save each month?',
        options: ['$300', '$600', '$900', '$1,500'],
        correct: 1,
        explanation: "20% of $3,000 = $600 per month toward savings and debt repayment. That adds up to $7,200 per year!",
      },
      {
        type: 'content',
        title: 'Emergency Fund Essentials',
        body: "An emergency fund is your financial safety net. It covers unexpected expenses like car repairs, medical bills, or job loss — so you don't have to rely on credit cards or loans when life throws a curveball.",
        icon: 'Shield',
        accent: 'var(--secondary)',
      },
      {
        type: 'question',
        question: 'How many months of living expenses do financial experts recommend keeping in an emergency fund?',
        options: ['1–2 months', '3–6 months', '10–12 months', '24 months'],
        correct: 1,
        explanation: 'Most experts recommend 3–6 months of essential expenses. This gives you a solid cushion without tying up too much cash.',
      },
      {
        type: 'content',
        title: 'Needs vs. Wants',
        body: "A “need” is something essential for survival and basic functioning — housing, food, healthcare, transportation to work. A “want” is something that improves your quality of life but isn't strictly necessary — streaming services, new clothes, eating out.",
        icon: 'Target',
        accent: 'var(--quaternary)',
      },
      {
        type: 'question',
        question: 'Which of these is classified as a "need" in a budget?',
        options: ['Netflix subscription', 'New sneakers', 'Health insurance', 'Concert tickets'],
        correct: 2,
        explanation: "Health insurance is a need — it protects you from potentially devastating medical costs. The others are wants (even if they feel essential!).",
      },
      {
        type: 'content',
        title: 'Smart Spending Strategies',
        body: "Before any big purchase, use the 48-hour rule: wait 48 hours before buying. Track every dollar for one month to see where your money actually goes. Use cash envelopes for categories where you tend to overspend. Small daily savings add up — $5/day = $1,825/year!",
        icon: 'Lightbulb',
        accent: 'var(--tertiary)',
      },
      {
        type: 'question',
        question: "You want to buy a $200 jacket. What's the smartest budgeting approach?",
        options: [
          'Put it on a credit card now',
          'Skip meals to save up faster',
          'Save from your "wants" budget over time',
          'Dip into your emergency fund',
        ],
        correct: 2,
        explanation: 'Saving from your "wants" allocation is the responsible choice. Never sacrifice needs or emergency savings for a want!',
      },
    ],
  },
  INVEST: {
    title: 'Investing 101: Grow Your Money',
    description: 'Learn how to make your money work for you!',
    slides: [
      {
        type: 'content',
        title: 'Welcome to Investing 101!',
        body: "Time to learn how to grow your wealth! Investing might sound intimidating, but the basics are simpler than you think. We'll cover compound interest, diversification, risk, and why starting early is your biggest superpower.",
        icon: 'TrendingUp',
        accent: 'var(--secondary)',
      },
      {
        type: 'question',
        question: 'What makes compound interest so powerful compared to simple interest?',
        options: [
          'It has a higher rate',
          'You earn interest on your interest',
          "It's tax-free",
          "It's guaranteed by the government",
        ],
        correct: 1,
        explanation: "Compound interest means you earn returns on both your original investment AND your accumulated returns. It's often called the \"8th wonder of the world!\"",
      },
      {
        type: 'content',
        title: 'The Power of Compound Interest',
        body: "Albert Einstein reportedly called compound interest the “eighth wonder of the world.” If you invest $1,000 at 10% annual return: after 10 years you'd have ~$2,594, after 20 years ~$6,727, and after 30 years ~$17,449. Your money literally makes money!",
        icon: 'BarChart3',
        accent: 'var(--tertiary)',
      },
      {
        type: 'question',
        question: 'If you invest $1,000 at a 10% average annual return, approximately how much would you have after 30 years?',
        options: ['$4,000', '$7,500', '$17,450', '$30,000'],
        correct: 2,
        explanation: "$1,000 × (1.10)³⁰ ≈ $17,449. That's over 17x your original investment — without adding another penny!",
      },
      {
        type: 'content',
        title: "Don't Put All Your Eggs in One Basket",
        body: "Diversification means spreading your investments across different types of assets — stocks, bonds, real estate, international markets. If one investment drops, others may hold steady or rise, reducing your overall risk.",
        icon: 'Target',
        accent: 'var(--quaternary)',
      },
      {
        type: 'question',
        question: 'Which portfolio is best diversified?',
        options: [
          'All money in one tech stock',
          'Half stocks, half savings account',
          'Mix of stocks, bonds, and index funds',
          'Only cryptocurrency',
        ],
        correct: 2,
        explanation: 'A mix of different asset types (stocks, bonds, index funds) provides the best diversification, balancing growth potential with stability.',
      },
      {
        type: 'content',
        title: 'Risk and Reward',
        body: "Higher potential returns usually come with higher risk. Stocks can earn 8–12% long-term but fluctuate wildly short-term. Bonds earn less (3–5%) but are more stable. Your risk tolerance depends on your age, goals, and timeline — younger investors can usually afford more risk.",
        icon: 'Percent',
        accent: 'var(--accent)',
      },
      {
        type: 'question',
        question: 'Which investment has historically provided the highest long-term returns (over 20+ years)?',
        options: [
          'Savings accounts',
          'Government bonds',
          'Stock market index funds',
          'Gold',
        ],
        correct: 2,
        explanation: "The S&P 500 has averaged about 10% annually over the long term, outperforming bonds (~5%), gold (~7%), and savings accounts (~2%).",
      },
      {
        type: 'content',
        title: 'The Earlier You Start, The Better',
        body: "Thanks to compound interest, time is your greatest asset. Starting at age 22 and investing $200/month at 8% gives you ~$700,000 by age 62. Wait until 32? You'd have ~$300,000. Those 10 extra years are worth $400,000!",
        icon: 'Sparkles',
        accent: 'var(--secondary)',
      },
      {
        type: 'question',
        question: "Alex starts investing $200/month at age 22. Jordan starts the same amount at age 32. At 8% returns, roughly how much more will Alex have at age 62?",
        options: ['$50,000 more', '$100,000 more', '$250,000 more', '$400,000 more'],
        correct: 3,
        explanation: "Alex would have ~$700K vs Jordan's ~$300K — a $400K difference! Those first 10 years of compound growth make an enormous impact.",
      },
    ],
  },
}

export default function PresentationViewer() {
  const { code } = useParams()
  const navigate = useNavigate()
  const pres = presentations[code?.toUpperCase()]

  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timedOut, setTimedOut] = useState(false)
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [lastPoints, setLastPoints] = useState(0)
  const timerRef = useRef(null)

  function stopTimer() {
    clearInterval(timerRef.current)
  }

  function startTimer() {
    stopTimer()
    setTimeLeft(QUESTION_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => stopTimer()
  }, [])

  useEffect(() => {
    if (!pres || finished) return
    const slide = pres.slides[current]
    if (slide?.type === 'question' && !showResult) {
      startTimer()
    }
    return () => stopTimer()
  }, [current, finished])

  useEffect(() => {
    if (timeLeft === 0 && !showResult && !timedOut && pres) {
      const slide = pres.slides[current]
      if (slide?.type === 'question') {
        setTimedOut(true)
        setShowResult(true)
        setLastPoints(0)
      }
    }
  }, [timeLeft])

  if (!pres) {
    return (
      <section className="pv-page">
        <div className="pv-topbar">
          <Link to="/presentations" className="pv-back">
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </Link>
        </div>
        <div className="pv-slide container">
          <div className="pv-not-found">
            <h2>Presentation Not Found</h2>
            <p>The code &ldquo;{code}&rdquo; doesn&rsquo;t match any presentation.</p>
            <Link to="/presentations" className="pv-not-found-link">
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to Presentations
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const slide = pres.slides[current]
  const totalSlides = pres.slides.length
  const progress = ((current + 1) / totalSlides) * 100
  const totalQuestions = pres.slides.filter((s) => s.type === 'question').length

  function handleAnswer(index) {
    if (showResult || timedOut) return
    stopTimer()
    setSelected(index)
    setShowResult(true)

    if (index === slide.correct) {
      const pts = Math.round(1000 * (timeLeft / QUESTION_TIME))
      setLastPoints(pts)
      setScore((s) => s + pts)
      setCorrectCount((c) => c + 1)
    } else {
      setLastPoints(0)
    }
  }

  function handleNext() {
    if (current + 1 >= totalSlides) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowResult(false)
      setTimedOut(false)
      setLastPoints(0)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setTimeLeft(QUESTION_TIME)
    setTimedOut(false)
    setFinished(false)
    setCorrectCount(0)
    setLastPoints(0)
  }

  if (finished) {
    const maxScore = totalQuestions * 1000
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    let rank, rankColor
    if (pct >= 80) { rank = 'Financial Genius!'; rankColor = 'var(--secondary)' }
    else if (pct >= 60) { rank = 'Money Master!'; rankColor = 'var(--tertiary)' }
    else if (pct >= 40) { rank = 'Getting There!'; rankColor = 'var(--quaternary)' }
    else { rank = 'Keep Learning!'; rankColor = 'var(--accent)' }

    return (
      <section className="pv-page">
        <div className="pv-topbar">
          <Link to="/presentations" className="pv-back">
            <ArrowLeft size={16} strokeWidth={2.5} /> Exit
          </Link>
          <div className="pv-progress">
            <div className="pv-progress-fill" style={{ width: '100%' }} />
          </div>
          <div className="pv-score-badge">
            <Zap size={16} strokeWidth={2.5} />
            {score}
          </div>
        </div>
        <div className="pv-slide container">
          <div className="pv-results">
            <div className="pv-results-icon">
              <Trophy size={44} strokeWidth={2} />
            </div>
            <h2>Presentation Complete!</h2>
            <div className="pv-score-display">
              <div className="pv-score-number">{score.toLocaleString()}</div>
              <div className="pv-score-max">out of {maxScore.toLocaleString()} points</div>
            </div>
            <div className="pv-rank" style={{ color: rankColor }}>{rank}</div>
            <div className="pv-stats">
              <div className="pv-stat">
                <span className="pv-stat-value">{correctCount}</span>
                <span className="pv-stat-label">Correct</span>
              </div>
              <div className="pv-stat">
                <span className="pv-stat-value">{totalQuestions - correctCount}</span>
                <span className="pv-stat-label">Incorrect</span>
              </div>
              <div className="pv-stat">
                <span className="pv-stat-value">{pct}%</span>
                <span className="pv-stat-label">Accuracy</span>
              </div>
            </div>
            <div className="pv-results-actions">
              <Button variant="secondary" icon={RotateCcw} onClick={handleRestart}>
                Play Again
              </Button>
              <Button variant="primary" icon={ArrowRight} onClick={() => navigate('/presentations')}>
                Try Another
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const SlideIcon = slide.icon ? iconMap[slide.icon] : null
  const timerColor = timeLeft > 10 ? 'var(--secondary)' : timeLeft > 5 ? 'var(--tertiary)' : 'var(--accent)'

  return (
    <section className="pv-page">
      <div className="pv-topbar">
        <Link to="/presentations" className="pv-back">
          <ArrowLeft size={16} strokeWidth={2.5} /> Exit
        </Link>
        <div className="pv-progress">
          <div className="pv-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="pv-score-badge">
          <Zap size={16} strokeWidth={2.5} />
          {score}
        </div>
      </div>

      <div className="pv-slide container" key={current}>
        {slide.type === 'content' ? (
          <div className="pv-content">
            {SlideIcon && (
              <div className="pv-content-icon" style={{ backgroundColor: slide.accent }}>
                <SlideIcon size={36} strokeWidth={2} />
              </div>
            )}
            <h2 className="pv-content-title">{slide.title}</h2>
            <p className="pv-content-body">{slide.body}</p>
            <Button variant="primary" icon={ArrowRight} onClick={handleNext}>
              {current + 1 >= totalSlides ? 'See Results' : 'Next'}
            </Button>
          </div>
        ) : (
          <div className="pv-question">
            <div className="pv-timer">
              <svg viewBox="0 0 48 48" className="pv-timer-svg">
                <circle cx="24" cy="24" r={CIRCLE_R} className="pv-timer-track" />
                <circle
                  cx="24" cy="24" r={CIRCLE_R}
                  className="pv-timer-fill"
                  style={{
                    strokeDasharray: CIRCUMFERENCE,
                    strokeDashoffset: CIRCUMFERENCE * (1 - timeLeft / QUESTION_TIME),
                    stroke: timerColor,
                  }}
                />
              </svg>
              <span className="pv-timer-text">{timeLeft}</span>
            </div>

            <h2 className="pv-question-text">{slide.question}</h2>

            <div className="pv-options-grid">
              {slide.options.map((option, i) => {
                const letter = String.fromCharCode(65 + i)
                let cls = 'pv-option'
                if (showResult) {
                  if (i === slide.correct) cls += ' pv-option--correct'
                  else if (i === selected) cls += ' pv-option--wrong'
                  else cls += ' pv-option--dimmed'
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                  >
                    <span className="pv-option-letter">{letter}</span>
                    <span className="pv-option-text">{option}</span>
                  </button>
                )
              })}
            </div>

            {showResult && (
              <div className="pv-feedback">
                <div className={`pv-feedback-icon ${
                  !timedOut && selected === slide.correct
                    ? 'pv-feedback-icon--correct'
                    : 'pv-feedback-icon--wrong'
                }`}>
                  {!timedOut && selected === slide.correct ? (
                    <>
                      <CheckCircle2 size={24} strokeWidth={2.5} />
                      <span>Correct! +{lastPoints} pts</span>
                    </>
                  ) : timedOut ? (
                    <>
                      <XCircle size={24} strokeWidth={2.5} />
                      <span>Time&rsquo;s up!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={24} strokeWidth={2.5} />
                      <span>Not quite!</span>
                    </>
                  )}
                </div>
                <p className="pv-explanation">{slide.explanation}</p>
                <Button variant="primary" icon={ArrowRight} onClick={handleNext}>
                  {current + 1 >= totalSlides ? 'See Results' : 'Next'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
