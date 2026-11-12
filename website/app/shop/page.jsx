'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Check, Lock } from 'lucide-react'
import {
  getPurchased, getActive, getSpent, updatePeakCoins,
  purchase, activateItem, deactivateColor, deactivateShape,
  applyCosmetics, THEME_COLORS, COIN_SHAPES,
} from '@/lib/shop'
import { saveShopToCloud } from '@/lib/shopSync'
import '@/components/Button.css'
import './Shop.css'

function CoinSVG({ shape, size = 28, drop, style }) {
  const sw = Math.round(200 / size)
  const filter = drop ? `drop-shadow(${drop} var(--foreground))` : undefined
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
         style={{ display: 'block', flexShrink: 0, filter, ...style }}>
      {shape.id === 'circle'
        ? <circle cx="50" cy="50" r="44" fill="url(#coin-grad)" stroke="var(--foreground)" strokeWidth={sw}/>
        : <path d={shape.d} fill="url(#coin-grad)" stroke="var(--foreground)" strokeWidth={sw}/>}
    </svg>
  )
}

export default function ShopPage() {
  const { currentUser, profile } = useAuth()
  const [purchased, setPurchased] = useState(getPurchased)
  const [active,    setActive]    = useState(getActive)
  const [spent,     setSpent]     = useState(getSpent)
  const [cents,     setCents]     = useState(0)

  useEffect(() => { applyCosmetics() }, [])

  // Read balance from wallet_ledger for signed-in users
  useEffect(() => {
    if (!currentUser) {
      setCents(Math.max(0, (profile?.xp ?? 0) - spent))
      return
    }
    const supabase = createClient()
    supabase
      .from('wallet_ledger')
      .select('cents')
      .eq('user_id', currentUser.id)
      .then(({ data }) => {
        if (data) {
          const total = data.reduce((s, r) => s + (r.cents ?? 0), 0)
          setCents(Math.max(0, total))
        } else {
          setCents(Math.max(0, (profile?.xp ?? 0) - spent))
        }
      })
  }, [currentUser?.id, spent])

  function refreshShop() {
    setPurchased(getPurchased())
    setActive(getActive())
    setSpent(getSpent())
  }

  function handleBuy(itemId, price) {
    if (cents < price) return
    purchase(itemId, price)
    refreshShop()
    if (currentUser) saveShopToCloud(currentUser.id)
  }

  function handleEquip(itemId) {
    activateItem(itemId)
    setActive(getActive())
    if (currentUser) saveShopToCloud(currentUser.id)
  }

  function handleUnequipColor() { deactivateColor(); setActive(getActive()); if (currentUser) saveShopToCloud(currentUser.id) }
  function handleUnequipShape() { deactivateShape(); setActive(getActive()); if (currentUser) saveShopToCloud(currentUser.id) }

  const activeShape = COIN_SHAPES.find(s => s.id !== 'circle' && active.has(s.id)) ?? COIN_SHAPES[0]

  return (
    <main className="shop-page">
      <div className="container">
        <div className="shop-header">
          <h1 className="shop-title">Shop</h1>
          <div className="shop-balance">
            <CoinSVG shape={activeShape} size={22} drop="1px 1px 0" />
            <span>{cents} available</span>
          </div>
        </div>

        {/* Theme Colors */}
        <section className="shop-section">
          <div className="shop-cat-header">
            <span className="shop-cat-title">Theme Color</span>
            <span className="shop-cat-desc">Accents, buttons &amp; progress bars · 200¢ each</span>
          </div>
          <div className="shop-color-grid">
            {THEME_COLORS.map(color => {
              const isFree   = color.price === 0
              const owned    = isFree || purchased.has(color.id)
              const isActive = active.has(color.id)
              const canBuy   = !owned && cents >= color.price
              return (
                <div key={color.id} className={`shop-color-item${isActive ? ' shop-color-item--active' : ''}`}>
                  <div className="shop-color-swatch" style={{ background: color.hex }}>
                    {isActive && <Check size={18} strokeWidth={3} color="white" />}
                  </div>
                  <div className="shop-color-footer">
                    <span className="shop-color-name">{color.label}</span>
                    {owned ? (
                      <button
                        className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'} shop-pill-btn`}
                        onClick={() => isActive ? handleUnequipColor() : handleEquip(color.id)}
                      >
                        {isActive ? 'On' : 'Use'}
                      </button>
                    ) : (
                      <button
                        className={`btn ${canBuy ? 'btn-primary' : 'btn-secondary'} shop-pill-btn`}
                        disabled={!canBuy}
                        onClick={() => canBuy && handleBuy(color.id, color.price)}
                      >
                        {color.price}¢
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Coin Shapes */}
        <section className="shop-section">
          <div className="shop-cat-header">
            <span className="shop-cat-title">Coin Shape</span>
            <span className="shop-cat-desc">Changes every coin badge on the site · 200–3,200¢</span>
          </div>
          <div className="shop-shape-grid">
            {COIN_SHAPES.map(shape => {
              const isFree   = shape.price === 0
              const owned    = isFree || purchased.has(shape.id)
              const isActive = isFree
                ? !COIN_SHAPES.some(s => s.id !== 'circle' && active.has(s.id))
                : active.has(shape.id)
              const canBuy = !owned && cents >= shape.price
              return (
                <div key={shape.id} className={`shop-shape-item${isActive ? ' shop-shape-item--active' : ''}${!owned ? ' shop-shape-item--locked' : ''}`}>
                  <div className="shop-shape-preview">
                    <CoinSVG shape={shape} size={46} drop="2px 2px 0" style={{ opacity: owned ? 1 : 0.45 }} />
                    {!owned && <div className="shop-shape-lock-badge"><Lock size={10} strokeWidth={2.5} /></div>}
                    {isActive && <div className="shop-shape-active-badge"><Check size={10} strokeWidth={3} /></div>}
                  </div>
                  <span className="shop-shape-name">{shape.label}</span>
                  {isFree ? (
                    <button className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'} shop-pill-btn`} disabled={isActive} onClick={() => !isActive && handleEquip('circle')}>
                      {isActive ? 'On' : 'Use'}
                    </button>
                  ) : owned ? (
                    <button className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'} shop-pill-btn`} onClick={() => isActive ? handleUnequipShape() : handleEquip(shape.id)}>
                      {isActive ? 'On' : 'Use'}
                    </button>
                  ) : (
                    <button className={`btn ${canBuy ? 'btn-primary' : 'btn-secondary'} shop-pill-btn`} disabled={!canBuy} onClick={() => canBuy && handleBuy(shape.id, shape.price)}>
                      {shape.price}¢
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
