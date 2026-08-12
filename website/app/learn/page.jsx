import LearnClient from './LearnClient'
import { SITE, ORG, breadcrumbLd } from '@/lib/schema'

export const metadata = {
  title: 'Free Personal Finance Courses for Students | Incentive',
  description: 'Free personal finance courses for high school students. Learn budgeting, banking, taxes, and investing through interactive lessons and earn rewards as you go.',
  alternates: { canonical: `${SITE}/learn` },
  openGraph: {
    title: 'Free Personal Finance Courses for Students | Incentive',
    description: 'Free personal finance courses for high school students. Learn budgeting, banking, taxes, and investing through interactive lessons and earn rewards as you go.',
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
