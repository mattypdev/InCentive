// Adds 2 special interactive questions + 1 fill-blank per lesson for The Basics.
// Replaces positions 1, 4, 5 in every lesson.  Positions 0, 2, 3 are untouched.
// Run: node scripts/add-interactive.mjs

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

const u = id => id.replace(/-l\d+$/, '')

// fill-blank: prompt must contain exactly one ______
const fb = (lid, pos, prompt, opts, correct, expl) => ({
  lesson_id: lid, unit_id: u(lid), type: 'fill-blank', position: pos,
  prompt, options: opts, correct, explanation: expl, meta: null,
})
// numberline: answer is a specific value; tolerance is how close the user must be
const nl = (lid, pos, prompt, min, max, step, answer, tolerance, format, labels, expl) => ({
  lesson_id: lid, unit_id: u(lid), type: 'numberline', position: pos,
  prompt, options: [], correct: 0, explanation: expl,
  meta: { min, max, step, answer, tolerance, format, labels },
})
// slider: user drags to a calculated value
const sl = (lid, pos, prompt, min, max, step, answer, tolerance, format, expl) => ({
  lesson_id: lid, unit_id: u(lid), type: 'slider', position: pos,
  prompt, options: [], correct: 0, explanation: expl,
  meta: { min, max, step, answer, tolerance, format },
})

// ─── Question data ────────────────────────────────────────────────────────────
// Each lesson gets:
//   pos 1 → fill-blank  (replaces a stale MC)
//   pos 4 → special type A (numberline or slider)
//   pos 5 → special type B (slider, numberline, or fill-blank)

