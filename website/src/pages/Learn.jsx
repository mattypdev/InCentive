import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { allUnits } from '../data/levels'
import { fetchQuestionsMap } from '../lib/questionsApi'
import { getStoredProgress, storeProgress } from '../lib/guestProgress'
import { ChevronLeft, ChevronRight, ArrowLeft, LogIn, Lock, Check, Star, Trophy, RefreshCw, Map as MapIcon } from 'lucide-react'
import { triggerCoinFly, triggerXPFly } from '../components/CoinFlyLayer'
import CoinBadge from '../components/CoinBadge'
import './Learn.css'

const SECTIONS = [
  { id: 's1', label: 'The Basics', color: '#FF6F61', desc: 'Money, income, budgeting, and banking',
    unitIds: ['u1-1','u1-2','u1-3','u1-4','u2-1','u2-2'] },
  { id: 's2', label: 'Banking & Budgeting', color: '#0D9488', desc: 'Compound interest, budgets, and credit scores',
    unitIds: ['u2-3','u3-1','u3-2','u3-3','u4-1','u4-2'] },
  { id: 's3', label: 'Taxes & Investing', color: '#F59E0B', desc: 'Filing taxes and putting money to work',
    unitIds: ['u4-3','u5-1','u5-2','u6-1','u7-1','u7-2'] },
  { id: 's4', label: 'Markets & Business', color: '#3B82F6', desc: 'Stocks, funds, retirement, and economics',
    unitIds: ['u7-3','u7-4','u7-5','u8-1','u9-1','u10-1'] },
  { id: 's5', label: 'Advanced Topics', color: '#8B5CF6', desc: 'Real estate, debt, and entrepreneurship',
    unitIds: ['u11-1','u12-1','u13-1','u14-1','u15-1'] },
  { id: 's6', label: 'Finance & Psychology', color: '#6366F1', desc: 'Behavioral finance, emotional spending, and money mindset',
    unitIds: ['u16-1','u17-1','u18-1','u19-1','u21-1','u22-1'] },
  { id: 'cap', label: 'Capstone Challenge', color: '#F59E0B', desc: '40 questions drawn from all sections · Pass 35/40',
    unitIds: [], isCapstone: true },
]

const NODE_R       = 34
const TRAIL_CENTER = 150
const TRAIL_TOP    = 56

// Unique zigzag offsets and vertical spacing per section
const SECTION_PATHS = {
  s1:  { zigzag: [0, -55, -82, -55,  0,  55, 82, 55],  interval: 180 }, // smooth S-curve
  s2:  { zigzag: [72, -72,  72, -72, 72, -72, 72, -72], interval: 170 }, // sharp left-right
  s3:  { zigzag: [-78, -38, 12, 58, 80, 48, -8, -58],   interval: 185 }, // sweeps right then back
  s4:  { zigzag: [0, -82, -65, -20, 30, 70, 82, 55],    interval: 175 }, // heavy left lean then right
  s5:  { zigzag: [60, 82,  55,  10, -38, -72, -80, -50], interval: 182 }, // leans right to left
  s6:  { zigzag: [-35, 68, -80, 20, -58, 80, -15, 58],   interval: 178 }, // organic irregular
  cap: { zigzag: [0],                                    interval: 180 }, // single node, centered
}

// Ordered node IDs *within* each section. Sections themselves are freely
// enterable — you only have to work in order once you're on an island.
const SECTION_NODE_IDS = SECTIONS.reduce((acc, s) => {
  acc[s.id] = s.isCapstone ? ['capstone'] : [...s.unitIds, `${s.id}-test`]
  return acc
}, {})

// Every non-capstone node, used to decide when the capstone island opens
const ALL_SECTION_NODE_IDS = SECTIONS
  .filter(s => !s.isCapstone)
  .flatMap(s => SECTION_NODE_IDS[s.id])

function sectionIdForNode(nodeId) {
  return SECTIONS.find(s => SECTION_NODE_IDS[s.id].includes(nodeId))?.id ?? null
}

const CAPSTONE_NODE = {
  id: 'capstone', title: 'Capstone Challenge',
  centsReward: 200, isCapstone: true, questions: [],
}

