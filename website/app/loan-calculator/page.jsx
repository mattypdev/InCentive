import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoanCalc from './LoanCalc'
import FAQ from '@/components/FAQ'
import { SITE, webAppLd, breadcrumbLd } from '@/lib/schema'
import '@/app/(pages)/Calculator.css'

const faqItems = [
  {
    question: 'How is my monthly loan payment calculated?',
    answer: 'Your monthly payment is calculated using the standard amortization formula: M = P[r(1+r)^n] / [(1+r)^n−1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the number of monthly payments. Each payment covers that month\'s interest first; the remainder reduces your principal balance.',
  },
  {
    question: 'What is a good interest rate for a personal loan?',
    answer: 'A good personal loan rate is below 12% APR. Borrowers with excellent credit (720+) typically qualify for 6–12%. Average credit (630–719) usually sees 13–20%. If you are being offered above 25%, the loan is expensive—shop around or delay borrowing until your credit improves. Auto loans and mortgages carry lower rates because they are secured by collateral.',
  },
  {
    question: 'Does a shorter loan term always save money?',
    answer: 'A shorter term saves on total interest but raises your monthly payment. A $15,000 loan at 8% over 3 years costs $470/month and $1,924 in total interest. The same loan over 5 years costs $304/month but $3,240 in total interest—$1,316 more. Choose the shortest term your budget can comfortably handle each month.',
  },
  {
    question: 'What is the difference between APR and interest rate?',
    answer: 'The interest rate is the base cost of borrowing as a percentage. APR (Annual Percentage Rate) includes the interest rate plus any fees—origination fees, closing costs, or points—rolled into a single annual figure. APR is the better number to compare across lenders because it reflects the true total cost of the loan.',
  },
  {
    question: 'How does my credit score affect my loan rate?',
    answer: 'Your credit score is the single biggest factor lenders use to set your rate. The difference between a 620 and a 760 score can be 5–10 percentage points on a personal loan. On a $20,000 loan over 5 years, that gap means paying thousands more in interest. Improving your score before applying is almost always worth the wait.',
  },
  {
    question: 'Should I pay off my loan early?',
    answer: 'Yes, if your loan has no prepayment penalty and the rate is above 4–5%. Extra principal payments reduce the balance on which interest accrues, cutting both your total interest and your payoff date. Check your loan agreement first—some lenders charge fees for early payoff that could offset your savings.',
  },
  {
    question: 'What happens if I miss a loan payment?',
    answer: 'Missing a payment typically triggers a late fee (often $25–$50 or 5% of the payment amount). After 30 days, lenders report the missed payment to credit bureaus, which can drop your credit score significantly. After 90+ days, the loan may go to collections. Contact your lender immediately if you cannot pay—most offer hardship or deferment plans.',
  },
  {
    question: 'How can I lower my monthly loan payment?',
    answer: 'The three main ways to lower a monthly payment are: extend the loan term (raises total interest), negotiate a lower interest rate, or borrow less. Refinancing to a lower rate is the best option if your credit has improved since you took the original loan—it reduces both the monthly payment and the total cost of borrowing.',
  },
]

export const metadata = {
  title: 'Free Loan Payment Calculator | Incentive',
  description: 'Free loan payment calculator. Enter your loan amount, interest rate, and repayment term to estimate your monthly payment, total interest, and payoff timeline.',
  alternates: { canonical: `${SITE}/loan-calculator` },
  openGraph: {
    title: 'Free Loan Payment Calculator | Incentive',
    description: 'Free loan payment calculator. Enter your loan amount, interest rate, and repayment term to estimate your monthly payment, total interest, and payoff timeline.',
    url: `${SITE}/loan-calculator`,
    type: 'website',
  },
}

const appLd = webAppLd({
  name: 'Loan Calculator',
  description: 'Estimate monthly loan payments, total interest paid, and payoff timeline based on loan amount, interest rate, and term.',
  url: `${SITE}/loan-calculator`,
})

const crumbLd = breadcrumbLd([
  ['Resources', '/resources'],
  ['Loan Calculator', '/loan-calculator'],
])

export default function LoanCalculatorPage() {
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
          <h1>Loan Calculator</h1>
          <p>Estimate monthly payments, total interest, and payoff timelines.</p>
        </div>

        <LoanCalc />

        <FAQ items={faqItems} />
      </div>
    </section>
  )
}