const patches = [

  // ══════════════════════════════════════════════════════════════
  // u1-1  What is Money?
  // ══════════════════════════════════════════════════════════════

  // l1  History of Money
  fb('u1-1-l1', 1,
    'Money replaced ______, the direct exchange system that required both parties to want exactly what the other offered.',
    ['barter', 'credit', 'savings', 'investing'], 0,
    'Barter = direct exchange. Its fatal flaw: the double coincidence of wants. Money solved this by acting as a universal intermediary.'),
  nl('u1-1-l1', 4,
    'The US officially ended the gold standard in what year? Drag the pin to that year on the timeline.',
    1900, 2000, 5, 1971, 6, 'year', [1910, 1930, 1950, 1971, 1990, 2000],
    'President Nixon ended dollar-gold convertibility in 1971, fully transitioning the US dollar to fiat currency. $35 could no longer buy 1 oz of gold.'),
  fb('u1-1-l1', 5,
    'Digital money exists only as ______ records in computer systems — about 90–95% of all money today has no physical form.',
    ['electronic', 'paper', 'gold', 'printed'], 0,
    'Bank balances, transfers, and card payments are just numbers in databases. Physical cash is a shrinking fraction of the total money supply.'),

  // l2  Barter System
  fb('u1-1-l2', 1,
    'In barter, if a farmer has wheat but needs shoes, they must find someone who has shoes AND ______ wheat.',
    ['wants', 'grows', 'sells', 'trades'], 0,
    'This "double coincidence of wants" is barter\'s fatal flaw. Money eliminates it by acting as a universally accepted intermediary.'),
  fb('u1-1-l2', 4,
    'Without money, the only way to store wealth was to stockpile ______ goods — but they could spoil, be stolen, or be hard to transport.',
    ['durable', 'perishable', 'digital', 'imported'], 0,
    'Grain, cattle, or tools work for a while, but they decay or are impractical to carry. Money is a far superior store of value.'),
  fb('u1-1-l2', 5,
    'Money solves barter\'s main problem by acting as a universal ______ of exchange that everyone accepts.',
    ['medium', 'store', 'unit', 'form'], 0,
    'The three functions of money: medium of exchange (buy/sell anything), unit of account (compare prices), store of value (save for later).'),

  // l3  Why Money Has Value
  fb('u1-1-l3', 1,
    'Using money to buy a pizza uses money as a ______ of exchange — its most fundamental role.',
    ['medium', 'store', 'unit', 'ledger'], 0,
    'Medium of exchange = money lets you swap your labor (wages) for any good or service without needing a perfect barter match.'),
  fb('u1-1-l3', 4,
    'A $4.99 price tag on a candy bar uses money as a ______ of account — a standard ruler for comparing the value of things.',
    ['unit', 'medium', 'store', 'base'], 0,
    'Unit of account lets us compare a $4.99 candy bar to a $49.99 pizza. Without it, every trade would require complex negotiation.'),
  fb('u1-1-l3', 5,
    'The US dollar has value because people ______ it and the government declares it legal tender — not because of any physical backing.',
    ['trust', 'print', 'hoard', 'mine'], 0,
    'Fiat currency\'s value is purely social. If collective trust collapsed, dollar bills would be worthless paper.'),

  // l4  Fiat Currency
  fb('u1-1-l4', 1,
    '"Fiat" comes from Latin for "let it ______," meaning value comes from government decree, not intrinsic worth.',
    ['be done', 'grow', 'trade', 'earn'], 0,
    'A dollar bill\'s paper and ink are nearly worthless. Its value exists because the US government declares it legal tender.'),
  nl('u1-1-l4', 4,
    'Economists define "hyperinflation" as inflation exceeding ___% per MONTH. Plot this threshold on the scale.',
    0, 100, 5, 50, 10, 'percent', [0, 25, 50, 75, 100],
    'Hyperinflation = >50% monthly. Zimbabwe\'s 2008 peak hit 79.6 billion percent monthly. Prices doubled every 24 hours at the worst.'),
  fb('u1-1-l4', 5,
    'When the government prints too much money, too much ______ chases too few goods — causing inflation to rise.',
    ['money', 'debt', 'gold', 'taxes'], 0,
    'This is the core inflation mechanism. Zimbabwe and Weimar Germany both experienced this. Central banks exist partly to prevent it.'),

  // l5  Commodity Money  (pos 0 = sort, kept)
  fb('u1-1-l5', 1,
    'Commodity money has ______ value — it is useful even if it\'s never used as currency.',
    ['intrinsic', 'fiat', 'digital', 'speculative'], 0,
    'Gold is valuable for jewelry and electronics. Salt preserved food before refrigeration. Their real-world usefulness made them credible as money.'),
  nl('u1-1-l5', 4,
    'Gold coins were used as money for centuries. The US formally ended the gold standard in what year? Pin the year.',
    1900, 2000, 5, 1971, 6, 'year', [1910, 1930, 1950, 1971, 1990, 2000],
    'Nixon ended dollar-gold convertibility in 1971. Before 1971, the US was legally obligated to exchange $35 for 1 oz of gold.'),
  fb('u1-1-l5', 5,
    'The word "salary" comes from "sal," the Latin word for ______, which Roman soldiers were sometimes paid with.',
    ['salt', 'silver', 'gold', 'grain'], 0,
    'Salt was a valuable commodity — essential for preserving food before refrigeration. Hence: "worth their salt."'),

  // l6  Digital Money
  fb('u1-1-l6', 1,
    'When you pay with a debit card, ______ records transfer between bank databases — no physical cash moves at all.',
    ['electronic', 'paper', 'gold', 'printed'], 0,
    'Digital money exists as numbers in computer systems. Physical bills represent less than 5–10% of all money in circulation.'),
  nl('u1-1-l6', 4,
    'Approximately what percentage of all money in the modern economy exists only as digital (not physical) currency?',
    0, 100, 5, 92, 8, 'percent', [0, 25, 50, 75, 92, 100],
    'About 92% of global money exists only as electronic records. Physical cash usage is shrinking every year as digital payments dominate.'),
  fb('u1-1-l6', 5,
    'The ______ network processes billions of digital payments between US banks — powering direct deposit and bill pay.',
    ['ACH', 'ATM', 'FDIC', 'IRS'], 0,
    'ACH = Automated Clearing House. Your paycheck direct deposit, utility autopay, and peer-to-peer transfers all use ACH.'),

  // l7  Cryptocurrency
  fb('u1-1-l7', 1,
    'Cryptocurrencies like Bitcoin run on a ______ — a distributed public ledger maintained by thousands of computers simultaneously.',
    ['blockchain', 'mainframe', 'clearinghouse', 'server farm'], 0,
    'Blockchain records every transaction in a chain of verified blocks. No single entity controls it — it\'s truly decentralized.'),
  nl('u1-1-l7', 4,
    'Bitcoin\'s price dropped approximately what percentage during the 2022 crypto crash? Pin the drop on the scale.',
    0, 100, 5, 70, 8, 'percent', [0, 25, 50, 70, 85, 100],
    'Bitcoin fell ~70% in 2022 (from ~$69K to ~$16K). This volatility makes crypto a poor "store of value" compared to traditional assets.'),
  fb('u1-1-l7', 5,
    '"Decentralised" means no single ______, company, or government controls the cryptocurrency network.',
    ['bank', 'user', 'miner', 'coin'], 0,
    'Bitcoin is run by a global peer-to-peer network. Contrast this with the US dollar, controlled by the Federal Reserve.'),

  // l8  Inflation Introduction
  fb('u1-1-l8', 1,
    'Inflation means prices rise overall, ______ your purchasing power — $100 today buys less than $100 did last year.',
    ['reducing', 'increasing', 'doubling', 'protecting'], 0,
    'At 5% inflation, $100 this year buys only ~$95 worth of goods next year. Your money\'s real value slowly erodes.'),
  nl('u1-1-l8', 4,
    'The US Federal Reserve targets an annual inflation rate of approximately ___%. Drag the pin to that target.',
    0, 10, 0.5, 2, 0.5, 'percent', [0, 2, 4, 6, 8, 10],
    'The Fed aims for ~2% — enough for healthy economic growth and room to cut rates in recessions, without eroding purchasing power fast.'),
  sl('u1-1-l8', 5,
    'A coffee costs $3.00 today. With 5% annual inflation, drag the slider to its approximate price next year.',
    2.50, 4.00, 0.05, 3.15, 0.06, 'dollar',
    '$3.00 × 1.05 = $3.15. Small annual inflation compounds into significant price increases over decades.'),

  // ══════════════════════════════════════════════════════════════
  // u1-2  Income
  // ══════════════════════════════════════════════════════════════

  // l1  What Income Is  (pos 0 = sort, kept)
  fb('u1-2-l1', 1,
    'Income is money ______ from work, investments, or other sources — the opposite of an expense.',
    ['received', 'borrowed', 'spent', 'owed'], 0,
    'Income flows in; expenses flow out. A loan is NOT income because you must repay it — it\'s a liability.'),
  nl('u1-2-l1', 4,
    'Royalties from a song require almost no ongoing effort after creation. On a 0–100 "passiveness" scale, where do royalties fall?',
    0, 100, 10, 90, 10, 'number', [0, 25, 50, 75, 90, 100],
    'Royalties are nearly 100% passive — written once, earns forever. Active income (wages) is near 0 — stops the moment you stop working.'),
  fb('u1-2-l1', 5,
    'A loan is NOT income because you must ______ it to the lender — often with interest added on top.',
    ['repay', 'invest', 'spend', 'claim'], 0,
    'Never count borrowed money as income when budgeting. It\'s a temporary inflow that creates a future obligation.'),

  // l2  Gross vs Net  (pos 0 = wordbank, kept)
  fb('u1-2-l2', 1,
    '______ income is your total pay before any taxes or deductions are removed from your paycheck.',
    ['Gross', 'Net', 'Taxable', 'Adjusted'], 0,
    'Gross = total earned. Net = take-home after federal/state taxes, Social Security, Medicare, and benefits deductions.'),
  sl('u1-2-l2', 4,
    'Gross monthly income: $4,000. Total deductions (taxes + benefits): $1,000. Drag to your net monthly income.',
    2000, 4000, 100, 3000, 0, 'dollar',
    '$4,000 − $1,000 = $3,000 net. Always budget from your net income — it\'s the only money you can actually spend.'),
  sl('u1-2-l2', 5,
    '$60,000/year gross income. Effective tax rate: 20%. Drag the slider to annual net income.',
    40000, 60000, 1000, 48000, 0, 'dollar',
    '$60,000 × (1 − 0.20) = $48,000 annual take-home. Plan your budget around this number, not the gross.'),

  // l3  Salary
  fb('u1-2-l3', 1,
    'A ______ is a fixed annual pay amount — you receive the same paycheck regardless of how many hours you actually work.',
    ['salary', 'commission', 'tip', 'bonus'], 0,
    'Salary = fixed annual compensation. Unlike hourly pay, extra hours don\'t earn extra pay for most exempt salaried workers.'),
  sl('u1-2-l3', 4,
    'A salaried employee earns $52,000/year paid biweekly (26 pay periods). Drag to each paycheck amount.',
    1000, 3500, 50, 2000, 0, 'dollar',
    '$52,000 ÷ 26 pay periods = $2,000 per paycheck. This predictability makes salary easy to budget around.'),
  fb('u1-2-l3', 5,
    'A disadvantage of salary is that ______ employees typically receive no extra pay for working overtime hours.',
    ['exempt', 'hourly', 'part-time', 'seasonal'], 0,
    'The FLSA exempts many salaried professionals from overtime requirements. Working 60 hours earns the same as 40.'),

  // l4  Hourly Wage
  nl('u1-2-l4', 1,
    'The US federal minimum wage has been $___/hour since 2009. Drag the pin to that amount on the scale.',
    5.00, 20.00, 0.25, 7.25, 0.50, 'dollar', [5, 7.25, 10, 12, 15, 20],
    '$7.25/hour is the federal floor, unchanged since 2009. Many states set higher minimums — California and NY are at $16–17+.'),
  sl('u1-2-l4', 4,
    'Jordan works 35 hours at $15/hour this week. Drag to Jordan\'s gross weekly pay.',
    400, 700, 5, 525, 0, 'dollar',
    '35 × $15 = $525. With hourly pay, every hour worked adds directly to your paycheck.'),
  sl('u1-2-l4', 5,
    'A worker earns $18/hour and works 40 hours. Drag to their gross weekly pay.',
    500, 900, 10, 720, 0, 'dollar',
    '40 × $18 = $720. Hourly workers\' income varies directly with hours worked — more hours, more pay.'),

  // l5  Overtime
  nl('u1-2-l5', 1,
    'Under US federal law (FLSA), overtime pay kicks in after ___ hours per week. Pin the threshold.',
    30, 60, 1, 40, 1, 'hours', [30, 35, 40, 45, 50, 55, 60],
    'The Fair Labor Standards Act sets the overtime threshold at 40 hours/week. Hours 41+ must be paid at 1.5× the regular rate.'),
  sl('u1-2-l5', 4,
    'An employee earns $20/hour. They work 45 hours this week. Drag to their gross weekly pay.',
    700, 1100, 10, 950, 0, 'dollar',
    '40 hrs × $20 = $800 regular pay + 5 OT hrs × $30 (time-and-a-half) = $150. Total: $950.'),
  fb('u1-2-l5', 5,
    'Overtime pay is ______ times (time and a half) your regular hourly rate for hours worked over 40 per week.',
    ['1.5×', '2×', '1.25×', '3×'], 0,
    'If you earn $20/hour, overtime = $30/hour. The 1.5× rate is a federal minimum — some employers pay more.'),

  // l6  Commission
  fb('u1-2-l6', 1,
    'Commission is pay based on a ______ of the sales or deals you complete — higher performance means higher pay.',
    ['percentage', 'flat fee', 'fixed amount', 'daily rate'], 0,
    'Commission aligns your pay with your results. A 5% commission rate means $5 earned for every $100 of sales closed.'),
  sl('u1-2-l6', 4,
    'A salesperson earns 5% commission. They close $20,000 in sales this month. Drag to their commission.',
    0, 2000, 100, 1000, 0, 'dollar',
    '$20,000 × 0.05 = $1,000. Commission directly rewards performance — the more you sell, the more you earn.'),
  sl('u1-2-l6', 5,
    'A real estate agent earns 3% on a $400,000 home sale. Drag to the agent\'s total commission.',
    0, 20000, 1000, 12000, 0, 'dollar',
    '$400,000 × 0.03 = $12,000. Real estate agents typically earn 2.5–3% per transaction.'),

  // l7  Bonuses & Tips
  fb('u1-2-l7', 1,
    'All ______ income must be reported to the IRS — the government classifies it as taxable wages, not tax-free gifts.',
    ['tip', 'salary', 'passive', 'bonus'], 0,
    'Tips are legally wages. Servers must track and report all tips on their tax returns. Underreporting is illegal.'),
  sl('u1-2-l7', 4,
    'A server receives $200 in tips tonight. Their effective tax rate is 15%. Drag to the after-tax amount they keep.',
    100, 200, 5, 170, 0, 'dollar',
    '$200 × (1 − 0.15) = $170 after taxes. Even cash tips are subject to federal and state income taxes.'),
  fb('u1-2-l7', 5,
    'A performance ______ rewards hitting targets but is discretionary — not guaranteed like a salary.',
    ['bonus', 'wage', 'raise', 'subsidy'], 0,
    'Bonuses are not legally required. A sign-on bonus attracts new hires; a holiday bonus rewards loyalty. Neither is guaranteed.'),

  // l8  Multiple Income Streams  (pos 0 = order, kept)
  fb('u1-2-l8', 1,
    'A ______ is a secondary income source pursued outside your main job — like freelancing, tutoring, or selling products.',
    ['side hustle', 'salary', 'dividend', 'loan'], 0,
    'Side hustles range from Uber driving to Etsy stores to freelance work. They diversify income and build financial resilience.'),
  fb('u1-2-l8', 4,
    'Income ______ reduces financial risk — if one source disappears, the others keep you financially stable.',
    ['diversification', 'inflation', 'taxation', 'leverage'], 0,
    'Just like investing in multiple assets reduces portfolio risk, multiple income sources reduce personal financial risk.'),
  fb('u1-2-l8', 5,
    'Passive income from investments can grow without proportionally more of your ______ — unlike hourly or salaried work.',
    ['time', 'money', 'skills', 'savings'], 0,
    'This scalability is the key advantage. A dividend portfolio or digital product earns while you sleep — trading time for money does not.'),

  // ══════════════════════════════════════════════════════════════
  // u1-3  Spending
  // ══════════════════════════════════════════════════════════════

  // l1  Needs vs Wants  (pos 0 = sort, kept)
  fb('u1-3-l1', 1,
    'A "need" is something essential for ______, safety, or the ability to earn income — not just something you strongly desire.',
    ['health', 'luxury', 'entertainment', 'convenience'], 0,
    'Needs: food, shelter, basic clothing, healthcare, transportation to work. Everything else is technically a want.'),
  fb('u1-3-l1', 4,
    'Covering ______ first in your budget ensures you stay housed, healthy, and employed before any discretionary spending.',
    ['needs', 'wants', 'luxuries', 'entertainment'], 0,
    'Needs-first budgeting prevents the disaster of spending on wants and then being unable to pay rent or buy groceries.'),
  fb('u1-3-l1', 5,
    'A smartphone is a "need" if used for ______, but a "want" if primarily used for social media and entertainment.',
    ['work', 'games', 'photos', 'music'], 0,
    'Context determines need vs. want. A basic phone for employment = need. The latest iPhone for Instagram = want.'),

  // l2  Opportunity Cost
  fb('u1-3-l2', 1,
    '______ cost is the value of the next-best option you gave up when making any financial decision.',
    ['Opportunity', 'Fixed', 'Sunk', 'Variable'], 0,
    'Every choice eliminates alternatives. Buying clothes instead of investing has an opportunity cost: the investment returns foregone.'),
  fb('u1-3-l2', 4,
    'You spend $200 on clothes instead of investing it. The opportunity cost is the future ______ growth you forgo.',
    ['investment', 'clothing', 'purchase', 'savings'], 0,
    '$200 invested at 7% for 10 years ≈ $394. The true cost of a purchase includes this foregone future wealth.'),
  fb('u1-3-l2', 5,
    'Even "free" choices have opportunity costs — using your own ______ for one thing means giving up all its other possible uses.',
    ['time', 'credit', 'wallet', 'budget'], 0,
    'Time is your most valuable finite resource. An hour watching TV has an opportunity cost of learning a skill, exercising, or earning money.'),

  // l3  Fixed Expenses  (pos 0 = sort, kept)
  fb('u1-3-l3', 1,
    'Fixed expenses stay the ______ amount every period — predictable and easy to plan for in advance.',
    ['same', 'variable', 'growing', 'minimal'], 0,
    'Fixed = contractually set amounts. Rent, car loan payments, insurance premiums — you owe the same whether you use more or less.'),
  fb('u1-3-l3', 4,
    'When income drops, fixed expenses are dangerous because they ______ regardless of how much you currently earn.',
    ['remain the same', 'adjust lower', 'disappear', 'shrink automatically'], 0,
    'This inflexibility is why high fixed costs create financial fragility. Miss your rent and the consequences are severe.'),
  fb('u1-3-l3', 5,
    'Fixed expenses typically include rent and loan payments, but NOT ______ spending like groceries or restaurant meals.',
    ['variable', 'monthly', 'planned', 'recurring'], 0,
    'Groceries and gas fluctuate based on your choices each month. Contracted obligations like rent stay constant.'),

  // l4  Variable Expenses
  fb('u1-3-l4', 1,
    'Variable expenses ______ in amount each month based on your usage, behavior, and the choices you make.',
    ['change', 'stay constant', 'increase only', 'decrease only'], 0,
    'Gas, groceries, dining out, entertainment — all fluctuate monthly. Tracking them is essential for accurate budgeting.'),
  sl('u1-3-l4', 4,
    'You spent $300, $240, and $360 on groceries over 3 months. Drag to your monthly average.',
    0, 500, 10, 300, 0, 'dollar',
    '($300 + $240 + $360) ÷ 3 = $300/month average. Use past averages to set realistic variable expense budgets.'),
  fb('u1-3-l4', 5,
    'The best strategy for variable expenses is to ______ past spending and set a monthly cap per category.',
    ['track', 'ignore', 'maximize', 'estimate'], 0,
    'Historical data + category caps = a realistic budget. Without tracking, variable spending quietly drains your account.'),

  // l5  Recurring vs One-Time  (pos 0 = sort, kept)
  fb('u1-3-l5', 1,
    'A ______ expense happens on a predictable schedule — like monthly subscriptions or annual insurance premiums.',
    ['recurring', 'one-time', 'emergency', 'variable'], 0,
    'Recurring = automatic and regular. Netflix, your gym membership, and utility bills all repeat on a fixed schedule.'),
  sl('u1-3-l5', 4,
    'Your car registration costs $180/year. To prepare each month, drag to how much you should set aside.',
    0, 50, 1, 15, 0, 'dollar',
    '$180 ÷ 12 months = $15/month. Breaking annual costs into monthly savings prevents financial shock when the bill arrives.'),
  fb('u1-3-l5', 5,
    'Annual recurring expenses are easy to ______ — until the bill arrives once a year and catches you unprepared.',
    ['forget', 'track', 'avoid', 'double'], 0,
    'Car registration, Amazon Prime, annual insurance — save monthly for these so they never blindside you.'),

  // l6  Impulse Buying
  fb('u1-3-l6', 1,
    'Impulse buying is making ______ purchases driven by emotion or marketing — not your actual budget plan.',
    ['unplanned', 'planned', 'essential', 'routine'], 0,
    'Impulse purchases bypass rational decision-making — triggered by sales, social media FOMO, or simple boredom.'),
  fb('u1-3-l6', 4,
    'The best defense against impulse buying is to ______ at least a day before purchasing anything unplanned.',
    ['wait', 'justify', 'borrow', 'compare prices for'], 0,
    'The 24–48 hour rule: let the emotional urge fade. If you still want it after reflection, it may genuinely be worth buying.'),
  fb('u1-3-l6', 5,
    'Stores place candy and small items at checkout to trigger ______ purchases while customers wait in line.',
    ['last-minute', 'planned', 'bulk', 'essential'], 0,
    'A deliberate retail strategy. The checkout wait + low-cost items + "why not" psychology = millions in impulse revenue.'),

  // l7  Lifestyle Inflation
  fb('u1-3-l7', 1,
    'Lifestyle ______ happens when spending rises with every income increase, leaving savings unchanged despite earning more.',
    ['inflation', 'deflation', 'investment', 'planning'], 0,
    'Also called "lifestyle creep." Someone earning $100K but spending $100K is no more financially secure than someone at $50K/$50K.'),
  fb('u1-3-l7', 4,
    'To counter lifestyle inflation, set aside part of each ______ into savings BEFORE increasing lifestyle spending.',
    ['raise', 'bill', 'purchase', 'loan'], 0,
    'Automate savings from raises first — what you never see, you won\'t spend. Then enjoy some of the remainder guilt-free.'),
  fb('u1-3-l7', 5,
    '"Keeping up with the ______" means buying things to match peers, which drives lifestyle inflation and drains wealth.',
    ['Joneses', 'market', 'economy', 'trend'], 0,
    'Social comparison drives much of lifestyle inflation. Buying for status rather than genuine need or joy is wealth-destroying.'),

  // l8  Delayed Gratification
  fb('u1-3-l8', 1,
    'Delayed gratification means choosing a bigger ______ reward over a smaller one you could take right now.',
    ['future', 'random', 'guaranteed', 'partial'], 0,
    'Classic example: skip the $5 daily coffee ($1,825/year), invest it consistently, and build substantial long-term wealth.'),
  fb('u1-3-l8', 4,
    'Savings grow ______ over time — which is why starting early and waiting longer multiplies the impact of delay.',
    ['exponentially', 'linearly', 'slowly', 'randomly'], 0,
    'Compound interest means $1,000 saved at 20 grows far more than $1,000 saved at 30. Time is the key variable.'),
  fb('u1-3-l8', 5,
    'Putting a purchase on ______ is the opposite of delayed gratification — you enjoy it now and pay more later with interest.',
    ['credit', 'savings', 'cash', 'discount'], 0,
    'Debt shifts cost to the future AND adds interest charges. Saving first and buying outright always costs less total.'),

  // ══════════════════════════════════════════════════════════════
  // u1-4  Saving
  // ══════════════════════════════════════════════════════════════

  // l1  Why Save
  fb('u1-4-l1', 1,
    'Saving builds financial ______ — the ability to fund future goals and handle unexpected costs without going into debt.',
    ['security', 'debt', 'income', 'credit'], 0,
    'Without savings, any emergency (job loss, medical bill, car repair) can become a financial crisis requiring expensive debt.'),
  nl('u1-4-l1', 4,
    'Long-term savings goals are generally those taking more than ___ years to achieve. Pin that threshold.',
    1, 10, 1, 5, 1, 'number', [1, 2, 3, 5, 7, 10],
    'Short-term = under 1 year (vacation, phone). Medium-term = 1–5 years (car, down payment). Long-term = 5+ years (retirement, college fund).'),
  fb('u1-4-l1', 5,
    'Starting to save at 20 rather than 30 is better because more ______ allows compound interest to multiply your money longer.',
    ['time', 'willpower', 'income', 'accounts'], 0,
    'Time is the single most powerful variable in compounding. Starting 10 years earlier can more than double your final balance.'),

  // l2  Emergency Funds
  fb('u1-4-l2', 1,
    'Experts recommend an emergency fund covering ______ months of living expenses to handle most financial crises.',
    ['3–6', '1–2', '12', '18'], 0,
    '3–6 months handles job loss, medical emergencies, and major repairs. More than 6 months ties up money unnecessarily in low-yield accounts.'),
  sl('u1-4-l2', 4,
    'Monthly expenses: $2,000. Drag the slider to the size of a fully funded 3-month emergency fund.',
    0, 12000, 500, 6000, 0, 'dollar',
    '$2,000 × 3 months = $6,000. This covers three full months of living expenses if your income suddenly stops.'),
  fb('u1-4-l2', 5,
    'Keep your emergency fund in a ______ account, separate from daily spending, so it\'s there when you truly need it.',
    ['savings', 'checking', 'investment', 'retirement'], 0,
    'A separate savings account earns interest and creates a psychological barrier against spending it on non-emergencies.'),

  // l3  Savings Accounts
  nl('u1-4-l3', 1,
    'High-yield savings accounts at online banks currently offer around ___% APY. Pin that rate on the scale.',
    0, 10, 0.25, 4.5, 0.75, 'percent', [0, 1, 2, 3, 4.5, 7, 10],
    'Online bank HYSAs offer ~4–5% APY vs. 0.01% at big traditional banks — 400–500× more interest on the same deposit.'),
  sl('u1-4-l3', 4,
    'Deposit $5,000 in a savings account at 4% APY. Drag to the interest earned after 1 year.',
    0, 500, 10, 200, 0, 'dollar',
    '$5,000 × 0.04 = $200 in annual interest. The same balance at 0.01% APY (big bank) earns only 50 cents.'),
  fb('u1-4-l3', 5,
    'Savings accounts earn ______ interest than stocks, but your principal is FDIC-guaranteed and always accessible.',
    ['lower', 'higher', 'no', 'compounding'], 0,
    'Lower risk = lower return. The safety guarantee is the trade-off. Stocks grow more but can lose value right when you need cash.'),

  // l4  Simple Interest  (pos 0 = wordbank, kept)
  fb('u1-4-l4', 1,
    'In I = P × r × t, the "P" stands for ______ — the original amount deposited or borrowed.',
    ['principal', 'percent', 'payment', 'period'], 0,
    'Principal = starting amount. Rate (r) = annual interest rate as a decimal. Time (t) = years. The result I = interest earned.'),
  sl('u1-4-l4', 4,
    'Deposit $1,000 at 5% simple interest for 3 years. Drag to the total interest earned over those 3 years.',
    0, 300, 10, 150, 0, 'dollar',
    'I = $1,000 × 0.05 × 3 = $150. Simple interest is linear — the same $50 earned each year on the original principal.'),
  sl('u1-4-l4', 5,
    'A $500 loan at 8% simple interest for 2 years. Drag to the total interest cost of this loan.',
    0, 200, 5, 80, 0, 'dollar',
    'I = $500 × 0.08 × 2 = $80. You\'d repay $580 total. Understanding interest cost helps you evaluate whether borrowing is worth it.'),

  // l5  Compound Interest
  fb('u1-4-l5', 1,
    'Compound interest is earned on both the ______ and any previously earned interest — creating exponential growth.',
    ['principal', 'rate', 'time', 'balance only'], 0,
    'The magic: earned interest joins the principal, so next period you earn interest on a larger number. This accelerates over time.'),
  nl('u1-4-l5', 4,
    'Rule of 72: at 6% annual interest, your money doubles in approximately ___ years. Pin that number.',
    1, 20, 1, 12, 1, 'number', [1, 4, 8, 12, 16, 20],
    '72 ÷ 6 = 12 years to double. Rule of 72: divide 72 by the interest rate. At 9% → 8 years. At 12% → 6 years.'),
  sl('u1-4-l5', 5,
    '$1,000 invested at 10% compound interest annually. After exactly 2 years, drag to the total balance.',
    1000, 1500, 10, 1210, 0, 'dollar',
    'Year 1: $1,000 × 1.10 = $1,100. Year 2: $1,100 × 1.10 = $1,210. The extra $10 (vs simple interest) is the Year 1 interest earning interest.'),

  // l6  Savings Goals  (pos 0 = order, kept)
  fb('u1-4-l6', 1,
    'SMART savings goals are Specific, Measurable, Achievable, Relevant, and ______-bound — with a concrete deadline.',
    ['Time', 'Tax', 'Total', 'Trend'], 0,
    'Time-bound = you have a deadline. "Save money" is vague. "Save $600 for a camera by December" is a SMART goal.'),
  sl('u1-4-l6', 4,
    'You want $600 for a camera in 6 months. Drag to the monthly savings amount needed.',
    0, 200, 10, 100, 0, 'dollar',
    '$600 ÷ 6 months = $100/month. Breaking goals into monthly amounts converts wishes into actionable savings plans.'),
  fb('u1-4-l6', 5,
    'Long-term savings goals (10+ years) benefit most from stock market ______ funds that historically outpace inflation.',
    ['index', 'savings', 'checking', 'money market'], 0,
    'Index funds have returned ~7–10%/year historically — well above inflation. The long time horizon lets you ride out volatility.'),

  // l7  Pay Yourself First
  fb('u1-4-l7', 1,
    '"Pay yourself ______" means saving a set amount the moment your paycheck arrives — before any other spending.',
    ['first', 'last', 'extra', 'eventually'], 0,
    'Reversing the sequence changes everything: save first, live on the rest — instead of spending everything and saving nothing.'),
  sl('u1-4-l7', 4,
    'You earn $2,000/month and save 10% first. Drag to your monthly automatic savings amount.',
    0, 400, 10, 200, 0, 'dollar',
    '$2,000 × 10% = $200 saved automatically each month. The remaining $1,800 covers all living expenses.'),
  fb('u1-4-l7', 5,
    'Pre-tax 401(k) contributions that come out ______ you receive your paycheck are the ultimate "pay yourself first."',
    ['before', 'after', 'whenever', 'unless'], 0,
    'Pre-tax contributions never touch your checking account — invested automatically before you ever see or spend them.'),

  // l8  Inflation vs Savings
  fb('u1-4-l8', 1,
    '"Real return" means your investment return ______ the inflation rate — showing your actual change in purchasing power.',
    ['minus', 'plus', 'times', 'divided by'], 0,
    '7% return − 3% inflation = 4% real growth. If your return is below inflation, your money buys less even as the number grows.'),
  nl('u1-4-l8', 4,
    'Your savings earn 1% APY but inflation is 4%. Pin your approximate real annual return on the scale (can be negative).',
    -5, 10, 0.5, -3, 0.5, 'percent', [-5, -3, 0, 3, 6, 10],
    'Real return = 1% − 4% = −3%. Even while "earning" interest, your money buys about 3% less each year in real terms.'),
  sl('u1-4-l8', 5,
    'Jeans cost $50 today. At 3% annual inflation, drag to approximately what they\'ll cost in 5 years.',
    45, 75, 1, 58, 2, 'dollar',
    '$50 × (1.03)^5 ≈ $57.96. Small annual inflation compounds into meaningful price increases over 5–10 years.'),

  // ══════════════════════════════════════════════════════════════
  // u2-1  Banks & Accounts
  // ══════════════════════════════════════════════════════════════

  // l1  Checking Accounts
  fb('u2-1-l1', 1,
    'A checking account is designed for ______ daily transactions like bill pay, debit purchases, and direct deposit.',
    ['frequent', 'rare', 'investment', 'savings'], 0,
    'Checking = high-activity hub. Your money flows in (paycheck) and out (bills, purchases) constantly. Not for long-term savings.'),
  fb('u2-1-l1', 4,
    'Overdraft protection covers transactions when your balance is ______, but typically charges a fee of $25–35 per occurrence.',
    ['too low', 'too high', 'earning interest', 'disputed'], 0,
    'Overdraft lets a transaction proceed even without sufficient funds. Convenient in emergencies, but fees add up fast.'),
  fb('u2-1-l1', 5,
    'Monthly checking fees are often ______ if you maintain a minimum balance or have direct deposit set up.',
    ['waived', 'doubled', 'hidden', 'mandatory'], 0,
    'Banks waive fees to attract customers who use the account actively as their primary financial hub.'),

  // l2  Savings Accounts at Banks
  nl('u2-1-l2', 1,
    'Traditional big-bank savings accounts typically offer only ___% APY. Pin that rate on the scale.',
    0, 5, 0.25, 0.05, 0.05, 'percent', [0, 0.05, 1, 2, 3, 4, 5],
    'Big banks like Chase or Bank of America pay ~0.01–0.05% APY on savings. Online banks pay 4–5%. That gap is 400–500× more interest.'),
  sl('u2-1-l2', 4,
    '$5,000 in a savings account at 4% APY for 1 year. Drag to the interest earned.',
    0, 500, 10, 200, 0, 'dollar',
    '$5,000 × 0.04 = $200. The same balance at a big bank\'s 0.01% APY earns only $0.50 — 400× less interest.'),
  fb('u2-1-l2', 5,
    'FDIC insurance protects bank ______ up to $250,000 per depositor per insured institution.',
    ['deposits', 'stocks', 'mutual funds', 'loans'], 0,
    'FDIC covers deposits only — checking, savings, money market, CDs. Stocks and mutual funds held at a bank are NOT covered.'),

  // l3  Credit Unions  (pos 0 = sort, kept)
  fb('u2-1-l3', 1,
    'Credit unions are ______ cooperatives owned by their members, not by outside investors seeking profit.',
    ['non-profit', 'for-profit', 'government-run', 'publicly traded'], 0,
    'Without a profit motive, credit unions return value to members as better loan rates, higher savings rates, and lower fees.'),
  fb('u2-1-l3', 4,
    'Credit union deposits are insured by the ______, with the same $250,000 per depositor protection as the FDIC.',
    ['NCUA', 'FDIC', 'SEC', 'Federal Reserve'], 0,
    'NCUA = National Credit Union Administration. Same $250K protection level as FDIC, just administered separately.'),
  fb('u2-1-l3', 5,
    'A disadvantage of credit unions is fewer ______ and ATMs than large national banks.',
    ['branches', 'products', 'members', 'loan types'], 0,
    'Credit unions\' smaller footprint is the main trade-off for better rates. Many join ATM networks to partially offset this.'),

  // l4  Online Banks
  fb('u2-1-l4', 1,
    'Online banks offer higher savings rates than traditional banks because they have no physical ______ to maintain.',
    ['branches', 'website', 'accounts', 'employees'], 0,
    'No rent, no tellers, no branch upkeep. Online banks pass those overhead savings to customers as higher interest rates.'),
  fb('u2-1-l4', 4,
    'A disadvantage of online banks is no physical ______ for cash deposits or complex in-person financial needs.',
    ['locations', 'website', 'accounts', 'transfers'], 0,
    'If you frequently deposit cash or want face-to-face service, an online-only bank creates real inconvenience.'),
  fb('u2-1-l4', 5,
    'For maximum interest on your emergency fund with minimal risk, consider a high-yield ______ account at an FDIC-insured online bank.',
    ['savings', 'checking', 'investment', 'brokerage'], 0,
    'Online bank HYSAs currently offer ~4–5% APY with full FDIC protection — ideal emergency fund storage.'),

  // l5  How Banks Make Money
  nl('u2-1-l5', 1,
    'A bank pays 2% on savings and charges 7% on car loans. Drag the pin to the bank\'s profit spread (%).',
    0, 15, 0.5, 5, 0.5, 'percent', [0, 2, 5, 7, 10, 15],
    '7% − 2% = 5% spread. Applied to billions of dollars in loans and deposits, this 5% generates enormous profit.'),
  sl('u2-1-l5', 4,
    'A bank lends out $1,000 at 7% and pays depositors 2%. Drag to the bank\'s annual profit on that $1,000.',
    0, 100, 5, 50, 0, 'dollar',
    '$1,000 × (7% − 2%) = $1,000 × 5% = $50 profit per $1,000. Multiply by billions in deposits and the profit is massive.'),
  fb('u2-1-l5', 5,
    'Under ______ reserve banking, banks keep only a fraction of deposits as reserves and lend the rest out to borrowers.',
    ['fractional', 'full', 'digital', 'federal'], 0,
    'Your $1,000 deposit becomes a $900 loan to someone else. Banks legally "create" purchasing power through this system.'),

  // l6  FDIC Insurance  (pos 0 = wordbank, kept)
  fb('u2-1-l6', 1,
    'FDIC stands for ______ Deposit Insurance Corporation — created in 1933 after the Great Depression bank failures.',
    ['Federal', 'Financial', 'Fiscal', 'Fixed'], 0,
    '9,000+ banks failed between 1930–1933, wiping out savings. FDIC was created by the Banking Act of 1933 to prevent this again.'),
  nl('u2-1-l6', 4,
    'FDIC insures up to $___K per depositor per insured bank. Pin the coverage limit (in thousands of dollars).',
    0, 500, 25, 250, 25, 'dollar_k', [0, 100, 250, 400, 500],
    'FDIC covers $250,000 per depositor per insured institution. Joint accounts and retirement accounts get separate coverage limits.'),
  sl('u2-1-l6', 5,
    'You have $300,000 at one bank. FDIC covers $250,000. Drag to the amount that is NOT insured.',
    0, 100000, 5000, 50000, 0, 'dollar',
    '$300,000 − $250,000 FDIC limit = $50,000 uninsured. Spread large deposits across multiple banks to stay fully covered.'),

  // l7  Reading Bank Statements  (pos 0 = order, kept)
  fb('u2-1-l7', 1,
    'The ______ balance is your account total at the end of a statement period — it becomes the opening balance for next month.',
    ['closing', 'opening', 'minimum', 'available'], 0,
    'Statement math: opening balance + deposits − withdrawals and fees = closing balance. Review this every single month.'),
  fb('u2-1-l7', 4,
    'If you see an unfamiliar charge on your statement, contact your ______ immediately to investigate or dispute it.',
    ['bank', 'employer', 'credit bureau', 'landlord'], 0,
    'Most banks allow 60 days to dispute unauthorized charges. Acting fast maximizes your chance of full recovery.'),
  fb('u2-1-l7', 5,
    'A "debit" entry on a bank statement means money ______ your account; a "credit" means money ______ it.',
    ['left / entered', 'entered / left', 'doubled / halved', 'earned / spent'], 0,
    'Accounting: debit = outflow, credit = inflow. This is opposite to the colloquial "debit card" meaning in everyday speech.'),

  // l8  Mobile Banking
  fb('u2-1-l8', 1,
    'The most important mobile banking security practice is enabling ______-factor authentication on your banking app.',
    ['two', 'single', 'zero', 'three'], 0,
    '2FA means a hacker needs both your password AND physical access to your phone — dramatically harder to breach.'),
  fb('u2-1-l8', 4,
    'Mobile check deposit works by ______ a photo of the check — the app sends it electronically without mailing anything.',
    ['taking', 'emailing', 'uploading', 'scanning'], 0,
    'Remote check deposit (RDC) lets you deposit checks instantly from anywhere by photographing both sides.'),
  fb('u2-1-l8', 5,
    'Avoid banking over ______ Wi-Fi — use your cellular data or a VPN to protect sensitive financial data.',
    ['public', 'home', 'secure', 'fast'], 0,
    '"Man in the middle" attacks on public Wi-Fi can intercept unencrypted data. Use cellular data for financial transactions.'),

  // ══════════════════════════════════════════════════════════════
  // u2-2  Payments
  // ══════════════════════════════════════════════════════════════

  // l1  Debit Cards
  fb('u2-2-l1', 1,
    'A debit card draws money ______ from your checking account — you can only spend what you actually have.',
    ['directly', 'slowly', 'monthly', 'indirectly'], 0,
    'Debit = immediate subtraction from your checking balance. No credit, no debt — just your own money leaving your account.'),
  fb('u2-2-l1', 4,
    'A ______ (Personal Identification Number) proves your identity at point of sale for debit card purchases.',
    ['PIN', 'CVV', 'ACH', 'NFC'], 0,
    'Never share your PIN or write it on your card. It\'s the key that unlocks access to your entire checking account balance.'),
  fb('u2-2-l1', 5,
    'Debit card fraud is riskier than credit card fraud because stolen funds leave your real ______ immediately.',
    ['account', 'credit limit', 'overdraft', 'savings'], 0,
    'Credit card fraud: no money lost during investigation. Debit fraud: your cash is gone while you wait for resolution.'),

  // l2  Credit Cards as Payment
  nl('u2-2-l2', 1,
    'The average US credit card APR is approximately ___%. Pin approximately where it falls on the scale.',
    5, 30, 1, 22, 3, 'percent', [5, 10, 15, 22, 25, 30],
    'The average US credit card APR is ~22–24%. At this rate, a $1,000 unpaid balance costs ~$220 in interest per year.'),
  sl('u2-2-l2', 4,
    'A $500 credit card balance carried for 1 year at 22% APR. Drag to the approximate interest cost.',
    0, 200, 5, 110, 5, 'dollar',
    '$500 × 0.22 = $110 in interest per year. This is why carrying a balance is so expensive — pay in full every month.'),
  fb('u2-2-l2', 5,
    'To avoid credit card interest, pay the full ______ balance by the due date — not just the minimum payment.',
    ['statement', 'minimum', 'partial', 'daily'], 0,
    'Pay in full = zero interest charged. Paying even $1 less than the full balance can trigger interest on the entire amount.'),

  // l3  Cash & Checks
  fb('u2-2-l3', 1,
    'Cash naturally limits spending because you literally cannot spend more than you currently ______.',
    ['have', 'earn', 'save', 'owe'], 0,
    'This physical limit is why "cash envelope" budgeting works — the envelope emptying signals you\'ve hit your limit.'),
  fb('u2-2-l3', 4,
    'A "bounced check" means the writer had insufficient funds (NSF) — the bank ______ the payment and charges a fee.',
    ['rejects', 'approves', 'delays', 'holds'], 0,
    'NSF fees can hit both the writer and the recipient. The bank declines the transaction and charges $25–35+ per bounce.'),
  fb('u2-2-l3', 5,
    'Cash is least effective for ______ purchases, which require a card or digital payment method.',
    ['online', 'in-person', 'small', 'tipping'], 0,
    'You can\'t mail dollar bills to an online retailer. Digital commerce requires digital payments.'),

  // l4  Wire Transfers & ACH
  fb('u2-2-l4', 1,
    'ACH is used for ______ deposits and automatic bill payments — processing billions of transactions between US banks daily.',
    ['direct', 'wire', 'crypto', 'cash'], 0,
    'ACH = Automated Clearing House. Your paycheck, utility autopay, and recurring transfers all likely run through ACH.'),
  nl('u2-2-l4', 4,
    'Domestic wire transfers typically cost $___–$50 per transfer. Pin the approximate low end of this range.',
    0, 100, 5, 15, 10, 'dollar', [0, 15, 25, 50, 75, 100],
    'Wire fees range $15–50 domestic, $25–65+ international. Worth paying for large, same-day transactions like home closings.'),
  fb('u2-2-l4', 5,
    'Wire transfers are nearly ______ to reverse once sent — a key reason wire fraud victims rarely recover their money.',
    ['impossible', 'easy', 'automatic', 'fast'], 0,
    'Wires settle immediately and finally. Once received, funds can be withdrawn instantly. This finality is also why wire fraud is so devastating.'),

  // l5  P2P Apps (Venmo, Zelle, Cash App)
  fb('u2-2-l5', 1,
    'Zelle transfers go ______ bank-to-bank instantly — unlike Venmo, which holds funds in an in-app balance.',
    ['directly', 'slowly', 'via PayPal', 'through Venmo'], 0,
    'Zelle is integrated into most US bank apps and uses existing bank-to-bank ACH rails. No app wallet — money moves directly.'),
  fb('u2-2-l5', 4,
    'The biggest risk with P2P apps is accidentally sending money to the ______ person — recoveries are difficult.',
    ['wrong', 'right', 'verified', 'saved'], 0,
    'One typo in a username or phone number sends money to a stranger. Always triple-check recipient info before confirming.'),
  fb('u2-2-l5', 5,
    'Keep your P2P app balance ______ — transfer funds to your bank, since app balances have weaker protections than FDIC deposits.',
    ['minimal', 'maximized', 'invested', 'interest-earning'], 0,
    'App balances exist in a regulatory grey area with fewer protections than insured bank deposits. Don\'t park money there.'),

  // l6  Apple Pay & Contactless
  fb('u2-2-l6', 1,
    'Contactless payments use ______ (Near Field Communication) — a tap within a few centimeters triggers the payment.',
    ['NFC', 'QR code', 'Bluetooth', 'Wi-Fi'], 0,
    'NFC works over very short distances, making it fast and inherently secure at point of sale.'),
  fb('u2-2-l6', 4,
    'Apple Pay and Google Pay are more secure than card swipes because they use a unique ______ per transaction — not your real card number.',
    ['token', 'PIN', 'password', 'fingerprint'], 0,
    'Tokenization: merchants receive a one-time code, not your real card number. Even if hacked, your card is not compromised.'),
  fb('u2-2-l6', 5,
    'If your phone with Apple Pay is stolen, you can disable all payments ______ using Find My or your Apple ID.',
    ['remotely', 'in person', 'by calling the bank', 'by canceling your card'], 0,
    'Remote lock or erase via Apple ID or Google Account disables all payment methods immediately — no branch visit required.'),

  // l7  Direct Deposit
  fb('u2-2-l7', 1,
    'To set up direct deposit, you give your employer your bank\'s ______ number and account number.',
    ['routing', 'Social Security', 'credit card', 'PIN'], 0,
    'Routing number = 9-digit code identifying your bank. Account number = your specific account. Both needed for ACH transfers.'),
  nl('u2-2-l7', 4,
    'A US bank routing number is exactly ___ digits long. Pin that number on the scale.',
    1, 15, 1, 9, 0, 'number', [1, 3, 6, 9, 12, 15],
    'Every US bank has a unique 9-digit ABA routing number. You can find yours at the bottom-left of a personal check.'),
  fb('u2-2-l7', 5,
    'Many banks ______ monthly fees when you set up direct deposit, making it a win for both you and the bank.',
    ['waive', 'increase', 'double', 'charge'], 0,
    'Banks value direct deposit customers — they use accounts actively, maintain higher balances, and rarely switch banks.'),

  // l8  Choosing the Right Payment Method
  fb('u2-2-l8', 1,
    'For unknown online sellers, a ______ card offers the best protection through chargebacks if goods never arrive.',
    ['credit', 'debit', 'prepaid', 'gift'], 0,
    'Credit card chargebacks = dispute charges and get refunded for non-delivered goods. Wire/Zelle/cash offer zero such protection.'),
  fb('u2-2-l8', 4,
    'For large, time-sensitive transfers like a home down payment, use a ______ for same-day finality.',
    ['wire transfer', 'Venmo', 'personal check', 'ACH'], 0,
    'Wire transfers are the standard for large, urgent payments. The $25–50 fee is worth the certainty for a $50,000+ transaction.'),
  fb('u2-2-l8', 5,
    'Credit cards offer the most consumer protections — federal law limits your fraud ______ to $50, often $0 in practice.',
    ['liability', 'spending', 'interest', 'rewards'], 0,
    'The Fair Credit Billing Act caps credit card fraud liability at $50. Most issuers go further with $0 liability guarantees.'),
]

