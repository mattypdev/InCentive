-- Insert the "How Compound Interest Works" article.
-- Run once in Supabase Dashboard → SQL Editor.
-- Requires the slug column to exist (migration 20260811000000).

INSERT INTO articles (title, author, slug, published_at, body)
VALUES (
  'How Compound Interest Works',
  'incentive team',
  'how-compound-interest-works',
  NOW(),
  NOW(),
  $body$<p>Compound interest is one of the most powerful forces in personal finance — and one of the most misunderstood. Once you see the math, you'll understand why starting to invest early isn't just good advice: it's the difference between a comfortable future and a stressful one.</p>

<h2>What is compound interest?</h2>
<p>Compound interest is interest calculated on both your original deposit <em>and</em> the interest you've already earned. Unlike simple interest — which only ever applies to your starting amount — compound interest snowballs. Each period, your interest earns its own interest, so growth accelerates over time.</p>
<p>Think of it this way: if you earn $70 on a $1,000 deposit in year one, year two's interest is calculated on $1,070, not $1,000. That extra $70 earns $4.90 more than it would have. Small at first — life-changing over decades.</p>
<blockquote><p><strong>Worked example — $1,000 at 7% compounded annually</strong><br>Year 1: $1,000.00 × 1.07 = $1,070.00<br>Year 2: $1,070.00 × 1.07 = $1,144.90<br>Year 3: $1,144.90 × 1.07 = $1,225.04<br><br>After 3 years you've earned $225.04. Simple interest at the same rate pays exactly $210.00 — compounding adds $15.04 in just 3 years. Over 30 years that gap becomes thousands of dollars.</p></blockquote>

<h2>The compound interest formula</h2>
<p>The standard formula for a lump-sum deposit is:</p>
<pre>A = P (1 + r/n)^nt</pre>
<p>Where each variable means:</p>
<ul>
<li><strong>A</strong> — Final amount: what your money grows to</li>
<li><strong>P</strong> — Principal: your initial deposit or investment</li>
<li><strong>r</strong> — Annual interest rate as a decimal (7% = 0.07)</li>
<li><strong>n</strong> — Number of compounding periods per year (12 for monthly)</li>
<li><strong>t</strong> — Time in years</li>
</ul>
<p>Applied to $1,000 at 7% compounded monthly for 30 years: A = 1,000 × (1 + 0.07/12)<sup>360</sup> = <strong>$7,974</strong>. That's nearly eight times your original investment with zero additional contributions. The formula also has a version that includes regular contributions — which is what most calculators (including ours) use in practice.</p>

<h2>Simple interest vs. compound interest: the same numbers, very different results</h2>
<p>Simple interest pays the same fixed dollar amount every year — always calculated on the original principal only. Compound interest grows because each year's interest becomes part of next year's base. Same $1,000 deposit, same 7% rate, 30 years:</p>
<ul>
<li><strong>Simple interest:</strong> $1,000 + ($1,000 × 0.07 × 30) = <strong>$3,100</strong></li>
<li><strong>Compound interest (annual):</strong> $1,000 × (1.07)<sup>30</sup> = <strong>$7,612</strong></li>
</ul>
<p>Compounding produces <strong>$4,512 more</strong> on the exact same deposit at the exact same rate. That difference exists entirely because each year's gains were left in and allowed to keep growing. No extra work, no extra risk — just time doing its job.</p>

<h2>How compounding frequency affects your balance</h2>
<p>More frequent compounding means interest is added to your balance more often, giving each dollar more time to earn its own interest. Here's what a $10,000 deposit at 6% grows to over 20 years, depending on how often interest compounds:</p>
<ul>
<li>Annually (1× per year): <strong>$32,071</strong></li>
<li>Quarterly (4× per year): <strong>$32,877</strong></li>
<li>Monthly (12× per year): <strong>$33,102</strong></li>
<li>Daily (365× per year): <strong>$33,198</strong></li>
</ul>
<p>The difference between annual and daily compounding over 20 years is only about $1,127 — real, but not the main event. The interest rate matters far more. A 1% rate improvement beats any compounding frequency upgrade. When comparing savings accounts, always look at APY (which already accounts for compounding) rather than the nominal rate.</p>

<h2>The Rule of 72: how long will it take to double your money?</h2>
<p>The Rule of 72 is a quick mental math shortcut: divide 72 by your annual interest rate to estimate how many years it takes your money to double.</p>
<ul>
<li>At 4%: 72 ÷ 4 = <strong>18 years</strong></li>
<li>At 6%: 72 ÷ 6 = <strong>12 years</strong></li>
<li>At 7%: 72 ÷ 7 = <strong>about 10 years</strong></li>
<li>At 9%: 72 ÷ 9 = <strong>8 years</strong></li>
<li>At 12%: 72 ÷ 12 = <strong>6 years</strong></li>
</ul>
<p>The rule works in reverse for debt too. A credit card charging 24% APR doubles what you owe in just 3 years (72 ÷ 24 = 3). If an investment pitch promises you'll "double your money in 2 years," that implies a 36% annual return — a significant red flag worth questioning before committing any money.</p>

<h2>Why starting at 22 beats starting at 32 — the actual numbers</h2>
<p>The most important variable in compound interest isn't the rate. It's time. Consider two people investing the same amount every month at the same return, both stopping at 65:</p>
<ul>
<li><strong>Starts investing at 22</strong> — 43 years in the market, $103,200 contributed, <strong>$655,500 at retirement</strong></li>
<li><strong>Starts investing at 32</strong> — 33 years in the market, $79,200 contributed, <strong>$308,800 at retirement</strong></li>
</ul>
<p>Both are putting in $200 per month at 7% annually. The 10-year head start costs only <strong>$24,000 more in total contributions</strong> — but produces <strong>$346,700 more at retirement</strong>. The earlier investor ends up with more than double the balance despite contributing only about 30% more money. Every dollar of that gap is compound interest working across an extra decade.</p>
<p>The takeaway isn't to invest more — it's to start now. Even $50 a month at 22 outperforms $200 a month starting at 35. Time in the market is the one variable you genuinely cannot buy back, no matter how much you earn later.</p>

<hr>

<h2>Frequently asked questions</h2>

<h3>What is compound interest in simple terms?</h3>
<p>It's interest on top of interest. Each time interest is added to your account, it becomes part of the balance — so next period you earn interest on a slightly larger number. Repeat that for years and the growth becomes exponential rather than linear.</p>

<h3>How often does interest compound?</h3>
<p>It depends on the account. High-yield savings accounts and money market accounts typically compound daily. Most CDs compound daily or monthly. Investment accounts (IRA, 401(k)) compound through reinvested dividends, usually quarterly. When comparing accounts, APY already accounts for compounding frequency — focus on APY, not the advertised nominal rate.</p>

<h3>What annual return rate should I use when planning?</h3>
<p>A common benchmark is 7% annually, which reflects the S&P 500's historical average after adjusting for inflation. For cash savings, 4–5% reflects current high-yield rates. For a conservative bond-heavy portfolio, 3–4% is realistic. Pick a rate that matches what you're actually investing in — and be skeptical of anything above 10% in long-term projections.</p>

<h3>Is compound interest the same as APY?</h3>
<p>APY (Annual Percentage Yield) is the rate that already incorporates compounding. An account with a 6% nominal rate compounded monthly has an APY of about 6.17%. When comparing savings accounts, always compare APY — it tells you the true annual return and the math is already done for you.</p>

<h3>Can compound interest work against me?</h3>
<p>Absolutely — and faster than you'd expect. Credit cards often charge 20–30% APR compounded daily. A $5,000 balance where you only make minimum payments can easily exceed $10,000 before it's paid off. The same mechanism that builds long-term wealth destroys it when you're on the borrowing side. Pay off high-interest debt before prioritizing investments.</p>

<h3>Does inflation reduce my compound interest gains?</h3>
<p>Yes. If your account returns 5% but inflation runs at 3%, your real purchasing power grows by only about 2%. A savings account that just matches inflation isn't building wealth — it's keeping pace. Equities have historically outpaced inflation by 4–7% annually, which is why long-term investors hold stocks despite short-term volatility.</p>

<h3>What happens if I stop contributing for a few months?</h3>
<p>The interest already in your account keeps compounding regardless. Missing contributions slows your balance growth but doesn't reset anything. The bigger risk is withdrawing principal, which reduces the base your interest grows on. Contributing inconsistently is far better than not starting at all — start small, stay consistent, and increase contributions when you can.</p>

<h3>What's the best account type for compound interest?</h3>
<p>For liquid savings: a high-yield savings account or money market account. For long-term wealth: a tax-advantaged account like a Roth IRA or 401(k) invested in low-cost index funds. The tax-free or tax-deferred growth in these accounts amplifies compounding significantly — $1 of tax-free growth compounds more effectively than $1 that's taxed each year.</p>$body$
);
