'use client'
import { useState, useMemo } from 'react'
import { geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from 'topojson-client'
import { MapPin, Users } from 'lucide-react'
import usTopology from '@/data/us-states-10m.json'

function Instagram({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

const projection = geoAlbersUsa().scale(1050).translate([480, 300])
const pathGenerator = geoPath(projection)
const states = feature(usTopology, usTopology.objects.states).features

const chapters = [
  {
    id: 'hhi',
    name: 'Hilton Head Island, SC',
    presidents: 'Kevin G. and Santiago F.',
    instagram: null,
    coordinates: [-80.726, 32.216],
  },
  {
    id: 'nyhs',
    name: 'Northwest Yeshiva High School, WA',
    presidents: 'Levi S.',
    instagram: 'incentive.nyhs',
    coordinates: [-122.332, 47.658],
  },
  {
    id: 'stl',
    name: 'St. Louis, MO',
    presidents: 'Ridhima K.',
    instagram: 'incentive.stlouis',
    coordinates: [-90.199, 38.627],
  },
  {
    id: 'lhs',
    name: 'Lingonore High School, MD',
    presidents: 'Bhavya Y. and Rashmika P.',
    instagram: 'incentive.lhs',
    coordinates: [-77.349, 39.377],
  },
]

export default function ChapterMap() {
  const [activeChapter, setActiveChapter] = useState(null)

  const markers = useMemo(() => {
    return chapters
      .map((ch) => ({ ...ch, pos: projection(ch.coordinates) }))
      .filter((ch) => ch.pos)
  }, [])

  return (
    <div className="about-map-card">
      <svg
        viewBox="0 0 960 600"
        className="about-map-svg"
        onClick={() => setActiveChapter(null)}
      >
        {states.map((state, i) => (
          <path key={i} d={pathGenerator(state)} className="about-map-state" />
        ))}
        {markers.map((ch) => (
          <g key={ch.id} className="about-map-marker-group">
            <circle cx={ch.pos[0]} cy={ch.pos[1]} r={14} className="about-map-pin-ring" />
            <circle
              cx={ch.pos[0]}
              cy={ch.pos[1]}
              r={8}
              className={`about-map-pin ${activeChapter?.id === ch.id ? 'about-map-pin--active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setActiveChapter(activeChapter?.id === ch.id ? null : ch)
              }}
            />
          </g>
        ))}
      </svg>

      {activeChapter && (
        <div className="about-chapter-popup" onClick={(e) => e.stopPropagation()}>
          <button className="about-chapter-close" onClick={() => setActiveChapter(null)} aria-label="Close">
            &times;
          </button>
          <div className="about-chapter-header">
            <MapPin size={18} strokeWidth={2.5} />
            <h4>{activeChapter.name}</h4>
          </div>
          <div className="about-chapter-detail">
            <Users size={16} strokeWidth={2} />
            <span>{activeChapter.presidents}</span>
          </div>
          {activeChapter.instagram ? (
            <a href={`https://instagram.com/${activeChapter.instagram}`} target="_blank" rel="noopener noreferrer" className="about-chapter-ig">
              <Instagram size={16} strokeWidth={2} />
              @{activeChapter.instagram}
            </a>
          ) : (
            <div className="about-chapter-detail about-chapter-detail--muted">
              <Instagram size={16} strokeWidth={2} />
              <span>N/A</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
