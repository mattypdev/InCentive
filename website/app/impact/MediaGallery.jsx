'use client'
import { useState } from 'react'

const ITEMS = [
  {
    id: 'ktvn',
    name: 'KTVN 2 News Nevada',
    logo: '/ktvn2.png',
    dark: false,
    type: 'video',
    src: 'https://cdn.field59.com/KTVN/1792543323-bc31a46bd94eb5fe60c6c9f967c9095c8d699d07_fl9-720p.mp4',
  },
  {
    id: 'kolo',
    name: 'KOLO 8 News Now',
    logo: '/kolo8.png',
    dark: false,
    type: 'video',
    src: '/incentive-financial.mp4',
  },
  {
    id: 'kolo-article',
    name: 'KOLO 8 — Article',
    logo: '/kolo8.png',
    dark: false,
    type: 'article',
    src: 'https://www.kolotv.com/2026/11/23/local-teen-create-financial-literacy-course-students/',
  },
  {
    id: 'eip',
    name: 'Education Innovators Podcast - Part 1',
    logo: '/eip-podcast.jpeg',
    dark: true,
    type: 'podcast',
    src: 'https://www.youtube.com/embed/515elFbpgBM?start=123',
  },
  {
    id: 'eip2',
    name: 'Education Innovators Podcast - Part 2',
    logo: '/eip-podcast.jpeg',
    dark: true,
    type: 'podcast',
    src: 'https://www.youtube.com/embed/-V3OUyKgSyw?start=604',
  },
]

function MediaViewer({ item }) {
  if (!item) return null

  if (item.type === 'video') {
    return (
      <video key={item.id} className="mg-video" controls preload="metadata" playsInline>
        <source src={item.src} type="video/mp4" />
      </video>
    )
  }

  if (item.type === 'podcast') {
    return (
      <iframe
        key={item.id}
        className="mg-iframe"
        src={item.src}
        title={item.name}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    )
  }

  if (item.type === 'article') {
    return (
      <div key={item.id} className="mg-pending">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.logo} alt={item.name} className="mg-link-logo" />
        <p className="mg-link-label">{item.name}</p>
        <a href={item.src} target="_blank" rel="noopener noreferrer" className="mg-link-btn">
          Read the article →
        </a>
      </div>
    )
  }

  return (
    <div className="mg-pending">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.logo} alt={item.name} className={`mg-pending-logo${item.dark ? ' mg-pending-logo--dark' : ''}`} />
      <p className="mg-pending-text">Content coming soon</p>
    </div>
  )
}

export default function MediaGallery() {
  const [activeId, setActiveId] = useState(ITEMS[0].id)
  const active = ITEMS.find(i => i.id === activeId)

  return (
    <div className="mg-wrap">
      <div className="mg-viewer">
        <MediaViewer item={active} />
      </div>

      <ul className="mg-list">
        {ITEMS.map(item => (
          <li key={item.id}>
            <button
              className={`mg-btn${item.id === activeId ? ' mg-btn--active' : ''}${item.type === 'pending' ? ' mg-btn--pending' : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              <span className="mg-btn-check" aria-hidden="true">✓</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logo} alt={item.name} className={`mg-btn-logo${item.dark ? ' mg-btn-logo--dark' : ''}`} />
              <span className="mg-btn-name">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
