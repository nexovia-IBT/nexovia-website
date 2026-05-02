'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// ── Ambient stage background per slide ──────────────────────────────────────
const AMBIENT_BG = [
  '#F7E8EC', '#F4E2E8', '#F8EBED', '#F2DDE5',
  '#F6E6EB', '#F3E0E7', '#F8ECF0', '#EDD6DE',
]

// ── Per-slide bottle rotation (degrees) ─────────────────────────────────────
const BOTTLE_ROTATE = [-5, 8, -10, 6, -8, 12, -6, 9]

// ── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = Array.from({ length: 8 }, (_, i) => ({
  number: String(i + 1).padStart(2, '0'),
  title: `[Ingredient ${i + 1} Name]`,
  benefit: '[Key Benefit — replace with final copy]',
  description:
    '[Description of this ingredient and how it functions in the formula. Replace with final copy.]',
  details: [
    '[Key property or action one]',
    '[Key property or action two]',
    '[Key property or action three]',
  ],
}))

// ── Component ────────────────────────────────────────────────────────────────
export default function SupportingArchitectureSection() {
  const [reducedMotion, setReducedMotion] = useState(false)

  const sectionRef   = useRef<HTMLElement>(null)
  const stageRef     = useRef<HTMLDivElement>(null)
  const slideRefs    = useRef<(HTMLDivElement | null)[]>([])
  const bottleRefs   = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([])
  const currentSlide = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Hide all slides except 0
      slideRefs.current.forEach((el, i) => {
        if (!el || i === 0) return
        gsap.set(el, { opacity: 0, y: 60 })
      })

      // Apply initial tilt to slide 0's bottle
      gsap.set(bottleRefs.current[0], { rotate: BOTTLE_ROTATE[0] })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self) {
          const idx = Math.min(Math.floor(self.progress * 8), 7)
          if (idx !== currentSlide.current) {
            transitionSlide(idx, currentSlide.current)
            currentSlide.current = idx
          }
        },
      })
    })

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function transitionSlide(next: number, prev: number) {
    const dir = next > prev ? 1 : -1

    // Exit outgoing slide
    gsap.to(slideRefs.current[prev], {
      opacity: 0,
      y: dir * -40,
      duration: 0.45,
      ease: 'power2.inOut',
    })

    // Incoming bottle starts at the outgoing bottle's angle, then tumbles to its own
    gsap.set(slideRefs.current[next], { opacity: 0, y: dir * 60 })
    gsap.set(bottleRefs.current[next], { rotate: BOTTLE_ROTATE[prev] })

    gsap.to(slideRefs.current[next], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.08,
    })
    gsap.to(bottleRefs.current[next], {
      rotate: BOTTLE_ROTATE[next],
      duration: 0.7,
      ease: 'power2.out',
      delay: 0.08,
    })

    // Ambient background shift
    gsap.to(stageRef.current, {
      backgroundColor: AMBIENT_BG[next],
      duration: 0.6,
      ease: 'power2.inOut',
    })

    // Progress dots
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      gsap.to(dot, {
        backgroundColor: i === next ? '#732C3F' : 'rgba(197,124,138,0.2)',
        duration: 0.3,
      })
    })
  }

  // ── Reduced-motion fallback — stacked slides ──────────────────────────────
  if (reducedMotion) {
    return (
      <section style={{ backgroundColor: '#F7E8EC', padding: '80px 0' }}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            style={{
              padding: '64px 8%',
              borderTop: i > 0 ? '1px solid rgba(115,44,63,0.08)' : undefined,
            }}
          >
            <p style={{ fontSize: 11, letterSpacing: '0.12em', color: '#C57C8A', marginBottom: 8, textTransform: 'uppercase', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              {slide.number} / 08
            </p>
            <h3 className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: '#732C3F', margin: '0 0 12px' }}>
              {slide.title}
            </h3>
            <p style={{ fontSize: 13, color: '#5A1F2E', lineHeight: 1.75, maxWidth: 520, margin: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              {slide.description}
            </p>
          </div>
        ))}
      </section>
    )
  }

  // ── Animated layout ───────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} style={{ height: '800vh', backgroundColor: '#F7E8EC' }}>
      <div
        ref={stageRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: AMBIENT_BG[0],
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 88,
          overflow: 'hidden',
        }}
      >

        {/* Section header — always visible */}
        <div style={{ flexShrink: 0, textAlign: 'center', paddingBottom: 14, zIndex: 10 }}>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(22px, 2.6vw, 36px)',
              fontWeight: 400,
              color: '#732C3F',
              lineHeight: 1.1,
              margin: '0 0 8px',
            }}
          >
            Supporting Architecture
          </h2>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C57C8A',
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            }}
          >
            Formula Components
          </p>
        </div>

        {/* Slides area */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              ref={(el) => { slideRefs.current[i] = el }}
              style={{ position: 'absolute', inset: 0, opacity: i === 0 ? 1 : 0 }}
            >

              {/* Oversized ingredient title — behind bottle */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '53%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  width: '72%',
                  maxWidth: 600,
                }}
              >
                <span
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(60px, 8vw, 120px)',
                    fontWeight: 400,
                    color: '#732C3F',
                    opacity: 0.18,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  {slide.title}
                </span>
              </div>

              {/* Bottle — GSAP animates rotate, translate stays via inline style */}
              <div
                ref={(el) => { bottleRefs.current[i] = el }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '47%',
                  transform: 'translate(-50%, -50%)',
                  width: 'min(190px, 18vw)',
                  height: 'min(295px, 38vh)',
                  zIndex: 3,
                }}
              >
                <Image
                  src="/products/Nexovia_Skin_serum.png"
                  alt="Nexovia Skin Serum"
                  fill
                  sizes="(max-width: 768px) 140px, 190px"
                  priority={i === 0}
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Ingredient number — top left */}
              <div style={{ position: 'absolute', top: 20, left: 48, zIndex: 4 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#732C3F',
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {slide.number}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: '#C57C8A',
                    letterSpacing: '0.06em',
                    marginLeft: 5,
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  / 08
                </span>
              </div>

              {/* Description — upper right */}
              <div
                style={{
                  position: 'absolute',
                  top: '13%',
                  right: 52,
                  maxWidth: 168,
                  zIndex: 4,
                  textAlign: 'right',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: '#C57C8A',
                    margin: '0 0 8px',
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {slide.benefit}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    lineHeight: 1.7,
                    color: '#5A1F2E',
                    opacity: 0.72,
                    margin: 0,
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {slide.description}
                </p>
              </div>

              {/* Detail lines — bottom left */}
              <div style={{ position: 'absolute', bottom: 36, left: 48, zIndex: 4 }}>
                {slide.details.map((detail, d) => (
                  <div
                    key={d}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: d < slide.details.length - 1 ? 8 : 0,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 1,
                        backgroundColor: 'rgba(115,44,63,0.3)',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: '#732C3F',
                        opacity: 0.58,
                        letterSpacing: '0.05em',
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      }}
                    >
                      {detail}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Progress dots — right edge of stage */}
        <div
          style={{
            position: 'absolute',
            right: 26,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            zIndex: 20,
          }}
        >
          {SLIDES.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el }}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: i === 0 ? '#732C3F' : 'rgba(197,124,138,0.2)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
