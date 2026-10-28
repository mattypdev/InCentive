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
    id: 'eip',
    name: 'Education Innovators Podcast',
    logo: '/eip-podcast.jpeg',
    dark: true,
    type: 'podcast',
    src: 'https://www.youtube.com/embed/515elFbpgBM',
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
