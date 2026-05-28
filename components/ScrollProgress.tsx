'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const GOLD = '#EDC967'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const SECTIONS = [
  { id: 'hero',        label: 'Hero' },
  { id: 'problem',     label: 'The Problem' },
  { id: 'synergy',     label: 'The Synergy' },
  { id: 'aba4',        label: 'ABA.4' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'clinical-evidence', label: 'Clinical Evidence' },
  { id: 'protocol',    label: 'Protocol' },
  { id: 'why',         label: 'Why Nexovia' },
  { id: 'faq',         label: 'FAQ' },
]

const DOM_IDS: Record<string, string> = {
  ingredients: 'sa-section',
  protocol:    'protocol-section',
  why:         'why-nexovia',
  faq:         'faq',
}

const ORBIT_FRACTIONS: Record<string, number> = {
  hero: 0, problem: 0.25, synergy: 0.5, aba4: 0.75,
}

function getAbsoluteTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY
}

function getTargetScrollTop(id: string): number {
  const orbitEl = document.getElementById('orbit-outer')
  if (id in ORBIT_FRACTIONS) {
    if (!orbitEl) return 0
    return getAbsoluteTop(orbitEl) + orbitEl.offsetHeight * ORBIT_FRACTIONS[id]
  }
  const el = document.getElementById(DOM_IDS[id] ?? id)
  return el ? getAbsoluteTop(el) : 0
}

function getActiveSection(scrollY: number): string {
  const orbitEl = document.getElementById('orbit-outer')
  const saEl    = document.getElementById('sa-section')
  const clinicalEl = document.getElementById('clinical-evidence')
  const protoEl = document.getElementById('protocol-section')
  const whyEl   = document.getElementById('why-nexovia')
  const faqEl   = document.getElementById('faq')

  if (faqEl   && scrollY >= faqEl.offsetTop   - 80) return 'faq'
  if (whyEl   && scrollY >= whyEl.offsetTop   - 80) return 'why'
  if (protoEl && scrollY >= protoEl.offsetTop - 80) return 'protocol'
  if (clinicalEl && scrollY >= clinicalEl.offsetTop - 80) return 'clinical-evidence'
  if (saEl    && scrollY >= saEl.offsetTop    - 80) return 'ingredients'

  if (orbitEl) {
    const top    = orbitEl.offsetTop
    const height = orbitEl.offsetHeight
    if (scrollY >= top && scrollY < top + height) {
      const p = (scrollY - top) / height
      if (p < 0.25) return 'hero'
      if (p < 0.50) return 'problem'
      if (p < 0.75) return 'synergy'
      return 'aba4'
    }
  }

  return 'hero'
}

export default function ScrollProgress() {
  const [progress,      setProgress]      = useState(0)
  const [visible,       setVisible]       = useState(false)
  const [hovered,       setHovered]       = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const stReady = useRef(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    stReady.current = true

    const timer = setTimeout(() => setVisible(true), 1200)

    function onScroll() {
      const doc      = document.documentElement
      const scrolled = doc.scrollTop || document.body.scrollTop
      const total    = doc.scrollHeight - doc.clientHeight
      setProgress(total > 0 ? scrolled / total : 0)
      setActiveSection(getActiveSection(scrolled))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function scrollToSection(targetId: string) {
    const targetTop = getTargetScrollTop(targetId)

    if (stReady.current) {
      ScrollTrigger.getAll().forEach(st => st.disable())
    }

    window.scrollTo({ top: targetTop, behavior: 'auto' })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (stReady.current) {
          ScrollTrigger.getAll().forEach(st => {
            st.enable()
            st.refresh()
          })
          ScrollTrigger.refresh()
        }
      })
    })
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nexovia-scroll-progress { display: none !important; }
        }
        .nexovia-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 0;
          text-align: left;
          width: 100%;
        }
        .nexovia-nav-btn:hover .nexovia-nav-dash {
          opacity: 1 !important;
        }
        .nexovia-nav-btn:hover span {
          color: rgba(255,255,255,0.9) !important;
        }
      `}</style>

      <div
        className="nexovia-scroll-progress"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: hovered ? 200 : 40,
          overflow: 'hidden',
          zIndex: 999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* Glassmorphism panel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 200,
            height: '100%',
            background: 'rgba(115,44,63,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(237,201,103,0.1)',
            transform: hovered ? 'translateX(0)' : 'translateX(-200px)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 28px',
            gap: 2,
          }}
        >
          {SECTIONS.map((section, i) => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                className="nexovia-nav-btn"
                onClick={() => scrollToSection(section.id)}
                style={{
                  transform: hovered ? 'translateX(0)' : 'translateX(-12px)',
                  opacity: hovered ? 1 : 0,
                  transition: `transform 0.3s ease ${i * 0.03}s, opacity 0.3s ease ${i * 0.03}s`,
                }}
              >
                <div
                  className="nexovia-nav-dash"
                  style={{
                    width: 12,
                    height: 1,
                    backgroundColor: GOLD,
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const,
                    color: isActive ? GOLD : 'rgba(255,255,255,0.6)',
                    fontFamily: SANS,
                    lineHeight: 1,
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {section.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Progress bar — fades out when panel opens */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
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
              fontFamily: SANS,
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
      </div>
    </>
  )
}
