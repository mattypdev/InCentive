'use client'
import dynamic from 'next/dynamic'

const LessonPlayer = dynamic(() => import('@/components/LessonPlayer/LessonPlayer'), { ssr: false })

export default function LessonPlayerShell(props) {
  return <LessonPlayer {...props} />
}
