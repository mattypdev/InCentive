import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RetirementCalc from './RetirementCalc'
import FAQ from '@/components/FAQ'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

const faqItems = [
  {
    question: 'How much money do I need to retire?',
    answer: 'A common benchmark is 25 times your expected annual retirement spending—the 4% rule. If you plan to spend $50,000 per year, you need $1.25 million saved. This assumes you withdraw 4% annually and your portfolio earns enough to sustain that for 30 years. Subtract any guaranteed income like Social Security, which reduces how much your savings need to cover.',
  },
  {
    question: 'What annual return should I use in the retirement calculator?',
    answer: 'Use 6–7% for a stock-heavy long-term portfolio (this approximates the S&P 500\'s historical average after inflation). Use 4–5% for a balanced mix of stocks and bonds. Use 3% or lower for a conservative approach near or in retirement. Avoid using anything above 8%—it typically does not account for inflation, fees, or market variance over decades.',
  },
  {
    question: 'What is the 4% rule?',
    answer: 'The 4% rule states that withdrawing 4% of your retirement savings in year one, then adjusting for inflation each year after, your portfolio has historically lasted 30 years in most market conditions. It originated from the 1994 Trinity Study. Many planners now recommend 3–3.5% for early retirees or those with longer expected lifespans.',
  },
  {
    question: 'How much should I save each month for retirement?',
    answer: 'A standard target is 15% of your gross income, including any employer match. At 25, saving $300/month at 7% reaches about $1 million by 65. At 35, reaching the same amount requires roughly $700/month. The exact number depends on your current savings, timeline, and expected expenses. Use the calculator above to find your personal target.',
  },
  {
    question: 'When should I start saving for retirement?',
    answer: 'As early as possible—ideally with your first job. Starting at 22 and saving $200/month at 7% produces roughly $655,500 by 65. Starting at 32 with the same contribution produces about $308,800—less than half. Every year you delay requires larger monthly savings to reach the same balance. If your employer matches 401(k) contributions, capture the full match immediately—it is free money.',
  },
  {
    question: 'What is the difference between a Roth IRA and a traditional 401(k)?',
    answer: 'A traditional 401(k) uses pre-tax dollars—you reduce your taxable income now but pay taxes on withdrawals in retirement. A Roth IRA uses after-tax dollars—you pay taxes now, but all withdrawals in retirement are completely tax-free, including decades of growth. Roth accounts are generally better when you are young and in a lower tax bracket than you expect to be at retirement.',
  },
  {
    question: 'Does Social Security count toward my retirement savings goal?',
    answer: 'Yes—Social Security income reduces how much you need your savings to cover. The average benefit is about $1,800/month in 2025 ($21,600/year). If your retirement budget is $50,000/year, Social Security covers about 43% of it, so your savings only need to fund the remaining $28,400 annually. Visit the Social Security Administration\'s My SSA portal to estimate your personal projected benefit.',
  },
  {
    question: 'What if I am starting to save for retirement late?',
    answer: 'It is never too late to meaningfully improve your retirement outcome. Focus first on maxing tax-advantaged accounts—at age 50, the IRS allows catch-up contributions ($7,500 extra to a 401(k) in 2025). Delaying retirement by even 2–3 years has an outsized effect: it adds savings years and shortens the period your portfolio must support you. Reducing planned retirement spending also dramatically lowers the balance you need.',
  },
]

export const metadata = {
  title: 'Free Retirement Savings Calculator | Incentive',
  description: 'Free retirement savings calculator. Adjust your age, savings balance, monthly contributions, and expected return to project what you\'ll have at retirement.',
  alternates: { canonical: `${SITE}/retirement-calculator` },
  openGraph: {
    title: 'Free Retirement Savings Calculator | Incentive',
    description: 'Free retirement savings calculator. Adjust your age, savings balance, monthly contributions, and expected return to project what you\'ll have at retirement.',
    url: `${SITE}/retirement-calculator`,
    type: 'website',
  },
}

const appLd = webAppLd({
  name: 'Retirement Calculator',
  description: 'Project your retirement savings based on current age, retirement age, existing savings, monthly contributions, and expected annual return.',
  url: `${SITE}/retirement-calculator`,
})

const crumbLd = breadcrumbLd([
  ['Resources', '/resources'],
  ['Retirement Calculator', '/retirement-calculator'],
])

export default function RetirementCalculatorPage() {
  return (
    <section className="calc-page section">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />

        <Link href="/resources" className="calc-back">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Resources
        </Link>

        <div className="calc-header">
          <h1>Retirement Calculator</h1>
          <p>Plan ahead and see what it takes to retire on your terms.</p>
        </div>

        <RetirementCalc />

        <FAQ items={faqItems} />
      </div>
    </section>
  )
}