function chapterTestNode(section) {
  return {
    id: `${section.id}-test`, title: 'Chapter Test',
    centsReward: 100, isChapterTest: true, _sectionId: section.id, questions: [],
  }
}

function calcPositions(count, { zigzag, interval }) {
  return Array.from({ length: count }, (_, i) => ({
    x: TRAIL_CENTER + zigzag[i % zigzag.length],
    y: TRAIL_TOP + i * interval,
  }))
}

function NodeConnector({ p1, p2, done, color }) {
  const y1 = p1.y + NODE_R
  const y2 = p2.y - NODE_R
  const h  = y2 - y1
  if (h <= 0) return null
  const minX = Math.min(p1.x, p2.x) - 14
  const maxX = Math.max(p1.x, p2.x) + 14
  const w  = Math.max(maxX - minX, 28)
  const d  = `M ${p1.x - minX} 0 C ${p1.x - minX} ${h*0.45} ${p2.x - minX} ${h*0.55} ${p2.x - minX} ${h}`
  return (
    <svg style={{ position:'absolute', left:minX, top:y1, pointerEvents:'none', overflow:'visible' }} width={w} height={h}>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="14" strokeLinecap="round" />
      {done && <path d={d} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />}
    </svg>
  )
}

function fisherYates(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleOptions(questions) {
  return questions.map(q => {
    const correct = q.options[q.correct]
    const opts    = fisherYates(q.options)
    return { ...q, options: opts, correct: opts.indexOf(correct) }
  })
}

function FillBlankPrompt({ prompt, selectedOption, correctIndex, selectedIndex, showFeedback }) {
  const parts = prompt.split('______')
  if (parts.length < 2) return <p className="lesson-prompt">{prompt}</p>
  let cls = 'fill-blank-gap'
  if (selectedOption !== null && !showFeedback) cls += ' fill-blank-gap--pending'
  if (showFeedback && selectedIndex === correctIndex) cls += ' fill-blank-gap--correct'
  if (showFeedback && selectedIndex !== correctIndex) cls += ' fill-blank-gap--wrong'
  return (
    <p className="lesson-prompt lesson-prompt--fill-blank">
      {parts[0]}<span className={cls}>{selectedOption ?? '______'}</span>{parts[1]}
    </p>
  )
}

function SparkleEffect({ color }) {
  return (
    <div className="sparkle-effect" aria-hidden>
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = deg * Math.PI / 180
        return (
          <div key={i} className="sparkle-particle" style={{
            '--tx': `${Math.cos(rad)*40}px`, '--ty': `${Math.sin(rad)*40}px`,
            '--spark-color': color, animationDelay: `${i*0.025}s`,
          }} />
        )
      })}
    </div>
  )
}


