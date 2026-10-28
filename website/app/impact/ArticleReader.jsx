'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGES = [
  {
    content: (
      <div className="ar-page ar-page--cover">
        <span className="ar-eyebrow">Business · This is Reno</span>
        <h1 className="ar-title">
          Taking the initiative to create incentive: Reno high school students launch a
          nation-wide financial literacy nonprofit
        </h1>
        <div className="ar-meta">
          <span className="ar-author">By Nora Tarte</span>
          <span className="ar-date">September 27, 2026</span>
        </div>
        <div className="ar-cover-photo">
          <div className="ar-photo-placeholder">
            <span>Davidson Academy · University of Nevada, Reno</span>
          </div>
          <p className="ar-caption">Davidson Academy on the University of Nevada, Reno campus. Bob Conrad / THIS IS RENO</p>
        </div>
      </div>
    ),
  },
  {
    content: (
      <div className="ar-page">
        <p className="ar-body">
          After taking a financial literacy course in middle school, Sathvik Vadlakunta walked away confused. He carried with him a small nugget of information — certificates of deposits are low risk — but he didn't really know what it meant. He had hoped the course would teach him how to open a bank account, manage his credit and create a budget.
        </p>
        <blockquote className="ar-quote">
          "The class was supposed to prepare me for financial adulthood. But instead, it gave me a perfect example of exactly what financial literacy education should never look like."
          <cite>— Sathvik Vadlakunta, Davidson Academy</cite>
        </blockquote>
        <p className="ar-body">
          After he reached high school, Vadlakunta realized that he could do something about the financial literacy gap in Nevada K-12 education. With the help of Matthew Park, a senior at the Illinois Math and Science Academy in Aurora, Illinois, he started Incentive — financial literacy curriculum geared toward middle and high school students.
        </p>
      </div>
    ),
  },
  {
    content: (
      <div className="ar-page">
        <p className="ar-body">
          Financial literacy is a problem across the country, but Vadlakunta zeroed in on the deficits Nevada was facing specifically. He cited Nevada's low financial literacy rating compared to other states despite the fact it is also one of the fastest growing states in the nation. He also saw high household debt rates and youth unemployment rates.
        </p>
        <blockquote className="ar-quote">
          "The reality is that most Nevada students will graduate without ever learning basic financial principles like filing taxes, building credit or even how to open a savings account. They'll enter adulthood making financial decisions that encroach upon them for decades, prepped with nothing but guesswork."
          <cite>— Sathvik Vadlakunta</cite>
        </blockquote>
        <p className="ar-body">
          Vadlakunta said this deficit is a "systematic failure," but he also saw it as an opportunity to take control of Nevada's financial future. Instead of asking for adults to step in and change it for him, he created a space where he could enact the change himself.
        </p>
        <blockquote className="ar-quote">
          "Nevada's next generation doesn't just deserve financial literacy education. They deserve to be the ones who make it happen."
          <cite>— Sathvik Vadlakunta</cite>
        </blockquote>
      </div>
    ),
  },
  {
    content: (
      <div className="ar-page">
        <p className="ar-body">
          Incentive works by hosting financial literacy workshops throughout the country. Because there is a local chapter in Reno, students can reach out directly to request one. High school students can become even more involved in the mission by starting chapters at their own schools and in their own communities — directing workshops, planning events, hosting fundraisers and running community drives.
        </p>
        <blockquote className="ar-quote">
          "By starting a chapter, students become active voices in their community, becoming a driver of free and quality financial literacy education."
          <cite>— Sathvik Vadlakunta</cite>
        </blockquote>
        <p className="ar-body">
          Students who want to engage in curriculum on a personal level can do so through <strong>incentivefinance.org</strong>, a gamified set of financial literacy lessons covering a myriad of topics in the personal finance space.
        </p>
        <blockquote className="ar-quote">
          "Students work through bite-sized lessons on budgeting, saving, credit and investing, earning points, badges and level-ups as they go, so progress feels like a game instead of a chore."
          <cite>— Sathvik Vadlakunta</cite>
        </blockquote>
      </div>
    ),
  },
  {
    content: (
      <div className="ar-page">
        <p className="ar-body">
          The backbone of the program is student volunteers who lead workshops, run supply drives and build community partnerships. In fact, students teaching students is part of what makes the model work.
        </p>
        <blockquote className="ar-quote">
          "A junior explaining compound interest to a sophomore in a language they both understand is worth more than any textbook can offer."
          <cite>— Sathvik Vadlakunta</cite>
        </blockquote>
        <p className="ar-body">
          There are a total of six states with chapters, and more than 200 students have interacted with the curriculum. Vadlakunta and Park used their personal connections to grow Incentive quickly, then spread the word through TikTok and Instagram, often posting personal finance lessons online.
        </p>
        <p className="ar-body">
          What started as a grassroots effort in February became a registered nonprofit by April, coinciding with personal finance month. There are 30 volunteers making the six chapters run, and the goal is to continue expansion — including into collegiate and international markets.
        </p>
        <blockquote className="ar-quote">
          "Giving college students the ability to teach financial literacy within their communities helps us exponentiate bridging the gap from underrepresented communities to those who have access to proper education."
          <cite>— Sathvik Vadlakunta</cite>
        </blockquote>
      </div>
    ),
  },
]

export default function ArticleReader() {
  const [page, setPage] = useState(0)
  const total = PAGES.length

  return (
    <div className="ar-wrap">
      <div className="ar-book">
        {PAGES[page].content}
      </div>

      <div className="ar-nav">
        <button
          className="ar-nav-btn"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <span className="ar-page-count">
          {page + 1} <span className="ar-page-sep">/</span> {total}
        </span>

        <button
          className="ar-nav-btn"
          onClick={() => setPage(p => Math.min(total - 1, p + 1))}
          disabled={page === total - 1}
          aria-label="Next page"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      <a
        href="https://thisisreno.com/2026/09/students-launch-incentive-financial-literacy/"
        target="_blank"
        rel="noopener noreferrer"
        className="ar-source"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/this-is-reno.webp" alt="This is Reno" className="ar-source-logo" />
        <span>Read original article ↗</span>
      </a>
    </div>
  )
}
