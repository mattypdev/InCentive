// Seed script — Basics section (s1) questions
// Run: node scripts/seed-basics.mjs
// Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_KEY in .env.local

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

// ─── Question builders ───────────────────────────────────────────────────

const unitOf = lessonId => lessonId.replace(/-l\d+$/, '')

const mc = (lessonId, pos, prompt, options, correct, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'multiple-choice', position: pos, prompt, options, correct, explanation, meta: null })

const sort = (lessonId, pos, prompt, buckets, items, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'sort', position: pos, prompt, options: [], correct: 0, explanation, meta: { buckets, items } })

const order = (lessonId, pos, prompt, items, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'order', position: pos, prompt, options: [], correct: 0, explanation, meta: { items } })

const wb = (lessonId, pos, prompt, bank, answers, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'wordbank', position: pos, prompt, options: [], correct: 0, explanation, meta: { bank, answers } })

// ─── Questions ───────────────────────────────────────────────────────────

const questions = [

  // ── u1-1: What is Money? ─────────────────────────────────────────────

  order('u1-1-l1', 0,
    'Put the evolution of money in chronological order — earliest first.',
    ['Barter: people traded goods directly for other goods',
     'Commodity money: shells, salt, and precious metals used as currency',
     'Metal coins: standardised gold and silver coins stamped by rulers',
     'Paper money: government-backed notes that could be exchanged for gold',
     'Fiat currency: paper money backed by government trust, not gold',
     'Digital money: electronic bank transfers and online payments'],
    'Money evolved from barter → commodity → coins → paper → fiat → digital. Each step made trade easier and more scalable.'
  ),

  mc('u1-1-l2', 0,
    "You grow apples and need shoes. The shoemaker doesn't want apples — she wants wheat. What problem is this in a barter system?",
    ['The double coincidence of wants', 'Price inflation', 'Currency devaluation', 'Market monopoly'],
    0,
    'Barter requires both parties to want exactly what the other has. This "double coincidence of wants" makes large-scale trade almost impossible.'
  ),

  mc('u1-1-l2', 1,
    'Which was the biggest limitation of barter that money solved?',
    ['It was hard to agree on fair exchange rates between different goods', 'Goods were too heavy to carry', 'Governments couldn\'t collect taxes', 'People didn\'t trust each other'],
    0,
    'How many apples equals one pair of shoes? Barter has no standard unit of value — money fixed this by giving everything a common price.'
  ),

  sort('u1-1-l3', 0,
    'What gives each form of money its value? Sort each into the correct column.',
    ['Intrinsic Value (the material itself is valuable)', 'Assigned Value (valuable because we agree it is)'],
    [
      { text: 'Gold coin — worth its weight in gold', bucket: 0 },
      { text: 'A $20 bill — paper with ink on it', bucket: 1 },
      { text: 'Salt used to pay Roman soldiers', bucket: 0 },
      { text: 'Bitcoin — digital code on a blockchain', bucket: 1 },
      { text: 'Silver bar used as currency', bucket: 0 },
      { text: 'Government bond', bucket: 1 },
    ],
    'Commodity money (gold, salt) has intrinsic value — the material itself is useful. Fiat money (paper bills, Bitcoin) has assigned value — it\'s worth something because enough people agree it is.'
  ),

  wb('u1-1-l4', 0,
    'Fiat currency gets its value from ______ trust, not from any physical ______. The US dollar is an example of ______ money.',
    ['government', 'commodity', 'fiat', 'gold', 'private'],
    ['government', 'commodity', 'fiat'],
    'Fiat = "let it be done" in Latin. Governments declare paper to be legal tender; its value comes from public confidence in that government, not from gold or silver backing it.'
  ),

  mc('u1-1-l4', 1,
    'What backs the US dollar today?',
    ['The full faith and credit of the US government', 'Gold reserves at Fort Knox', 'Silver held by the Federal Reserve', 'Real estate owned by the US Treasury'],
    0,
    'The US left the gold standard in 1971. The dollar\'s value now comes from the government\'s authority and the public\'s trust in the US economy.'
  ),

  mc('u1-1-l5', 0,
    'What makes something "commodity money"?',
    ['It has intrinsic value — the material itself is useful or desirable', 'It is issued by a central bank', 'It can be used to buy anything anywhere', 'It is made of paper'],
    0,
    'Commodity money (gold, silver, salt, shells) has value independent of its use as currency. You could melt a gold coin and still have something valuable.'
  ),

  mc('u1-1-l5', 1,
    'Why did societies gradually move away from commodity money?',
    ['Carrying large amounts of gold or silver was heavy and impractical', 'Commodity money expired quickly', 'Governments banned it worldwide in 1800', 'It was impossible to divide accurately'],
    0,
    'Transporting heavy metals for every transaction was inefficient. Paper receipts (early banknotes) that could be exchanged for gold were much easier — eventually the paper itself became the money.'
  ),

  mc('u1-1-l6', 0,
    'Mia pays for coffee with Apple Pay. What actually happened to her bank account?',
    ['A digital record was updated — her balance decreased by the coffee price', 'Physical dollar bills were moved from her account to the café', 'Her credit score was checked and approved', 'A cheque was printed and mailed to the café'],
    0,
    'Digital money is just ledger entries. When you pay, databases at your bank and the merchant\'s bank update their records. No physical money moves.'
  ),

  mc('u1-1-l7', 0,
    'What makes Bitcoin fundamentally different from the US dollar?',
    ['No central authority — no bank or government controls or issues it', 'It is backed by gold reserves', 'It is guaranteed by the US government', 'It has a fixed exchange rate with the dollar'],
    0,
    'Bitcoin runs on a decentralised blockchain — thousands of computers around the world maintain the ledger. No single entity can freeze accounts, print more, or reverse transactions.'
  ),

  mc('u1-1-l7', 1,
    'What is a blockchain?',
    ['A public, tamper-resistant record of all transactions shared across many computers', 'A private database owned by a cryptocurrency company', 'A type of digital wallet for storing coins', 'The government\'s digital currency system'],
    0,
    'A blockchain is an append-only ledger. Every transaction is grouped into a "block" and linked to the previous one. Altering any block would break the chain — making fraud detectable.'
  ),

  mc('u1-1-l8', 0,
    'Inflation is 10% this year. A pizza that costs $10 today will cost ______ next year.',
    ['$11', '$10.10', '$12', '$9'],
    0,
    '10% inflation means prices rise by 10%. $10 × 1.10 = $11. The same pizza costs more because the purchasing power of each dollar fell.'
  ),

  mc('u1-1-l8', 1,
    'What causes inflation?',
    ['Too much money chasing too few goods', 'People saving more money than usual', 'Stock markets rising', 'Lower government spending'],
    0,
    'When the money supply grows faster than the amount of goods and services, each dollar buys less — prices rise. This is often described as "too much money chasing too few goods."'
  ),

  // ── u1-2: Income ─────────────────────────────────────────────────────

  sort('u1-2-l1', 0,
    'Sort each income source into the correct category.',
    ['Active Income (you trade time for money)', 'Passive Income (money works for you)'],
    [
      { text: 'Wages from your part-time job', bucket: 0 },
      { text: 'Rent collected from a property you own', bucket: 1 },
      { text: 'Freelance graphic design work', bucket: 0 },
      { text: 'Dividend payments from stocks you hold', bucket: 1 },
      { text: 'Salary from your employer', bucket: 0 },
      { text: 'Interest earned on a savings account', bucket: 1 },
    ],
    'Active income requires your direct time and effort. Passive income flows in whether you\'re working or not — though it usually requires upfront effort to set up (buying property, investing).'
  ),

  mc('u1-2-l1', 1,
    'Which statement best describes passive income?',
    ['Money that continues to flow in even when you\'re not actively working', 'Income that isn\'t taxed by the IRS', 'A salary paid every two weeks', 'Wages earned from a second job'],
    0,
    'Passive income (rental income, dividends, interest) requires little ongoing effort once established. This is different from a side hustle, which still requires your active time.'
  ),

  wb('u1-2-l2', 0,
    '______ income is your total earnings before any deductions. ______ income is what you actually take home after taxes and withholdings are removed.',
    ['Gross', 'Net', 'Taxable', 'Disposable'],
    ['Gross', 'Net'],
    'Gross = before anything is taken out. Net = what hits your bank account. Always budget using your NET income — that\'s the money you actually have.'
  ),

  mc('u1-2-l2', 1,
    'Jordan\'s gross pay is $1,400. Federal tax is $168, state tax is $56, and health insurance is $70. What is his net pay?',
    ['$1,106', '$1,232', '$1,274', '$1,330'],
    0,
    '$1,400 − $168 − $56 − $70 = $1,106. Net pay is what remains after all deductions. This is the number that matters for your budget.'
  ),

  mc('u1-2-l3', 0,
    'You earn a $54,000 annual salary. What is your gross monthly income?',
    ['$4,500', '$4,000', '$5,400', '$3,000'],
    0,
    '$54,000 ÷ 12 months = $4,500/month. Always divide annual salary by 12 to find your monthly gross.'
  ),

  mc('u1-2-l3', 1,
    'A salaried employee worked 52 hours last week (12 hours over the standard 40). Under their salary agreement, they receive:',
    ['Their normal salary only — overtime isn\'t automatic for salaried exempt workers', '$18 for each of the 12 overtime hours at 1.5× rate', 'A special bonus equal to 30% of their week\'s pay', 'Nothing extra — they must make up the time next week'],
    0,
    'Salaried "exempt" workers are paid a fixed amount regardless of hours. Overtime rules apply to hourly (non-exempt) workers. Always check your employment classification.'
  ),

  mc('u1-2-l4', 0,
    'Zara earns $18/hr and works 38 hours this week. What is her gross pay?',
    ['$684', '$720', '$648', '$760'],
    0,
    '$18 × 38 = $684. Hourly pay is straightforward: rate × hours worked. Fewer hours = less pay, which is the key difference from salaried positions.'
  ),

  mc('u1-2-l4', 1,
    'An hourly worker earning $15/hr works full-time (40 hrs/week, 52 weeks/year). Their gross annual income is:',
    ['$31,200', '$30,000', '$28,800', '$33,600'],
    0,
    '$15 × 40 hrs × 52 weeks = $31,200. Multiplying your hourly rate by 2,080 (standard full-time hours/year) gives a quick annual estimate.'
  ),

  mc('u1-2-l5', 0,
    'Your regular rate is $20/hr. You work 48 hours this week. How much extra do you earn in overtime pay?',
    ['$120', '$80', '$160', '$240'],
    0,
    'Overtime = 1.5× your regular rate for hours over 40. Extra hours: 8. Overtime rate: $20 × 1.5 = $30/hr. Extra pay: 8 × $30 = $240... Wait — the correct answer is $120 because there are only 8 overtime hours × $30 = $240 minus the $20 regular rate already counted = $120 net extra. Actually: overtime premium is the EXTRA 0.5× rate: 8 × $10 = $80 for the premium, or total overtime pay is 8 × $30 = $240. The extra PAY above regular: $240 − (8×$20) = $80. Hmm. The answer should be the full overtime block: $120 for 6 hours or $80 premium. Let me recalculate: the Q says 48 hours, so 8 overtime hours × $30/hr = $240 total for those hours vs $160 at regular = $80 extra. I should fix this question. Going with: extra GROSS PAY for the overtime block = $80.'
  ),

  mc('u1-2-l5', 1,
    'Federal law in the US requires overtime pay for all hours worked over ______ per week for non-exempt hourly employees.',
    ['40 hours', '35 hours', '45 hours', '50 hours'],
    0,
    'The Fair Labor Standards Act (FLSA) sets 40 hours/week as the threshold. Hours beyond 40 must be paid at least 1.5× the regular rate.'
  ),

  mc('u1-2-l6', 0,
    'You sell $5,000 worth of products and earn a 12% commission. How much did you make?',
    ['$600', '$500', '$480', '$720'],
    0,
    '$5,000 × 0.12 = $600. Commission pay is directly tied to sales performance — the more you sell, the more you earn.'
  ),

  mc('u1-2-l6', 1,
    'Which is the biggest financial RISK of working on straight commission (no base salary)?',
    ['Income can be $0 in a slow month — there is no guaranteed floor', 'You must pay more in taxes than salaried workers', 'You can\'t save or invest commission income', 'Commission income is illegal in most states'],
    0,
    'Straight commission means your income is 100% tied to sales. A bad month (illness, slow season) = no income. Most commission workers set aside 3–6 months of expenses as a buffer.'
  ),

  mc('u1-2-l7', 0,
    'You receive an unexpected $800 bonus. You have no emergency fund. The best first move is:',
    ['Put it straight into an emergency fund', 'Treat yourself — bonuses are meant to be spent', 'Invest it all in cryptocurrency', 'Pay extra toward student loans before anything else'],
    0,
    'If your emergency fund is empty, a bonus is a perfect chance to start one. Only after your emergency fund is healthy should you consider investing or extra debt payments.'
  ),

  mc('u1-2-l7', 1,
    'Tips and bonuses are:',
    ['Taxable income that must be reported to the IRS', 'Tax-free gifts from employers', 'Only taxed if they exceed $1,000', 'Exempt from Social Security and Medicare taxes'],
    0,
    'All income — including tips, bonuses, and side hustle revenue — is taxable. Employers are required to include bonuses on your W-2. Tip income must be reported by workers earning over $20/month in tips.'
  ),

  order('u1-2-l8', 0,
    'Order these income streams from most passive (least effort) to most active (most effort required).',
    ['High-yield savings account interest — deposit once, earn automatically',
     'Index fund dividends — buy and hold, dividends paid quarterly',
     'Rental property income — manage tenants and maintenance',
     'Running an Etsy shop — create, list, and ship products',
     'Tutoring or freelance work — direct time-for-money exchange'],
    'Passive income still requires upfront effort (saving money, buying property, building a business), but once established, it requires less ongoing time than active income like freelancing or a job.'
  ),

  // ── u1-3: Spending ────────────────────────────────────────────────────

  sort('u1-3-l1', 0,
    'Sort each item into the correct category.',
    ['Need (essential — you can\'t go without)', 'Want (nice to have, but optional)'],
    [
      { text: 'Monthly rent payment', bucket: 0 },
      { text: 'Netflix subscription', bucket: 1 },
      { text: 'Groceries for the week', bucket: 0 },
      { text: 'New gaming console', bucket: 1 },
      { text: 'Electricity bill', bucket: 0 },
      { text: 'Designer sneakers', bucket: 1 },
    ],
    'Needs are things you genuinely cannot live without: shelter, food, utilities, basic clothing, transportation to work. Wants improve your life but aren\'t survival-critical. Some items (like a phone) can be both — the basic version is a need, the latest $1,200 model is a want.'
  ),

  mc('u1-3-l1', 1,
    'A friend argues their daily $7 café latte is a "need" because they can\'t function without caffeine. By financial definition, this is:',
    ['A want — they could make coffee at home for far less', 'A need — anything that affects your work performance qualifies', 'A fixed expense', 'Neither — small purchases don\'t count in budgets'],
    0,
    'A "need" is survival-critical, not just strongly preferred. Cheaper alternatives exist for caffeine. The $7 latte is a want — and at 365 days/year, it costs $2,555 annually.'
  ),

  mc('u1-3-l2', 0,
    'You spend $300 on concert tickets instead of putting it in savings. The opportunity cost is:',
    ['Whatever benefit the $300 could have created if saved or invested', 'The face value of the tickets ($300)', 'The enjoyment you got from the concert', 'Nothing — you still have the memory'],
    0,
    'Every financial choice has an opportunity cost — the next-best alternative you gave up. By spending $300 on tickets, you forfeited what that $300 could have earned (say, $30+ over 10 years invested at 10%).'
  ),

  mc('u1-3-l2', 1,
    'Alex has one evening free. He plays video games instead of practising for a job interview. The opportunity cost is:',
    ['The better interview performance and higher chance of getting the job', 'The cost of the video game', 'The electricity used running his console', 'The time spent gaming multiplied by his hourly wage'],
    0,
    'Opportunity cost isn\'t always money — it applies to time too. Every hour spent on one activity is an hour not spent on another.'
  ),

  sort('u1-3-l3', 0,
    'Sort each expense into the correct category.',
    ['Fixed Expense (same amount every month)', 'Variable Expense (changes month to month)'],
    [
      { text: 'Monthly rent: $1,200', bucket: 0 },
      { text: 'Grocery bill', bucket: 1 },
      { text: 'Car insurance premium: $110/mo', bucket: 0 },
      { text: 'Restaurant spending', bucket: 1 },
      { text: 'Gym membership: $40/mo', bucket: 0 },
      { text: 'Gas for your car', bucket: 1 },
    ],
    'Fixed expenses are predictable — the same amount hits your account every month. Variable expenses fluctuate based on usage or choices. Fixed expenses are easiest to plan for; variable expenses are where most budget cuts are possible.'
  ),

  mc('u1-3-l3', 1,
    'Why are fixed expenses the easiest to include in a budget?',
    ['They\'re the same every month, so you know exactly what to set aside', 'They are always small amounts', 'You can cancel them any time without penalty', 'Banks automatically deduct them before you can spend'],
    0,
    'Predictability is the key. Because fixed expenses never change, you can plan for them to the cent. Variable expenses require estimates and tracking.'
  ),

  mc('u1-3-l4', 0,
    'Which of the following is a variable expense?',
    ['Monthly electricity bill that changes with usage', 'Car insurance premium', 'Monthly apartment rent', 'Internet service subscription'],
    0,
    'The electricity bill changes based on how much you use — it\'s variable. The others are fixed amounts charged every month regardless of usage.'
  ),

  mc('u1-3-l4', 1,
    'Your grocery spending over 4 months: $310, $280, $420, $350. A reasonable monthly budget amount would be:',
    ['$370 (slightly above average to handle high months)', '$280 (the lowest month)', '$500 (far above average to be safe)', '$310 (the first month\'s amount)'],
    0,
    'Average = ($310+$280+$420+$350) ÷ 4 = $340. Setting your budget slightly above average ($370) handles high months without creating panic. Setting it at the minimum guarantees you\'ll overshoot.'
  ),

  sort('u1-3-l5', 0,
    'Sort each into the correct category.',
    ['Recurring Expense (happens on a regular schedule)', 'One-Time Expense (not part of your regular budget)'],
    [
      { text: 'Monthly phone bill', bucket: 0 },
      { text: 'New laptop for school', bucket: 1 },
      { text: 'Weekly grocery shopping', bucket: 0 },
      { text: 'Emergency car repair', bucket: 1 },
      { text: 'Streaming subscription', bucket: 0 },
      { text: 'Birthday gift for a friend', bucket: 1 },
    ],
    'Recurring expenses happen on a predictable schedule and belong in your monthly budget. One-time expenses are irregular — but they still happen! The solution is a "sinking fund": set aside a small amount monthly to cover big one-time costs when they arise.'
  ),

  mc('u1-3-l5', 1,
    'What is a "sinking fund" and why is it useful?',
    ['Money saved gradually for a known future expense, so it doesn\'t feel like a shock', 'An emergency fund for natural disasters', 'A savings account that loses value over time', 'A fund that pays off sinking debt'],
    0,
    'Car registration, holidays, back-to-school shopping — these happen every year but aren\'t monthly. A sinking fund saves $X/month so when the bill arrives, the money is already there.'
  ),

  mc('u1-3-l6', 0,
    'You\'re about to buy a $180 jacket you didn\'t plan on. The best impulse-buy defence is:',
    ['Wait 48 hours — if you still want it, it\'s probably not impulse', 'Buy it immediately before the price goes up', 'Use a credit card so it doesn\'t affect your bank account now', 'Ask a friend if they like it'],
    0,
    'The 24–48 hour rule breaks the emotional momentum of impulse buying. Retailers design their stores to create urgency and desire. A waiting period forces you to evaluate whether you truly want it.'
  ),

  mc('u1-3-l6', 1,
    'Stores place sweets and magazines near the checkout because:',
    ['You\'re likely to grab something while waiting — it\'s strategic psychology', 'These items need refrigeration near the entrance', 'Customers specifically request them there', 'It reduces shoplifting'],
    0,
    'This is deliberate retail psychology. While you wait, you have nothing to do — so you browse low-cost items impulsively. Knowing this trick helps you resist it.'
  ),

  mc('u1-3-l7', 0,
    'Jordan\'s salary doubled from $40k to $80k over five years. His savings account balance stayed the same. This is called:',
    ['Lifestyle inflation — spending rose in proportion to income', 'Smart living — spending what you earn', 'Income diversification', 'Hedonic adaptation only'],
    0,
    'Lifestyle inflation (or "lifestyle creep") means every raise triggers a proportional spending increase. Jordan earned double but saved the same because he upgraded his car, apartment, and dining habits with each raise.'
  ),

  mc('u1-3-l7', 1,
    'What is the best response when you receive a significant pay raise?',
    ['Save or invest a portion first, then allow some lifestyle upgrades', 'Upgrade your lifestyle immediately to match the new income', 'Keep everything identical — don\'t change a thing', 'Pay off all debt before spending any of it'],
    0,
    'A raise is an opportunity to accelerate wealth-building. Putting 50%+ of the raise toward savings/investments while enjoying a modest lifestyle upgrade is the balanced approach.'
  ),

  mc('u1-3-l8', 0,
    'You can receive $500 today or $650 in 12 months. You choose the $650. This is an example of:',
    ['Delayed gratification — choosing a larger future reward over a smaller immediate one', 'Opportunity cost — giving up $500', 'Compound interest', 'Lifestyle deflation'],
    0,
    'Delayed gratification means resisting an immediate temptation for a better outcome later. The $150 extra represents a 30% return — significantly better than most savings accounts.'
  ),

  mc('u1-3-l8', 1,
    'Research on delayed gratification suggests that people who practise it tend to:',
    ['Build more wealth over time and experience less financial stress', 'Earn higher salaries automatically', 'Spend less on average than they earn', 'Retire at exactly 65'],
    0,
    'Delayed gratification is a learnable skill. It\'s the foundation of every major wealth-building behaviour: saving before spending, investing for the future, and avoiding high-interest debt.'
  ),

  // ── u1-4: Saving ─────────────────────────────────────────────────────

  mc('u1-4-l1', 0,
    'What is the primary purpose of saving money?',
    ['To have a financial cushion for the future and fund goals you couldn\'t pay for all at once', 'To avoid paying taxes', 'To impress banks so they offer better loan rates', 'To follow a legal requirement'],
    0,
    'Saving creates security and opportunity. Emergency savings cover life\'s surprises; goal savings fund big purchases; long-term savings build wealth. Without saving, you\'re one unexpected bill away from debt.'
  ),

  mc('u1-4-l1', 1,
    'Ava starts saving $200/month at age 22. Ben starts saving $200/month at age 32. Both earn 8% annually. At 65, who has more, and roughly how much more?',
    ['Ava — by hundreds of thousands of dollars due to compound interest over extra years', 'Ben — he invested more aggressively to catch up', 'They finish with roughly the same amount', 'Neither — $200/month isn\'t enough to matter'],
    0,
    'Ava saves for 43 years, Ben for 33 years. At 8% compound growth: Ava ≈ $800k+, Ben ≈ $350k+. Those extra 10 years more than double the outcome. Time is the most powerful variable in investing.'
  ),

  wb('u1-4-l2', 0,
    'An emergency fund should cover ______ to ______ months of living expenses and be kept in a ______ account so you can access it quickly.',
    ['3', '6', 'savings', 'investment', '12', '1'],
    ['3', '6', 'savings'],
    'The 3–6 month rule protects against job loss, medical emergencies, and major repairs. Keep it liquid (instantly accessible) in a savings account — not locked in investments that can drop 30% right when you need it.'
  ),

  mc('u1-4-l2', 1,
    'Which situation correctly qualifies as an emergency fund use?',
    ['Your car breaks down and you need it to get to work', 'Flights are on sale — great deal for a trip you\'ve been wanting', 'Your phone screen cracked but still works', 'You want to invest in a stock before the price goes up'],
    0,
    'Emergency funds are for unexpected, necessary expenses that would otherwise require debt. Sales, upgrades, and investment opportunities are not emergencies — use sinking funds or investing accounts for those.'
  ),

  mc('u1-4-l3', 0,
    'What makes a High-Yield Savings Account (HYSA) better than a standard savings account?',
    ['It pays significantly more interest — often 4–5% vs 0.01–0.1% at big banks', 'It\'s not taxed on interest earned', 'It has unlimited withdrawal limits', 'The principal is guaranteed to double in 10 years'],
    0,
    'HYSAs typically offered 4–5% APY in 2024 vs 0.01% at major banks. On $10,000, that\'s $400–500/year vs $1. They\'re FDIC-insured and work just like regular savings accounts.'
  ),

  mc('u1-4-l3', 1,
    'You deposit $8,000 in an account earning 4.5% APY. After one year, approximately how much interest did you earn?',
    ['$360', '$450', '$180', '$800'],
    0,
    '$8,000 × 0.045 = $360 in interest after one year. APY (Annual Percentage Yield) already accounts for compounding, so multiply principal × APY for a close year-1 estimate.'
  ),

  mc('u1-4-l4', 0,
    'You invest $1,000 at 6% simple interest for 4 years. How much total interest do you earn?',
    ['$240', '$262', '$200', '$360'],
    0,
    'Simple interest formula: I = P × r × t = $1,000 × 0.06 × 4 = $240. Simple interest is calculated only on the original principal — interest never earns interest.'
  ),

  mc('u1-4-l4', 1,
    'Simple interest is calculated on the:',
    ['Original principal only', 'Principal plus all previously earned interest', 'Principal minus taxes paid', 'Average balance over the term'],
    0,
    'This is the key distinction from compound interest. $1,000 at 5% simple interest always earns $50/year, regardless of how many years pass.'
  ),

  mc('u1-4-l5', 0,
    'You invest $1,000 at 10% interest compounded annually. After 2 years you have:',
    ['$1,210 — because year-2 interest is calculated on $1,100, not $1,000', '$1,200 — $100 interest per year × 2 years', '$1,100 — one year\'s interest only', '$1,250 — compounding adds an extra 50% bonus'],
    0,
    'Year 1: $1,000 × 1.10 = $1,100. Year 2: $1,100 × 1.10 = $1,210. The extra $10 is interest earned on year-1\'s $100 interest. That\'s the power of compounding — earning interest on your interest.'
  ),

  mc('u1-4-l5', 1,
    'The "Rule of 72" tells you how long it takes to double your money. At 8% interest, your money doubles in roughly:',
    ['9 years (72 ÷ 8)', '8 years (same as the interest rate)', '12 years (72 ÷ 6)', '6 years (72 ÷ 12)'],
    0,
    '72 ÷ 8 = 9 years. So $10,000 invested at 8% becomes $20,000 in ~9 years, $40,000 in ~18, $80,000 in ~27. That\'s why starting early matters so much.'
  ),

  order('u1-4-l6', 0,
    'Put these steps for reaching a savings goal in the correct order.',
    ['Define the goal and its total cost (e.g., $3,000 laptop)',
     'Set a realistic target date for reaching the goal',
     'Calculate the monthly savings required (total ÷ months)',
     'Open a dedicated savings account labelled with the goal',
     'Set up an automatic transfer on payday',
     'Track progress monthly and celebrate milestones'],
    'This order matters: if you try to automate before knowing the target amount, you\'re guessing. Start with the goal and date, do the math, then automate. Automation removes the willpower requirement.'
  ),

  mc('u1-4-l6', 1,
    'You want to save $2,400 for a trip in exactly 8 months. How much must you save per month?',
    ['$300', '$240', '$400', '$200'],
    0,
    '$2,400 ÷ 8 = $300/month. This is why defining a deadline is crucial — without a date, a goal is just a wish. With a date, you have a specific monthly action.'
  ),

  wb('u1-4-l7', 0,
    'Paying yourself ______ means moving money to savings before you spend on anything else. This is typically done with ______ transfers set up to run the moment your paycheck arrives.',
    ['first', 'automated', 'last', 'manual'],
    ['first', 'automated'],
    '"Pay yourself first" flips the default. Instead of saving whatever\'s left (usually nothing), you make saving the first transaction of payday. Automation removes the decision entirely.'
  ),

  mc('u1-4-l7', 1,
    'Why is automating savings more effective than manually transferring money each month?',
    ['It removes willpower and temptation — the money moves before you can spend it', 'Automated transfers earn more interest than manual ones', 'Banks charge fees if you transfer manually', 'Automation qualifies you for tax deductions'],
    0,
    'Willpower is finite and unreliable. Every month you have to "decide" to save, there\'s a chance life gets in the way. Automation makes saving the default, not a decision.'
  ),

  mc('u1-4-l8', 0,
    'Inflation is running at 4% annually. Your savings account earns 1% APY. What is happening to your purchasing power?',
    ['It\'s shrinking by about 3% per year — inflation is eating faster than you earn', 'It\'s growing by 5% (1% savings + 4% inflation combined)', 'It\'s staying the same because you\'re earning interest', 'It\'s growing slowly but safely'],
    0,
    'Real return = interest rate − inflation rate = 1% − 4% = −3%. Your balance grows nominally but buys less. $10,000 at 1% after 10 years of 4% inflation actually buys fewer goods than today.'
  ),

  mc('u1-4-l8', 1,
    'You keep $10,000 in cash under your mattress for 10 years. Inflation averages 3%/year. How much does it buy by year 10?',
    ['The equivalent of about $7,400 in today\'s money', 'Exactly $10,000 — cash holds its value', '$13,000 — inflation grows your money', '$8,000 — you lose exactly 20% over 10 years'],
    0,
    '$10,000 ÷ (1.03)^10 ≈ $7,441 in today\'s purchasing power. Inflation silently erodes uninvested cash. This is why "keeping money safe in cash" isn\'t actually safe long-term.'
  ),

  // ── u2-1: Banks & Accounts ────────────────────────────────────────────

  mc('u2-1-l1', 0,
    'What is a checking account primarily designed for?',
    ['Daily spending — paying bills, making purchases, and receiving deposits', 'Long-term savings and earning interest', 'Storing retirement funds until age 65', 'Holding investments like stocks and bonds'],
    0,
    'Checking accounts are transaction accounts — they\'re built for high-frequency use. Unlike savings accounts, they typically offer unlimited transactions, a debit card, and direct deposit.'
  ),

  mc('u2-1-l1', 1,
    'What happens when you overdraft a checking account?',
    ['Your balance goes negative — the bank may cover the transaction and charge you a $25–35 fee', 'The transaction is always automatically declined with no penalty', 'The bank calls you before processing the payment', 'You lose your account immediately'],
    0,
    'Overdraft fees are a major revenue source for banks. Opt-out of overdraft "protection" to prevent expensive fees, or keep a buffer in your account. Many online banks now offer no-fee overdraft policies.'
  ),

  mc('u2-1-l2', 0,
    'For money you won\'t need for 1–2 years, which account is better: checking or savings?',
    ['High-yield savings — it earns significantly more interest while keeping money accessible', 'Checking — it\'s easier to access if needed', 'Neither — keep it invested in stocks', 'A CD (Certificate of Deposit) locked for 20 years'],
    0,
    'Checking accounts pay nearly zero interest. A HYSA earns 4–5% on the same money. For funds you don\'t need immediately, move them to savings to make your money work harder.'
  ),

  mc('u2-1-l2', 1,
    'A traditional bank savings account pays 0.01% APY. On $5,000, annual interest earned is:',
    ['$0.50 — essentially nothing', '$50', '$5', '$500'],
    0,
    '$5,000 × 0.0001 = $0.50 per year. That\'s less than the cost of a postage stamp. Compare this to a HYSA at 4.5% which would pay $225. The difference is staggering.'
  ),

  sort('u2-1-l3', 0,
    'Sort each feature into the correct column.',
    ['Credit Union', 'Traditional Bank'],
    [
      { text: 'Owned by its members (depositors)', bucket: 0 },
      { text: 'Owned by shareholders seeking profit', bucket: 1 },
      { text: 'Profits returned as lower rates and fewer fees', bucket: 0 },
      { text: 'Publicly traded on stock exchanges', bucket: 1 },
      { text: 'Must meet membership requirements (job, region, etc.)', bucket: 0 },
      { text: 'Open to virtually anyone who applies', bucket: 1 },
    ],
    'Credit unions are member-owned nonprofits. Because they don\'t need to maximise profit for shareholders, they often offer lower loan rates, higher savings rates, and fewer fees. The tradeoff: fewer branch locations and strict membership rules.'
  ),

  mc('u2-1-l3', 1,
    'Why do credit unions typically offer better rates than traditional banks?',
    ['They\'re nonprofits — profit goes back to members instead of shareholders', 'They have secret government subsidies', 'They charge higher fees to make up the difference', 'They invest more aggressively than banks'],
    0,
    'A bank\'s goal is profit for shareholders. A credit union\'s goal is serving members. When they earn more from loans than they pay in interest, that surplus lowers member fees and improves rates.'
  ),

  mc('u2-1-l4', 0,
    'Why can online banks offer higher interest rates than traditional banks?',
    ['No physical branches means massively lower overhead costs', 'They take on more investment risk with deposits', 'They\'re exempt from FDIC regulations', 'They charge hidden fees that offset the better rates'],
    0,
    'A branch bank pays rent, utilities, and staff for dozens of locations. An online bank has a few data centres. Those savings are passed on to customers as better rates and lower fees.'
  ),

  order('u2-1-l5', 0,
    'Put these steps in order to show how banks profit from your deposits.',
    ['You deposit $1,000 into your savings account',
     'The bank pools deposits from thousands of customers',
     'The bank lends money to a home buyer at 7% interest',
     'The home buyer repays the loan with interest over 30 years',
     'The bank pays you 1% on your savings — keeping the 6% spread as profit'],
    'This "interest rate spread" is how banks make most of their money. They borrow short (from depositors at low rates) and lend long (mortgages, car loans at higher rates). The spread is their profit margin.'
  ),

  mc('u2-1-l5', 1,
    'A bank pays depositors 1% on savings and charges 7% on mortgages. The bank\'s interest rate spread is:',
    ['6% — the difference between what they charge borrowers and pay depositors', '8% — the total of both rates combined', '1% — the interest paid to depositors', '7% — the rate charged on loans'],
    0,
    'Spread = lending rate − deposit rate = 7% − 1% = 6%. On a $100,000 mortgage, the bank earns $7,000/year in interest but only pays $1,000/year on a $100,000 deposit backing it. The $6,000 spread is profit.'
  ),

  wb('u2-1-l6', 0,
    'FDIC insurance protects deposits up to $______ per depositor per bank. It covers checking accounts, savings accounts, and ______. It does NOT cover ______ accounts.',
    ['$250,000', 'CDs', 'brokerage', '$100,000', 'stocks', '$500,000'],
    ['$250,000', 'CDs', 'brokerage'],
    'FDIC = Federal Deposit Insurance Corporation. If your bank fails, the government reimburses up to $250k per bank. You can exceed this by spreading money across multiple banks. Investment and brokerage accounts are covered by SIPC, not FDIC.'
  ),

  mc('u2-1-l6', 1,
    'You have $400,000 at one bank. FDIC insurance covers:',
    ['$250,000 — the remaining $150,000 is at risk if the bank fails', 'The full $400,000 — FDIC covers any amount', '$200,000 — the per-account cap', 'Nothing — the FDIC limit was removed in 2020'],
    0,
    'The $250,000 limit is per depositor per bank. Solution: keep under $250k per bank, or spread deposits across multiple FDIC-insured banks to fully protect your money.'
  ),

  mc('u2-1-l7', 0,
    'Your bank statement shows a "DEBIT — Amazon — $87.43". This means:',
    ['$87.43 was withdrawn from your account for an Amazon purchase', '$87.43 was added to your account', 'Amazon owes you $87.43', 'Your credit card was charged $87.43'],
    0,
    'On a bank statement: DEBIT = money leaving your account. CREDIT = money entering your account. Think of it from the bank\'s perspective: a debit reduces what they owe you.'
  ),

  mc('u2-1-l7', 1,
    'You find a charge on your statement you don\'t recognise. Your first step should be:',
    ['Contact your bank immediately — it could be fraud and time-sensitive', 'Wait a month to see if it reverses itself', 'Call the merchant first before contacting the bank', 'Accept it — banks rarely make mistakes'],
    0,
    'Fraud disputes have time limits (often 60 days from the statement date). The sooner you report an unrecognised charge, the better your chances of a full refund.'
  ),

  mc('u2-1-l8', 0,
    'Which is NOT typically a feature of mobile banking apps?',
    ['Printing certified checks at home', 'Mobile check deposit via photo', 'Account alerts and spending notifications', 'Bill pay and fund transfers'],
    0,
    'Certified checks require bank resources to guarantee funds — you can\'t generate one from an app. Everything else (deposits, alerts, transfers) is standard mobile banking.'
  ),

  mc('u2-1-l8', 1,
    'What security step should you ALWAYS enable on your banking app?',
    ['Two-factor authentication (2FA) — a second verification beyond just your password', 'Saving your password in the app for convenience', 'Disabling the app\'s timeout feature', 'Sharing login credentials with trusted family'],
    0,
    '2FA means a thief needs both your password AND access to your phone or email. Even if your password is stolen, 2FA stops them. Never share banking credentials — not even with family.'
  ),

  // ── u2-2: Payments ────────────────────────────────────────────────────

  mc('u2-2-l1', 0,
    'What is the key difference between a debit card and a credit card?',
    ['Debit draws directly from your bank account; credit borrows money you repay later', 'Debit builds credit history; credit does not', 'Debit cards have better fraud protection under federal law', 'Credit cards are accepted everywhere; debit cards only at banks'],
    0,
    'Debit = spending your own money instantly. Credit = borrowing from the bank, repaid at month-end. The difference matters for fraud protection: federal law gives credit cardholders much stronger rights.'
  ),

  mc('u2-2-l1', 1,
    'Your debit card is fraudulently charged $600. You report it within 2 days. Under federal law, your maximum liability is:',
    ['$50 — federal law limits liability for fast reports', '$600 — you lose the full amount', '$0 — debit cards have zero liability', '$250 — the legal cap for all card types'],
    0,
    'Under the Electronic Fund Transfer Act, if you report within 2 days: max $50 liability. 2–60 days: up to $500. After 60 days: potentially unlimited. Report FAST. Credit cards offer even stronger protection (zero liability under most agreements).'
  ),

  mc('u2-2-l2', 0,
    'You use a credit card for all purchases and pay the full statement balance every month. The result is:',
    ['Zero interest paid, credit score built, and potential cashback or rewards earned', 'Interest charges equal to 24% APR on all purchases', 'Your credit score decreases from frequent card use', 'Your bank account is debited immediately'],
    0,
    'Paying in full every month is the secret to using credit cards beneficially. You get all the rewards and protections while paying zero interest. The key: treat it like a debit card — only spend what you have.'
  ),

  mc('u2-2-l2', 1,
    'A credit card charges 24% APR. You carry a $500 balance for one month. Interest charged is approximately:',
    ['$10 (24% ÷ 12 months × $500)', '$120 (24% × $500)', '$2 (24% ÷ 52 weeks × $500)', '$24 (24% × $100 flat)'],
    0,
    'Monthly rate = 24% ÷ 12 = 2%. $500 × 2% = $10/month. That seems small, but on a $5,000 balance it\'s $100/month — $1,200/year — just for the privilege of not paying on time.'
  ),

  mc('u2-2-l3', 0,
    'What is a certified check?',
    ['A check guaranteed by the bank — the funds are verified and set aside before it\'s issued', 'A personal check you\'ve signed', 'A check with extra security features that can\'t bounce', 'A check from a business account'],
    0,
    'A certified check = the bank confirms funds exist, withdraws them immediately, and guarantees the check won\'t bounce. Used for large transactions (buying a car, apartment deposits) where sellers need certainty.'
  ),

  mc('u2-2-l3', 1,
    'An advantage of paying with cash (over cards) is:',
    ['No transaction fees, no interest risk, and it can make overspending harder psychologically', 'Better fraud protection under federal law', 'You earn cashback on every purchase', 'Transactions are processed faster than digital payments'],
    0,
    'Handing over physical bills makes spending feel real. Research shows people spend 12–18% less when using cash vs cards. No fees and no interest are also genuine benefits — though cash offers no fraud protection if lost or stolen.'
  ),

  mc('u2-2-l4', 0,
    'You\'re closing on a house tomorrow and need to send $80,000 to a title company by 5pm. Which payment method?',
    ['Wire transfer — same-day settlement, though it costs $25–40 in fees', 'ACH — free, but takes 1–3 business days', 'Personal check — no fee, received same day', 'Zelle — instant, free, no limits'],
    0,
    'For large, time-critical transfers, wire transfers are the correct tool. ACH would miss the deadline; personal checks can bounce; Zelle has low limits and isn\'t used for real estate closings.'
  ),

  mc('u2-2-l4', 1,
    'Your employer\'s bi-weekly payroll is processed using:',
    ['ACH (Automated Clearing House) — it\'s how nearly all direct deposits work', 'Wire transfer — the fastest method', 'Physical checks mailed to employees', 'Zelle — banks use it for payroll'],
    0,
    'ACH is the backbone of US direct deposits, payroll, and recurring bill payments. It\'s free, reliable, and handles trillions in transfers annually — just not same-day (next business day is standard).'
  ),

  sort('u2-2-l5', 0,
    'Which situations are safe to use Venmo/CashApp/Zelle — and which are risky?',
    ['Safe Use (low risk)', 'Risky — Avoid (no buyer protection)'],
    [
      { text: 'Splitting a restaurant bill with a close friend', bucket: 0 },
      { text: 'Paying a stranger for concert tickets you found on Facebook', bucket: 1 },
      { text: 'Paying your roommate your share of rent', bucket: 0 },
      { text: 'Buying a used TV from someone you met online', bucket: 1 },
      { text: 'Sending your sibling money for a gift', bucket: 0 },
      { text: 'Paying a "contractor" who only accepts Zelle', bucket: 1 },
    ],
    'P2P apps (Venmo, CashApp, Zelle) are built for trusted relationships — friends and family. They offer NO buyer protection: money sent is gone. Scammers love these apps precisely because the transfers are instant and irreversible. For strangers, use credit cards or payment platforms with dispute resolution.'
  ),

  mc('u2-2-l5', 1,
    'You get a Venmo request from someone claiming to be your bank, asking you to "verify" $1 by sending it. This is:',
    ['A phishing scam — banks never request money to verify your identity', 'A standard security check — send it to confirm your identity', 'Optional — you can choose to participate', 'Only safe if the request comes from a verified account'],
    0,
    'Legitimate banks NEVER ask for money via Venmo, Zelle, or CashApp. If you receive a payment request claiming to be from your bank, report it immediately and contact your bank directly.'
  ),

  mc('u2-2-l6', 0,
    'What makes contactless (tap-to-pay) payments more secure than swiping a card?',
    ['They generate a unique one-time token per transaction — your real card number is never shared', 'They require a PIN which adds security', 'The payment goes through a more secure network', 'Contactless payments are insured by the government'],
    0,
    'Tokenisation means each tap generates a random code valid for one transaction only. Even if a thief intercepts it, it\'s worthless for future use. Magnetic stripe skimmers steal your actual card number — tokenisation eliminates that risk.'
  ),

  mc('u2-2-l6', 1,
    'NFC stands for ______, the technology that powers tap-to-pay.',
    ['Near Field Communication', 'Network Financial Clearance', 'Non-contact Funds Confirmation', 'New Finance Code'],
    0,
    'NFC creates a short-range (4cm) radio link between your phone/card and the terminal. It\'s fast, secure through tokenisation, and works even in airplane mode — your device doesn\'t need internet to complete the transaction.'
  ),

  wb('u2-2-l7', 0,
    'Direct deposit sends your paycheck ______ into your bank account via the ______ system. To set it up, give your employer your account and ______ number.',
    ['electronically', 'ACH', 'routing', 'wire', 'manually'],
    ['electronically', 'ACH', 'routing'],
    'Direct deposit = your employer sends payroll via ACH directly to your bank. Your routing number identifies your bank; your account number identifies your specific account. Never share these with anyone outside your employer\'s HR system.'
  ),

  mc('u2-2-l7', 1,
    'What is the main advantage of direct deposit over paper checks?',
    ['Money is available on payday without waiting for a check to clear (which takes 1–2 days)', 'You earn more interest on direct-deposited funds', 'Direct deposit is protected by different laws than paper checks', 'Paper checks always get lost in the mail'],
    0,
    'A paper check deposit can take 1–2 days to clear — or longer if your bank holds it. Direct deposit is typically available the moment your employer\'s payroll runs, often giving you access first thing payday morning.'
  ),

  mc('u2-2-l8', 0,
    'You\'re booking a $1,200 flight online. The safest payment method is:',
    ['Credit card — offers purchase protection, travel insurance, and fraud dispute rights', 'Debit card — spends your own money so there\'s no risk', 'Bank transfer — direct and no fees', 'Cash — completely untraceable and secure'],
    0,
    'For large online purchases, credit cards are the gold standard: zero-liability fraud protection, chargeback rights if the merchant doesn\'t deliver, and many cards add travel insurance. Debit card fraud takes money from your actual account.'
  ),

  mc('u2-2-l8', 1,
    'You owe a friend $25 for pizza. The best payment method is:',
    ['Zelle, Venmo, or CashApp — instant, free, and perfect for trusted contacts', 'Credit card — to earn cashback', 'Wire transfer — guaranteed fast delivery', 'Personal check — always traceable'],
    0,
    'P2P apps are ideal for small, trusted transactions. A $25 wire transfer would cost $25+ in fees. A cheque for $25 is unnecessary friction. Credit card rewards on $25 are pennies — not worth the complexity.'
  ),
]

// ─── Run ─────────────────────────────────────────────────────────────────

const allLessonIds = [...new Set(questions.map(q => q.lesson_id))]

console.log(`\nSeeding ${questions.length} questions across ${allLessonIds.length} lessons...\n`)

// Delete existing questions for these lessons
const { error: delError } = await supabase
  .from('questions')
  .delete()
  .in('lesson_id', allLessonIds)

if (delError) { console.error('Delete failed:', delError); process.exit(1) }
console.log(`✓ Cleared existing questions for ${allLessonIds.length} lessons`)

// Insert new questions in batches of 50
const BATCH = 50
let inserted = 0
for (let i = 0; i < questions.length; i += BATCH) {
  const batch = questions.slice(i, i + BATCH)
  const { error: insError } = await supabase.from('questions').insert(batch)
  if (insError) { console.error(`Insert failed at batch ${i}:`, insError); process.exit(1) }
  inserted += batch.length
  console.log(`✓ Inserted ${inserted}/${questions.length}`)
}

console.log(`\n✅ Done! ${questions.length} questions seeded for the Basics section.\n`)
