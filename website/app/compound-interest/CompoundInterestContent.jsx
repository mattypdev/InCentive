const FAQ_ITEMS = [
  {
    q: 'What is compound interest in simple terms?',
    a: 'Compound interest is interest calculated on both your original deposit and the interest you\'ve already earned. Each period you earn a little more than the last, because your interest balance is growing. Over time this creates an exponential curve instead of a straight line.',
  },
  {
    q: 'How often does interest compound?',
    a: 'It depends on the account. High-yield savings accounts and money market accounts typically compound daily. Most CDs compound daily or monthly. Index funds and ETFs don\'t have a fixed compounding schedule — they reinvest dividends when paid, which is usually quarterly.',
  },
  {
    q: 'What annual return rate should I use in the calculator?',
    a: 'A common benchmark is 7% annually, which reflects the S&P 500\'s historical average after adjusting for inflation. For conservative cash savings, 4–5% reflects current high-yield savings rates. For a bond-heavy portfolio, 3–4% is realistic. Pick a rate that matches what you\'re actually investing in.',
  },
  {
    q: 'Is compound interest the same as APY?',
    a: 'APY (Annual Percentage Yield) already accounts for compounding frequency. An account with a 6% nominal rate compounded monthly has an APY of about 6.17%. When comparing savings accounts, always compare APY — it shows the real annual return including compounding, so the math is already done for you.',
  },
  {
    q: 'What types of accounts use compound interest?',
    a: 'High-yield savings accounts, money market accounts, CDs, and bonds all pay compound interest. Investment accounts (brokerage, IRA, 401(k)) compound through reinvested dividends and capital gains. The key is to reinvest returns rather than withdraw them — that\'s what keeps the compounding going.',
  },
  {
    q: 'Can compound interest work against me?',
    a: 'Absolutely — and it\'s a much faster process when you\'re the borrower. Credit cards often charge 20–30% APR compounded daily. A $5,000 balance you only make minimum payments on can easily balloon past $10,000 before you pay it off. The same math that builds wealth can destroy it when the interest is working against you.',
  },
  {
    q: 'Does inflation reduce my compound interest gains?',
    a: 'Yes. If your account returns 5% but inflation is 3%, your real purchasing power only grows by about 2%. This is why a high-yield savings account that just matches inflation isn\'t really building wealth — it\'s treading water. Equities historically outpace inflation by 4–7% annually, which is why long-term investors hold stocks.',
  },
  {
    q: 'What happens if I stop contributing for a few months?',
    a: 'The interest already in your account keeps compounding regardless. Missing contributions slows your balance growth but doesn\'t reset anything. The bigger risk is withdrawing principal — that actually reduces the base your interest grows on. Contributing inconsistently is far better than not starting at all.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function CompoundInterestContent() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="ci-content">

        {/* ── 1. What Is Compound Interest ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">What is compound interest?</h2>
          <p className="ci-prose">
            Compound interest is interest calculated on both your original deposit <em>and</em> the
            interest you&apos;ve already earned. Unlike simple interest — which only ever applies to
            your starting amount — compound interest snowballs. Each period, your interest earns its
            own interest, so the growth accelerates over time.
          </p>
          <p className="ci-prose">
            Think of it this way: if you earn $70 on a $1,000 deposit in year one, year two&apos;s
            interest is calculated on $1,070, not $1,000. That extra $70 earns $4.90 more than it
            would have. Small at first — life-changing over decades.
          </p>

          <div className="ci-highlight-box">
            <p className="ci-highlight-label">Worked example — $1,000 at 7% compounded annually</p>
            <div className="ci-example-rows">
              <div className="ci-example-row">
                <span className="ci-example-year">Year 1</span>
                <span className="ci-example-calc">$1,000.00 × 1.07</span>
                <span className="ci-example-result">$1,070.00</span>
              </div>
              <div className="ci-example-row">
                <span className="ci-example-year">Year 2</span>
                <span className="ci-example-calc">$1,070.00 × 1.07</span>
                <span className="ci-example-result">$1,144.90</span>
              </div>
              <div className="ci-example-row">
                <span className="ci-example-year">Year 3</span>
                <span className="ci-example-calc">$1,144.90 × 1.07</span>
                <span className="ci-example-result">$1,225.04</span>
              </div>
            </div>
            <p className="ci-highlight-note">
              After 3 years you&apos;ve earned $225.04 in interest. Simple interest at the same rate
              would have paid exactly $210.00 — compounding added an extra $15.04 in just 3 years.
              Over 30 years that gap becomes thousands.
            </p>
          </div>
        </section>

        {/* ── 2. The Formula ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">The compound interest formula</h2>
          <p className="ci-prose">
            The standard compound interest formula for a lump sum is:
          </p>

          <div className="ci-formula-box">
            <div className="ci-formula">A = P (1 + r/n)<sup>nt</sup></div>
          </div>

          <dl className="ci-terms">
            <div className="ci-term-row">
              <dt>A</dt>
              <dd>Final amount — what your money grows to</dd>
            </div>
            <div className="ci-term-row">
              <dt>P</dt>
              <dd>Principal — your initial deposit or investment</dd>
            </div>
            <div className="ci-term-row">
              <dt>r</dt>
              <dd>Annual interest rate as a decimal (7% = 0.07)</dd>
            </div>
            <div className="ci-term-row">
              <dt>n</dt>
              <dd>Number of times interest compounds per year (12 for monthly)</dd>
            </div>
            <div className="ci-term-row">
              <dt>t</dt>
              <dd>Time in years</dd>
            </div>
          </dl>

          <p className="ci-prose">
            Applied to the example above — $1,000 at 7% compounded monthly for 30 years — the math
            is: A = 1,000 × (1 + 0.07/12)<sup>360</sup> = <strong>$7,974</strong>. The calculator
            above also handles regular monthly contributions using the future value of an annuity
            formula layered on top.
          </p>
        </section>

        {/* ── 3. Simple vs Compound ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">Simple interest vs. compound interest</h2>
          <p className="ci-prose">
            Simple interest pays the same dollar amount every year. Compound interest grows because
            each year&apos;s interest becomes part of next year&apos;s base. Same $1,000 deposit,
            same 7% rate, 30 years — two very different outcomes:
          </p>

          <div className="ci-compare-table">
            <div className="ci-compare-header">
              <span>Method</span>
              <span>Formula</span>
              <span>After 30 years</span>
            </div>
            <div className="ci-compare-row">
              <span className="ci-compare-label">Simple interest</span>
              <span className="ci-compare-formula">$1,000 + ($1,000 × 0.07 × 30)</span>
              <span className="ci-compare-amount ci-compare-amount--plain">$3,100</span>
            </div>
            <div className="ci-compare-row">
              <span className="ci-compare-label">Compound (annual)</span>
              <span className="ci-compare-formula">$1,000 × (1.07)<sup>30</sup></span>
              <span className="ci-compare-amount ci-compare-amount--accent">$7,612</span>
            </div>
          </div>

          <p className="ci-prose">
            Compounding produces <strong>$4,512 more</strong> on the exact same deposit with the
            exact same rate. That difference exists entirely because each year&apos;s gains were
            re-invested and allowed to grow. No extra work, no extra risk — just time.
          </p>
        </section>

        {/* ── 4. Compounding Frequency ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">How compounding frequency affects your balance</h2>
          <p className="ci-prose">
            More frequent compounding means interest is added to your balance more often, giving it
            more chances to earn interest on itself. Here&apos;s what a $10,000 deposit at 6%
            grows to over 20 years depending on how often it compounds:
          </p>

          <div className="ci-freq-table">
            <div className="ci-freq-header">
              <span>Frequency</span>
              <span>Times/year</span>
              <span>Balance after 20 years</span>
            </div>
            <div className="ci-freq-row">
              <span>Annually</span>
              <span>1×</span>
              <span className="ci-freq-amount">$32,071</span>
            </div>
            <div className="ci-freq-row">
              <span>Quarterly</span>
              <span>4×</span>
              <span className="ci-freq-amount">$32,877</span>
            </div>
            <div className="ci-freq-row ci-freq-row--highlight">
              <span>Monthly</span>
              <span>12×</span>
              <span className="ci-freq-amount">$33,102</span>
            </div>
            <div className="ci-freq-row ci-freq-row--highlight">
              <span>Daily</span>
              <span>365×</span>
              <span className="ci-freq-amount">$33,198</span>
            </div>
          </div>

          <p className="ci-prose">
            Going from annual to daily compounding adds about $1,127 over 20 years on a $10,000
            deposit — real but not dramatic. The bigger variable by far is the interest rate itself.
            A 1% rate improvement beats any compounding frequency upgrade. Focus on finding the
            highest APY account first; compounding frequency is a secondary consideration.
          </p>
        </section>

        {/* ── 5. Rule of 72 ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">The Rule of 72 — how long to double your money</h2>
          <p className="ci-prose">
            The Rule of 72 is a mental math shortcut: divide 72 by your annual interest rate to
            estimate how many years it takes your money to double. No calculator needed.
          </p>

          <div className="ci-rule72-grid">
            <div className="ci-rule72-card">
              <div className="ci-rule72-rate">4%</div>
              <div className="ci-rule72-years">18 years</div>
              <div className="ci-rule72-calc">72 ÷ 4</div>
            </div>
            <div className="ci-rule72-card">
              <div className="ci-rule72-rate">6%</div>
              <div className="ci-rule72-years">12 years</div>
              <div className="ci-rule72-calc">72 ÷ 6</div>
            </div>
            <div className="ci-rule72-card ci-rule72-card--accent">
              <div className="ci-rule72-rate">7%</div>
              <div className="ci-rule72-years">~10 years</div>
              <div className="ci-rule72-calc">72 ÷ 7</div>
            </div>
            <div className="ci-rule72-card">
              <div className="ci-rule72-rate">9%</div>
              <div className="ci-rule72-years">8 years</div>
              <div className="ci-rule72-calc">72 ÷ 9</div>
            </div>
            <div className="ci-rule72-card">
              <div className="ci-rule72-rate">12%</div>
              <div className="ci-rule72-years">6 years</div>
              <div className="ci-rule72-calc">72 ÷ 12</div>
            </div>
          </div>

          <p className="ci-prose">
            The rule also works in reverse for debt: a credit card charging 24% APR doubles what
            you owe in 3 years (72 ÷ 24). Use this rule to instantly sanity-check any investment
            pitch or loan offer. If someone says you&apos;ll &ldquo;double your money in 2
            years,&rdquo; they&apos;re implying a 36% annual return — a significant red flag.
          </p>
        </section>

        {/* ── 6. Starting at 22 vs 32 ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">Why starting at 22 beats starting at 32</h2>
          <p className="ci-prose">
            The most important variable in compound interest isn&apos;t the rate — it&apos;s time.
            Consider two people, both investing $200 per month at a 7% annual return into a
            retirement account until age 65:
          </p>

          <div className="ci-age-compare">
            <div className="ci-age-card">
              <div className="ci-age-label">Starts at 22</div>
              <div className="ci-age-years">43 years invested</div>
              <div className="ci-age-contributed">$103,200 contributed</div>
              <div className="ci-age-total">$655,500</div>
              <div className="ci-age-total-label">at retirement</div>
            </div>
            <div className="ci-age-vs">vs</div>
            <div className="ci-age-card ci-age-card--dim">
              <div className="ci-age-label">Starts at 32</div>
              <div className="ci-age-years">33 years invested</div>
              <div className="ci-age-contributed">$79,200 contributed</div>
              <div className="ci-age-total">$308,800</div>
              <div className="ci-age-total-label">at retirement</div>
            </div>
          </div>

          <p className="ci-prose">
            The 10-year head start costs only <strong>$24,000 more in contributions</strong> — but
            produces <strong>$346,700 more at retirement</strong>. The person who started at 22
            ends up with more than double the balance despite contributing only about 30% more
            money. That gap is entirely compound interest at work over an extra decade.
          </p>
          <p className="ci-prose">
            The lesson isn&apos;t to invest more — it&apos;s to start now. Even $50 a month at 22
            outperforms $200 a month starting at 35. Time in the market is the one variable you
            can&apos;t buy back.
          </p>
        </section>

        {/* ── 7. FAQ ── */}
        <section className="ci-section">
          <h2 className="ci-section-title">Frequently asked questions</h2>
          <dl className="ci-faq-list">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="ci-faq-item">
                <dt className="ci-faq-q">{q}</dt>
                <dd className="ci-faq-a">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

      </div>
    </>
  )
}