// ─── Seed ────────────────────────────────────────────────────────────────────

const LESSON_IDS = [
  'u1-1-l1','u1-1-l2','u1-1-l3','u1-1-l4','u1-1-l5','u1-1-l6','u1-1-l7','u1-1-l8',
  'u1-2-l1','u1-2-l2','u1-2-l3','u1-2-l4','u1-2-l5','u1-2-l6','u1-2-l7','u1-2-l8',
  'u1-3-l1','u1-3-l2','u1-3-l3','u1-3-l4','u1-3-l5','u1-3-l6','u1-3-l7','u1-3-l8',
  'u1-4-l1','u1-4-l2','u1-4-l3','u1-4-l4','u1-4-l5','u1-4-l6','u1-4-l7','u1-4-l8',
  'u2-1-l1','u2-1-l2','u2-1-l3','u2-1-l4','u2-1-l5','u2-1-l6','u2-1-l7','u2-1-l8',
  'u2-2-l1','u2-2-l2','u2-2-l3','u2-2-l4','u2-2-l5','u2-2-l6','u2-2-l7','u2-2-l8',
]

console.log(`Patching ${patches.length} questions (positions 1, 4, 5) across ${LESSON_IDS.length} lessons...`)

// Verify counts — each lesson must get exactly 3 patches
const counts = {}
for (const p of patches) {
  counts[p.lesson_id] = (counts[p.lesson_id] ?? 0) + 1
}
const bad = LESSON_IDS.filter(id => counts[id] !== 3)
if (bad.length) {
  console.error(`Lesson patch count error for: ${bad.map(id => `${id}(${counts[id] ?? 0})`).join(', ')}`)
  process.exit(1)
}
console.log('✓ All 48 lessons have exactly 3 patches')

// Delete positions 1, 4, 5 for all lesson IDs
const { error: delError } = await supabase
  .from('questions')
  .delete()
  .in('lesson_id', LESSON_IDS)
  .in('position', [1, 4, 5])

if (delError) { console.error('Delete failed:', delError); process.exit(1) }
console.log(`✓ Deleted positions 1, 4, 5 from ${LESSON_IDS.length} lessons`)

// Insert in batches of 50
const BATCH = 50
for (let i = 0; i < patches.length; i += BATCH) {
  const batch = patches.slice(i, i + BATCH)
  const { error } = await supabase.from('questions').insert(batch)
  if (error) { console.error(`Insert failed at batch ${i}:`, error); process.exit(1) }
  console.log(`✓ Inserted ${Math.min(i + BATCH, patches.length)} / ${patches.length}`)
}

console.log(`\n✅ Done! Each of the ${LESSON_IDS.length} lessons now has 2 special interactive questions + 1 fill-blank.`)
