import LearnClient from './LearnClient'
import { SITE, ORG, breadcrumbLd } from '@/lib/schema'

export const metadata = {
  title: 'Learn Personal Finance — Incentive',
  description: 'Master personal finance through interactive lessons, quizzes, and challenges. Six modules covering budgeting, banking, taxes, investing, markets, and behavioral finance.',
  alternates: { canonical: `${SITE}/learn` },
  openGraph: {
    title: 'Learn Personal Finance — Incentive',
    description: 'Interactive personal finance lessons for high school students. Earn rewards as you progress through budgeting, investing, taxes, and more.',
    url: `${SITE}/learn`,
    type: 'website',
  },
}

const courseLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Personal Finance Fundamentals',
  description: 'An interactive personal finance course for high school students covering budgeting, banking, taxes, investing, retirement planning, and behavioral finance. Learn through quizzes and earn rewards as you progress.',
  url: `${SITE}/learn`,
  inLanguage: 'en-US',
  isAccessibleForFree: true,
  educationalLevel: 'Beginner',
  teaches: [
    'personal finance',
    'budgeting',
    'banking',
    'compound interest',
    'taxes',
    'investing',
    'retirement planning',
    'behavioral finance',
  ],
  provider: ORG,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  hasPart: [
    { '@type': 'Course', name: 'The Basics', description: 'Money, income, budgeting, and banking' },
    { '@type': 'Course', name: 'Banking & Budgeting', description: 'Compound interest, budgets, and credit scores' },
    { '@type': 'Course', name: 'Taxes & Investing', description: 'Filing taxes and putting money to work' },
    { '@type': 'Course', name: 'Markets & Business', description: 'Stocks, funds, retirement, and economics' },
    { '@type': 'Course', name: 'Advanced Topics', description: 'Real estate, debt, and entrepreneurship' },
    { '@type': 'Course', name: 'Finance & Psychology', description: 'Behavioral finance, emotional spending, and money mindset' },
  ],
}

const crumbLd = breadcrumbLd([['Learn', '/learn']])

export default function LearnPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <LearnClient />
    </>
  )
}
