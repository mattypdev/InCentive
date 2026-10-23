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

// ─── Question builders ───────────────────────────────────────────────────────

const unitOf = lessonId => lessonId.replace(/-l\d+$/, '')

const mc = (lessonId, pos, prompt, options, correct, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'multiple-choice', position: pos, prompt, options, correct, explanation, meta: null })

const sort = (lessonId, pos, prompt, buckets, items, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'sort', position: pos, prompt, options: [], correct: 0, explanation, meta: { buckets, items } })

const order = (lessonId, pos, prompt, items, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'order', position: pos, prompt, options: [], correct: 0, explanation, meta: { items } })

const wb = (lessonId, pos, prompt, bank, answers, explanation) =>
  ({ lesson_id: lessonId, unit_id: unitOf(lessonId), type: 'wordbank', position: pos, prompt, options: [], correct: 0, explanation, meta: { bank, answers } })

// ─── Questions ───────────────────────────────────────────────────────────────

const questions = [

  // ── u1-1: What is Money? ─────────────────────────────────────────────────

  // l1: History of Money
  order('u1-1-l1', 0,
    'Put the evolution of money in chronological order — earliest first.',
    ['Barter: people traded goods directly', 'Commodity money: gold, salt, and shells', 'Metal coins: stamped by rulers', 'Paper money: government-backed notes', 'Digital money: electronic transfers'],
    'Money evolved from barter → commodity → coins → paper → digital. Each step made trade easier and more scalable.'
  ),
  mc('u1-1-l1', 1, 'What is the main problem with a barter economy?',
    ['Both parties must want exactly what the other is offering', 'There are no agreed-upon prices for any goods', 'Goods are too heavy and bulky to transport', 'Governments cannot regulate or tax any trades'],
    0, 'In barter, you can only trade if you find someone who has what you want AND wants what you have. Money solves this.'
  ),
  mc('u1-1-l1', 2, 'Which of these is an example of commodity money?',
    ['Gold coins', 'A $20 bill', 'A debit card', 'Bitcoin'],
    0, 'Commodity money has intrinsic value — gold is useful even if it\'s not used as currency.'
  ),
  mc('u1-1-l1', 3, 'Which came first historically?',
    ['Barter systems', 'Paper money', 'Credit cards', 'Cryptocurrency'],
    0, 'Barter — trading goods directly — predates all other forms of money.'
  ),
  mc('u1-1-l1', 4, 'What backed the US dollar before 1971?',
    ['Gold (the gold standard)', 'Silver', 'Government debt', 'Nothing — it was always fiat'],
    0, 'The US left the gold standard in 1971. Before that, dollars could be exchanged for gold.'
  ),
  mc('u1-1-l1', 5, 'Digital money is different from paper money because it:',
    ['Exists only as electronic records and numbers', 'Has greater purchasing power than paper notes', 'Is not controlled or backed by any government', 'Can only be used for purchases made online'],
    0, 'Digital money (bank balances, transfers) is just numbers in a computer system.'
  ),

  // l2: Barter System
  mc('u1-1-l2', 0, 'A farmer has wheat but wants shoes. The shoemaker has shoes but wants fish. Neither can trade directly. This is called:',
    ['The double coincidence of wants problem', 'Supply and demand', 'Inflation', 'Liquidity trap'],
    0, 'Barter only works when both parties want exactly what the other has. Money eliminates this constraint.'
  ),
  mc('u1-1-l2', 1, 'Which of these is NOT a problem with barter?',
    ['Goods can be portable', 'Hard to make change (divisibility)', 'Perishable goods lose value quickly', 'Need to find exact match of wants'],
    0, 'Portability is actually a barter advantage for light goods. The real problems are indivisibility, perishability, and coincidence of wants.'
  ),
  mc('u1-1-l2', 2, 'A student offers tutoring in exchange for gym access. This is:',
    ['Barter', 'Commission', 'Passive income', 'A trade deficit'],
    0, 'Directly exchanging goods or services without money is barter.'
  ),
  mc('u1-1-l2', 3, 'Why is barter impractical in a modern economy?',
    ['Too many goods and services exist to find perfect matches', 'People don\'t have skills to offer', 'Governments ban it', 'It requires too much math'],
    0, 'A modern economy has millions of products. Finding someone who wants exactly what you offer and has exactly what you need is nearly impossible at scale.'
  ),
  mc('u1-1-l2', 4, 'What single property of money most directly solves the barter problem?',
    ['It acts as a medium of exchange everyone accepts', 'It earns interest', 'It\'s made of valuable metal', 'It\'s printed by the government'],
    0, 'Money is universally accepted, so you never need to find a perfect barter match.'
  ),
  mc('u1-1-l2', 5, 'In barter, how would you "save" for the future?',
    ['Store durable goods like grain or gold', 'Open a savings account', 'Buy bonds', 'Invest in stocks'],
    0, 'Without money, you\'d stockpile physical goods — which can spoil, get stolen, or be hard to transport.'
  ),

  // l3: Why Money Has Value
  mc('u1-1-l3', 0, 'Why does the US dollar have value today?',
    ['People trust and accept it as payment, backed by the US government', 'It\'s made of valuable metal', 'It can be exchanged for gold at any time', 'Its supply is limited like Bitcoin'],
    0, 'The dollar is fiat money — its value comes from collective trust and government backing, not a physical commodity.'
  ),
  mc('u1-1-l3', 1, 'Using money to buy a pizza demonstrates money as a:',
    ['Medium of exchange', 'Store of value', 'Unit of account', 'Investment vehicle'],
    0, 'Medium of exchange = using money to buy things. This is money\'s most fundamental role.'
  ),
  mc('u1-1-l3', 2, 'A price tag of $4.99 on a candy bar uses money as a:',
    ['Unit of account', 'Medium of exchange', 'Store of value', 'Commodity'],
    0, 'Unit of account = money as a standard measure of value, letting us compare prices.'
  ),
  mc('u1-1-l3', 3, 'Keeping $500 in a savings account uses money as a:',
    ['Store of value', 'Unit of account', 'Medium of exchange', 'Form of barter'],
    0, 'Store of value = money preserving purchasing power over time.'
  ),
  mc('u1-1-l3', 4, 'What would happen if everyone suddenly stopped trusting the US dollar?',
    ['Its value would collapse and no one would accept it', 'Its value would rise sharply overnight', 'The government would back it with gold reserves', 'Banks would quickly create a replacement currency'],
    0, 'Fiat currency only has value because of collective trust. Without trust, it\'s worthless paper.'
  ),
  mc('u1-1-l3', 5, 'Ancient societies used shells as money because shells were:',
    ['Rare enough, portable, and accepted by many traders', 'Crafted from valuable metals and minerals', 'Endorsed by a government as official currency', 'Found in unlimited supply near coastlines'],
    0, 'Good money must be scarce (not too easy to find), portable, and accepted by others.'
  ),

  // l4: Fiat Currency
  mc('u1-1-l4', 0, '"Fiat" comes from Latin meaning:',
    ['"Let it be done," implying value by decree', '"Forged from precious metal"', '"Backed by silver reserves"', '"Exchanged across digital networks"'],
    0, 'Fiat currency gets its value from the government declaring it legal tender — not from any physical backing.'
  ),
  mc('u1-1-l4', 1, 'What backs a fiat currency?',
    ['Government authority and public trust', 'Gold reserves', 'Silver coins', 'Foreign currency'],
    0, 'Unlike commodity-backed money, fiat money\'s value rests entirely on trust in the issuing government.'
  ),
  mc('u1-1-l4', 2, 'The main risk of governments printing too much fiat money is:',
    ['Inflation, as more money chases the same goods', 'Deflation, as prices fall across the economy', 'The currency converts back to commodity money', 'Interest rates automatically drop close to zero'],
    0, 'Excess money supply causes inflation. Zimbabwe\'s 2008 hyperinflation is a famous example.'
  ),
  mc('u1-1-l4', 3, 'Which of these is a fiat currency?',
    ['The Euro', 'Gold', 'Bitcoin', 'Seashells'],
    0, 'The Euro (and USD, GBP, JPY etc.) are all fiat — value by government decree, no commodity backing.'
  ),
  mc('u1-1-l4', 4, 'Fiat money differs from commodity money because:',
    ['Its value comes from trust, not the material it\'s made of', 'It\'s always worth more', 'It can\'t be counterfeited', 'It earns interest automatically'],
    0, 'A dollar bill\'s paper and ink are nearly worthless physically — the value is purely social/institutional.'
  ),
  mc('u1-1-l4', 5, 'Which country experienced hyperinflation so severe that prices doubled every few hours in 2008?',
    ['Zimbabwe', 'USA', 'Japan', 'Canada'],
    0, 'Zimbabwe\'s government printed money uncontrollably, causing hyperinflation. Prices rose billions of percent in months.'
  ),

  // l5: Commodity Money
  sort('u1-1-l5', 0, 'Sort each item into the correct money type.',
    ['Commodity Money', 'Fiat Money'],
    [
      { text: 'Gold coins', bucket: 0 },
      { text: 'US Dollar bill', bucket: 1 },
      { text: 'Salt (ancient Rome)', bucket: 0 },
      { text: 'British Pound', bucket: 1 },
      { text: 'Silver bar', bucket: 0 },
      { text: 'Japanese Yen', bucket: 1 },
    ],
    'Commodity money has intrinsic value (gold, salt, silver). Fiat money has value only because governments declare it legal tender.'
  ),
  mc('u1-1-l5', 1, 'What makes something "commodity money"?',
    ['It has intrinsic value — useful even if not used as currency', 'It\'s issued by a government', 'It\'s digital', 'It earns interest'],
    0, 'Gold is valuable for jewelry and electronics. Salt was valuable for preserving food. That underlying usefulness made them work as money.'
  ),
  mc('u1-1-l5', 2, 'Why did gold work so well as commodity money?',
    ['It is durable, scarce, divisible, and portable', 'It is simple to find in any region or climate', 'It is officially endorsed and regulated by states', 'It gains value on its own without any effort'],
    0, 'Good commodity money must resist decay, be rare enough to be valuable, divide easily, and be practical to carry.'
  ),
  mc('u1-1-l5', 3, 'The word "salary" comes from "sal," the Latin word for:',
    ['Salt', 'Silver', 'Gold', 'Sun'],
    0, 'Roman soldiers were sometimes paid in salt — a valuable commodity at the time. Hence "salary."'
  ),
  mc('u1-1-l5', 4, 'The US officially ended the gold standard in:',
    ['1971', '1929', '1945', '1999'],
    0, 'President Nixon ended dollar-gold convertibility in 1971, fully transitioning the US to fiat currency.'
  ),
  mc('u1-1-l5', 5, 'A disadvantage of commodity money compared to fiat money is:',
    ['Limited supply can restrict economic growth', 'It has no real value', 'Governments can\'t control it', 'It\'s harder to trust'],
    0, 'If an economy grows but the gold supply doesn\'t, there\'s not enough money to facilitate all transactions.'
  ),

  // l6: Digital Money
  mc('u1-1-l6', 0, 'When you pay with a debit card, what actually moves?',
    ['Electronic records transfer between bank databases', 'Physical cash moves through wires', 'Gold is exchanged between banks', 'Nothing — you pay later'],
    0, 'Digital money exists only as numbers in computer systems. No physical money actually moves.'
  ),
  mc('u1-1-l6', 1, 'Approximately what percentage of money in circulation today is digital (not physical cash)?',
    ['About 90–95%', 'About 50%', 'About 10%', 'About 70%'],
    0, 'Most money in modern economies exists only digitally — as bank balances and electronic records.'
  ),
  mc('u1-1-l6', 2, 'Which of these is an example of digital money?',
    ['Your bank account balance', 'A $100 bill', 'A gold bar', 'A check you haven\'t cashed'],
    0, 'Your account balance is just a number in a database — digital money with no physical form.'
  ),
  mc('u1-1-l6', 3, 'What is the main advantage of digital money over cash?',
    ['Can be sent instantly across the world', 'Can\'t be hacked', 'Earns more interest', 'Is backed by gold'],
    0, 'Digital transfers can move funds globally in seconds — far faster than any physical currency.'
  ),
  mc('u1-1-l6', 4, 'A potential risk of digital money is:',
    ['Cyber fraud and hacking', 'Inflation', 'Running out of physical supply', 'Too slow for daily use'],
    0, 'Digital money creates cyber security risks — account hacking, phishing, and fraud are real concerns.'
  ),
  mc('u1-1-l6', 5, 'Which technology allows banks to settle digital payments with each other overnight?',
    ['ACH — Automated Clearing House', 'Blockchain', 'FDIC network', 'Federal Reserve printing press'],
    0, 'The ACH network processes billions of electronic payments (direct deposits, bill payments) between US banks.'
  ),

  // l7: Cryptocurrency Basics
  mc('u1-1-l7', 0, 'What technology powers most cryptocurrencies like Bitcoin?',
    ['A distributed public ledger called blockchain', 'The standard internet banking network', 'Federal Reserve computer servers', 'Gold held in national reserve vaults'],
    0, 'Blockchain is a chain of transaction records maintained by thousands of computers simultaneously, with no central authority.'
  ),
  mc('u1-1-l7', 1, 'Bitcoin is best described as:',
    ['A peer-to-peer currency with no central authority', 'A government-backed digital version of the dollar', 'A type of prepaid digital credit card', 'A managed fund investing in tech companies'],
    0, 'Bitcoin operates on a peer-to-peer network with no central bank or government controlling it.'
  ),
  mc('u1-1-l7', 2, 'What does "mining" mean in the context of Bitcoin?',
    ['Using computers to verify transactions and earn new Bitcoin as a reward', 'Physically extracting Bitcoin from the ground', 'Buying Bitcoin at low prices', 'Printing Bitcoin'],
    0, 'Miners run powerful computers that verify and record transactions. As a reward, they earn newly created Bitcoin.'
  ),
  mc('u1-1-l7', 3, 'Cryptocurrency is most controversial as a "store of value" because:',
    ['Its price swings dramatically over very short periods', 'Most governments have banned or restricted its use', 'Central banks can issue unlimited amounts of it', 'You need a physical device to hold your coins'],
    0, 'Bitcoin dropped over 70% in 2022. Something that volatile is a risky store of value compared to gold or savings accounts.'
  ),
  mc('u1-1-l7', 4, 'Which of the three functions of money does cryptocurrency struggle with most?',
    ['Store of value, due to extreme price volatility', 'Medium of exchange for everyday transactions', 'Unit of account for measuring prices clearly', 'All three functions fail at the same rate'],
    0, 'Wild price swings make crypto a poor store of value. Imagine your grocery bill tripling in a week because crypto crashed.'
  ),
  mc('u1-1-l7', 5, 'What does "decentralised" mean for a cryptocurrency?',
    ['No single bank, company, or government controls it', 'It\'s available everywhere', 'It\'s linked to the dollar', 'It\'s regulated by the SEC'],
    0, 'Decentralised = run by a distributed network of users, not a central authority like a bank or government.'
  ),

  // l8: Inflation Introduction
  mc('u1-1-l8', 0, 'Inflation means:',
    ['Prices rise overall, reducing your purchasing power', 'The economy is experiencing strong growth', 'Interest rates are trending downward nationally', 'The government is reducing its money supply'],
    0, 'Inflation erodes purchasing power. A 5% inflation rate means $100 today buys only $95 worth of goods next year.'
  ),
  mc('u1-1-l8', 1, 'If inflation is 5% and a coffee costs $3.00 today, what will it likely cost next year?',
    ['$3.15', '$3.50', '$2.85', '$3.00 — prices don\'t change that fast'],
    0, '$3.00 × 1.05 = $3.15. Small percentages compound into significant price changes over time.'
  ),
  mc('u1-1-l8', 2, 'The US Federal Reserve\'s target inflation rate is approximately:',
    ['2% per year', '0% — no inflation', '5% per year', '10% per year'],
    0, 'The Fed aims for ~2% inflation — enough to keep the economy growing without eroding purchasing power too fast.'
  ),
  mc('u1-1-l8', 3, 'Who is MOST hurt by unexpected inflation?',
    ['A retiree living on a fixed pension', 'Someone with a variable-rate mortgage', 'A company that borrows money', 'A stock market investor'],
    0, 'Fixed incomes don\'t rise with inflation. A retiree\'s $2,000/month pension buys progressively less each year.'
  ),
  mc('u1-1-l8', 4, 'Your savings account earns 1% interest, but inflation is 3%. Your money\'s real purchasing power:',
    ['Decreases by about 2% per year', 'Increases by 4%', 'Stays the same', 'Increases by 1%'],
    0, 'Real return = nominal return − inflation = 1% − 3% = −2%. You\'re losing ground even while earning interest.'
  ),
  mc('u1-1-l8', 5, 'What typically causes inflation?',
    ['Too much money chasing too few goods', 'Banks earning too much profit', 'People saving too much', 'Interest rates rising'],
    0, 'When money supply grows faster than goods/services, prices rise. This is why central banks carefully manage money supply.'
  ),

  // ── u1-2: Income ─────────────────────────────────────────────────────────

  // l1: What Income Is
  sort('u1-2-l1', 0, 'Sort each income source into the correct category.',
    ['Active Income', 'Passive Income'],
    [
      { text: 'Hourly wages from a job', bucket: 0 },
      { text: 'Rental income from a property', bucket: 1 },
      { text: 'Freelance project payment', bucket: 0 },
      { text: 'Stock dividends', bucket: 1 },
      { text: 'Tips from customers', bucket: 0 },
      { text: 'Royalties from a book', bucket: 1 },
    ],
    'Active income requires your time and effort. Passive income flows in without ongoing work — though it usually takes upfront effort to set up.'
  ),
  mc('u1-2-l1', 1, 'Income is best defined as:',
    ['Money received from work, investments, or other sources', 'Money you borrow from a bank', 'Money saved in an account', 'Money spent on expenses'],
    0, 'Income = money flowing in. It can come from a job, side hustle, investments, or even gifts in some contexts.'
  ),
  mc('u1-2-l1', 2, 'Which of these is NOT a source of income?',
    ['A loan you must repay', 'Wages from a job', 'Rent from a property', 'Dividends from stocks'],
    0, 'A loan is borrowed money — you owe it back. It\'s a liability, not income.'
  ),
  mc('u1-2-l1', 3, 'A musician earns royalties every time their song is streamed. This is:',
    ['Passive income', 'Active income', 'Earned income', 'Commission'],
    0, 'Royalties flow in without ongoing work — the musician wrote the song once and now earns continuously.'
  ),
  mc('u1-2-l1', 4, 'Which type of income requires your ongoing time and effort to earn?',
    ['Active (earned) income', 'Passive income', 'Portfolio income', 'Residual income'],
    0, 'Active income stops when you stop working. A salary, hourly wage, or freelance fee all require your direct participation.'
  ),
  mc('u1-2-l1', 5, 'Someone earns money renting out a spare room on Airbnb. After the initial setup, this is mainly:',
    ['Passive income', 'Active income', 'Commission income', 'A salary'],
    0, 'Once set up, rental income comes in without day-to-day active effort — making it passive.'
  ),

  // l2: Gross vs Net Income
  wb('u1-2-l2', 0,
    'Your ______ income is what you earn before any deductions. After taxes and withholdings, what you take home is your ______ income.',
    ['gross', 'net', 'taxable', 'adjusted'],
    ['gross', 'net'],
    'Gross = total earned. Net = what you actually take home. Deductions include federal/state taxes, Social Security, Medicare, and benefits.'
  ),
  mc('u1-2-l2', 1, 'Alex earns $4,000/month. She pays $800 in federal taxes and $200 in health insurance. Her net monthly income is:',
    ['$3,000', '$3,200', '$4,000', '$2,800'],
    0, '$4,000 − $800 − $200 = $3,000. Net income is what actually hits your bank account.'
  ),
  mc('u1-2-l2', 2, 'Which of these is subtracted from gross income to get net income?',
    ['Federal income tax withholding', 'Rent payments', 'Grocery expenses', 'Credit card bills'],
    0, 'Payroll deductions (taxes, benefits) come out before you receive your paycheck. Rent and groceries come after.'
  ),
  mc('u1-2-l2', 3, 'Why is net income more useful than gross income for budgeting?',
    ['It\'s the actual money available to spend', 'It\'s a bigger number', 'It includes investment returns', 'It never changes'],
    0, 'You can\'t spend money you never received. Budget from net, not gross.'
  ),
  mc('u1-2-l2', 4, 'FICA taxes include Social Security and:',
    ['Medicare', 'State income tax', 'Property tax', 'Sales tax'],
    0, 'FICA = Federal Insurance Contributions Act. It funds Social Security (6.2%) and Medicare (1.45%).'
  ),
  mc('u1-2-l2', 5, 'A job pays $60,000/year gross. With an effective tax rate of 20%, the annual net income is:',
    ['$48,000', '$60,000', '$50,000', '$52,000'],
    0, '$60,000 × (1 − 0.20) = $48,000. Always budget with your after-tax take-home pay.'
  ),

  // l3: Salary
  mc('u1-2-l3', 0, 'A salary is:',
    ['A fixed annual pay amount, regardless of hours worked', 'Pay based on hours worked each week', 'A percentage of sales made', 'Bonus pay for good performance'],
    0, 'Salary = fixed annual compensation. You get the same amount whether you work 38 or 55 hours that week.'
  ),
  mc('u1-2-l3', 1, 'A salaried employee earns $52,000/year paid biweekly (26 pay periods). Each paycheck is:',
    ['$2,000', '$4,333', '$1,000', '$2,167'],
    0, '$52,000 ÷ 26 = $2,000 per paycheck.'
  ),
  mc('u1-2-l3', 2, 'Which is an advantage of a salaried job?',
    ['Predictable, consistent income every pay period', 'You earn more when you work extra hours', 'Higher pay than hourly workers always', 'No taxes withheld'],
    0, 'Salary predictability makes budgeting easier — you know exactly what\'s coming in each period.'
  ),
  mc('u1-2-l3', 3, 'A potential downside of salaried work compared to hourly work is:',
    ['No extra pay for working overtime in most cases', 'Lower base pay', 'No health benefits', 'Pay changes with hours worked'],
    0, 'Exempt salaried employees typically don\'t earn overtime regardless of how many extra hours they put in.'
  ),
  mc('u1-2-l3', 4, 'Which worker is most likely to be salaried?',
    ['A marketing manager at a tech company', 'A barista at a coffee shop', 'A nurse paid per shift', 'A delivery driver paid per package'],
    0, 'Professional and managerial roles are typically salaried; service and hourly labor roles are wage-based.'
  ),
  mc('u1-2-l3', 5, 'Salary is usually expressed as:',
    ['An annual (yearly) amount', 'A weekly amount', 'A daily rate', 'A per-project fee'],
    0, 'Job offers quote salary annually (e.g., "$75,000/year") even though pay is distributed in smaller intervals.'
  ),

  // l4: Hourly Wage
  mc('u1-2-l4', 0, 'Jordan works 35 hours at $15/hour. Jordan\'s gross weekly pay is:',
    ['$525', '$500', '$450', '$560'],
    0, '35 × $15 = $525.'
  ),
  mc('u1-2-l4', 1, 'The federal minimum wage in the US is:',
    ['$7.25/hour', '$15.00/hour', '$10.00/hour', '$12.00/hour'],
    0, 'The federal minimum wage has been $7.25/hour since 2009. Many states and cities set higher minimums.'
  ),
  mc('u1-2-l4', 2, 'Which worker is most likely paid an hourly wage?',
    ['A retail cashier', 'A CEO', 'A doctor on salary', 'A commissioned salesperson'],
    0, 'Hourly wages are common in retail, food service, and other industries where hours vary week to week.'
  ),
  mc('u1-2-l4', 3, 'An advantage of hourly pay over salary is:',
    ['You earn more when you work more hours', 'More job stability', 'Easier to predict your income', 'No taxes on wages'],
    0, 'Hourly workers get paid for every hour worked, including overtime — if hours increase, so does pay.'
  ),
  mc('u1-2-l4', 4, 'A worker earns $18/hour and works 40 hours. Their gross weekly pay is:',
    ['$720', '$680', '$760', '$700'],
    0, '40 × $18 = $720.'
  ),
  mc('u1-2-l4', 5, 'Hourly workers face financial risk when:',
    ['Their hours are cut or they can\'t work (illness, slow season)', 'They earn too much', 'They get a raise', 'They work overtime'],
    0, 'Unlike salaried workers, hourly employees only earn when they work. Reduced hours = reduced income.'
  ),

  // l5: Overtime
  mc('u1-2-l5', 0, 'Under US federal law, overtime pay is typically:',
    ['1.5× the regular hourly rate for hours over 40/week', '2× the regular rate', 'The same as regular pay', 'Optional — employers can choose'],
    0, '"Time and a half" — if you earn $20/hour, overtime is $30/hour.'
  ),
  mc('u1-2-l5', 1, 'An employee earns $20/hour and works 45 hours in a week. Their gross pay is:',
    ['$950', '$900', '$1,000', '$875'],
    0, '40 hours × $20 = $800, plus 5 overtime hours × $30 = $150. Total = $950.'
  ),
  mc('u1-2-l5', 2, 'After how many hours per week does overtime typically apply under US federal law?',
    ['40 hours', '35 hours', '50 hours', '45 hours'],
    0, 'The Fair Labor Standards Act (FLSA) sets the overtime threshold at 40 hours per week.'
  ),
  mc('u1-2-l5', 3, '"Time and a half" means:',
    ['1.5× your regular hourly rate', 'Working 1.5 extra hours', 'Getting paid 50% of overtime', 'Working half a day extra'],
    0, 'If your regular rate is $16/hour, time and a half = $24/hour for every overtime hour.'
  ),
  mc('u1-2-l5', 4, 'Which employee is LEAST likely to be eligible for overtime pay?',
    ['A salaried software engineer classified as exempt', 'A part-time warehouse worker', 'A full-time cashier', 'A nurse paid hourly'],
    0, 'The FLSA exempts certain salaried employees in executive, administrative, or professional roles from overtime requirements.'
  ),
  mc('u1-2-l5', 5, 'From an employer\'s perspective, why might they hire a second part-time worker instead of giving one person overtime?',
    ['Overtime costs 50% more per hour than regular pay', 'Workers are legally prohibited from working overtime', 'Part-time workers consistently outperform full-time staff', 'Splitting hours avoids mandatory benefit contributions'],
    0, 'The 1.5× overtime rate means one person working 50 hours costs more per labor hour than two people each working 25.'
  ),

  // l6: Commission
  mc('u1-2-l6', 0, 'A salesperson earns 5% commission on sales. They sell $20,000 in products. Their commission is:',
    ['$1,000', '$2,000', '$500', '$1,500'],
    0, '$20,000 × 0.05 = $1,000.'
  ),
  mc('u1-2-l6', 1, 'Commission-based pay is best suited for someone who:',
    ['Is highly motivated and comfortable with variable income', 'Prefers stable, predictable paychecks', 'Works in a government job', 'Earns an annual salary'],
    0, 'Commission rewards performance but creates income uncertainty. It suits driven, results-oriented people.'
  ),
  mc('u1-2-l6', 2, '"Base + commission" pay means:',
    ['A fixed salary plus extra earnings based on sales', 'Earning only from sales', 'A salary with no bonuses', 'Commission only for new customers'],
    0, 'Base + commission balances income stability with performance incentives.'
  ),
  mc('u1-2-l6', 3, 'Which profession typically earns commission?',
    ['Real estate agent', 'Elementary school teacher', 'Hospital nurse', 'Software engineer'],
    0, 'Real estate agents typically earn 2.5–3% commission on each property they sell or help buy.'
  ),
  mc('u1-2-l6', 4, 'A real estate agent earns 3% commission on a $400,000 home sale. Their commission is:',
    ['$12,000', '$4,000', '$40,000', '$1,200'],
    0, '$400,000 × 0.03 = $12,000.'
  ),
  mc('u1-2-l6', 5, 'A key financial risk of commission-only pay is:',
    ['Income can be very low during slow periods', 'You earn too much in good months', 'It\'s not taxable', 'You can\'t save money'],
    0, 'Commission income fluctuates with sales cycles, seasons, and economic conditions — making budgeting harder.'
  ),

  // l7: Bonuses & Tips
  mc('u1-2-l7', 0, 'A performance bonus is:',
    ['Extra pay given when you meet or exceed work goals', 'Mandatory overtime pay', 'A salary increase', 'Tax-free income'],
    0, 'Performance bonuses reward hitting targets — they\'re discretionary and not guaranteed.'
  ),
  mc('u1-2-l7', 1, 'Are tips taxable income in the US?',
    ['Yes, all tip income must be reported to the IRS', 'No, tips are classified as gifts and are tax-free', 'Only tips exceeding $100 per month are taxable', 'Only tips received via credit card are taxable'],
    0, 'The IRS requires all tip income to be reported. Servers must track and declare their tips.'
  ),
  mc('u1-2-l7', 2, 'A server receives $200 in tips. If their effective tax rate is 15%, they keep:',
    ['$170', '$200', '$185', '$150'],
    0, '$200 × (1 − 0.15) = $170 after taxes.'
  ),
  mc('u1-2-l7', 3, 'A sign-on bonus is:',
    ['A one-time payment to a new employee for joining a company', 'Regular performance pay', 'A mandatory salary', 'A government subsidy'],
    0, 'Companies offer sign-on bonuses to attract candidates, especially to compete with other job offers.'
  ),
  mc('u1-2-l7', 4, 'Why do some industries use a tipping system instead of higher base wages?',
    ['It incentivises good service and shifts some wage cost to customers', 'Workers prefer it', 'It\'s required by law', 'Tips are tax-free for restaurants'],
    0, 'Tipping creates direct financial incentive for service quality, and customers effectively subsidise staff wages.'
  ),
  mc('u1-2-l7', 5, 'An end-of-year holiday bonus of $1,000 from your employer is:',
    ['Taxable income — reported on your W-2', 'A gift — not taxable', 'Taxed at a flat 50%', 'Only taxable if over $5,000'],
    0, 'Employer bonuses are supplemental wages and fully taxable, withheld at a flat 22% federal rate.'
  ),

  // l8: Multiple Income Streams
  order('u1-2-l8', 0,
    'Put these steps for building multiple income streams in order — from first to last.',
    ['Secure a primary income source (job or main business)', 'Build an emergency fund with 3–6 months of expenses', 'Start a side hustle or freelance work', 'Invest surplus income to earn passive returns', 'Scale passive income to eventually cover your living costs'],
    'The path: stability first, then safety net, then side income, then investing, then financial independence.'
  ),
  mc('u1-2-l8', 1, 'Why do financial experts recommend building multiple income streams?',
    ['If one source dries up, others keep you afloat', 'More streams means less work', 'It guarantees you become wealthy', 'It reduces your taxes'],
    0, 'Income diversification is financial resilience. Job loss is devastating with one income; manageable with several.'
  ),
  mc('u1-2-l8', 2, 'A student has a part-time job AND sells handmade bracelets online. They have:',
    ['2 income streams', '1 income stream', '3 income streams', '0 income streams'],
    0, 'Each separate source of income = one stream. Two jobs = two streams.'
  ),
  mc('u1-2-l8', 3, 'The term "side hustle" refers to:',
    ['A secondary income source pursued outside your main job', 'Working overtime at your main job', 'A financial scam', 'A type of investment account'],
    0, 'Side hustles range from freelancing to selling products to driving for rideshare apps.'
  ),
  mc('u1-2-l8', 4, 'Which income stream is most scalable (can grow without proportionally more of your time)?',
    ['Passive income from investments or digital products', 'Hourly wage work', 'Commission sales', 'A second part-time job'],
    0, 'A YouTube channel, rental property, or dividend portfolio can earn while you sleep — unlike trading time for money.'
  ),
  mc('u1-2-l8', 5, 'What is the biggest challenge of running a side hustle alongside a full-time job?',
    ['Time management — fitting both without burning out', 'It\'s illegal in most states', 'You have to pay double taxes', 'Employers always prohibit it'],
    0, 'Side hustles require time and energy. Managing both demands discipline, good scheduling, and avoiding burnout.'
  ),

  // ── u1-3: Spending ───────────────────────────────────────────────────────

  // l1: Needs vs Wants
  sort('u1-3-l1', 0, 'Sort each item into the correct category.',
    ['Need', 'Want'],
    [
      { text: 'Monthly rent payment', bucket: 0 },
      { text: 'Video game subscription', bucket: 1 },
      { text: 'Prescription medication', bucket: 0 },
      { text: 'Designer sneakers', bucket: 1 },
      { text: 'Electricity bill', bucket: 0 },
      { text: 'Concert tickets', bucket: 1 },
    ],
    'Needs = essential for survival and functioning (shelter, health, utilities). Wants = things that improve life but aren\'t essential.'
  ),
  mc('u1-3-l1', 1, 'A "need" is best defined as:',
    ['Something essential for health, safety, or income', 'Anything you feel a strong desire to have', 'Whichever option carries the lowest price tag', 'Something your social circle expects you to own'],
    0, 'Needs: food, shelter, clothing, healthcare, transportation to work. Everything else is a want.'
  ),
  mc('u1-3-l1', 2, 'Why is separating needs from wants important when budgeting?',
    ['So you cover essential spending before discretionary spending', 'To feel guilty about spending on fun', 'To impress financial advisors', 'Needs are always cheaper'],
    0, 'Budgeting logic: needs first, wants after. This keeps you housed, healthy, and financially stable.'
  ),
  mc('u1-3-l1', 3, 'A smartphone could reasonably be considered a "need" if:',
    ['You use it for work and have no other way to contact your employer', 'You use it for social media', 'It has the latest features', 'Your friends all have one'],
    0, 'Context matters. A basic phone for work communication = functional need. The latest iPhone for Instagram = want.'
  ),
  mc('u1-3-l1', 4, 'Which of these is clearly a "want"?',
    ['A streaming service subscription', 'Groceries for the week', 'Monthly bus pass to work', 'Generic pain reliever'],
    0, 'Entertainment subscriptions improve life but aren\'t necessary for survival or employment.'
  ),
  mc('u1-3-l1', 5, 'Transportation to work is usually considered a need because:',
    ['It enables you to earn income', 'It\'s enjoyable', 'It\'s required by law', 'Everyone drives to work'],
    0, 'Without transportation to your job, you can\'t earn the income that covers all your other needs.'
  ),

  // l2: Opportunity Cost
  mc('u1-3-l2', 0, 'Opportunity cost is:',
    ['The value of the best option you gave up', 'The listed price you pay at checkout', 'The interest charged for borrowing money', 'Hidden fees not shown in the advertised price'],
    0, 'Every choice eliminates other options. Opportunity cost = what you sacrificed to make your choice.'
  ),
  mc('u1-3-l2', 1, 'You spend Saturday working a shift instead of attending a friend\'s party. The opportunity cost is:',
    ['Time at the party', 'Your hourly wage', 'The cost of a party gift', 'Nothing — work is more important'],
    0, 'Opportunity cost isn\'t always money. Here, your earnings come at the cost of social time.'
  ),
  mc('u1-3-l2', 2, 'You spend $200 on new clothes instead of putting it in savings. The opportunity cost is:',
    ['The investment gains that $200 could have made', 'Exactly the $200 purchase price you paid', 'The gradual decline in the clothing\'s resale value', 'Nothing, since replacing worn clothes is a need'],
    0, '$200 invested at 7% for 10 years = ~$394. The opportunity cost is that lost future growth.'
  ),
  mc('u1-3-l2', 3, 'A company builds a parking lot on land it owns instead of leasing it. The opportunity cost is:',
    ['The rent revenue it could have earned from leasing', 'The cost of building the lot', 'Nothing — they own the land', 'Parking fees charged'],
    0, 'Even "free" choices have opportunity costs. Using owned resources means giving up alternative uses of those resources.'
  ),
  mc('u1-3-l2', 4, 'Why is opportunity cost important in financial decisions?',
    ['Every choice eliminates other valuable alternatives', 'It helps you calculate your effective tax rate', 'It measures how quickly consumer prices are rising', 'It determines your current credit score rating'],
    0, 'Opportunity cost makes you think about alternatives, not just the choice in front of you.'
  ),
  mc('u1-3-l2', 5, 'Which concept does opportunity cost most closely relate to?',
    ['The idea that every choice requires giving something up', 'The relationship between product prices and quantity', 'Interest that compounds on both principal and earnings', 'The system of progressively higher income tax rates'],
    0, 'Opportunity cost is the economic way of quantifying trade-offs in decision-making.'
  ),

  // l3: Fixed Expenses
  sort('u1-3-l3', 0, 'Sort each expense into the correct category.',
    ['Fixed Expense', 'Variable Expense'],
    [
      { text: 'Monthly rent ($1,200)', bucket: 0 },
      { text: 'Electricity bill (varies)', bucket: 1 },
      { text: 'Car insurance premium', bucket: 0 },
      { text: 'Dining out', bucket: 1 },
      { text: 'Gym membership ($40/month)', bucket: 0 },
      { text: 'Grocery shopping', bucket: 1 },
    ],
    'Fixed = same amount every period (rent, insurance, subscriptions). Variable = changes each period based on usage or behavior.'
  ),
  mc('u1-3-l3', 1, 'A fixed expense is:',
    ['A cost that stays the same amount every month', 'Any expense over $100', 'A cost you can\'t avoid', 'An investment'],
    0, 'Fixed expenses are predictable and contractually set: rent, loan payments, insurance premiums.'
  ),
  mc('u1-3-l3', 2, 'Fixed expenses are easier to budget for because:',
    ['You know the exact amount in advance', 'They\'re always smaller', 'You can skip them when money is tight', 'Banks cover them automatically'],
    0, 'Predictability is the key benefit — you know exactly what you owe and when.'
  ),
  mc('u1-3-l3', 3, 'What happens to your fixed expenses if your income suddenly drops?',
    ['They remain the same regardless of your income level', 'They automatically adjust lower to match your income', 'They become optional payments you can skip freely', 'Banks temporarily pause them until income recovers'],
    0, 'Fixed expenses don\'t flex with income — this is why high fixed costs create financial fragility.'
  ),
  mc('u1-3-l3', 4, 'Which of these is NOT a fixed expense?',
    ['Restaurant meals', 'Monthly mortgage payment', 'Internet service bill', 'Health insurance premium'],
    0, 'Restaurant spending varies each month based on how often you eat out. The others are contracted fixed amounts.'
  ),
  mc('u1-3-l3', 5, 'Fixed expenses typically include all EXCEPT:',
    ['Clothing purchases', 'Car loan payment', 'Rent', 'Streaming subscriptions'],
    0, 'Clothing purchases vary in timing and amount. The others recur at the same amount each period.'
  ),

  // l4: Variable Expenses
  mc('u1-3-l4', 0, 'A variable expense is:',
    ['A cost that changes in amount from month to month', 'An expense that never recurs', 'A fixed loan payment', 'Any expense over $50'],
    0, 'Variable expenses fluctuate: gas, groceries, dining out, utilities, entertainment.'
  ),
  mc('u1-3-l4', 1, 'Which is a variable expense?',
    ['Your monthly electricity bill', 'Rent', 'Car insurance', 'Gym membership'],
    0, 'Electricity varies month to month based on usage — hot summers and cold winters drive it up or down.'
  ),
  mc('u1-3-l4', 2, 'Why are variable expenses harder to budget for than fixed ones?',
    ['The amount changes each month, making them unpredictable', 'They\'re always larger', 'You can\'t track them', 'Banks don\'t allow them'],
    0, 'Without tracking, variable spending can quietly exceed your budget and drain your account.'
  ),
  mc('u1-3-l4', 3, 'The best strategy for managing variable expenses is:',
    ['Track past spending and set a monthly cap for each category', 'Ignore them — they\'re too unpredictable', 'Only buy things on sale', 'Pay them with credit cards'],
    0, 'Historical averages + category caps = a realistic variable expense budget.'
  ),
  mc('u1-3-l4', 4, 'You spent $300, $240, and $360 on groceries over three months. Your average is:',
    ['$300', '$360', '$240', '$330'],
    0, '($300 + $240 + $360) ÷ 3 = $300/month. Use averages to set realistic variable expense budgets.'
  ),
  mc('u1-3-l4', 5, 'Cutting variable expenses is typically easier than cutting fixed expenses because:',
    ['You can change habits and consumption levels', 'Variable expenses are always smaller', 'You can cancel contracts', 'Banks help you reduce them'],
    0, 'You can cook more, drive less, or skip entertainment. But your rent is your rent — hard to change short-term.'
  ),

  // l5: Recurring vs One-Time Expenses
  sort('u1-3-l5', 0, 'Sort each expense into the correct category.',
    ['Recurring', 'One-Time'],
    [
      { text: 'Netflix subscription', bucket: 0 },
      { text: 'Buying a new laptop', bucket: 1 },
      { text: 'Monthly phone bill', bucket: 0 },
      { text: 'Emergency car repair', bucket: 1 },
      { text: 'Annual gym membership', bucket: 0 },
      { text: 'Birthday gift for a friend', bucket: 1 },
    ],
    'Recurring = happens on a schedule. One-time = happens once (though sometimes unexpectedly).'
  ),
  mc('u1-3-l5', 1, 'A recurring expense is one that:',
    ['Happens regularly on a predictable schedule', 'Costs the same as last month', 'Is paid with a credit card', 'Is always small'],
    0, 'Subscriptions, rent, and insurance premiums all repeat on a fixed schedule.'
  ),
  mc('u1-3-l5', 2, 'Which of these is a one-time expense?',
    ['Buying a new couch', 'Monthly electric bill', 'Internet service fee', 'Annual car insurance renewal'],
    0, 'A furniture purchase is a one-time event — you don\'t re-buy a couch every month.'
  ),
  mc('u1-3-l5', 3, 'Annual recurring expenses are tricky because:',
    ['They arrive once a year and are easy to forget', 'They are typically much larger than monthly costs', 'Their annual timing makes them impossible to plan for', 'Most banks decline or reject annual payment requests'],
    0, 'Car registration, Amazon Prime, and annual insurance bills can surprise you if you haven\'t saved up monthly.'
  ),
  mc('u1-3-l5', 4, 'Your car registration costs $180/year. To prepare monthly, you should save:',
    ['$15/month', '$18/month', '$180/month', '$30/month'],
    0, '$180 ÷ 12 = $15/month. Spreading annual costs monthly prevents financial shock.'
  ),
  mc('u1-3-l5', 5, 'A subscription service like Spotify is best categorised as:',
    ['A recurring expense', 'A one-time expense', 'A fixed asset', 'An investment'],
    0, 'Monthly subscriptions repeat automatically — they\'re recurring and should be tracked in your budget.'
  ),

  // l6: Impulse Buying
  mc('u1-3-l6', 0, 'Impulse buying is:',
    ['Making unplanned purchases driven by emotion, not budget', 'Buying things on sale', 'Buying necessities quickly', 'Planning purchases in advance'],
    0, 'Impulse purchases bypass rational decision-making — triggered by emotion, boredom, or clever marketing.'
  ),
  mc('u1-3-l6', 1, 'The BEST strategy to avoid impulse buying is:',
    ['Wait a day or two before making any unplanned purchase', 'Avoid all online shopping websites entirely', 'Only carry cash so you cannot overspend digitally', 'Permanently delete every shopping app on your phone'],
    0, 'The waiting period lets the emotional urge fade. If you still want it after 48 hours, it may be worth buying.'
  ),
  mc('u1-3-l6', 2, 'Stores place candy and small items at checkout counters to:',
    ['Trigger last-minute impulse purchases while you wait', 'Make shopping more convenient', 'Help customers save money', 'Speed up checkout'],
    0, 'This is a deliberate retail strategy. The checkout wait gives you time to notice and want small, inexpensive items.'
  ),
  mc('u1-3-l6', 3, 'Social media ads are especially effective at driving impulse buying because they:',
    ['Target your specific interests with personalized content', 'Show you random products you have no interest in', 'Are easy to ignore and rarely change behavior', 'Only display on weekends when shopping urges peak'],
    0, 'Algorithms know your interests. "Limited time offer" creates fear of missing out. Together = powerful impulse trigger.'
  ),
  mc('u1-3-l6', 4, 'A student buys a $60 game impulsively and regrets it. Best strategy next time:',
    ['Add it to a wish list and wait a week to see if they still want it', 'Buy it immediately before the price changes', 'Ask a friend to decide', 'Never buy games'],
    0, 'Wish lists are a powerful impulse-control tool. Most impulse items are forgotten within days.'
  ),
  mc('u1-3-l6', 5, '"Retail therapy" refers to:',
    ['Shopping to improve mood, often leading to impulse spending', 'Getting a discount at a store', 'Returning impulse purchases', 'Budgeting for fun spending'],
    0, 'Using shopping as emotional comfort can feel good short-term but damages long-term finances.'
  ),

  // l7: Lifestyle Inflation
  mc('u1-3-l7', 0, 'Lifestyle inflation means:',
    ['Spending rises in step with each income increase', 'Higher inflation rates on luxury goods than basics', 'Wages failing to keep pace with rising prices', 'Strategically directing money into lifestyle upgrades'],
    0, 'Lifestyle inflation (or "lifestyle creep") is the tendency to spend more as you earn more, preventing wealth accumulation.'
  ),
  mc('u1-3-l7', 1, 'A new grad gets a $15k raise and immediately upgrades their apartment, car, and wardrobe. This is:',
    ['Lifestyle inflation', 'Smart investing', 'Needs-based spending', 'Financial planning'],
    0, 'All of the raise goes to a bigger lifestyle — none to savings or investments. The financial position barely improves.'
  ),
  mc('u1-3-l7', 2, 'The best way to counter lifestyle inflation is to:',
    ['Set aside part of each raise before increasing spending', 'Refuse to spend any money on personal enjoyment', 'Record every single purchase in a detailed budget log', 'Focus on finding ways to increase your total income'],
    0, 'Automate savings from raises first. What you don\'t see, you don\'t spend. Then enjoy some of the rest guilt-free.'
  ),
  mc('u1-3-l7', 3, 'Lifestyle inflation is dangerous for long-term wealth because:',
    ['It prevents building savings even as income grows', 'It causes debt immediately', 'Employers penalise it', 'It\'s illegal'],
    0, 'Someone earning $100k but spending $100k is no more financially secure than someone earning $50k and spending $50k.'
  ),
  mc('u1-3-l7', 4, '"Keeping up with the Joneses" means:',
    ['Buying things to match what your peers have', 'Being a friendly and considerate neighbour', 'Negotiating your salary to match coworker pay', 'Copying your neighbours\' savings and budget habits'],
    0, 'Social comparison drives much lifestyle inflation. We buy things to signal status or fit in, not because we truly need them.'
  ),
  mc('u1-3-l7', 5, 'You get a $300/month raise and save $200 of it. You:',
    ['Successfully limited lifestyle inflation by not spending the full raise', 'Fully avoided lifestyle inflation', 'Gave in to lifestyle inflation entirely', 'Made a budgeting mistake'],
    0, 'Saving $200 of $300 is a win. You improved your lifestyle a little AND built more financial security.'
  ),

  // l8: Delayed Gratification
  mc('u1-3-l8', 0, 'Delayed gratification means:',
    ['Choosing a bigger future reward over a smaller one now', 'Holding onto money until prices drop at a sale', 'Waiting for the best possible deal before buying', 'Deferring all personal spending until retirement age'],
    0, 'Classic example: skipping the $5 daily coffee to invest that $1,825/year and build long-term wealth.'
  ),
  mc('u1-3-l8', 1, 'The famous "marshmallow test" measured children\'s ability to:',
    ['Wait for a bigger reward instead of taking an immediate smaller one', 'Share food with others', 'Count and identify shapes', 'Solve math problems'],
    0, 'Children who waited for two marshmallows instead of eating one immediately showed better life outcomes in follow-up studies.'
  ),
  mc('u1-3-l8', 2, 'Which behaviour best demonstrates delayed gratification?',
    ['Saving $100/month for 6 months to buy $600 headphones outright', 'Buying headphones on credit now and paying later', 'Borrowing money from friends', 'Getting a store credit card for the discount'],
    0, 'Saving first = delayed gratification. Buying on credit = the opposite — you get it now and suffer the cost later.'
  ),
  mc('u1-3-l8', 3, 'Delayed gratification is especially powerful in finance because:',
    ['Savings grow exponentially when given enough time', 'Banks reward waiting customers with direct cash bonuses', 'Consumer prices consistently fall as technology improves', 'Employers value and promote employees who wait to spend'],
    0, '$1,000 saved at 20 vs. 30 makes a massive difference by retirement — time is the most powerful variable in compounding.'
  ),
  mc('u1-3-l8', 4, 'A student skips eating out ($10/day) for a month to save $300 for concert tickets. This shows:',
    ['Delayed gratification and intentional spending', 'Impulse buying', 'Lifestyle inflation', 'Poor financial planning'],
    0, 'Sacrificing short-term pleasure (daily takeout) for a specific future goal (concert) is textbook delayed gratification.'
  ),
  mc('u1-3-l8', 5, 'Which is NOT an example of delayed gratification?',
    ['Putting a vacation on credit and paying it off over 12 months', 'Saving 6 months to afford a vacation outright', 'Waiting a year to buy a better laptop', 'Investing instead of upgrading your car'],
    0, 'Credit shifts cost to the future but adds interest — you get the reward now and pay more later. That\'s the opposite of delayed gratification.'
  ),

  // ── u1-4: Saving ─────────────────────────────────────────────────────────

  // l1: Why Save
  mc('u1-4-l1', 0, 'The primary reason to save money is:',
    ['To fund future goals and handle unexpected costs', 'To signal wealth and financial success to others', 'To legally reduce the taxes you owe each year', 'To keep your money outside the banking system'],
    0, 'Saving builds financial security and enables future goals — from vacations to emergencies to retirement.'
  ),
  mc('u1-4-l1', 1, 'Which is a SHORT-term savings goal (under 1 year)?',
    ['Saving up for new headphones in 3 months', 'Saving for retirement at 65', 'Buying a house in 10 years', 'College tuition in 4 years'],
    0, 'Short-term = under 1 year. Medium = 1–5 years. Long-term = 5+ years.'
  ),
  mc('u1-4-l1', 2, 'Which is a LONG-term savings goal?',
    ['Retirement fund', 'Next month\'s rent', 'Holiday gift budget', 'Spring break trip'],
    0, 'Retirement is the classic long-term goal — decades of saving to fund 20–30 years of post-work life.'
  ),
  mc('u1-4-l1', 3, 'People who save regularly are better prepared for:',
    ['Unexpected expenses like car repairs or medical bills', 'Tax audits', 'Stock market crashes only', 'Salary negotiations'],
    0, 'An emergency fund is the difference between a stressful inconvenience and a financial crisis.'
  ),
  mc('u1-4-l1', 4, 'You save $100/month starting at 20. Your friend starts at 30, also $100/month. At 65, who has more?',
    ['You — more time allows compound interest to work longer', 'Your friend — they saved harder', 'The same amount', 'It depends on the interest rate only'],
    0, 'Starting 10 years earlier can more than double your final balance due to compounding. Time is the key variable.'
  ),
  mc('u1-4-l1', 5, 'A financial "safety net" refers to:',
    ['Saved money to fall back on during hard times', 'Government assistance programs', 'Your parents\' savings', 'Insurance policies'],
    0, 'Your personal safety net = emergency fund + short-term savings. It\'s your first line of financial defense.'
  ),

  // l2: Emergency Funds
  mc('u1-4-l2', 0, 'Most financial experts recommend an emergency fund of:',
    ['3–6 months of living expenses', '$1,000 flat', '$10,000 exactly', '1 year of salary'],
    0, '3–6 months covers most emergencies (job loss, medical bills, major repairs) without over-saving in low-yield accounts.'
  ),
  mc('u1-4-l2', 1, 'Which of these is an appropriate emergency fund use?',
    ['Unexpected car engine failure', 'A planned vacation', 'Holiday gift shopping', 'Concert tickets'],
    0, 'Emergency = unexpected, necessary, urgent. Planned events should have their own savings bucket.'
  ),
  mc('u1-4-l2', 2, 'Where should you keep your emergency fund?',
    ['A high-yield savings account with easy access', 'A stock brokerage account for maximum growth', 'Hidden at home where only you can find it', 'A retirement account like a 401k or IRA'],
    0, 'Emergency funds need to be accessible immediately and safe. Stocks can lose value right when you need the cash.'
  ),
  mc('u1-4-l2', 3, 'Your monthly expenses are $2,000. A fully funded 3-month emergency fund is:',
    ['$6,000', '$2,000', '$24,000', '$1,000'],
    0, '$2,000 × 3 = $6,000. This covers three months if income suddenly stops.'
  ),
  mc('u1-4-l2', 4, 'Which should NOT come from your emergency fund?',
    ['A planned vacation you\'ve been looking forward to', 'Sudden medical bill', 'Furnace breaking in winter', 'Unexpected job loss coverage'],
    0, 'Planned purchases need planned savings. Using the emergency fund for vacations leaves you exposed to real emergencies.'
  ),
  mc('u1-4-l2', 5, 'Why keep your emergency fund in a separate account from everyday spending?',
    ['To prevent accidentally spending it on non-emergencies', 'Banks require it', 'It earns more interest', 'To hide it from the IRS'],
    0, 'Out of sight = out of mind. A separate account creates a psychological barrier that protects the fund.'
  ),

  // l3: Savings Accounts
  mc('u1-4-l3', 0, 'What is APY?',
    ['The annual return rate including compound interest effects', 'A special type of high-interest savings account', 'The yearly amount owed on a loan or debt balance', 'The monthly maintenance fee charged by the bank'],
    0, 'APY reflects actual annual earnings after compounding. Higher APY = more interest earned on your deposits.'
  ),
  mc('u1-4-l3', 1, 'A high-yield savings account (HYSA) is better than a traditional savings account mainly because:',
    ['It offers a significantly higher interest rate', 'It\'s riskier', 'It\'s not FDIC insured', 'You can\'t withdraw money from it'],
    0, 'HYSAs at online banks often pay 4–5% APY vs. 0.01% at big traditional banks — 400–500× more interest.'
  ),
  mc('u1-4-l3', 2, 'Why do savings accounts typically earn lower returns than investments?',
    ['They\'re low-risk — your principal is guaranteed safe by FDIC', 'Banks are greedy', 'The government caps rates', 'Savings accounts don\'t earn interest'],
    0, 'Lower risk = lower return. Safety (FDIC guarantee) comes at the cost of lower earning potential.'
  ),
  mc('u1-4-l3', 3, 'You deposit $5,000 in a savings account at 4% APY. After 1 year you earn:',
    ['$200', '$400', '$20', '$500'],
    0, '$5,000 × 0.04 = $200 in interest. Small percentages on large balances add up over time.'
  ),
  mc('u1-4-l3', 4, 'What is a savings account best used for?',
    ['Storing money for future goals while earning interest', 'Day-to-day spending', 'Long-term stock investment', 'Receiving your paycheck'],
    0, 'Savings accounts are for goals 6 months to a few years away — better than checking but less risky than stocks.'
  ),
  mc('u1-4-l3', 5, 'Which is true about savings accounts?',
    ['They earn interest on your balance over time', 'They\'re identical to checking accounts', 'They always beat inflation', 'They have no withdrawal limits'],
    0, 'Interest is the key feature — your money works for you. Note: traditional savings accounts often beat cash, not inflation.'
  ),

  // l4: Simple Interest
  wb('u1-4-l4', 0,
    'Complete the simple interest formula: Interest = Principal × ______ × ______',
    ['Rate', 'Time', 'Compound', 'Balance', 'Amount'],
    ['Rate', 'Time'],
    'I = P × r × t. Principal = starting amount, Rate = annual interest rate (as decimal), Time = years.'
  ),
  mc('u1-4-l4', 1, 'You deposit $1,000 at 5% simple interest for 3 years. Interest earned:',
    ['$150', '$50', '$500', '$1,500'],
    0, 'I = $1,000 × 0.05 × 3 = $150. Simple interest is calculated only on the original principal.'
  ),
  mc('u1-4-l4', 2, 'Simple interest is calculated on:',
    ['Only the original principal, not on earned interest', 'The total balance including all accumulated interest', 'The running average of your account balance', 'An amount calculated individually by each bank'],
    0, 'This is the key difference from compound interest. Simple: interest stays separate. Compound: interest earns interest.'
  ),
  mc('u1-4-l4', 3, 'The "principal" in an interest calculation is:',
    ['The original amount deposited or borrowed', 'The interest rate', 'The total interest earned', 'The bank\'s profit'],
    0, 'Principal = the starting amount. It\'s the base from which interest is calculated.'
  ),
  mc('u1-4-l4', 4, 'A $500 loan at 8% simple interest for 2 years costs how much in total interest?',
    ['$80', '$800', '$40', '$160'],
    0, 'I = $500 × 0.08 × 2 = $80. You\'d repay $580 total.'
  ),
  mc('u1-4-l4', 5, 'Simple interest vs. compound interest: which grows faster over long periods?',
    ['Compound interest — because interest earns interest', 'Simple interest', 'They grow at the same rate', 'It depends on the bank'],
    0, 'Compound interest accelerates over time because each period\'s interest adds to the base. Simple stays linear.'
  ),

  // l5: Compound Interest
  mc('u1-4-l5', 0, 'Compound interest is interest earned on:',
    ['The principal plus any previously earned interest', 'Only the original starting principal amount', 'Only the interest that has already been earned', 'The bank\'s total combined asset base'],
    0, 'This is the magic: earned interest joins the principal, so next period you earn interest on a bigger amount.'
  ),
  mc('u1-4-l5', 1, 'You invest $1,000 at 10% compound interest annually. After 2 years you have:',
    ['$1,210', '$1,200', '$1,100', '$1,020'],
    0, 'Year 1: $1,000 × 1.10 = $1,100. Year 2: $1,100 × 1.10 = $1,210. The $10 of Year 1 interest also earned interest.'
  ),
  mc('u1-4-l5', 2, 'What has the BIGGEST impact on compound interest growth?',
    ['Starting early, since time amplifies compounding growth', 'The interest rate, which determines all of the growth', 'The specific bank you choose to deposit with', 'How frequently you log in to check the account'],
    0, 'The "eighth wonder of the world" effect kicks in over decades. Starting 10 years earlier can double your outcome.'
  ),
  mc('u1-4-l5', 3, '$2,000 at 7% annual compound interest for 10 years (no extra deposits) grows to approximately:',
    ['~$3,934', '~$3,400', '~$2,700', '~$4,500'],
    0, '$2,000 × (1.07)^10 ≈ $3,934. The Rule of 72 says money at 7% doubles in about 10.3 years.'
  ),
  mc('u1-4-l5', 4, 'Compound interest works AGAINST you when:',
    ['You carry a credit card balance', 'You invest in index funds', 'You have a savings account', 'Interest rates are low'],
    0, 'Credit card debt compounds daily. A $1,000 balance at 22% APR grows to $1,246 in a year without payments.'
  ),
  mc('u1-4-l5', 5, 'The "Rule of 72" tells you:',
    ['How many years it takes to double your money', 'The safest percentage of income to invest annually', 'The monthly payment amount on any given loan', 'The exact amount needed to retire comfortably'],
    0, 'At 6%, 72÷6 = 12 years to double. At 9%, 72÷9 = 8 years. Quick mental math for compounding.'
  ),

  // l6: Saving Goals
  order('u1-4-l6', 0,
    'Put these steps for setting a savings goal in the correct order.',
    ['Identify what you\'re saving for', 'Research the total cost', 'Set a target date', 'Divide total cost by months remaining', 'Automate monthly transfers to your savings'],
    'Goal → Cost → Deadline → Monthly amount → Automate. Automation is the key final step that makes it actually happen.'
  ),
  mc('u1-4-l6', 1, 'SMART savings goals are Specific, Measurable, Achievable, Relevant, and:',
    ['Time-bound', 'Temporary', 'Tax-free', 'Traditional'],
    0, 'Time-bound = you have a deadline. Without one, goals stay vague intentions.'
  ),
  mc('u1-4-l6', 2, 'You want $600 for a camera in 6 months. You should save:',
    ['$100/month', '$60/month', '$600 upfront', '$120/month'],
    0, '$600 ÷ 6 months = $100/month.'
  ),
  mc('u1-4-l6', 3, 'Which is a SMART savings goal?',
    ['"Save $1,200 for emergencies over 12 months at $100/month"', '"Put away more money toward savings this year"', '"Build up a large savings balance as soon as possible"', '"Try to cut down on unnecessary spending this year"'],
    0, 'It\'s Specific ($1,200), Measurable ($100/month), Achievable (reasonable), Relevant (emergency fund), Time-bound (12 months).'
  ),
  mc('u1-4-l6', 4, 'Long-term savings goals (10+ years) often benefit most from:',
    ['Stock market index funds that outpace inflation', 'A standard bank savings account for safety', 'Physical cash stored securely at home', 'Certificates of deposit with fixed interest rates'],
    0, 'Long time horizons allow you to ride out market volatility. Stocks historically return ~7% annually vs. 4% for HYSAs.'
  ),
  mc('u1-4-l6', 5, 'What is the main advantage of setting a specific savings target date?',
    ['It lets you calculate exactly how much to save each month', 'Deadlines are motivating regardless', 'Banks give you better rates', 'It guarantees success'],
    0, 'Without a deadline, you can\'t calculate a monthly savings rate. Time-bound goals convert wishes into plans.'
  ),

  // l7: Pay Yourself First
  mc('u1-4-l7', 0, '"Pay yourself first" means:',
    ['Saving a fixed amount from each paycheck before spending', 'Buying personal wants before paying any bills', 'Holding all your earnings in physical cash form', 'Reducing taxes by cutting down on all purchases'],
    0, 'Money goes to savings the moment you\'re paid — before rent, groceries, or entertainment. You live on what\'s left.'
  ),
  mc('u1-4-l7', 1, 'The best way to implement "pay yourself first" is:',
    ['Set up automatic transfers to savings on payday', 'Remind yourself to save after expenses', 'Save only if there\'s money left over', 'Put savings in your wallet'],
    0, 'Automation removes willpower from the equation. If it transfers automatically, you never get the chance to spend it.'
  ),
  mc('u1-4-l7', 2, '"Pay yourself first" helps most because:',
    ['It removes the temptation to spend money before saving it', 'It earns more interest', 'Employers pay you extra', 'It reduces taxes'],
    0, 'Most people save what\'s left after spending — which is usually nothing. Flipping this changes everything.'
  ),
  mc('u1-4-l7', 3, 'You earn $2,000/month and pay yourself 10% first. You save:',
    ['$200/month', '$20/month', '$2,000/month', '$1,800/month'],
    0, '$2,000 × 10% = $200. The remaining $1,800 covers living expenses.'
  ),
  mc('u1-4-l7', 4, '"Pay yourself first" directly solves which common problem?',
    ['Spending everything and having nothing left to save', 'Paying too many taxes', 'Earning too little', 'Choosing bad investments'],
    0, '"I\'ll save whatever\'s left over" almost never works. Paying yourself first guarantees savings happen.'
  ),
  mc('u1-4-l7', 5, 'A 401(k) contribution that automatically comes out of your paycheck before you see it is an example of:',
    ['Paying yourself first through a retirement account', 'Lifestyle inflation', 'An emergency fund', 'Commission income'],
    0, 'Pre-tax 401(k) contributions are the ultimate "pay yourself first" — the money never hits your checking account.'
  ),

  // l8: Inflation vs Savings
  mc('u1-4-l8', 0, 'If inflation is 4% and your savings account earns 1%, your money\'s purchasing power:',
    ['Decreases by about 3% in real terms each year', 'Increases, since earning 1% is still positive growth', 'Stays the same since interest offsets inflation', 'Doubles faster as both rates compound together'],
    0, 'Real return = nominal return − inflation = 1% − 4% = −3%. Your money buys less each year despite earning interest.'
  ),
  mc('u1-4-l8', 1, '"Real return" means:',
    ['Your investment return minus the inflation rate', 'Return before taxes', 'The interest you earn', 'How much the bank keeps'],
    0, 'Real return adjusts for inflation. 7% return with 3% inflation = 4% real growth in purchasing power.'
  ),
  mc('u1-4-l8', 2, 'If jeans cost $50 today and inflation runs 3% annually, in 5 years they\'ll cost approximately:',
    ['~$58', '~$65', '~$50', '~$75'],
    0, '$50 × (1.03)^5 ≈ $57.96. Small annual inflation compounds into meaningful price increases.'
  ),
  mc('u1-4-l8', 3, 'Why is keeping large sums of cash "under the mattress" bad financial strategy?',
    ['Inflation erodes purchasing power while the cash earns 0%', 'It\'s dangerous for physical safety only', 'Banks penalise cash holders', 'Cash loses face value'],
    0, 'Cash earning 0% while inflation runs 3% = 3% annual loss in purchasing power. Real money is lost even without spending.'
  ),
  mc('u1-4-l8', 4, 'To protect savings from inflation long-term, you should:',
    ['Invest in assets that historically outpace inflation, like index funds', 'Keep everything in a savings account', 'Buy more cash', 'Only invest in gold'],
    0, 'US stock market index funds have historically returned ~7–10% annually, well above the ~2–3% average inflation rate.'
  ),
  mc('u1-4-l8', 5, 'Which account type is most likely to beat inflation over a 30-year horizon?',
    ['A stock market index fund', 'A high-yield savings account', 'A standard checking account', 'A CD (Certificate of Deposit)'],
    0, 'Over 30 years, index funds compounding at ~7% far outpace a 4% HYSA or 5% CD, especially after inflation adjustment.'
  ),

  // ── u2-1: Banks & Accounts ───────────────────────────────────────────────

  // l1: Checking Accounts
  mc('u2-1-l1', 0, 'A checking account is designed for:',
    ['Day-to-day spending and frequent transactions', 'Long-term saving with interest', 'Investing in stocks', 'Receiving loans'],
    0, 'Checking = transaction account. Debit card, bill pay, transfers — high activity, usually little to no interest.'
  ),
  mc('u2-1-l1', 1, 'What is overdraft protection?',
    ['A service that covers transactions when your balance is low', 'Free emergency funds automatically provided by the bank', 'Insurance coverage that protects your deposit balance', 'A feature that earns bonus interest when funds run low'],
    0, 'Overdraft lets a transaction go through even when funds are insufficient, but banks typically charge $25–$35 per occurrence.'
  ),
  mc('u2-1-l1', 2, 'What happens if you spend more than your checking balance (no overdraft protection)?',
    ['The transaction is declined', 'The bank covers it for free', 'Your credit score drops immediately', 'The bank automatically transfers from savings'],
    0, 'Without overdraft protection, a transaction that exceeds your balance is simply declined at point of sale.'
  ),
  mc('u2-1-l1', 3, 'Why do checking accounts earn little or no interest?',
    ['Checking funds move too often to lend out profitably', 'Banks earn no profit from operating checking accounts', 'Federal law bans interest payments on checking accounts', 'Most customers prefer not to earn any interest'],
    0, 'Checking account funds move in and out constantly, making them less useful for lending — so banks pay little interest.'
  ),
  mc('u2-1-l1', 4, 'Which is a good reason to use a checking account?',
    ['To pay bills and make everyday purchases', 'To grow wealth over 10 years', 'To earn high interest on savings', 'To invest in mutual funds'],
    0, 'Checking is your spending hub — debit card, direct deposit, automated bill pay all work through it.'
  ),
  mc('u2-1-l1', 5, 'A monthly maintenance fee on a checking account can often be waived by:',
    ['Maintaining a minimum balance or setting up direct deposit', 'Opening more accounts', 'Calling the bank every month', 'Using the debit card daily'],
    0, 'Banks offer fee waivers to attract and retain customers who make the account their primary financial hub.'
  ),

  // l2: Savings Accounts at Banks
  mc('u2-1-l2', 0, 'Traditional bank savings accounts often offer around:',
    ['0.01%–0.10% APY — very low', '4–5% APY', '10% APY', '1–2% APY consistently'],
    0, 'Big national banks like Chase or Bank of America typically pay nearly nothing on savings. Online banks do far better.'
  ),
  mc('u2-1-l2', 1, 'High-yield savings accounts (HYSAs) are typically offered by:',
    ['Online banks with lower overhead costs', 'Credit unions exclusively', 'The Federal Reserve', 'Investment firms only'],
    0, 'Online banks have no physical branches, cutting costs dramatically and allowing them to offer much higher rates.'
  ),
  mc('u2-1-l2', 2, '$5,000 in a savings account at 4% APY for 1 year earns:',
    ['$200', '$2,000', '$400', '$20'],
    0, '$5,000 × 0.04 = $200. Simple annual interest on your deposit balance.'
  ),
  mc('u2-1-l2', 3, 'A benefit of keeping savings at the same bank as your checking account:',
    ['Easy, instant transfers between accounts', 'Higher interest rates', 'No fees on either account', 'Better fraud protection'],
    0, 'Same-bank transfers are usually instant. Cross-bank ACH transfers can take 1–3 business days.'
  ),
  mc('u2-1-l2', 4, 'The best use of a savings account versus a checking account:',
    ['Savings for future goals; checking for daily expenses', 'Both for daily expenses', 'Checking for saving; savings for spending', 'Neither — keep cash at home'],
    0, 'The two accounts serve different purposes: checking = flow-through spending, savings = accumulation for goals.'
  ),
  mc('u2-1-l2', 5, 'Savings accounts are FDIC-insured up to:',
    ['$250,000 per depositor, per insured bank', '$100,000', 'Unlimited', '$50,000'],
    0, 'FDIC insurance covers up to $250,000 per depositor per institution — your savings are safe even if the bank fails.'
  ),

  // l3: Credit Unions
  sort('u2-1-l3', 0, 'Sort each feature into the correct institution type.',
    ['Credit Union', 'Traditional Bank'],
    [
      { text: 'Owned by members', bucket: 0 },
      { text: 'Publicly traded / investor-owned', bucket: 1 },
      { text: 'Not-for-profit structure', bucket: 0 },
      { text: 'Generally wider ATM network', bucket: 1 },
      { text: 'Often lower loan interest rates', bucket: 0 },
      { text: 'Profit goes to shareholders', bucket: 1 },
    ],
    'Credit unions are member-owned non-profits that return profits as better rates. Banks are for-profit businesses owned by investors.'
  ),
  mc('u2-1-l3', 1, 'A credit union differs from a bank because:',
    ['It\'s owned by its members and operates as a non-profit', 'It\'s owned by the government', 'It doesn\'t offer loans', 'It\'s only for businesses'],
    0, 'Members are both customers and owners. Profits go back to members through better rates and lower fees.'
  ),
  mc('u2-1-l3', 2, 'Who can typically join a credit union?',
    ['Those who meet a defined eligibility requirement', 'Any adult who walks in and applies at any time', 'Business owners with an established company only', 'Individuals who have a perfect credit history'],
    0, 'Credit unions serve a defined "field of membership" — you must qualify (work, live, or belong somewhere specific).'
  ),
  mc('u2-1-l3', 3, 'Credit unions often offer:',
    ['Better interest rates on loans and savings accounts', 'More branch locations across the country', 'Superior mobile apps and online banking tools', 'Faster loan approval times than commercial banks'],
    0, 'Without a profit motive, credit unions can offer better financial terms. The tradeoff is usually fewer locations.'
  ),
  mc('u2-1-l3', 4, 'Credit union deposits are insured by:',
    ['The NCUA, with the same $250,000 coverage limit', 'The FDIC, just like standard commercial banks', 'The Federal Reserve as their central regulator', 'No agency, as credit unions are fully uninsured'],
    0, 'NCUA for credit unions, FDIC for banks. Both provide the same $250,000 per depositor coverage.'
  ),
  mc('u2-1-l3', 5, 'A potential downside of credit unions is:',
    ['Fewer branches and ATMs compared to large national banks', 'Higher interest rates on loans', 'Not FDIC insured', 'They charge membership fees always'],
    0, 'Credit unions often have limited physical footprints. Many partner with ATM networks to partially offset this.'
  ),

  // l4: Online Banks
  mc('u2-1-l4', 0, 'Online banks can offer higher savings rates than traditional banks mainly because:',
    ['They have lower overhead with no physical branches', 'They accept higher investment risks for better returns', 'They operate without any banking regulations', 'They pay significantly lower wages to employees'],
    0, 'No rent, no tellers, no branch upkeep. Online banks redirect those savings into better rates for customers.'
  ),
  mc('u2-1-l4', 1, 'A potential disadvantage of an online bank:',
    ['No physical locations for cash deposits or in-person help', 'They consistently charge higher fees than big banks', 'Deposits are not covered by any federal insurance', 'They are unable to issue any debit or ATM cards'],
    0, 'If you need to deposit cash or deal with a complex issue face-to-face, an online-only bank can frustrate.'
  ),
  mc('u2-1-l4', 2, 'Online bank deposits are FDIC insured (if the bank is FDIC-member):',
    ['Yes — the same $250,000 per depositor protection applies', 'No — only physical banks qualify', 'Only for savings accounts', 'Only up to $50,000'],
    0, 'FDIC membership is about the bank\'s charter, not whether it has branches. Most online banks are FDIC-insured.'
  ),
  mc('u2-1-l4', 3, 'Online banks are best for someone who:',
    ['Is comfortable managing money digitally and rarely needs cash deposits', 'Always pays with cash', 'Wants in-person financial advice weekly', 'Has complex business banking needs'],
    0, 'Tech-comfortable users who mostly transact digitally gain the most from online banks\' better rates and lower fees.'
  ),
  mc('u2-1-l4', 4, 'The main way to deposit cash into an online bank account is:',
    ['Use a Green Dot retailer or mail a money order', 'Visit a nearby branch and use their ATM machine', 'Call the bank and schedule a courier cash pickup', 'Use any ATM network to deposit cash for free'],
    0, 'Cash deposits are the biggest friction point with online banks. Most customers use them alongside a local bank for cash.'
  ),
  mc('u2-1-l4', 5, 'If you want to maximize interest on your emergency fund with minimal risk, you should consider:',
    ['A high-yield savings account at an online bank', 'A stock index fund', 'A traditional big-bank savings account', 'Keeping cash at home'],
    0, 'Online bank HYSAs currently offer 4–5% APY with full FDIC protection — ideal for emergency fund storage.'
  ),

  // l5: How Banks Make Money
  mc('u2-1-l5', 0, 'The main way banks make money is:',
    ['Charging borrowers more interest than they pay savers', 'Charging fees on ATM use and account maintenance', 'Investing your deposits directly in the stock market', 'Printing and issuing their own branded currency'],
    0, 'The interest rate spread is the core of banking profit: borrow from depositors at 2%, lend to borrowers at 7% = 5% spread.'
  ),
  mc('u2-1-l5', 1, 'If a bank pays you 2% on savings and charges 7% on car loans, the bank\'s spread is:',
    ['5%', '9%', '2%', '7%'],
    0, '7% − 2% = 5%. This spread, applied to billions of dollars, is how banks generate profit.'
  ),
  mc('u2-1-l5', 2, 'Banks also earn money through:',
    ['Account fees, overdraft charges, and transaction fees', 'Taxes on your income', 'Printing more money', 'Selling investments directly'],
    0, 'Non-interest income (fees) is an increasingly important revenue stream for banks.'
  ),
  mc('u2-1-l5', 3, 'When you deposit $1,000 in a bank, the bank:',
    ['Lends most of it out and pays you interest in return', 'Stores the full amount untouched in a secure vault', 'Invests all of it directly in the stock market', 'Transfers the full amount to the Federal Reserve'],
    0, 'This is fractional reserve banking. Your $1,000 becomes a $900 loan to someone else while you keep "access" to $1,000.'
  ),
  mc('u2-1-l5', 4, 'What is fractional reserve banking?',
    ['Banks keep a fraction of deposits as reserves and lend the rest out', 'Banks keep all deposits as reserves', 'Banks lend 100% of deposits', 'Banks invest all deposits'],
    0, 'If the reserve requirement is 10%, a $1,000 deposit means the bank keeps $100 and lends out $900.'
  ),
  mc('u2-1-l5', 5, 'Why would a bank offer you a higher savings rate during periods of rising interest rates?',
    ['They can lend at even higher rates, so the spread still works in their favour', 'They\'re required to by law', 'They\'re losing customers', 'The government forces them to'],
    0, 'When lending rates rise, banks can pay depositors more and still maintain a profitable spread.'
  ),

  // l6: FDIC Insurance
  wb('u2-1-l6', 0,
    'The FDIC insures bank deposits up to ______ per depositor, per ______ bank, per ownership category.',
    ['$250,000', '$100,000', 'insured', 'member', 'federal'],
    ['$250,000', 'insured'],
    'FDIC coverage: $250,000 per depositor, per insured bank. Joint accounts, retirement accounts, and trusts get separate coverage.'
  ),
  mc('u2-1-l6', 1, 'What does FDIC stand for?',
    ['Federal Deposit Insurance Corporation', 'Federal Debt Insurance Council', 'Financial Deposit Insurance Company', 'Federal Dollar Insurance Corp'],
    0, 'Created by the Banking Act of 1933 after thousands of bank failures during the Great Depression.'
  ),
  mc('u2-1-l6', 2, 'Your bank fails. You have $200,000 in a savings account. Under FDIC:',
    ['You get the full $200,000 back, completely covered', 'You lose the entire $200,000 with no recovery', 'You receive exactly $100,000 and lose the rest', 'You eventually recover it after years of waiting'],
    0, 'FDIC reimburses insured deposits promptly — often the next business day after a bank failure.'
  ),
  mc('u2-1-l6', 3, 'FDIC insurance does NOT cover:',
    ['Stock market investments and mutual funds', 'Checking accounts', 'Savings accounts', 'CDs (Certificates of Deposit)'],
    0, 'FDIC covers bank deposits only — checking, savings, money markets, and CDs. Not stocks, bonds, or mutual funds.'
  ),
  mc('u2-1-l6', 4, 'FDIC was created after:',
    ['The Great Depression, when thousands of banks failed and people lost savings', 'The 2008 financial crisis', 'World War II', 'The dot-com crash'],
    0, '9,000+ banks failed between 1930–1933. FDIC, created in 1933, ended bank runs by guaranteeing deposits.'
  ),
  mc('u2-1-l6', 5, 'You have $300,000 at one bank. How much is NOT insured?',
    ['$50,000', '$250,000', '$300,000', 'All of it is insured'],
    0, '$300,000 − $250,000 FDIC limit = $50,000 uninsured. Solution: spread large deposits across multiple banks.'
  ),

  // l7: Reading Bank Statements
  order('u2-1-l7', 0,
    'Put these steps for reviewing your monthly bank statement in the correct order.',
    ['Log in to your bank or open your paper statement', 'Check your opening and closing balance', 'Review each transaction for accuracy', 'Flag any charges you don\'t recognise', 'Report fraudulent transactions to the bank immediately'],
    'This 5-step habit catches errors and fraud. Most banks give you 60 days to dispute unauthorised charges.'
  ),
  mc('u2-1-l7', 1, 'What is the "closing balance" on a bank statement?',
    ['Your account balance at the end of the statement period', 'Your total spending that month', 'The balance after fees are deducted', 'Your opening balance'],
    0, 'Opening balance → transactions in/out → closing balance. The closing balance becomes next month\'s opening balance.'
  ),
  mc('u2-1-l7', 2, 'If you see an unfamiliar charge on your bank statement, you should:',
    ['Contact your bank immediately to investigate or dispute it', 'Wait a few months to see if it repeats', 'Assume it\'s fine', 'Close the account right away'],
    0, 'Unknown charges can be fraud or billing errors. Contact your bank promptly — disputes have time limits.'
  ),
  mc('u2-1-l7', 3, 'Bank statements are typically issued:',
    ['Monthly', 'Weekly', 'Annually', 'Every 6 months'],
    0, 'Most banks issue monthly statements covering one calendar month of transactions.'
  ),
  mc('u2-1-l7', 4, 'Why is regularly reviewing your bank statement important?',
    ['To catch errors, fraud, and track spending patterns', 'To impress your bank', 'It\'s required by law', 'To qualify for better rates'],
    0, 'Regular review is your first line of defense against fraud and billing errors.'
  ),
  mc('u2-1-l7', 5, 'A "debit" entry on a bank statement means:',
    ['Money left your account', 'Money entered your account', 'An error occurred', 'Interest was earned'],
    0, 'Debit = money out. Credit = money in. These are accounting terms, opposite to colloquial "debit card" usage in some contexts.'
  ),

  // l8: Mobile Banking
  mc('u2-1-l8', 0, 'Mobile banking allows you to:',
    ['Check balances, transfer money, pay bills, and deposit checks from your phone', 'Only check balances', 'Withdraw cash remotely', 'Open new loans instantly'],
    0, 'Modern banking apps let you do almost everything without visiting a branch.'
  ),
  mc('u2-1-l8', 1, 'Best security practice for mobile banking:',
    ['Use a strong password and enable two-factor authentication', 'Reuse your email password for easy remembering', 'Save your login credentials in a phone notes file', 'Turn off all banking notifications to block phishing'],
    0, '2FA means a hacker needs both your password AND your phone to access your account. Essential for banking apps.'
  ),
  mc('u2-1-l8', 2, 'Mobile check deposit works by:',
    ['Taking a photo of the check — the app processes it electronically', 'Emailing a scan to the bank', 'Mailing the physical check', 'The bank picking up the check'],
    0, 'Remote check deposit (RDC) is one of mobile banking\'s most convenient features — instant deposit from anywhere.'
  ),
  mc('u2-1-l8', 3, 'Why is public Wi-Fi risky for mobile banking?',
    ['Hackers can intercept unencrypted data on public networks', 'Public Wi-Fi is always slow', 'Banks block connections from public Wi-Fi', 'It drains your battery faster'],
    0, 'Use cellular data or a VPN for financial transactions on public networks. "Man in the middle" attacks are real threats.'
  ),
  mc('u2-1-l8', 4, 'If you lose your phone that has your banking app, you should:',
    ['Report it to your bank and remotely lock the device', 'Wait a few days to see if someone returns it', 'Open an entirely new account at a different bank', 'Do nothing since Face ID blocks all transactions'],
    0, 'Act immediately. Remote lock or wipe prevents access even if the phone is found. Report to your bank to freeze mobile access.'
  ),
  mc('u2-1-l8', 5, 'Mobile banking most reduces the need for:',
    ['Visiting a bank branch in person', 'Owning a debit card', 'Having a bank account', 'Saving money'],
    0, 'Deposits, transfers, payments, balance checks — all formerly requiring a branch visit can now be done from your couch.'
  ),

  // ── u2-2: Payments ───────────────────────────────────────────────────────

  // l1: Debit Cards
  mc('u2-2-l1', 0, 'When you pay with a debit card, money is drawn:',
    ['Directly and immediately from your checking account', 'From a revolving line of credit you repay later', 'Transferred automatically from your savings account', 'From the bank\'s own funds, repaid at month-end'],
    0, 'Debit = immediate subtraction from your checking balance. No credit, no debt — just your own money.'
  ),
  mc('u2-2-l1', 1, 'What happens when you use a debit card for more than your account balance (no overdraft)?',
    ['The transaction is declined', 'The bank covers the difference for free', 'Your credit score drops', 'The payment processes and you get a fee later'],
    0, 'No overdraft protection = declined transaction at point of sale. Embarrassing but not financially damaging.'
  ),
  mc('u2-2-l1', 2, 'What is a PIN used for with a debit card?',
    ['To verify your identity for in-person purchases', 'To access your savings account only', 'To set up direct deposit', 'To apply for a loan'],
    0, 'PIN (Personal Identification Number) proves you\'re the account owner when swiping or inserting at a terminal.'
  ),
  mc('u2-2-l1', 3, 'An advantage of a debit card over cash:',
    ['Every transaction is recorded and easy to review', 'You can spend more than your current balance allows', 'It builds a strong credit history over time', 'You automatically earn cashback rewards on purchases'],
    0, 'Every debit transaction shows in your statement, making it easy to review spending. Cash transactions leave no record.'
  ),
  mc('u2-2-l1', 4, 'A disadvantage of debit cards compared to credit cards:',
    ['Stolen funds leave your account immediately and directly', 'Fewer stores and merchants accept debit cards overall', 'Most debit cards carry an annual fee to maintain', 'Debit cards cannot be used for any online purchases'],
    0, 'Credit card fraud = no money lost until investigation. Debit card fraud = your cash is gone while you dispute.'
  ),
  mc('u2-2-l1', 5, 'Debit cards are safest when:',
    ['Used for everyday purchases where you want to stay within your budget', 'Making large purchases', 'Shopping internationally', 'Buying online from unknown vendors'],
    0, 'Debit cards naturally prevent overspending (you can only spend what\'s there). For large or risky purchases, credit is safer.'
  ),

  // l2: Credit Cards as Payment
  mc('u2-2-l2', 0, 'When you pay with a credit card, you are:',
    ['Borrowing money from the card issuer, to be repaid later', 'Spending from your savings account', 'Getting a discount from the store', 'Accessing a government benefit'],
    0, 'Credit = borrowed money. You must repay the card issuer — with interest if you don\'t pay in full by the due date.'
  ),
  mc('u2-2-l2', 1, 'To avoid paying interest on a credit card:',
    ['Pay the full statement balance by the due date', 'Pay only the minimum amount listed on your bill', 'Avoid using the card entirely to prevent charges', 'Set up autopay for any partial amount you choose'],
    0, 'Pay in full = no interest ever. Even one dollar short means you pay interest on the entire balance in many cases.'
  ),
  mc('u2-2-l2', 2, 'The "grace period" on a credit card is:',
    ['The window between statement close and payment due date', 'Extra time given after your payment becomes overdue', 'A promotional period when reward points are doubled', 'A fixed 30-day period when no interest can accumulate'],
    0, 'Typically 21–25 days. Pay your full statement balance within this window and you pay zero interest.'
  ),
  mc('u2-2-l2', 3, 'A credit card with 22% APR on a $500 balance held for one year accumulates about:',
    ['~$110 in interest', '$22 in interest', '$500 in interest', '$55 in interest'],
    0, '$500 × 0.22 = $110. High APR + carrying a balance = expensive money. Always pay in full when possible.'
  ),
  mc('u2-2-l2', 4, 'Which is a benefit of paying with a credit card (used responsibly)?',
    ['Fraud protection, rewards points, and credit building', 'Borrowed money that you are never required to repay', 'No credit check or approval process is required', 'Permanently higher limits granted on all future purchases'],
    0, 'Credit cards offer chargeback rights (disputing fraud or bad purchases), cashback/points, and help build credit.'
  ),
  mc('u2-2-l2', 5, 'Your credit limit is:',
    ['The maximum you can charge on the card at one time', 'The maximum interest rate', 'The amount you must spend monthly', 'The bank\'s total credit pool'],
    0, 'Credit limit is set by the issuer based on creditworthiness. Exceeding it can result in declined transactions or over-limit fees.'
  ),

  // l3: Cash & Checks
  mc('u2-2-l3', 0, 'One advantage of paying with cash:',
    ['It\'s universally accepted and naturally limits spending to available funds', 'It earns rewards points', 'It builds credit history', 'Transactions are reversible'],
    0, 'You literally cannot spend more than you have with cash. This natural limit prevents overspending.'
  ),
  mc('u2-2-l3', 1, 'A personal check is:',
    ['A written instruction to your bank to pay someone', 'A form of digital currency stored on your phone', 'A type of debit card linked to your checking account', 'A guarantee from the bank to cover a payment itself'],
    0, 'Checks authorise your bank to transfer funds from your account to the payee\'s account.'
  ),
  mc('u2-2-l3', 2, 'A "bounced check" means:',
    ['The check writer had insufficient funds to cover it', 'The check was mailed too late to arrive in time', 'The signature on the check did not match records', 'The physical check was intercepted and stolen'],
    0, 'NSF (Non-Sufficient Funds) results in the check bouncing. Both parties may face fees, and it damages trust.'
  ),
  mc('u2-2-l3', 3, 'Which information is required on a personal check?',
    ['Payee name, amount, date, and your signature', 'Only your signature and the dollar amount', 'Just the account and routing numbers only', 'Only the payee name and the current date'],
    0, 'All four elements are legally required for a valid check. Missing any can cause it to be rejected.'
  ),
  mc('u2-2-l3', 4, 'Why are checks becoming less common?',
    ['Digital and card payments are faster and more convenient', 'Banks stopped issuing checkbooks', 'Checks became illegal for most purchases', 'Checks cost too much to write'],
    0, 'Writing, mailing, and depositing a check takes days. A Zelle or ACH transfer takes minutes to hours.'
  ),
  mc('u2-2-l3', 5, 'Cash is least effective for:',
    ['Online purchases — they require a card or digital payment method', 'Buying groceries', 'Tipping a server', 'Paying a friend back'],
    0, 'You can\'t email or upload dollar bills. Online commerce requires digital payment methods.'
  ),

  // l4: Wire Transfers & ACH
  mc('u2-2-l4', 0, 'A wire transfer is:',
    ['A direct electronic transfer that settles the same day', 'A physical wire that carries cash between branches', 'A recurring monthly automated payment system', 'A digitally enhanced version of a paper check'],
    0, 'Wire transfers are direct, fast, and final. Used for large amounts (real estate, international payments) where speed matters.'
  ),
  mc('u2-2-l4', 1, 'ACH (Automated Clearing House) is most commonly used for:',
    ['Direct deposits and automatic bill payments', 'International wire transfers', 'Cash withdrawals', 'Point-of-sale purchases'],
    0, 'Your employer uses ACH for direct deposit. Your utility company uses ACH for autopay. Billions of transactions daily.'
  ),
  mc('u2-2-l4', 2, 'Wire transfers are faster than ACH but typically:',
    ['Cost $15–$50 per transfer', 'Take 5–7 business days', 'Are free for bank customers', 'Are only for businesses'],
    0, 'Speed comes at a price. ACH is free or near-free; wires cost money. Use ACH for non-urgent transfers.'
  ),
  mc('u2-2-l4', 3, 'ACH transfers typically settle in:',
    ['1–3 business days', 'Instantly', '7–10 business days', 'The same day always'],
    0, 'Same-day ACH is now available for a fee, but standard ACH takes 1–3 business days to clear.'
  ),
  mc('u2-2-l4', 4, 'Why are wire transfers hard to reverse once sent?',
    ['They settle immediately and cannot be recalled', 'Bank systems automatically delete wire transfer records', 'The encryption makes the transfer impossible to reverse', 'Federal law prohibits reversing any completed wire'],
    0, 'This finality is why wire fraud scams are devastating — once sent, the money is almost impossible to recover.'
  ),
  mc('u2-2-l4', 5, 'Best payment method for sending $50,000 for a home down payment that must arrive today:',
    ['Wire transfer', 'Personal check', 'ACH transfer', 'Venmo'],
    0, 'Wire transfer: same-day, handles large amounts, universally accepted for real estate. The fee is worth the certainty.'
  ),

  // l5: Venmo, Cash App & Zelle
  mc('u2-2-l5', 0, 'Which app moves money directly between bank accounts with no app balance in between?',
    ['Zelle', 'Venmo', 'Cash App', 'PayPal'],
    0, 'Zelle transfers go bank-to-bank instantly. Venmo and Cash App hold funds in an app balance unless you transfer out.'
  ),
  mc('u2-2-l5', 1, 'A major risk when using peer-to-peer payment apps:',
    ['Accidentally sending money to the wrong recipient', 'The apps charge up to 10% on every transfer', 'All transactions are publicly visible by default', 'Funds can randomly disappear due to app glitches'],
    0, 'One wrong digit in a username or phone number sends money to a stranger. Recoveries are difficult and not guaranteed.'
  ),
  mc('u2-2-l5', 2, 'Safest practice when using Venmo or Cash App:',
    ['Only send money to people you know personally and always double-check recipient info', 'Send small test amounts first every time', 'Keep large balances in the app', 'Use public Wi-Fi for convenience'],
    0, 'Peer-to-peer apps have minimal fraud protection compared to credit cards. Treat them like handing over cash.'
  ),
  mc('u2-2-l5', 3, 'A common scam on peer-to-peer payment apps involves:',
    ['Fake "accidental payment" requests asking for a refund', 'Apps charging excessive hidden monthly interest fees', 'Banks closing accounts that use these payment apps', 'Apps harvesting your Social Security number at signup'],
    0, 'Scammers send money "by mistake" then ask for it back via a different method — often after their original payment reverses.'
  ),
  mc('u2-2-l5', 4, 'Zelle transfers are typically:',
    ['Instant and free — money moves directly between enrolled bank accounts', 'Expensive and slow', 'Only available on weekdays', 'Limited to $50 per transfer'],
    0, 'Zelle is integrated into most US bank apps and uses existing bank-to-bank rails for fast, free transfers.'
  ),
  mc('u2-2-l5', 5, 'Why should you avoid keeping large balances in apps like Venmo or Cash App?',
    ['App balances have weaker protections than bank deposits', 'Apps charge high monthly fees to store any balance', 'Your money earns zero interest no matter the amount', 'A large balance causes the app to run much slower'],
    0, 'App balances exist in regulatory grey areas. For safety, transfer app balances to your bank regularly.'
  ),

  // l6: Apple Pay, Google Pay & Contactless
  mc('u2-2-l6', 0, 'Contactless payments work using:',
    ['NFC — Near Field Communication technology', 'Bluetooth', 'Wi-Fi', 'QR codes exclusively'],
    0, 'NFC allows devices within a few centimetres to exchange data. Tap your phone or card near the terminal = payment made.'
  ),
  mc('u2-2-l6', 1, 'Apple Pay and Google Pay are more secure than swiping a physical card because:',
    ['They use a unique token per transaction, not your real number', 'They require a PIN to be entered for every purchase', 'They use government-certified military-grade encryption', 'They are directly backed and insured by the FDIC'],
    0, 'Tokenisation means merchants never receive your real card number — even if they\'re hacked, your card data is safe.'
  ),
  mc('u2-2-l6', 2, 'To make a contactless payment:',
    ['Hold your phone or card near the NFC-enabled payment terminal', 'Enter your card number manually', 'Scan a QR code only', 'Call your bank to authorise each purchase'],
    0, 'A tap within a few centimetres triggers NFC communication. Most modern terminals display the contactless symbol.'
  ),
  mc('u2-2-l6', 3, 'A disadvantage of mobile payment apps like Apple Pay:',
    ['Require a compatible phone and don\'t work at all merchants', 'Charge 2% per transaction', 'Only work internationally', 'Are not linked to your bank account'],
    0, 'Older terminals and small merchants may not support NFC. Adoption is high in cities but uneven in rural areas.'
  ),
  mc('u2-2-l6', 4, 'A "tap to pay" transaction is generally:',
    ['Faster than swiping or inserting a card', 'Slower than cash', 'The same speed as chip insert', 'Only available at large retailers'],
    0, 'Tap is typically the fastest payment method — no insert wait, no PIN for small purchases, no signature.'
  ),
  mc('u2-2-l6', 5, 'If your phone is stolen with Apple Pay enabled, you can:',
    ['Disable Apple Pay remotely using your Apple ID', 'Do nothing since Face ID prevents all transactions', 'Call the store and ask them to block the device', 'Cancel your entire bank account and reopen it'],
    0, 'Apple ID\'s Find My and Google\'s account management let you remotely lock or erase your device, disabling all payments.'
  ),

  // l7: Direct Deposit
  mc('u2-2-l7', 0, 'Direct deposit means:',
    ['Your paycheck is sent electronically to your bank account', 'You collect a paper check from HR or payroll', 'The bank receives and deposits physical cash for you', 'Your employer pays you in a chosen cryptocurrency'],
    0, 'Direct deposit via ACH is how most employees receive pay — automatic, paperless, and typically faster than checks.'
  ),
  mc('u2-2-l7', 1, 'To set up direct deposit, you give your employer:',
    ['Your bank routing number and account number', 'Your Social Security number and password', 'Your debit card number', 'Your monthly statement'],
    0, 'Routing number = identifies your bank. Account number = identifies your specific account. Both needed for ACH.'
  ),
  mc('u2-2-l7', 2, 'What is a routing number?',
    ['A 9-digit number that identifies your specific bank in the ACH network', 'Your personal account number', 'Your ATM PIN', 'A code for international wires only'],
    0, 'Every US bank has a unique 9-digit ABA routing number used to direct electronic transfers to the right institution.'
  ),
  mc('u2-2-l7', 3, '"Early direct deposit" means:',
    ['You receive your paycheck 1–2 days before the official pay date', 'You pay a fee to get paid early', 'Your employer pays you in advance', 'You get a larger first paycheck'],
    0, 'Many online and fintech banks release direct deposits as soon as they receive the ACH file — often 1–2 days early.'
  ),
  mc('u2-2-l7', 4, 'Direct deposit is safer than a paper check because:',
    ['It goes directly to your account without a physical check', 'Bank insurance covers paper checks but not deposits', 'Paper checks are far easier to forge or alter', 'Employers are legally required to use direct deposit'],
    0, 'Paper checks can be intercepted, lost in mail, or forged. Electronic deposits eliminate those physical risks.'
  ),
  mc('u2-2-l7', 5, 'Many banks waive monthly fees if you set up direct deposit because:',
    ['Customers with direct deposit use accounts more actively', 'Federal law mandates this fee waiver for all banks', 'It cuts their internal payment processing costs only', 'Employers pay banks a bonus for each setup completed'],
    0, 'Banks want direct deposit customers — they use the account more, maintain higher balances, and rarely switch banks.'
  ),

  // l8: Choosing the Right Payment Method
  mc('u2-2-l8', 0, 'You\'re buying something from an unknown online seller and want maximum protection if it doesn\'t arrive. Best method:',
    ['Credit card, with chargeback and dispute rights', 'Wire transfer for a guaranteed same-day payment', 'Zelle for an instant peer-to-peer bank transfer', 'Cash, which is untraceable and always accepted'],
    0, 'Credit card chargebacks let you dispute charges and get refunded if goods aren\'t delivered. Wire/Zelle/cash have no such protection.'
  ),
  mc('u2-2-l8', 1, 'You need to split a dinner bill five ways with friends instantly. Best method:',
    ['A peer-to-peer app like Venmo, Zelle, or Cash App', 'Wire transfer', 'Personal check', 'Cash only'],
    0, 'P2P apps are built exactly for this — instant, free, and require nothing but a phone.'
  ),
  mc('u2-2-l8', 2, 'You\'re paying rent ($1,200) and want a clear paper trail. Best method:',
    ['Personal check or ACH bank transfer', 'Cash', 'Venmo', 'Contactless tap'],
    0, 'Checks and bank transfers create documented records. Cash has no proof of payment if disputed later.'
  ),
  mc('u2-2-l8', 3, 'You\'re at a farmers market buying from a small vendor. Most likely accepted payment:',
    ['Cash', 'Wire transfer', 'Contactless Apple Pay only', 'Personal check'],
    0, 'Small vendors may not have card terminals. Cash is the universal fallback that always works.'
  ),
  mc('u2-2-l8', 4, 'You need to send $15,000 for a car purchase today. Best method:',
    ['Wire transfer, which finalizes same day for large sums', 'Venmo, which handles large same-day payments easily', 'A personal check written and handed over in person', 'An ACH transfer, which arrives in a few business days'],
    0, 'Wire transfers are the standard for large, time-sensitive transfers. The $25–50 fee is worth the certainty.'
  ),
  mc('u2-2-l8', 5, 'Which payment method gives you the most consumer protections overall?',
    ['Credit card, due to chargebacks and fraud protections', 'Debit card, which has similar federal protections', 'Cash App, which has robust consumer dispute tools', 'Wire transfer, with guaranteed federal consumer rights'],
    0, 'Federal law limits credit card fraud liability to $50 (often $0 in practice). Debit card protections are weaker; cash has none.'
  ),
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

console.log(`Seeding ${questions.length} questions across ${LESSON_IDS.length} lessons...`)

const { error: delError } = await supabase
  .from('questions')
  .delete()
  .in('lesson_id', LESSON_IDS)

if (delError) { console.error('Delete failed:', delError); process.exit(1) }
console.log(`✓ Cleared existing questions for ${LESSON_IDS.length} lessons`)

const BATCH = 50
for (let i = 0; i < questions.length; i += BATCH) {
  const batch = questions.slice(i, i + BATCH)
  const { error } = await supabase.from('questions').insert(batch)
  if (error) { console.error(`Insert failed at batch ${i}:`, error); process.exit(1) }
  console.log(`✓ Inserted ${Math.min(i + BATCH, questions.length)}/${questions.length}`)
}

console.log(`\n✅ Done! ${questions.length} questions seeded for the Basics section.`)
