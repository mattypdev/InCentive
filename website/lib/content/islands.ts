import type { Island, Unit, Lesson, Step, IslandSlug } from './types'

export const islands: Island[] = [
  {
    slug: 'basics',
    title: 'The Basics',
    tagline: 'Money, income, spending & saving',
    order: 1,
    art: '/islands/island-0.png',
    standards: ['earning_income', 'spending', 'saving'],
    color: '#FF6F61',
  },
  {
    slug: 'banking-budgeting',
    title: 'Banking & Budgeting',
    tagline: 'Banks, payments, budgets & goals',
    order: 2,
    art: '/islands/island-1.png',
    standards: ['spending', 'saving'],
    color: '#0D9488',
  },
  {
    slug: 'credit-protection',
    title: 'Credit & Protection',
    tagline: 'Credit scores, cards, loans & insurance',
    order: 3,
    art: '/islands/island-4.png',
    standards: ['managing_credit', 'managing_risk'],
    color: '#8B5CF6',
  },
  {
    slug: 'taxes-investing',
    title: 'Taxes & Investing',
    tagline: 'Taxes, stocks, bonds & retirement',
    order: 4,
    art: '/islands/island-2.png',
    standards: ['earning_income', 'investing'],
    color: '#3B82F6',
  },
  {
    slug: 'markets-business',
    title: 'Markets & Business',
    tagline: 'Economics, business & entrepreneurship',
    order: 5,
    art: '/islands/island-3.png',
    standards: ['investing', 'spending'],
    color: '#F59E0B',
  },
  {
    slug: 'finance-psychology',
    title: 'Finance & Psychology',
    tagline: 'Behavior, biases & money mindset',
    order: 6,
    art: '/islands/island-5.png',
    standards: ['spending', 'saving'],
    color: '#EC4899',
  },
  {
    slug: 'capstone',
    title: 'Capstone',
    tagline: 'Put it all together',
    order: 7,
    art: '/islands/island-cap.png',
    standards: ['earning_income', 'spending', 'saving', 'investing', 'managing_credit', 'managing_risk'],
    color: '#F4B400',
  },
]

// Island slug → ordered unit legacy ids (from spec section 3)
export const islandUnitIds: Record<string, string[]> = {
  'basics':             ['u1-1', 'u1-2', 'u1-3', 'u1-4'],
  'banking-budgeting':  ['u2-1', 'u2-2', 'u2-3', 'u3-1', 'u3-2', 'u3-3'],
  'credit-protection':  ['u4-1', 'u4-2', 'u4-3', 'u13-1', 'u6-1', 'u14-1'],
  'taxes-investing':    ['u5-1', 'u5-2', 'u7-1', 'u7-2', 'u7-3', 'u7-4', 'u7-5', 'u8-1'],
  'markets-business':   ['u11-1', 'u9-1', 'u16-1', 'u12-1', 'u17-1', 'u10-1', 'u15-1'],
  'finance-psychology': ['u19-1', 'u21-1', 'u22-1', 'u18-1'],
  'capstone':           ['u20-1'],
}

