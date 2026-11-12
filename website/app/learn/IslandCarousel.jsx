'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { islands } from '@/lib/content/islands'
import './IslandCarousel.css'

export default function IslandCarousel() {
  const [index, setIndex] = useState(0)
  const router = useRouter()

  function prev() { setIndex(i => Math.max(0, i - 1)) }
  function next() { setIndex(i => Math.min(islands.length - 1, i + 1)) }

  return (
    <div className="icar-root">
      {/* Track — slides horizontally */}
      <div className="icar-track" style={{ transform: `translateX(calc(-${index} * 70vw + 50vw - 35vw))` }}>
        {islands.map((isl, i) => {
          const dist = Math.abs(i - index)
          const scale = dist === 0 ? 1 : dist === 1 ? 0.72 : 0.5
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.55 : 0
          return (
            <div
              key={isl.slug}
              className={`icar-slide${i === index ? ' icar-slide--active' : ''}`}
              style={{ transform: `scale(${scale})`, opacity, cursor: dist > 0 ? 'pointer' : 'default' }}
              onClick={() => dist > 0 && setIndex(i)}
            >
              <div className="icar-shadow" />
              <Image
                src={isl.art}
                alt={isl.title}
                width={560}
                height={560}
                priority={dist === 0}
                className="icar-img"
              />
            </div>
          )
        })}
      </div>

      {/* Arrows */}
      <button
        className="icar-arrow icar-arrow--left"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous island"
      >
        ‹
      </button>
      <button
        className="icar-arrow icar-arrow--right"
        onClick={next}
        disabled={index === islands.length - 1}
        aria-label="Next island"
      >
        ›
      </button>

      {/* Title + CTA */}
      <div className="icar-label">
        <h1 className="icar-title">{islands[index].title}</h1>
        <button className="icar-cta" onClick={() => router.push(`/learn/${islands[index].slug}`)}>
          Explore island →
        </button>
      </div>

      {/* Dots */}
      <div className="icar-dots" role="tablist">
        {islands.map((isl, i) => (
          <button
            key={isl.slug}
            className={`icar-dot${i === index ? ' icar-dot--active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={isl.title}
            role="tab"
            aria-selected={i === index}
          />
        ))}
      </div>
    </div>
  )
}