export default function Learn() {
  const { currentUser, profile, refreshProfile, bumpXP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [completedIds,  setCompletedIds]  = useState(() => currentUser ? getStoredProgress() : new Set())
  const [activeUnit,    setActiveUnit]    = useState(null)
  const [shuffledQs,    setShuffledQs]    = useState([])
  const [qIndex,        setQIndex]        = useState(0)
  const [selected,      setSelected]      = useState(null)
  const [showFeedback,  setShowFeedback]  = useState(false)
  const [sessionOK,     setSessionOK]     = useState(0)
  const [lessonDone,    setLessonDone]    = useState(false)
  const [centsEarned,   setCentsEarned]   = useState(0)
  const [finalScore,    setFinalScore]    = useState({ correct:0, total:0 })
  const [sectionIndex,  setSectionIndex]  = useState(() => location.state?.sectionIndex ?? 0)
  // 'map' = island world view, 'path' = the node trail for one island
  const [view,          setView]          = useState(() => location.state?.sectionIndex != null ? 'path' : 'map')
  const [sparklingId,   setSparklingId]   = useState(null)
  const [qData,         setQData]         = useState(null)
  const touchStartX = useRef(null)

  const ALL_SPRITES = [
    '/sprites/coin-0-0.png', '/sprites/coin-0-1.png', '/sprites/coin-0-2.png',
    '/sprites/coin-1-0.png', '/sprites/coin-1-1.png', '/sprites/coin-1-2.png',
    '/sprites/coin-2-0.png', '/sprites/coin-2-1.png', '/sprites/coin-2-2.png',
  ]
  const [coinSprites, setCoinSprites] = useState(() =>
    [...ALL_SPRITES].sort(() => Math.random() - 0.5).slice(0, 4)
  )
  useEffect(() => {
    setCoinSprites([...ALL_SPRITES].sort(() => Math.random() - 0.5).slice(0, 4))
  }, [sectionIndex])

  useEffect(() => {
    fetchQuestionsMap()
      .then(setQData)
      .catch(err => {
        console.error('Failed to load questions from DB, falling back to local data:', err)
        setQData({ byLesson: {}, fillBlanks: {} })
      })
  }, [])

  const unitMap = useMemo(() => {
    const m = {}
    allUnits.forEach(u => {
      const lessons = u.lessons?.map(l => ({ ...l, questions: qData?.byLesson[l.id] ?? [] }))
      m[u.id] = { ...u, lessons, questions: qData?.byLesson[u.id] ?? u.questions ?? [] }
    })
    return m
  }, [qData])

  useEffect(() => {
    if (!currentUser) { setCompletedIds(new Set()); return }
    supabase.from('lesson_progress').select('lesson_id')
      .eq('user_id', currentUser.id).eq('completed', true)
      .then(({ data }) => {
        if (!data) return
        const supabaseIds = new Set(data.map(r => r.lesson_id))
        setCompletedIds(supabaseIds)
        storeProgress(supabaseIds)
      })
  }, [currentUser?.id])

  useEffect(() => {
    if (!activeUnit || lessonDone || showFeedback) return
    function onKey(e) {
      const n = parseInt(e.key)
      const q = shuffledQs[qIndex]
      if (n >= 1 && n <= 4 && q?.options[n-1] !== undefined) { setSelected(n-1); setShowFeedback(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeUnit, lessonDone, showFeedback, qIndex, shuffledQs])

  // Islands are open in any order; nodes inside an island stay sequential.
  // The capstone only opens once every section is finished.
  function isUnlocked(nodeId) {
    if (!currentUser) return true
    if (nodeId === 'capstone') return ALL_SECTION_NODE_IDS.every(id => completedIds.has(id))
    const secId = sectionIdForNode(nodeId)
    if (!secId) return true
    const order = SECTION_NODE_IDS[secId]
    const pos = order.indexOf(nodeId)
    if (pos <= 0) return true
    return order.slice(0, pos).every(id => completedIds.has(id))
  }

  // Per-island progress for the map view
  const mapStats = SECTIONS.map(s => {
    const ids = SECTION_NODE_IDS[s.id]
    return { done: ids.filter(id => completedIds.has(id)).length, total: ids.length }
  })
  const capstoneUnlocked = !currentUser || ALL_SECTION_NODE_IDS.every(id => completedIds.has(id))
  const overallDone  = mapStats.reduce((n, s) => n + s.done, 0)
  const overallTotal = mapStats.reduce((n, s) => n + s.total, 0)

  async function finishLesson(correct, total) {
    const unit   = activeUnit
    const score  = Math.round((correct / total) * 100)
    const earned = Math.round((unit.centsReward ?? 0) * (correct / total))
    if (currentUser) {
      const { error } = await supabase.from('lesson_progress').upsert(
        { user_id: currentUser.id, lesson_id: unit.id, completed: true, score },
        { onConflict: 'user_id,lesson_id' }
      )
      if (error) {
        console.error('Failed to save lesson progress:', error)
      } else {
        setCompletedIds(prev => new Set([...prev, unit.id]))
        bumpXP(earned)
        triggerCoinFly(earned)
        triggerXPFly(earned * 2)
        refreshProfile()
      }
    }
    setCentsEarned(earned)
    setFinalScore({ correct, total })
    setLessonDone(true)
  }

  function handleAnswer(i) {
    if (showFeedback) return
    setSelected(i); setShowFeedback(true)
  }

  async function handleNext() {
    const q  = shuffledQs[qIndex]
    const ok = sessionOK + (selected === q.correct ? 1 : 0)
    if (qIndex + 1 < shuffledQs.length) {
      setSessionOK(ok); setQIndex(i => i+1); setSelected(null); setShowFeedback(false)
    } else {
      await finishLesson(ok, shuffledQs.length)
    }
  }

  function startItem(node) {
    let questions
    if (node.isChapterTest) {
      const sec  = SECTIONS.find(s => s.id === node._sectionId)
      const pool = []
      sec.unitIds.forEach(id => {
        const u = unitMap[id]
        if (u) {
          const qs = u.lessons ? u.lessons.flatMap(l => l.questions ?? []) : (u.questions ?? [])
          pool.push(...qs)
          if (qData?.fillBlanks[id]) pool.push(qData.fillBlanks[id])
        }
      })
      questions = shuffleOptions(fisherYates(pool)).slice(0, 10)
    } else if (node.isCapstone) {
      const pool = []
      Object.values(unitMap).forEach(u => {
        const qs = u.lessons ? u.lessons.flatMap(l => l.questions ?? []) : (u.questions ?? [])
        pool.push(...qs)
        if (qData?.fillBlanks[u.id]) pool.push(qData.fillBlanks[u.id])
      })
      questions = shuffleOptions(fisherYates(pool)).slice(0, 40)
    } else {
      const base = [...node.questions]
      if (qData?.fillBlanks[node.id]) { const at = Math.floor(Math.random()*(base.length+1)); base.splice(at,0,qData.fillBlanks[node.id]) }
      questions = shuffleOptions(base)
    }
    setActiveUnit(node); setShuffledQs(questions)
    setQIndex(0); setSelected(null); setShowFeedback(false)
    setSessionOK(0); setLessonDone(false); setCentsEarned(0)
    setFinalScore({ correct:0, total:0 })
  }

  function exitLesson() { setActiveUnit(null); setLessonDone(false) }

  if (!qData) {
    return (
      <main className="learn-page">
        <section className="section"><div className="container">
          <div className="lesson-done"><p className="done-subtitle">Loading lessons…</p></div>
        </div></section>
      </main>
    )
  }

  function handleNodeClick(node) {
    if (!isUnlocked(node.id) || sparklingId) return
    if (node.lessons?.length) {
      navigate(`/learn/unit/${node.id}`, { state: { sectionIndex } })
      return
    }
    setSparklingId(node.id)
    setTimeout(() => { setSparklingId(null); startItem(node) }, 550)
  }

  /* ── DONE SCREEN ── */
  if (activeUnit && lessonDone) {
    const isTest      = activeUnit.isChapterTest || activeUnit.isCapstone
    const threshold   = activeUnit.isCapstone ? 35 : 7
    const passed      = isTest ? finalScore.correct >= threshold : null
    return (
      <main className="learn-page">
        <section className="section"><div className="container">
          <div className="lesson-done">
            <div className={`done-icon${isTest && passed ? ' done-icon--gold' : ''}`}>
              {activeUnit.isCapstone ? <Trophy size={36} strokeWidth={3}/> : isTest ? <Star size={36} strokeWidth={3}/> : <Check size={36} strokeWidth={3}/>}
            </div>
            <h2>{isTest ? (passed ? 'Test Passed!' : 'Test Complete') : 'Nice work.'}</h2>
            <p className="done-subtitle">{activeUnit.title}</p>
            {isTest && (
              <div className="done-test-result">
                <span className="done-test-score">{finalScore.correct}<span className="done-test-denom">/{finalScore.total}</span></span>
                <span className={`done-test-badge ${passed ? 'done-test-badge--passed' : 'done-test-badge--failed'}`}>
                  {passed ? 'Passed' : `Need ${threshold}/${finalScore.total}`}
                </span>
              </div>
            )}
            <div className="done-rewards">
              <div className="done-cents">
                <CoinBadge size={28} drop="2px 2px 0" />
                <span>+{centsEarned} cents earned</span>
              </div>
              <div className="done-xp">
                <span className="done-xp-icon"></span>
                <span>+{centsEarned * 2} XP earned</span>
              </div>
            </div>
            {!currentUser && (
              <div className="done-guest-cta">
                <p>Log in to save your progress and keep those cents.</p>
                <Link to="/login" className="btn btn-primary">
                  <span className="btn-label">Log in to save</span>
                  <span className="btn-icon-badge"><LogIn size={16} strokeWidth={2.5}/></span>
                </Link>
              </div>
            )}
            <button className="btn btn-secondary" onClick={exitLesson}>
              <span className="btn-label">Back to path</span>
              <span className="btn-icon-badge"><ArrowLeft size={16} strokeWidth={2.5}/></span>
            </button>
          </div>
        </div></section>
      </main>
    )
  }

  /* ── ACTIVE LESSON ── */
  if (activeUnit) {
    const q         = shuffledQs[qIndex]
    const isFill    = q?.type === 'fill-blank'
    const isCorrect = selected === q?.correct
    const pct       = (qIndex / shuffledQs.length) * 100
    const isTest    = activeUnit.isChapterTest || activeUnit.isCapstone
    const threshold = activeUnit.isCapstone ? 35 : 7
    return (
      <main className="learn-page">
        <section className="section"><div className="container">
          <div className="lesson-shell">
            <div className="lesson-top">
              <button className="lesson-exit" onClick={exitLesson}><ArrowLeft size={20} strokeWidth={2.5}/><span>Exit</span></button>
              <div className="lesson-progress-track"><div className="lesson-progress-fill" style={{width:`${pct}%`}}/></div>
              <span className="lesson-counter">{qIndex+1} / {shuffledQs.length}</span>
            </div>
            <div className="lesson-meta">
              <span className="lesson-title-inline">{activeUnit.title}</span>
              {isFill && <span className="fill-blank-tag">Fill in the blank</span>}
              {isTest && <span className="lesson-test-badge">Pass {threshold}/{shuffledQs.length}</span>}
            </div>
            {isFill ? (
              <FillBlankPrompt
                prompt={q.prompt}
                selectedOption={selected !== null ? q.options[selected] : null}
                correctIndex={q.correct} selectedIndex={selected} showFeedback={showFeedback}
              />
            ) : (
              <p className="lesson-prompt">{q?.prompt}</p>
            )}
            <ul className={`lesson-options${isFill ? ' lesson-options--fill-blank':''}`}>
              {q?.options.map((opt, i) => {
                let cls = 'lesson-option'
                if (showFeedback) { if (i===q.correct) cls+=' correct'; else if (i===selected) cls+=' wrong' }
                else if (i===selected) cls+=' selected'
                return (
                  <li key={i}>
                    <button className={cls} onClick={()=>handleAnswer(i)} disabled={showFeedback}>
                      <span className="option-letter">{i+1}</span>{opt}
                    </button>
                  </li>
                )
              })}
            </ul>
            {showFeedback && (
              <div className={`lesson-feedback ${isCorrect?'feedback-correct':'feedback-wrong'}`}>
                <p className="feedback-label">{isCorrect?'Correct':'Not quite'}</p>
                <p className="feedback-explain">{q?.explanation}</p>
                <button className="btn btn-primary" onClick={handleNext}>
                  <span className="btn-label">{qIndex+1<shuffledQs.length?'Next':'Finish'}</span>
                  <span className="btn-icon-badge"><ArrowLeft size={18} strokeWidth={2.5} style={{transform:'rotate(180deg)'}}/></span>
                </button>
              </div>
            )}
          </div>
        </div></section>
      </main>
    )
  }

  /* ── ISLAND CAROUSEL ── */
  if (view === 'map') {
    const sec  = SECTIONS[sectionIndex]
    const st   = mapStats[sectionIndex]
    const pct  = st.total ? Math.round((st.done / st.total) * 100) : 0
    const dim  = sec.isCapstone && !capstoneUnlocked
    const slug = sec.isCapstone ? 'cap' : String(sectionIndex)

    return (
      <main className="learn-page">
        <div className="island-carousel">

          <div
            className="carousel-stage"
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
            onTouchEnd={e => {
              if (touchStartX.current === null) return
              const diff = touchStartX.current - e.changedTouches[0].clientX
              if (Math.abs(diff) > 44) {
                if (diff > 0) setSectionIndex(i => Math.min(SECTIONS.length - 1, i + 1))
                else setSectionIndex(i => Math.max(0, i - 1))
              }
              touchStartX.current = null
            }}
          >
            <button
              className="carousel-arrow"
              onClick={() => setSectionIndex(i => Math.max(0, i - 1))}
              disabled={sectionIndex === 0}
              aria-label="Previous island"
            >
              <ChevronLeft size={28} strokeWidth={2.5}/>
            </button>

            <button
              className={`carousel-island${dim ? ' is-dim' : ''}`}
              onClick={() => !dim && setView('path')}
              disabled={dim}
              aria-label={`${sec.label}${dim ? ' — locked' : ' — click to enter'}`}
            >
              <img src={`/islands/island-${slug}.png`} alt={sec.label} className={`carousel-island-img${sectionIndex === 0 ? ' carousel-island-img--basics' : ''}`}/>
              {dim && (
                <div className="carousel-lock">
                  <Lock size={32} strokeWidth={2.5}/>
                </div>
              )}
            </button>

            <button
              className="carousel-arrow"
              onClick={() => setSectionIndex(i => Math.min(SECTIONS.length - 1, i + 1))}
              disabled={sectionIndex === SECTIONS.length - 1}
              aria-label="Next island"
            >
              <ChevronRight size={28} strokeWidth={2.5}/>
            </button>
          </div>

          <h1 className={`carousel-section-title${sec.label.length > 14 ? ' carousel-section-title--long' : ''}`} style={{ color: sec.color }}>{sec.label}</h1>

          <div className="carousel-dots">
            {SECTIONS.map((s, i) => (
              <button
                key={i}
                className={`carousel-dot${i === sectionIndex ? ' carousel-dot--active' : ''}`}
                onClick={() => setSectionIndex(i)}
                aria-label={`Go to ${s.label}`}
                style={i === sectionIndex ? { background: sec.color, borderColor: 'transparent' } : {}}
              />
            ))}
          </div>

          <p className="carousel-swipe-hint">
            <ChevronLeft size={13}/> swipe to explore <ChevronRight size={13}/>
          </p>

        </div>
      </main>
    )
  }

  /* ── PATH MAP ── */
  const section      = SECTIONS[sectionIndex]
  const pathCfg      = SECTION_PATHS[section.id] ?? SECTION_PATHS.s1
  const sectionUnits = section.isCapstone ? [] : section.unitIds.map(id => unitMap[id]).filter(Boolean)
  const sectionNodes = section.isCapstone ? [CAPSTONE_NODE] : [...sectionUnits, chapterTestNode(section)]
  const sectionDone  = sectionNodes.filter(n => completedIds.has(n.id)).length
  const sectionPct   = sectionNodes.length > 0 ? Math.round((sectionDone / sectionNodes.length) * 100) : 0
  const positions    = calcPositions(sectionNodes.length, pathCfg)
  const trailH       = positions.length > 0 ? positions[positions.length-1].y + NODE_R + 90 : 200
  const nextUpIndex  = sectionNodes.findIndex(n => !completedIds.has(n.id) && isUnlocked(n.id))
  const bannerColor  = section.color

  return (
    <main className="learn-page">
      <div className="path-page">

        {/* Left shapes */}
        <div className="path-side path-side--left" aria-hidden="true">
          <img className="coin-sprite" src={coinSprites[0]} style={{top: section.isCapstone ? '35%' : '15%', right:'0%'}} alt="" />
          {!section.isCapstone && <img className="coin-sprite" src={coinSprites[1]} style={{top:'58%', right:'0%'}} alt="" />}
        </div>

        <div className="path-center">
          {/* Section banner */}
          <div className="section-banner" style={{background: bannerColor}}>
            <div className="banner-nav">
              <button className="banner-arrow" onClick={()=>setView('map')} aria-label="Back to map">
                <MapIcon size={18} strokeWidth={2.5}/>
              </button>
              <span className="banner-eyebrow">
                {section.isCapstone ? 'Final Challenge' : `Island ${sectionIndex+1} of ${SECTIONS.length-1}`}
              </span>
              <button className="banner-arrow" onClick={()=>setSectionIndex(i=>Math.min(SECTIONS.length-1,i+1))} disabled={sectionIndex===SECTIONS.length-1} aria-label="Next island">
                <ChevronRight size={20} strokeWidth={2.5}/>
              </button>
            </div>
            <h2 className="banner-title">{section.label}</h2>
            <p className="banner-desc">{section.desc}</p>
            {currentUser && (
              <div className="banner-progress">
                <div className="banner-progress-track"><div className="banner-progress-fill" style={{width:`${sectionPct}%`}}/></div>
                <span className="banner-progress-label">{sectionDone} / {sectionNodes.length}</span>
              </div>
            )}
          </div>

          {/* Node trail */}
          <div className="trail-wrap">
            <div className="path-trail" style={{height: trailH}}>
              {positions.slice(0,-1).map((p1,i) => (
                <NodeConnector key={i} p1={p1} p2={positions[i+1]}
                  done={completedIds.has(sectionNodes[i].id) && completedIds.has(sectionNodes[i+1].id)}
                  color={bannerColor}
                />
              ))}
              {sectionNodes.map((node, i) => {
                const pos        = positions[i]
                const done       = completedIds.has(node.id)
                const unlocked   = isUnlocked(node.id)
                const sparkling  = sparklingId === node.id
                const isNextUp   = i === nextUpIndex
                const isTest     = node.isChapterTest || node.isCapstone
                const nodeColor  = isTest ? '#F59E0B' : bannerColor
                const inProgress = !done && node.lessons?.length > 0 &&
                  node.lessons.some(l => completedIds.has(l.id))
                return (
                  <div key={node.id} className="trail-stop" style={{left:pos.x, top:pos.y-NODE_R}}>
                    {isNextUp && (
                      <div className="trail-tip" style={{'--tip-color': nodeColor}}>
                        {sectionDone===0 ? 'START' : 'CONTINUE'}
                      </div>
                    )}
                    <button
                      className={`path-node${isTest?' node-test':''} ${sparkling?'node-sparkling':done?'node-done':unlocked?'node-available':'node-locked'}`}
                      style={{'--node-color': nodeColor}}
                      onClick={()=>handleNodeClick(node)}
                      disabled={!unlocked||!!sparklingId}
                      aria-label={node.title}
                    >
                      {sparkling && <SparkleEffect color={nodeColor}/>}
                      {done ? <Check size={28} strokeWidth={3}/>
                        : inProgress ? <RefreshCw size={26} strokeWidth={3}/>
                        : !unlocked ? <Lock size={22}/>
                        : node.isCapstone ? <Trophy size={24}/>
                        : node.isChapterTest ? <Star size={24}/>
                        : <span className="node-num">{i+1}</span>}
                    </button>
                    <div className="node-chip" style={{'--chip-color': nodeColor}}>
                      <span className="node-chip-name">{node.title}</span>
                      <CoinBadge size={20} drop="1px 1px 0" />
                      <span className="node-chip-cents">{node.centsReward}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Up next */}
          {sectionIndex < SECTIONS.length-1 && (
            <div className="path-next-section">
              <button className="path-next-btn" onClick={()=>setSectionIndex(i=>i+1)}
                style={{'--next-color': SECTIONS[sectionIndex+1].color}}>
                <span className="path-next-label">Up next</span>
                <span className="path-next-name">{SECTIONS[sectionIndex+1].label}</span>
                <ChevronRight size={20} strokeWidth={2.5}/>
              </button>
            </div>
          )}
        </div>

        {/* Right shapes */}
        <div className="path-side path-side--right" aria-hidden="true">
          <img className="coin-sprite" src={coinSprites[2]} style={{top: section.isCapstone ? '35%' : '35%', left:'0%'}} alt="" />
          {!section.isCapstone && <img className="coin-sprite" src={coinSprites[3]} style={{top:'72%', left:'0%'}} alt="" />}
        </div>

      </div>
    </main>
  )
}
