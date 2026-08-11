'use client'
import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import CoinFlyLayer from '@/components/CoinFlyLayer'
import { applyCosmetics } from '@/lib/shop'

export default function AppShell() {
  const pathname = usePathname()

  useLayoutEffect(() => { applyCosmetics() }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <radialGradient id="coin-grad" cx="0.35" cy="0.28" r="0.72" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#FFFBEB" />
            <stop offset="28%"  stopColor="#FCD34D" />
            <stop offset="65%"  stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#DC6803" />
          </radialGradient>
        </defs>
      </svg>
      <CoinFlyLayer />
    </>
  )
}
