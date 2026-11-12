// Converts all non-MC questions in the Basics section to multiple-choice.
// Run: node scripts/patch-to-mc.mjs

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

const mc = (lessonId, pos, prompt, options, correct, explanation) => ({
  lesson_id: lessonId,
  unit_id: lessonId.replace(/-l\d+$/, ''),
  type: 'multiple-choice',
  position: pos,
  prompt, options, correct, explanation,
  meta: null,
})

// MC replacements for every interactive question (1 per affected lesson, at position 0)
const replacements = [

  // u1-1-l1 was: order (history of money timeline)
  mc('u1-1-l1', 0,
    'Which correctly lists the evolution of money from earliest to most recent?',
    [
      'Barter → Commodity money → Metal coins → Paper money → Digital',
      'Coins → Barter → Paper → Digital → Commodity',
      'Paper → Barter → Commodity → Digital → Coins',
      'Digital → Paper → Coins → Commodity → Barter',
    ], 0,
    'Money evolved step by step: barter (direct trade) → commodity money (gold, salt) → metal coins → paper notes → digital payments.'
  ),

  // u1-1-l5 was: sort (commodity vs fiat)
  mc('u1-1-l5', 0,
    'Which of these is an example of COMMODITY money?',
    ['Gold coins', 'A dollar bill', 'A British Pound', 'A Japanese Yen'],
    0,
    'Commodity money has intrinsic value — gold is useful even outside its role as currency. Dollar bills and national currencies are fiat money.'
  ),

  // u1-2-l1 was: sort (active vs passive)
  mc('u1-2-l1', 0,
    'Which of these is PASSIVE income?',
    ['Rental income from a property you own', 'Hourly wages at a job', 'A freelance project payment', 'Server tips at a restaurant'],
    0,
    'Passive income flows in without ongoing active effort. The others require you to trade your time directly for money.'
  ),

  // u1-2-l2 was: wordbank (gross vs net)
  mc('u1-2-l2', 0,
    'Your gross income is $4,000/month. After $600 in taxes and $200 in benefits are deducted, your net income is:',
    ['$3,200', '$4,000', '$3,400', '$2,800'],
    0,
    'Net = Gross − deductions. $4,000 − $600 − $200 = $3,200. This is the money that actually hits your bank account.'
  ),

  // u1-2-l8 was: order (income stream steps)
  mc('u1-2-l8', 0,
    'What should you establish FIRST when building multiple income streams?',
    [
      'A stable primary income source',
      'A diversified investment portfolio',
      'A side hustle business',
      'Passive income investments',
    ], 0,
    'Stability comes first. Secure a reliable main income before layering in side hustles and passive streams.'
  ),

  // u1-3-l1 was: sort (needs vs wants)
  mc('u1-3-l1', 0,
    'Which of these is a NEED rather than a want?',
    ['Prescription medication', 'A streaming service subscription', 'Designer sneakers', 'Concert tickets'],
    0,
    'Needs are essential for health, safety, or the ability to earn income. Prescription medication meets that bar; entertainment does not.'
  ),

  // u1-3-l3 was: sort (fixed vs variable)
  mc('u1-3-l3', 0,
    'Which of these is a FIXED expense?',
    ['Monthly rent payment', 'Electricity bill', 'Dining out', 'Grocery shopping'],
    0,
    'Fixed = same amount every month. Rent is the classic example. Utilities, dining, and groceries vary each period.'
  ),

  // u1-3-l5 was: sort (recurring vs one-time)
  mc('u1-3-l5', 0,
    'Which of these is a RECURRING expense?',
    ['A Netflix subscription', 'Buying a new laptop', 'An emergency car repair', 'A birthday gift for a friend'],
    0,
    'Recurring = happens on a regular schedule. Subscriptions renew automatically; the others are one-time events.'
  ),

  // u1-4-l4 was: wordbank (simple interest formula)
  mc('u1-4-l4', 0,
    'In the simple interest formula I = P × r × t, what does "r" represent?',
    ['The annual interest rate (as a decimal)', 'The repayment period in months', 'The remaining balance', 'The risk adjustment factor'],
    0,
    'I = Principal × Rate × Time. Rate (r) is the annual interest rate as a decimal — e.g., 5% becomes 0.05.'
  ),

  // u1-4-l6 was: order (saving goals steps)
  mc('u1-4-l6', 0,
    'What is the FIRST step when setting a savings goal?',
    [
      'Identify what you are saving for',
      'Automate monthly transfers to savings',
      'Set a target date for the goal',
      'Divide the total cost by months remaining',
    ], 0,
    'You need to know what you\'re saving for before anything else. Then: research cost → set deadline → calculate monthly amount → automate.'
  ),

  // u2-1-l3 was: sort (credit union vs bank)
  mc('u2-1-l3', 0,
    'Which statement about credit unions is TRUE?',
    [
      'They are member-owned and operate as non-profits',
      'They are publicly traded companies like big banks',
      'They are insured by the FDIC just like banks',
      'They are open to anyone regardless of eligibility',
    ], 0,
    'Credit unions are non-profit cooperatives owned by their members. They\'re insured by the NCUA (not FDIC) and require eligibility to join.'
  ),

  // u2-1-l6 was: wordbank (FDIC coverage amount)
  mc('u2-1-l6', 0,
    'The FDIC insures bank deposits up to how much per depositor, per insured bank?',
    ['$250,000', '$100,000', '$500,000', '$1,000,000'],
    0,
    'FDIC coverage is $250,000 per depositor per insured institution. Joint accounts and retirement accounts get separate coverage limits.'
  ),

  // u2-1-l7 was: order (reading bank statements)
  mc('u2-1-l7', 0,
    'What should you do FIRST when reviewing your monthly bank statement?',
    [
      'Log in to your bank account or open the statement',
      'Flag any unrecognised transactions immediately',
      'Report fraudulent charges to your bank',
      'Reconcile the statement with your monthly budget',
    ], 0,
    'You have to open the statement before you can review it. Order: open → check balances → review transactions → flag issues → report fraud.'
  ),
]

// Delete all non-MC questions in the Basics section, then insert MC replacements
const LESSON_IDS = replacements.map(r => r.lesson_id)

console.log(`Patching ${replacements.length} interactive questions to multiple-choice...`)

// Delete only the non-MC rows for these lessons
const { error: delError } = await supabase
  .from('questions')
  .delete()
  .in('lesson_id', LESSON_IDS)
  .neq('type', 'multiple-choice')

if (delError) { console.error('Delete failed:', delError); process.exit(1) }
console.log(`✓ Removed interactive questions from ${LESSON_IDS.length} lessons`)

// Insert the MC replacements
const { error: insError } = await supabase.from('questions').insert(replacements)
if (insError) { console.error('Insert failed:', insError); process.exit(1) }
console.log(`✓ Inserted ${replacements.length} MC replacements`)

console.log('\n✅ Done! All questions in the Basics section are now multiple-choice.')
