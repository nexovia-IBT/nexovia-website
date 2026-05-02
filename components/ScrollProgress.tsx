'use client'

import { useEffect, useState } from 'react'

const GOLD = '#EDC967'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200)

    function onScroll() {
      const doc = document.documentElement
      const scrolled = doc.scrollTop || document.body.scrollTop
      const total = doc.scrollHeight - doc.clientHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nexovia-scroll-progress { display: none !important; }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="nexovia-scroll-progress"
        style={{
          position: 'fixed',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: GOLD,
            opacity: 0.6,
            writingMode: 'vertical-lr' as const,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 120,
            backgroundColor: 'rgba(237,201,103,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${progress * 100}%`,
              backgroundColor: GOLD,
              transition: 'height 0.1s linear',
            }}
          />
        </div>
      </div>
    </>
  )
}