function sl(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[''']/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Raw unit data (id, title, centsReward, level, summary, lessons[])
const RAW_UNITS = [
  { id: 'u1-1', title: 'What is Money?', centsReward: 160, level: 'beginner' as const, summary: 'Explore the history and function of money — from barter to bitcoin.',
    lessons: [
      { id: 'u1-1-l1', title: 'History of Money', objective: 'Explain how money evolved from barter systems to modern currency.' },
      { id: 'u1-1-l2', title: 'Barter System', objective: 'Describe the limitations of barter and why money was invented.' },
      { id: 'u1-1-l3', title: 'Why Money Has Value', objective: 'Explain what gives money its value in a modern economy.' },
      { id: 'u1-1-l4', title: 'Fiat Currency', objective: 'Define fiat currency and how governments back it.' },
      { id: 'u1-1-l5', title: 'Commodity Money', objective: 'Compare commodity money to fiat currency with real examples.' },
      { id: 'u1-1-l6', title: 'Digital Money', objective: 'Describe how digital money works and where it is stored.' },
      { id: 'u1-1-l7', title: 'Cryptocurrency Basics', objective: 'Explain what cryptocurrency is and how blockchain records transactions.' },
      { id: 'u1-1-l8', title: 'Inflation Introduction', objective: 'Define inflation and explain how it erodes purchasing power over time.' },
    ],
  },
  { id: 'u1-2', title: 'Income', centsReward: 160, level: 'beginner' as const, summary: 'Understand the different ways people earn money — from salaries to side hustles.',
    lessons: [
      { id: 'u1-2-l1', title: 'What Income Is', objective: 'Define income and list the main ways people earn it.' },
      { id: 'u1-2-l2', title: 'Gross vs Net Income', objective: 'Calculate the difference between gross and net pay using a pay stub.' },
      { id: 'u1-2-l3', title: 'Salary', objective: 'Explain how salaried income works and convert annual to monthly pay.' },
      { id: 'u1-2-l4', title: 'Hourly Wage', objective: 'Calculate weekly earnings from an hourly rate and hours worked.' },
      { id: 'u1-2-l5', title: 'Overtime', objective: 'Apply the 1.5x overtime rule to calculate total weekly pay.' },
      { id: 'u1-2-l6', title: 'Commission', objective: 'Compute earnings from commission-based pay structures.' },
      { id: 'u1-2-l7', title: 'Bonuses & Tips', objective: 'Describe how bonuses and tips are taxed differently from wages.' },
      { id: 'u1-2-l8', title: 'Multiple Income Streams', objective: 'Identify the benefits of having more than one source of income.' },
    ],
  },
  { id: 'u1-3', title: 'Spending', centsReward: 160, level: 'beginner' as const, summary: 'Learn to distinguish needs from wants and make smarter spending decisions.',
    lessons: [
      { id: 'u1-3-l1', title: 'Needs vs Wants', objective: 'Classify expenses as needs or wants in a real budget scenario.' },
      { id: 'u1-3-l2', title: 'Opportunity Cost', objective: 'Explain opportunity cost with a real money trade-off example.' },
      { id: 'u1-3-l3', title: 'Fixed Expenses', objective: 'Identify fixed expenses in a monthly budget.' },
      { id: 'u1-3-l4', title: 'Variable Expenses', objective: 'Track variable expenses and find areas to cut.' },
      { id: 'u1-3-l5', title: 'Recurring vs One-Time Expenses', objective: 'Distinguish recurring from one-time costs and plan for both.' },
      { id: 'u1-3-l6', title: 'Impulse Buying', objective: 'Identify impulse triggers and strategies to avoid them.' },
      { id: 'u1-3-l7', title: 'Lifestyle Inflation', objective: 'Explain lifestyle inflation and its long-term financial impact.' },
      { id: 'u1-3-l8', title: 'Delayed Gratification', objective: 'Apply the 24-hour rule to a real spending decision.' },
    ],
  },
  { id: 'u1-4', title: 'Saving', centsReward: 160, level: 'beginner' as const, summary: 'Build the saving habit — emergency funds, interest, and long-term goals.',
    lessons: [
      { id: 'u1-4-l1', title: 'Why Save', objective: 'List three financial benefits of saving money regularly.' },
      { id: 'u1-4-l2', title: 'Emergency Funds', objective: 'Explain why an emergency fund is the first savings priority.' },
      { id: 'u1-4-l3', title: 'Savings Accounts', objective: 'Compare savings account features and choose the best option.' },
      { id: 'u1-4-l4', title: 'Simple Interest', objective: 'Calculate simple interest earned on a savings balance.' },
      { id: 'u1-4-l5', title: 'Compound Interest', objective: 'Show how compound interest grows savings faster than simple interest.' },
      { id: 'u1-4-l6', title: 'Saving Goals', objective: 'Create a savings plan with a target amount and timeline.' },
      { id: 'u1-4-l7', title: 'Pay Yourself First', objective: 'Explain the pay-yourself-first strategy and set it up automatically.' },
      { id: 'u1-4-l8', title: 'Inflation vs Savings', objective: 'Calculate how inflation reduces the real value of savings over time.' },
    ],
  },
  { id: 'u2-1', title: 'Banks & Accounts', centsReward: 160, level: 'beginner' as const, summary: 'Learn how banks work, what accounts to open, and how your deposits are protected.',
    lessons: [
      { id: 'u2-1-l1', title: 'Checking Accounts', objective: 'Describe what a checking account is and when to use it.' },
      { id: 'u2-1-l2', title: 'Savings Accounts at Banks', objective: 'Compare checking and savings accounts and choose the right one.' },
      { id: 'u2-1-l3', title: 'Credit Unions', objective: 'Explain what credit unions are and how they differ from banks.' },
      { id: 'u2-1-l4', title: 'Online Banks', objective: 'List the advantages and disadvantages of online-only banks.' },
      { id: 'u2-1-l5', title: 'How Banks Make Money', objective: 'Describe how banks earn profit from deposits and loans.' },
      { id: 'u2-1-l6', title: 'FDIC Insurance', objective: 'Explain FDIC insurance and how much of your money it protects.' },
      { id: 'u2-1-l7', title: 'Reading Bank Statements', objective: 'Identify key sections of a bank statement and spot errors.' },
      { id: 'u2-1-l8', title: 'Mobile Banking', objective: 'List the most useful mobile banking features and safety tips.' },
    ],
  },
  { id: 'u2-2', title: 'Payments', centsReward: 160, level: 'beginner' as const, summary: 'Master every payment method — cards, apps, cash, and transfers.',
    lessons: [
      { id: 'u2-2-l1', title: 'Debit Cards', objective: 'Explain how debit cards work and the risk of overdrafts.' },
      { id: 'u2-2-l2', title: 'Credit Cards as Payment', objective: 'Describe when paying with a credit card makes sense.' },
      { id: 'u2-2-l3', title: 'Cash & Checks', objective: 'Compare cash and checks and identify when each is safest.' },
      { id: 'u2-2-l4', title: 'Wire Transfers & ACH', objective: 'Distinguish wire transfers from ACH payments by speed and cost.' },
      { id: 'u2-2-l5', title: 'Venmo, Cash App & Zelle', objective: 'Use peer-to-peer apps safely and avoid common scams.' },
      { id: 'u2-2-l6', title: 'Apple Pay, Google Pay & Contactless', objective: 'Explain how contactless payments work and how they stay secure.' },
      { id: 'u2-2-l7', title: 'Direct Deposit', objective: 'Set up direct deposit and explain its benefits over paper checks.' },
      { id: 'u2-2-l8', title: 'Choosing the Right Payment Method', objective: 'Select the best payment method for different spending situations.' },
    ],
  },
  { id: 'u2-3', title: 'Interest', centsReward: 140, level: 'beginner' as const, summary: 'Understand APR, APY, and how interest works for both borrowers and savers.',
    lessons: [
      { id: 'u2-3-l1', title: 'APR', objective: 'Define APR and calculate the yearly cost of a loan.' },
      { id: 'u2-3-l2', title: 'APY', objective: 'Distinguish APY from APR and explain which is better for savers.' },
      { id: 'u2-3-l3', title: 'Compound Interest', objective: 'Show how compounding frequency affects the total interest paid.' },
      { id: 'u2-3-l4', title: 'Loan Interest', objective: 'Calculate total interest paid on a simple loan.' },
      { id: 'u2-3-l5', title: 'Mortgage Interest', objective: 'Explain how mortgage amortization front-loads interest payments.' },
      { id: 'u2-3-l6', title: 'Student Loan Interest', objective: 'Calculate capitalized student loan interest during deferment.' },
      { id: 'u2-3-l7', title: 'Credit Card Interest', objective: 'Calculate how much interest accrues when you carry a credit card balance.' },
    ],
  },
  { id: 'u3-1', title: 'Budget Basics', centsReward: 160, level: 'beginner' as const, summary: 'Build your first budget — zero-based, 50/30/20, envelope, and more.',
    lessons: [
      { id: 'u3-1-l1', title: 'Income & Expenses', objective: 'List all income and expense categories in a personal budget.' },
      { id: 'u3-1-l2', title: 'Cash Flow', objective: 'Calculate monthly cash flow and identify a surplus or deficit.' },
      { id: 'u3-1-l3', title: 'Budget Categories', objective: 'Organize expenses into budget categories that make sense.' },
      { id: 'u3-1-l4', title: 'Zero-Based Budgeting', objective: 'Create a zero-based budget that assigns every dollar a job.' },
      { id: 'u3-1-l5', title: '50/30/20 Rule', objective: 'Apply the 50/30/20 rule to a sample income and classify each expense.' },
      { id: 'u3-1-l6', title: 'Envelope System', objective: 'Explain how the envelope budgeting system prevents overspending.' },
      { id: 'u3-1-l7', title: 'Pay-Yourself-First Budgeting', objective: 'Adjust a budget to save first before spending on anything else.' },
      { id: 'u3-1-l8', title: 'Flexible Budgeting', objective: 'Adapt a budget mid-month when an unexpected expense appears.' },
    ],
  },
  { id: 'u3-2', title: 'Tracking Money', centsReward: 140, level: 'beginner' as const, summary: 'Track your spending, find leaks, and use apps and spreadsheets to stay on budget.',
    lessons: [
      { id: 'u3-2-l1', title: 'Budget Apps', objective: 'Compare popular budgeting apps and choose the best fit.' },
      { id: 'u3-2-l2', title: 'Expense Tracking', objective: 'Categorize a month of transactions and find the biggest spending areas.' },
      { id: 'u3-2-l3', title: 'Subscriptions', objective: 'Audit recurring subscriptions and calculate the total monthly cost.' },
      { id: 'u3-2-l4', title: 'Finding Unnecessary Spending', objective: 'Identify at least three ways to reduce spending in a sample budget.' },
      { id: 'u3-2-l5', title: 'Cash Flow Forecasting', objective: 'Project next month\'s cash flow using current income and expenses.' },
      { id: 'u3-2-l6', title: 'Review & Adjust', objective: 'Compare a budget to actual spending and make adjustments.' },
      { id: 'u3-2-l7', title: 'Spreadsheets for Budgeting', objective: 'Use basic spreadsheet formulas to track income and expenses.' },
    ],
  },
  { id: 'u3-3', title: 'Financial Goals', centsReward: 160, level: 'beginner' as const, summary: 'Set SMART financial goals — from vacation savings to buying a house.',
    lessons: [
      { id: 'u3-3-l1', title: 'SMART Goals', objective: 'Rewrite a vague financial goal as a SMART goal.' },
      { id: 'u3-3-l2', title: 'Short-Term Goals', objective: 'Create a savings plan for a goal due within one year.' },
      { id: 'u3-3-l3', title: 'Medium-Term Goals', objective: 'Plan a 1–5 year financial goal with monthly savings targets.' },
      { id: 'u3-3-l4', title: 'Long-Term Goals', objective: 'Explain why long-term goals need investing, not just saving.' },
      { id: 'u3-3-l5', title: 'Saving for College', objective: 'Compare a 529 plan to a regular savings account for college costs.' },
      { id: 'u3-3-l6', title: 'Saving for a House', objective: 'Calculate how long it takes to save a 20% down payment.' },
      { id: 'u3-3-l7', title: 'Saving for Retirement - Intro', objective: 'Explain why starting retirement savings early makes a huge difference.' },
      { id: 'u3-3-l8', title: 'Vacation Saving', objective: 'Build a trip savings plan with a target amount and deadline.' },
    ],
  },
  { id: 'u4-1', title: 'Credit Scores', centsReward: 160, level: 'intermediate' as const, summary: 'Master credit scores — what they are, how they\'re calculated, and how to build yours.',
    lessons: [
      { id: 'u4-1-l1', title: 'What is Credit', objective: 'Define credit and explain why lenders check your credit history.' },
      { id: 'u4-1-l2', title: 'FICO Score', objective: 'List the five factors of a FICO score and their weights.' },
      { id: 'u4-1-l3', title: 'Credit Reports', objective: 'Read a credit report and identify the key sections.' },
      { id: 'u4-1-l4', title: 'Credit Bureaus', objective: 'Name the three major credit bureaus and what data they collect.' },
      { id: 'u4-1-l5', title: 'Hard & Soft Inquiries', objective: 'Distinguish hard and soft credit inquiries and their score impact.' },
      { id: 'u4-1-l6', title: 'Building Credit', objective: 'List three strategies to build credit when starting from zero.' },
      { id: 'u4-1-l7', title: 'Maintaining Credit', objective: 'Describe habits that keep a credit score in excellent shape.' },
      { id: 'u4-1-l8', title: 'VantageScore', objective: 'Compare VantageScore to FICO and explain when each is used.' },
    ],
  },
  { id: 'u4-2', title: 'Credit Cards', centsReward: 160, level: 'intermediate' as const, summary: 'Use credit cards as a tool — grace periods, rewards, and avoiding interest traps.',
    lessons: [
      { id: 'u4-2-l1', title: 'The Grace Period', objective: 'Explain the credit card grace period and how to keep it.' },
      { id: 'u4-2-l2', title: 'Minimum Payments', objective: 'Calculate how long it takes to pay off a balance making only minimums.' },
      { id: 'u4-2-l3', title: 'APR on Credit Cards', objective: 'Calculate the monthly interest charge on a carried balance.' },
      { id: 'u4-2-l4', title: 'Cash Back Rewards', objective: 'Compare two cash back cards and calculate which earns more.' },
      { id: 'u4-2-l5', title: 'Travel Rewards', objective: 'Evaluate a travel rewards card against the annual fee.' },
      { id: 'u4-2-l6', title: 'Interest Traps', objective: 'Identify credit card features designed to increase debt.' },
      { id: 'u4-2-l7', title: 'Credit Utilization', objective: 'Calculate credit utilization and explain its effect on your score.' },
      { id: 'u4-2-l8', title: 'Balance Transfers', objective: 'Evaluate a balance transfer offer and calculate the net savings.' },
    ],
  },
  { id: 'u4-3', title: 'Loans', centsReward: 160, level: 'intermediate' as const, summary: 'Navigate student loans, auto loans, and predatory lending — and manage debt wisely.',
    lessons: [
      { id: 'u4-3-l1', title: 'Types of Loans', objective: 'Classify common loans and explain when each is appropriate.' },
      { id: 'u4-3-l2', title: 'Loan Amortization', objective: 'Read an amortization schedule and identify how payments are split.' },
      { id: 'u4-3-l3', title: 'Student Loans', objective: 'Compare subsidized and unsubsidized student loans.' },
      { id: 'u4-3-l4', title: 'Auto Loans', objective: 'Calculate the total cost of a car including interest over the loan term.' },
      { id: 'u4-3-l5', title: 'Payday & Predatory Lending', objective: 'Calculate the true APR of a payday loan and find alternatives.' },
      { id: 'u4-3-l6', title: 'Refinancing', objective: 'Determine when refinancing saves money using a break-even analysis.' },
      { id: 'u4-3-l7', title: 'Credit Scores & Loan Approval', objective: 'Explain how a better credit score lowers loan interest rates.' },
      { id: 'u4-3-l8', title: 'Managing Debt Wisely', objective: 'Prioritize debt repayment using both urgency and interest rate.' },
    ],
  },
  { id: 'u5-1', title: 'Tax Basics', centsReward: 160, level: 'intermediate' as const, summary: 'Understand how taxes work — brackets, deductions, credits, and tax-advantaged accounts.',
    lessons: [
      { id: 'u5-1-l1', title: 'What Are Taxes', objective: 'Explain what taxes fund and the difference between federal and state taxes.' },
      { id: 'u5-1-l2', title: 'Income Tax Brackets', objective: 'Calculate federal income tax using marginal tax brackets.' },
      { id: 'u5-1-l3', title: 'Capital Gains Tax', objective: 'Distinguish short-term from long-term capital gains tax rates.' },
      { id: 'u5-1-l4', title: 'Payroll & Other Taxes', objective: 'Identify Social Security and Medicare taxes on a pay stub.' },
      { id: 'u5-1-l5', title: 'Tax Deductions', objective: 'Explain what a tax deduction is and how it reduces taxable income.' },
      { id: 'u5-1-l6', title: 'Tax Credits', objective: 'Distinguish tax credits from deductions and calculate the value of each.' },
      { id: 'u5-1-l7', title: 'Tax-Advantaged Accounts', objective: 'Compare traditional (pre-tax) and Roth (post-tax) account types.' },
      { id: 'u5-1-l8', title: 'Avoiding Tax Mistakes', objective: 'Identify five common tax mistakes and how to avoid them.' },
    ],
  },
  { id: 'u5-2', title: 'Filing Taxes', centsReward: 160, level: 'intermediate' as const, summary: 'File your taxes with confidence — W-2s, deductions, software, and deadlines.',
    lessons: [
      { id: 'u5-2-l1', title: 'Tax Forms: W-2 & 1099', objective: 'Read a W-2 and 1099 and identify the key boxes.' },
      { id: 'u5-2-l2', title: 'Standard vs. Itemized Deductions', objective: 'Decide between standard and itemized deductions for a sample taxpayer.' },
      { id: 'u5-2-l3', title: 'Tax Withholding', objective: 'Explain how paycheck withholding determines your refund or bill.' },
      { id: 'u5-2-l4', title: 'Filing Deadlines & Extensions', objective: 'List key tax deadlines and explain what an extension does and doesn\'t do.' },
      { id: 'u5-2-l5', title: 'Tax Software & Filing Options', objective: 'Compare free and paid tax filing options and choose the best fit.' },
      { id: 'u5-2-l6', title: 'Refunds & What You Owe', objective: 'Interpret a tax refund or bill and adjust withholding accordingly.' },
      { id: 'u5-2-l7', title: 'Self-Employment Taxes', objective: 'Calculate self-employment tax and quarterly estimated payments.' },
      { id: 'u5-2-l8', title: 'Taxes & Life Events', objective: 'Explain how major life events change your tax situation.' },
    ],
  },
  { id: 'u6-1', title: 'Insurance Basics', centsReward: 160, level: 'intermediate' as const, summary: 'Protect your finances with the right insurance — health, auto, home, and life.',
    lessons: [
      { id: 'u6-1-l1', title: 'How Insurance Works', objective: 'Explain premiums, deductibles, and copays using a real scenario.' },
      { id: 'u6-1-l2', title: 'Health Insurance', objective: 'Compare HMO, PPO, and HDHP plans and calculate total costs.' },
      { id: 'u6-1-l3', title: 'Auto Insurance', objective: 'Identify the coverage types on an auto policy declaration page.' },
      { id: 'u6-1-l4', title: 'Renters & Homeowners Insurance', objective: 'Explain what renters insurance covers and why it\'s worth the cost.' },
      { id: 'u6-1-l5', title: 'Life Insurance', objective: 'Compare term and whole life insurance and when each makes sense.' },
      { id: 'u6-1-l6', title: 'Disability & Other Insurance', objective: 'Explain disability insurance and how to decide if you need it.' },
      { id: 'u6-1-l7', title: 'Choosing the Right Coverage', objective: 'Select appropriate coverage levels for a sample household.' },
      { id: 'u6-1-l8', title: 'Insurance & Building Wealth', objective: 'Explain how the right insurance protects long-term wealth building.' },
    ],
  },
  { id: 'u7-1', title: 'Why Invest?', centsReward: 160, level: 'intermediate' as const, summary: 'Understand why investing beats saving alone — compound returns and beating inflation.',
    lessons: [
      { id: 'u7-1-l1', title: 'Inflation & Purchasing Power', objective: 'Calculate how inflation erodes the value of cash over 20 years.' },
      { id: 'u7-1-l2', title: 'Risk vs. Reward', objective: 'Plot investment types on a risk-reward spectrum.' },
      { id: 'u7-1-l3', title: 'Compound Returns', objective: 'Show how $1,000 invested for 30 years grows at 7% annually.' },
      { id: 'u7-1-l4', title: 'Asset Allocation', objective: 'Explain how age affects the right stock/bond split in a portfolio.' },
      { id: 'u7-1-l5', title: 'Diversification', objective: 'Explain why diversification reduces risk without sacrificing returns.' },
      { id: 'u7-1-l6', title: 'Dollar-Cost Averaging', objective: 'Show how DCA reduces the impact of market volatility.' },
      { id: 'u7-1-l7', title: 'Investment Accounts', objective: 'Compare brokerage, IRA, and 401(k) account types and tax treatment.' },
      { id: 'u7-1-l8', title: 'Common Investing Mistakes', objective: 'Identify the top mistakes new investors make and how to avoid them.' },
    ],
  },
  { id: 'u7-2', title: 'Stocks', centsReward: 160, level: 'intermediate' as const, summary: 'Learn how stocks work — from IPOs and dividends to reading stock data.',
    lessons: [
      { id: 'u7-2-l1', title: 'What Is a Stock', objective: 'Explain what owning a share of stock actually means.' },
      { id: 'u7-2-l2', title: 'IPOs & Going Public', objective: 'Describe the IPO process and why companies go public.' },
      { id: 'u7-2-l3', title: 'Stock Valuation', objective: 'Explain what P/E ratio means and when a stock might be over or undervalued.' },
      { id: 'u7-2-l4', title: 'Dividends', objective: 'Calculate dividend yield and explain why some investors prefer dividend stocks.' },
      { id: 'u7-2-l5', title: 'Growth vs. Value Stocks', objective: 'Compare growth and value stocks and match each to an investor type.' },
      { id: 'u7-2-l6', title: 'Stock Markets & Exchanges', objective: 'Explain how NYSE and NASDAQ work and who trades on them.' },
      { id: 'u7-2-l7', title: 'Reading Stock Information', objective: 'Read a stock quote and identify the key data points.' },
      { id: 'u7-2-l8', title: 'Stock Market Indices', objective: 'Explain what the S&P 500 is and why it\'s used as a market benchmark.' },
    ],
  },
  { id: 'u7-3', title: 'Bonds', centsReward: 160, level: 'intermediate' as const, summary: 'Understand bonds — how they work, yield, and their role in a balanced portfolio.',
    lessons: [
      { id: 'u7-3-l1', title: 'What Is a Bond', objective: 'Explain what a bond is and the relationship between issuer and holder.' },
      { id: 'u7-3-l2', title: 'Types of Bonds', objective: 'Compare government, municipal, and corporate bonds.' },
      { id: 'u7-3-l3', title: 'Interest Rate Risk', objective: 'Explain why bond prices fall when interest rates rise.' },
      { id: 'u7-3-l4', title: 'Credit Ratings & Default Risk', objective: 'Read a bond credit rating and explain what it means for an investor.' },
      { id: 'u7-3-l5', title: 'Yield & Return', objective: 'Calculate bond yield and compare it to a savings account.' },
      { id: 'u7-3-l6', title: 'Bonds in Your Portfolio', objective: 'Explain when adding bonds to a portfolio makes sense.' },
      { id: 'u7-3-l7', title: 'Government & Municipal Bonds', objective: 'Explain the tax advantages of Treasury and municipal bonds.' },
      { id: 'u7-3-l8', title: 'Bonds vs. Stocks', objective: 'Compare risk and return of bonds vs. stocks over a 20-year period.' },
    ],
  },
  { id: 'u7-4', title: 'Mutual Funds', centsReward: 160, level: 'intermediate' as const, summary: 'Invest with mutual funds — active vs. passive management, fees, and picking a fund.',
    lessons: [
      { id: 'u7-4-l1', title: 'What Is a Mutual Fund', objective: 'Explain how a mutual fund pools money from many investors.' },
      { id: 'u7-4-l2', title: 'Active vs. Passive Management', objective: 'Compare active and passive fund management by cost and performance.' },
      { id: 'u7-4-l3', title: 'Index Funds', objective: 'Explain what an index fund is and why most outperform active funds.' },
      { id: 'u7-4-l4', title: 'Expense Ratios & Fees', objective: 'Calculate how a 1% expense ratio affects a $10,000 investment over 30 years.' },
      { id: 'u7-4-l5', title: 'Target-Date Funds', objective: 'Explain how target-date funds automatically adjust as you near retirement.' },
      { id: 'u7-4-l6', title: 'Fund Categories', objective: 'Classify mutual funds by asset class and investment style.' },
      { id: 'u7-4-l7', title: 'How to Choose a Mutual Fund', objective: 'Select a mutual fund based on goal, time horizon, and fees.' },
      { id: 'u7-4-l8', title: 'Building with Mutual Funds', objective: 'Design a simple three-fund portfolio for a long-term investor.' },
    ],
  },
  { id: 'u7-5', title: 'ETFs', centsReward: 160, level: 'intermediate' as const, summary: 'Explore ETFs — how they trade, their tax efficiency, and how to build a portfolio.',
    lessons: [
      { id: 'u7-5-l1', title: 'What Is an ETF', objective: 'Explain how ETFs combine features of stocks and mutual funds.' },
      { id: 'u7-5-l2', title: 'ETFs vs. Mutual Funds', objective: 'Compare ETFs and mutual funds by trading, fees, and minimums.' },
      { id: 'u7-5-l3', title: 'Popular ETF Types', objective: 'Identify stock, bond, sector, and international ETF categories.' },
      { id: 'u7-5-l4', title: 'Reading ETF Data', objective: 'Interpret an ETF\'s expense ratio, AUM, and holdings breakdown.' },
      { id: 'u7-5-l5', title: 'Tax Efficiency of ETFs', objective: 'Explain why ETFs generate fewer taxable capital gain distributions.' },
      { id: 'u7-5-l6', title: 'Building a Portfolio with ETFs', objective: 'Create a simple ETF portfolio for a beginner investor.' },
      { id: 'u7-5-l7', title: 'Sector & Thematic ETFs', objective: 'Explain the risk of concentrating a portfolio in sector ETFs.' },
      { id: 'u7-5-l8', title: 'The ETF Ecosystem', objective: 'Name the largest ETF providers and how ETFs are created.' },
    ],
  },
  { id: 'u8-1', title: 'Retirement Planning', centsReward: 160, level: 'intermediate' as const, summary: 'Plan for retirement — 401(k), IRA, Social Security, and how much you\'ll need.',
    lessons: [
      { id: 'u8-1-l1', title: 'Why Plan for Retirement', objective: 'Calculate how much you need to retire and why starting early matters.' },
      { id: 'u8-1-l2', title: '401(k) Basics', objective: 'Explain how a 401(k) works and the value of employer matching.' },
      { id: 'u8-1-l3', title: 'Traditional IRA vs. Roth IRA', objective: 'Compare traditional and Roth IRAs and choose based on your tax situation.' },
      { id: 'u8-1-l4', title: 'Retirement Account Strategy', objective: 'Decide which accounts to max out first in a given income scenario.' },
      { id: 'u8-1-l5', title: 'Social Security', objective: 'Explain how Social Security works and when to claim benefits.' },
      { id: 'u8-1-l6', title: 'Required Minimum Distributions', objective: 'Explain RMDs and the penalties for not taking them.' },
      { id: 'u8-1-l7', title: 'Retirement Income Strategy', objective: 'Describe the "bucket strategy" for managing retirement income.' },
      { id: 'u8-1-l8', title: 'Retirement Planning at Any Age', objective: 'Adjust a retirement plan for a person who started saving late.' },
    ],
  },
  { id: 'u9-1', title: 'Macroeconomics', centsReward: 160, level: 'advanced' as const, summary: 'Understand how the economy works — GDP, inflation, the Fed, and business cycles.',
    lessons: [
      { id: 'u9-1-l1', title: 'GDP & Economic Growth', objective: 'Define GDP and explain what makes an economy grow.' },
      { id: 'u9-1-l2', title: 'Inflation', objective: 'Explain how the CPI measures inflation and its everyday impact.' },
      { id: 'u9-1-l3', title: 'The Federal Reserve', objective: 'Describe the Fed\'s dual mandate and its main policy tools.' },
      { id: 'u9-1-l4', title: 'Supply & Demand', objective: 'Draw a supply-demand graph and predict the price effect of a shift.' },
      { id: 'u9-1-l5', title: 'Recession & Business Cycles', objective: 'Identify the four phases of a business cycle in a real historical example.' },
      { id: 'u9-1-l6', title: 'Unemployment', objective: 'Explain the difference between frictional, structural, and cyclical unemployment.' },
      { id: 'u9-1-l7', title: 'Trade & Globalization', objective: 'Explain how international trade affects domestic jobs and prices.' },
      { id: 'u9-1-l8', title: 'Economic Indicators', objective: 'Interpret three economic indicators to assess the current economy.' },
    ],
  },
  { id: 'u10-1', title: 'Business Fundamentals', centsReward: 160, level: 'advanced' as const, summary: 'Read financial statements and understand the basics of running a business.',
    lessons: [
      { id: 'u10-1-l1', title: 'Revenue vs. Profit', objective: 'Distinguish between revenue, gross profit, and net profit.' },
      { id: 'u10-1-l2', title: 'Income Statement', objective: 'Read an income statement and identify a company\'s profit margin.' },
      { id: 'u10-1-l3', title: 'Balance Sheet', objective: 'Identify assets, liabilities, and equity on a balance sheet.' },
      { id: 'u10-1-l4', title: 'Cash Flow Statement', objective: 'Explain why a profitable company can still run out of cash.' },
      { id: 'u10-1-l5', title: 'Business Structures', objective: 'Compare sole proprietorship, LLC, and corporation for a new business.' },
      { id: 'u10-1-l6', title: 'Gross Profit Margin', objective: 'Calculate gross margin and explain what it reveals about a business.' },
      { id: 'u10-1-l7', title: 'Break-Even Analysis', objective: 'Calculate a business\'s break-even point in units sold.' },
      { id: 'u10-1-l8', title: 'Business Credit & Financing', objective: 'List the financing options for a small business and their trade-offs.' },
    ],
  },
  { id: 'u11-1', title: 'Stock Analysis', centsReward: 160, level: 'advanced' as const, summary: 'Analyze stocks like a pro — P/E ratios, DCF, and building a research process.',
    lessons: [
      { id: 'u11-1-l1', title: 'P/E Ratio & Valuation', objective: 'Use P/E ratio to judge whether a stock appears over or undervalued.' },
      { id: 'u11-1-l2', title: 'Beta & Volatility', objective: 'Explain what beta measures and how it affects portfolio risk.' },
      { id: 'u11-1-l3', title: 'DCF Analysis', objective: 'Explain how discounted cash flow analysis estimates intrinsic value.' },
      { id: 'u11-1-l4', title: 'Dollar-Cost Averaging', objective: 'Show how DCA protects against market timing errors.' },
      { id: 'u11-1-l5', title: 'EPS & Earnings Reports', objective: 'Read an earnings report and explain EPS, revenue beat, and guidance.' },
      { id: 'u11-1-l6', title: 'Price-to-Book & Other Ratios', objective: 'Apply P/B, P/S, and other ratios to evaluate a sample company.' },
      { id: 'u11-1-l7', title: 'Technical vs. Fundamental Analysis', objective: 'Compare technical and fundamental analysis approaches.' },
      { id: 'u11-1-l8', title: 'Building a Research Process', objective: 'Create a five-step process for evaluating a stock before buying.' },
    ],
  },
  { id: 'u12-1', title: 'Real Estate Basics', centsReward: 160, level: 'advanced' as const, summary: 'Navigate the housing market — buying vs. renting, mortgages, REITs, and more.',
    lessons: [
      { id: 'u12-1-l1', title: 'Buy vs. Rent', objective: 'Calculate the break-even point between renting and buying a home.' },
      { id: 'u12-1-l2', title: 'Home Equity', objective: 'Explain how home equity builds over time and how to use it responsibly.' },
      { id: 'u12-1-l3', title: 'REITs', objective: 'Explain what a REIT is and how it lets you invest in real estate without buying property.' },
      { id: 'u12-1-l4', title: 'Closing Costs & Buying Process', objective: 'Estimate closing costs and describe the steps in a home purchase.' },
      { id: 'u12-1-l5', title: 'Mortgage Types', objective: 'Compare fixed-rate and ARM mortgages for different buyer situations.' },
      { id: 'u12-1-l6', title: 'Rental Property Investing', objective: 'Calculate cash flow and cap rate for a sample rental property.' },
      { id: 'u12-1-l7', title: 'Real Estate Market Cycles', objective: 'Identify where in the real estate cycle a market might be.' },
      { id: 'u12-1-l8', title: 'Property Taxes & Other Costs', objective: 'List ongoing costs of homeownership beyond the mortgage payment.' },
    ],
  },
  { id: 'u13-1', title: 'Getting Out of Debt', centsReward: 160, level: 'intermediate' as const, summary: 'Escape debt with the snowball, avalanche, and consolidation strategies.',
    lessons: [
      { id: 'u13-1-l1', title: 'Debt Snowball', objective: 'Apply the debt snowball method to a list of sample debts.' },
      { id: 'u13-1-l2', title: 'Debt Avalanche', objective: 'Apply the debt avalanche method and compare total interest saved vs. snowball.' },
      { id: 'u13-1-l3', title: 'Debt-to-Income Ratio', objective: 'Calculate DTI ratio and explain what lenders look for.' },
      { id: 'u13-1-l4', title: 'Debt Consolidation', objective: 'Evaluate a debt consolidation offer and determine if it saves money.' },
      { id: 'u13-1-l5', title: 'Bankruptcy', objective: 'Explain Chapter 7 and Chapter 13 bankruptcy and their long-term consequences.' },
      { id: 'u13-1-l6', title: 'Negotiating with Creditors', objective: 'Describe strategies for negotiating a debt settlement.' },
      { id: 'u13-1-l7', title: 'Student Loan Strategies', objective: 'Compare income-driven repayment, PSLF, and refinancing for student loans.' },
      { id: 'u13-1-l8', title: 'Rebuilding Credit While Paying Debt', objective: 'Explain how to repair credit while aggressively paying off debt.' },
    ],
  },
  { id: 'u14-1', title: 'Smart Consumer', centsReward: 160, level: 'intermediate' as const, summary: 'Protect yourself from scams, bad contracts, and misleading purchases.',
    lessons: [
      { id: 'u14-1-l1', title: 'Avoiding Scams', objective: 'Identify five common financial scams and the red flags of each.' },
      { id: 'u14-1-l2', title: 'Identity Theft Protection', objective: 'List five actions to protect your identity and what to do if stolen.' },
      { id: 'u14-1-l3', title: 'Reading Contracts', objective: 'Identify the most important clauses in a phone or subscription contract.' },
      { id: 'u14-1-l4', title: 'Negotiating Purchases', objective: 'Apply negotiation tactics to a sample car purchase scenario.' },
      { id: 'u14-1-l5', title: 'Consumer Rights & Protections', objective: 'List the key protections the CFPB and FTC provide consumers.' },
      { id: 'u14-1-l6', title: 'Comparison Shopping', objective: 'Calculate the true cost per unit for competing products.' },
      { id: 'u14-1-l7', title: 'Subscription Traps', objective: 'Identify dark patterns that make subscriptions hard to cancel.' },
      { id: 'u14-1-l8', title: 'Warranties & Extended Protection', objective: 'Evaluate whether an extended warranty is worth buying.' },
    ],
  },
  { id: 'u15-1', title: 'Starting a Business', centsReward: 160, level: 'advanced' as const, summary: 'Turn an idea into a business — pricing, cash flow, customers, and scaling.',
    lessons: [
      { id: 'u15-1-l1', title: 'Profit Margin', objective: 'Calculate gross and net profit margin for a sample business.' },
      { id: 'u15-1-l2', title: 'Cash Flow for New Businesses', objective: 'Explain why profitable startups can still fail due to cash flow.' },
      { id: 'u15-1-l3', title: 'Business Plan', objective: 'Identify the essential sections of a one-page business plan.' },
      { id: 'u15-1-l4', title: 'Scaling Your Business', objective: 'Explain the difference between scaling and growing a business.' },
      { id: 'u15-1-l5', title: 'Finding Your First Customers', objective: 'List three strategies for acquiring the first 10 customers.' },
      { id: 'u15-1-l6', title: 'Setting Prices Strategically', objective: 'Apply cost-plus and value-based pricing to a sample product.' },
      { id: 'u15-1-l7', title: 'Managing Business Finances', objective: 'Explain why separating personal and business finances is essential.' },
      { id: 'u15-1-l8', title: 'Side Hustle to Business', objective: 'Describe the key signs that a side hustle is ready to become a full business.' },
    ],
  },
  { id: 'u16-1', title: 'Global Markets', centsReward: 160, level: 'advanced' as const, summary: 'Explore international trade, exchange rates, and investing in global markets.',
    lessons: [
      { id: 'u16-1-l1', title: 'Tariffs & Trade', objective: 'Explain how tariffs affect prices and trade between countries.' },
      { id: 'u16-1-l2', title: 'Exchange Rates', objective: 'Convert between currencies and explain what moves exchange rates.' },
      { id: 'u16-1-l3', title: 'Comparative Advantage', objective: 'Use comparative advantage to explain why countries specialize in trade.' },
      { id: 'u16-1-l4', title: 'Monopoly & Competition', objective: 'Compare perfect competition and monopoly and their effects on consumers.' },
      { id: 'u16-1-l5', title: 'Emerging Markets', objective: 'Describe the risks and opportunities of investing in emerging markets.' },
      { id: 'u16-1-l6', title: 'Trade Deficits & Surpluses', objective: 'Explain what a trade deficit means and whether it is always bad.' },
      { id: 'u16-1-l7', title: 'International Investing', objective: 'Explain why international diversification can reduce portfolio risk.' },
      { id: 'u16-1-l8', title: 'Central Banks & Monetary Policy', objective: 'Compare how central banks in different countries manage their economies.' },
    ],
  },
  { id: 'u17-1', title: 'Alternative Assets', centsReward: 160, level: 'advanced' as const, summary: 'Go beyond stocks and bonds — crypto, gold, options, and other alternative assets.',
    lessons: [
      { id: 'u17-1-l1', title: 'Cryptocurrency', objective: 'Explain how cryptocurrency works and the risks of investing in it.' },
      { id: 'u17-1-l2', title: 'Gold & Precious Metals', objective: 'Describe how gold acts as a hedge and when investors buy it.' },
      { id: 'u17-1-l3', title: 'Options Contracts', objective: 'Explain what a call option is and the maximum you can lose buying one.' },
      { id: 'u17-1-l4', title: 'Private Equity', objective: 'Describe how private equity funds work and who can invest in them.' },
      { id: 'u17-1-l5', title: 'Commodities & Futures', objective: 'Explain how commodity futures contracts work with a real example.' },
      { id: 'u17-1-l6', title: 'Hedge Funds', objective: 'Describe what hedge funds do and why most investors can\'t access them.' },
      { id: 'u17-1-l7', title: 'Art & Collectibles as Investments', objective: 'Evaluate the risks of investing in art, wine, or collectibles.' },
      { id: 'u17-1-l8', title: 'Portfolio Role of Alternatives', objective: 'Explain why a small allocation to alternatives can reduce overall risk.' },
    ],
  },
  { id: 'u18-1', title: 'Wealth Building', centsReward: 160, level: 'advanced' as const, summary: 'Advanced wealth strategies — tax-loss harvesting, FIRE, estate planning, and giving.',
    lessons: [
      { id: 'u18-1-l1', title: 'Tax-Loss Harvesting', objective: 'Explain tax-loss harvesting and how it reduces your tax bill.' },
      { id: 'u18-1-l2', title: 'FIRE Movement', objective: 'Calculate the savings rate needed to retire 20 years early using the 4% rule.' },
      { id: 'u18-1-l3', title: 'Estate Planning', objective: 'Identify the key documents in a basic estate plan.' },
      { id: 'u18-1-l4', title: 'Asset Protection', objective: 'Describe legal structures that protect personal assets from lawsuits.' },
      { id: 'u18-1-l5', title: 'Net Worth Tracking', objective: 'Calculate net worth and explain why tracking it quarterly is useful.' },
      { id: 'u18-1-l6', title: 'Charitable Giving & DAFs', objective: 'Explain how donor-advised funds work and their tax benefits.' },
      { id: 'u18-1-l7', title: 'Trusts & Wills', objective: 'Distinguish a will from a trust and explain when a trust makes sense.' },
      { id: 'u18-1-l8', title: 'Building Generational Wealth', objective: 'Describe three strategies for passing wealth to the next generation.' },
    ],
  },
  { id: 'u19-1', title: 'Money Psychology', centsReward: 160, level: 'advanced' as const, summary: 'Understand the biases that sabotage financial decisions — and how to beat them.',
    lessons: [
      { id: 'u19-1-l1', title: 'Loss Aversion', objective: 'Explain loss aversion and how it causes poor investment decisions.' },
      { id: 'u19-1-l2', title: 'Herd Mentality', objective: 'Describe herd mentality with a real market example and its consequences.' },
      { id: 'u19-1-l3', title: 'Confirmation Bias', objective: 'Explain how confirmation bias affects financial research and decisions.' },
      { id: 'u19-1-l4', title: 'Mental Accounting', objective: 'Describe mental accounting and why all money is actually equal.' },
      { id: 'u19-1-l5', title: 'Anchoring Bias', objective: 'Explain how anchoring affects price negotiations and investing.' },
      { id: 'u19-1-l6', title: 'Overconfidence Bias', objective: 'Explain why overconfident investors tend to underperform the market.' },
      { id: 'u19-1-l7', title: 'Recency Bias', objective: 'Show how recency bias leads investors to buy high and sell low.' },
      { id: 'u19-1-l8', title: 'Overcoming Cognitive Biases', objective: 'Apply a pre-mortem technique to a financial decision to reduce bias.' },
    ],
  },
  { id: 'u20-1', title: 'Capstone Challenge', centsReward: 300, level: 'advanced' as const, summary: 'Prove what you know. 15 questions across all six islands.',
    lessons: [],
  },
  { id: 'u21-1', title: 'Emotional Spending', centsReward: 160, level: 'intermediate' as const, summary: 'Recognize emotional triggers behind spending and build mindful money habits.',
    lessons: [
      { id: 'u21-1-l1', title: 'Retail Therapy', objective: 'Explain why shopping can feel good and its long-term financial cost.' },
      { id: 'u21-1-l2', title: 'FOMO Spending', objective: 'Describe FOMO spending and strategies to pause before buying.' },
      { id: 'u21-1-l3', title: 'Money & Happiness', objective: 'Explain what research says about money and happiness.' },
      { id: 'u21-1-l4', title: 'Hedonic Adaptation', objective: 'Explain hedonic adaptation and its impact on spending satisfaction.' },
      { id: 'u21-1-l5', title: 'Stress Spending Triggers', objective: 'Identify personal stress spending triggers and healthier alternatives.' },
      { id: 'u21-1-l6', title: 'Social Media & Spending Pressure', objective: 'Explain how social media comparison drives unplanned purchases.' },
      { id: 'u21-1-l7', title: 'Mindful Spending Habits', objective: 'Apply the 24-hour rule and a "joy score" to everyday purchases.' },
      { id: 'u21-1-l8', title: 'Needs vs. Wants', objective: 'Revisit needs vs. wants through the lens of emotional decision-making.' },
    ],
  },
  { id: 'u22-1', title: 'Money Mindset', centsReward: 160, level: 'intermediate' as const, summary: 'Shift from a scarcity mindset to abundance and build a healthy relationship with money.',
    lessons: [
      { id: 'u22-1-l1', title: 'Scarcity Mindset', objective: 'Describe how a scarcity mindset affects financial decisions.' },
      { id: 'u22-1-l2', title: 'Money Beliefs from Childhood', objective: 'Identify childhood money messages and how they shape adult behavior.' },
      { id: 'u22-1-l3', title: 'Lifestyle Creep', objective: 'Explain lifestyle creep and calculate its impact on savings over 10 years.' },
      { id: 'u22-1-l4', title: 'Pay Yourself First', objective: 'Set up a pay-yourself-first system that runs on autopilot.' },
      { id: 'u22-1-l5', title: 'Abundance Mindset', objective: 'Compare scarcity and abundance mindsets with financial examples.' },
      { id: 'u22-1-l6', title: 'Money & Relationships', objective: 'Describe how money conflicts arise in relationships and how to address them.' },
      { id: 'u22-1-l7', title: 'Overcoming Financial Avoidance', objective: 'Identify signs of financial avoidance and the first step to overcome it.' },
      { id: 'u22-1-l8', title: 'Long-Term Thinking', objective: 'Apply 10-10-10 thinking to a major financial decision.' },
    ],
  },
]

// Build the island→unit order lookup
const unitIslandOrder: Record<string, { island: IslandSlug; order: number }> = {}
for (const [islandSlug, unitIds] of Object.entries(islandUnitIds)) {
  unitIds.forEach((uid, idx) => {
    unitIslandOrder[uid] = { island: islandSlug as IslandSlug, order: idx + 1 }
  })
}

export const units: Unit[] = RAW_UNITS.map((u) => ({
  id: u.id,
  slug: sl(u.title),
  island: unitIslandOrder[u.id]?.island ?? 'capstone',
  order: unitIslandOrder[u.id]?.order ?? 1,
  title: u.title,
  summary: u.summary,
  level: u.level,
  centsReward: u.centsReward,
}))

export const lessons: Lesson[] = RAW_UNITS.flatMap((u) =>
  u.lessons.map((l, idx) => ({
    id: l.id,
    slug: sl(l.title),
    unitId: u.id,
    order: idx + 1,
    title: l.title,
    minutes: 6,
    centsReward: 20,
    objective: l.objective,
    steps: [],
  }))
)

// ── Minimum Payments reference lesson ─────────────────────────────────────────
const MIN_PAY_STEPS: Step[] = [
  {
    kind: 'hook',
    text: 'You owe $1,000 on a credit card and pay only the $25 minimum each month. How long until you\'re completely debt-free?',
  },
  {
    kind: 'learn',
    format: 'walkthrough',
    title: 'Where your $25 actually goes',
    body: 'At 24% APR, your monthly interest charge is $1,000 × (24% ÷ 12) = $20. So of your $25 minimum payment, $20 pays the bank\'s interest and only $5 reduces your actual balance.',
    data: {
      panels: [
        { label: 'Your minimum payment', value: '$25', color: 'accent' },
        { label: 'Goes to interest (24% APR)', value: '$20', color: 'red' },
        { label: 'Goes toward your balance', value: '$5', color: 'green' },
      ],
    },
    anotherWay: {
      format: 'explain',
      title: 'Think of it like a bucket with a hole',
      body: 'The hole (interest) drains almost as fast as you pour (minimum payment). You\'re making almost no progress on the balance — it takes 81 months and over $1,000 in interest to drain the bucket.',
    },
  },
  {
    kind: 'question',
    questionId: 'min-pay-q1',
    type: 'mc',
    graded: true,
    prompt: 'Maya owes $1,000 on a card at 24% APR. She pays the minimum on time every month. What happens?',
    explanation: 'Paying on time avoids late fees, not interest. Most of the $25 minimum goes to interest (~$20), so it takes about 81 months and she pays over $1,000 in interest.',
    config: {
      options: [
        { id: 'a', text: 'She pays no interest because she\'s never late' },
        { id: 'b', text: 'She\'ll be debt-free in about a year' },
        { id: 'c', text: 'It takes about 7 years and she pays nearly as much in interest as she borrowed' },
        { id: 'd', text: 'Her balance stays exactly at $1,000' },
      ],
      correct: 'c',
    },
  } as Step,
  {
    kind: 'question',
    questionId: 'min-pay-q2',
    type: 'mc',
    graded: true,
    prompt: 'Of your $25 minimum payment on a $1,000 balance at 24% APR, how much actually reduces the balance?',
    explanation: 'Monthly interest = $1,000 × (24% ÷ 12) = $20. So $20 of your $25 payment goes to interest and only $5 reduces the balance.',
    config: {
      options: [
        { id: 'a', text: '$0 — minimums only prevent late fees' },
        { id: 'b', text: 'About $5 — the rest goes to interest' },
        { id: 'c', text: '$12.50 — split evenly between interest and balance' },
        { id: 'd', text: '$25 — every dollar reduces the balance' },
      ],
      correct: 'b',
    },
  } as Step,
  {
    kind: 'learn',
    format: 'compare',
    title: 'Minimum vs. paying more',
    body: 'Doubling your payment from $25 to $50 cuts your payoff time from 81 months to 26 months — that\'s 4½ fewer years and about $740 less in interest.',
    data: {
      left: { label: '$25/mo (minimum)', months: 81, interest: '$1,032' },
      right: { label: '$50/mo (double)', months: 26, interest: '$290' },
    },
  },
  {
    kind: 'question',
    questionId: 'min-pay-q3',
    type: 'slider',
    graded: true,
    prompt: '$1,000 at 24% APR, paying $50/month. About how many months until you\'re debt-free?',
    explanation: 'It takes 26 months (just over 2 years) at $50/month and costs about $290 in interest. Paying more than the minimum makes a huge difference.',
    config: { min: 0, max: 72, correct: 26, unit: 'months', tolerance: 0.25 },
  } as Step,
  {
    kind: 'question',
    questionId: 'min-pay-q4',
    type: 'spot_mistake',
    graded: true,
    prompt: 'Tap the line on this credit card statement that can\'t be right.',
    explanation: 'New balance should be $1,000 − $25 + $20 = $995.00. The statement shows $975, as if the full $25 reduced the balance — but $20 was taken by interest first.',
    config: {
      title: 'CREDIT CARD STATEMENT',
      rows: [
        { id: 'prev', label: 'Previous balance', value: '$1,000.00' },
        { id: 'payment', label: 'Payment received', value: '−$25.00' },
        { id: 'interest', label: 'Interest charge (24% APR)', value: '+$20.00' },
        { id: 'new-balance', label: 'New balance', value: '$975.00' },
      ],
      correct: 'new-balance',
    },
  } as Step,
  {
    kind: 'try_it',
    widget: 'loan_payoff',
    config: { balance: 1000, apr: 24, minPayment: 25 },
  },
  {
    kind: 'learn',
    format: 'explain',
    title: 'Reading your credit card statement',
    body: 'The CARD Act of 2009 requires every statement with a balance to show a "minimum payment warning" box. It tells you exactly how long it takes at the minimum payment and how much faster you\'d pay it off with a higher amount.',
    data: {
      highlightBox: 'Minimum Payment Warning',
      detail: 'Required by law on every statement. Look for the box near the payment due date.',
    },
  },
  {
    kind: 'question',
    questionId: 'min-pay-q5',
    type: 'mc',
    graded: true,
    prompt: 'Which action pays off a $1,200 credit card balance the fastest?',
    explanation: 'Paying the full statement balance every month means you never carry a balance and pay $0 in interest. Even a few dollars above the minimum matters, but full payment is fastest.',
    config: {
      options: [
        { id: 'a', text: 'Always pay exactly the minimum due' },
        { id: 'b', text: 'Pay $5 above the minimum each month' },
        { id: 'c', text: 'Pay the full statement balance each month' },
        { id: 'd', text: 'Pay twice a year in large lump sums' },
      ],
      correct: 'c',
    },
  } as Step,
  {
    kind: 'question',
    questionId: 'min-pay-q6',
    type: 'scenario',
    graded: true,
    prompt: 'Maya has a $1,200 credit card balance at 22% APR. She just got paid and has an extra $200. What should she do?',
    explanation: 'High-interest debt (22% APR) costs more than almost any savings account earns. Putting the $200 toward the card is like earning a guaranteed 22% return.',
    config: {
      options: [
        { id: 'a', text: 'Put all $200 into savings' },
        { id: 'b', text: 'Pay the $35 minimum and keep $165 in checking' },
        { id: 'c', text: 'Put the full $200 toward the card balance' },
      ],
      correct: 'c',
      outcomes: {
        a: ['Month 1: Savings up $200, but card keeps charging $22/month', 'Year 1: Earned ~$4 in savings interest, paid ~$200+ in card interest'],
        b: ['Month 1: Only $15 went to the balance after interest', 'Month 12: Balance barely moved, paid ~$250 in interest'],
        c: ['Month 1: Balance drops from $1,200 to $1,000 immediately', 'Month 4: Back on track, ~$180 less in interest overall'],
      },
    },
  } as Step,
  {
    kind: 'money_move',
    text: 'Find the "minimum payment warning" box on a real credit card statement. It\'s usually near the payment due date and required by law. If you don\'t have a statement, search "credit card minimum payment warning example."',
  },
]

// Apply steps to specific lessons
const LESSON_STEPS: Record<string, Step[]> = {
  'u4-2-l2': MIN_PAY_STEPS,
}

// Patch lessons with their steps and correct minutes
for (const lesson of lessons) {
  if (LESSON_STEPS[lesson.id]) {
    lesson.steps = LESSON_STEPS[lesson.id]
    // Count graded questions to estimate minutes (~1 min per question step + 0.5 per learn)
    const gradedQ = lesson.steps.filter(s => s.kind === 'question').length
    const learnSteps = lesson.steps.filter(s => s.kind === 'learn').length
    lesson.minutes = Math.round(gradedQ * 1.2 + learnSteps * 0.8 + 1)
  }
}

// Lookup helpers
export const unitById = Object.fromEntries(units.map((u) => [u.id, u]))
export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]))
export const islandBySlug = Object.fromEntries(islands.map((i) => [i.slug, i]))
export const unitsByIsland = (slug: IslandSlug) =>
  units.filter((u) => u.island === slug).sort((a, b) => a.order - b.order)
export const lessonsByUnit = (unitId: string) =>
  lessons.filter((l) => l.unitId === unitId).sort((a, b) => a.order - b.order)

// Legacy id → new slug URL path: /learn/{island}/{unit}/{lesson}
export function legacyUnitUrl(unitId: string): string {
  const u = unitById[unitId]
  if (!u) return '/learn'
  return `/learn/${u.island}/${u.slug}`
}

export function legacyLessonUrl(lessonId: string): string {
  const l = lessonById[lessonId]
  if (!l) return '/learn'
  const u = unitById[l.unitId]
  if (!u) return '/learn'
  return `/learn/${u.island}/${u.slug}/${l.slug}`
}
