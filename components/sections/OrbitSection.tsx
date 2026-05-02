'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const PANELS = [
  {
    id: 0,
    tag: 'The Formula',
    heading: '[Hero headline — two or three words]',
    subtext:
      '[Supporting copy describing the product positioning. Replace with final copy from content team.]',
    bg: '#C57C8A',
    textSide: 'left' as const,
    bottleLeft: '62%',
    rotateY: 8,
    rotateX: 2,
    scale: 1.0,
    bottleY: 0,
    bloomLeft: '62%',
    bloomTop: '45%',
  },
  {
    id: 1,
    tag: 'The Problem',
    heading: '[Problem headline — what skin endures]',
    subtext:
      '[Problem framing copy. Describe the skin challenge this product addresses. Replace with final copy.]',
    bg: '#BA6F7E',
    textSide: 'right' as const,
    bottleLeft: '38%',
    rotateY: -12,
    rotateX: 3,
    scale: 1.03,
    bottleY: 0,
    bloomLeft: '38%',
    bloomTop: '45%',
  },
  {
    id: 2,
    tag: 'The Synergy',
    heading: '[Synergy headline — the compound effect]',
    subtext:
      '[Synergy explanation. Describe how the ingredients work together. Replace with final copy.]',
    bg: '#C57C8A',
    textSide: 'left' as const,
    bottleLeft: '62%',
    rotateY: 15,
    rotateX: -4,
    scale: 0.97,
    bottleY: 10,
    bloomLeft: '62%',
    bloomTop: '55%',
  },
  {
    id: 3,
    tag: 'ABA.4 Complex',
    heading: '[ABA.4 complex — the differentiator]',
    subtext:
      '[ABA.4 explanation. Describe the proprietary complex and its benefits. Replace with final copy.]',
    bg: '#CC8899',
    textSide: 'left' as const,
    bottleLeft: '62%',
    rotateY: -8,
    rotateX: -6,
    scale: 1.04,
    bottleY: -10,
    bloomLeft: '62%',
    bloomTop: '40%',
  },
]

// Per-panel entry direction — same direction used for exit (reversed)
const PANEL_MOTION = [
  { x: -80, y: 0 },  // panel 0: from/to left
  { x: 80,  y: 0 },  // panel 1: from/to right
  { x: 0,   y: 60 }, // panel 2: from/to below
  { x: 0,   y: -60 },// panel 3: from/to above
]

const ANIM = { duration: 0.65, ease: 'power2.inOut' } as const

export default function OrbitSection() {
  const [reducedMotion, setReducedMotion] = useState(false)

  const sectionRef    = useRef<HTMLElement>(null)
  const stageRef      = useRef<HTMLDivElement>(null)
  const bottleOuterRef = useRef<HTMLDivElement>(null)
  const bottleInnerRef = useRef<HTMLDivElement>(null)
  const glowRingRef   = useRef<HTMLDivElement>(null)
  const bloomRef      = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const panelRefs     = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs       = useRef<(HTMLDivElement | null)[]>([])
  const currentPanel  = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // ── Initial state ───────────────────────────────────────────────
      gsap.set(bottleInnerRef.current, {
        opacity: 0, y: 30, rotateY: 20, rotateX: 2, scale: 0.92,
      })
      gsap.set(scrollHintRef.current, { opacity: 0 })
      // Panel inner divs start at opacity 0 (set in JSX).
      // Set panel 0 to its entry position before animating it in.
      gsap.set(panelRefs.current[0], { x: -80 })

      // ── Hero entrance ───────────────────────────────────────────────
      gsap.to(bottleInnerRef.current, {
        opacity: 1,
        y: PANELS[0].bottleY,
        rotateY: PANELS[0].rotateY,
        rotateX: PANELS[0].rotateX,
        scale: PANELS[0].scale,
        duration: 1.1,
        delay: 0.3,
        ease: 'power2.out',
      })

      gsap.to(panelRefs.current[0], {
        opacity: 1,
        x: 0,
        duration: 0.9,
        delay: 0.5,
        ease: 'power2.out',
      })

      gsap.to(scrollHintRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 1.2,
        ease: 'power2.out',
      })

      // ── Scroll-driven panel transitions ─────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self) {
          const idx = Math.min(Math.floor(self.progress * 4), 3)

          if (idx !== currentPanel.current) {
            transitionToPanel(idx, currentPanel.current)
            currentPanel.current = idx
          }
        },
      })
    })

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Panel transition ─────────────────────────────────────────────────
  function transitionToPanel(next: number, prev: number) {
    const nextData = PANELS[next]
    const exitVec  = PANEL_MOTION[prev]
    const enterVec = PANEL_MOTION[next]

    // Exit old text
    gsap.to(panelRefs.current[prev], {
      opacity: 0,
      x: exitVec.x,
      y: exitVec.y,
      ...ANIM,
      onComplete() {
        const el = panelRefs.current[prev]
        if (el) el.style.pointerEvents = 'none'
      },
    })

    // Enter new text
    gsap.set(panelRefs.current[next], { x: enterVec.x, y: enterVec.y, opacity: 0 })
    gsap.to(panelRefs.current[next], {
      opacity: 1,
      x: 0,
      y: 0,
      ...ANIM,
      onStart() {
        const el = panelRefs.current[next]
        if (el) el.style.pointerEvents = 'auto'
      },
    })

    // 3D bottle rotation
    gsap.to(bottleInnerRef.current, {
      rotateY: nextData.rotateY,
      rotateX: nextData.rotateX,
      scale: nextData.scale,
      y: nextData.bottleY,
      ...ANIM,
    })

    // Bottle + glow ring horizontal position
    gsap.to(bottleOuterRef.current, { left: nextData.bottleLeft, ...ANIM })
    gsap.to(glowRingRef.current,    { left: nextData.bottleLeft, ...ANIM })

    // Stage background crossfade
    gsap.to(stageRef.current, { backgroundColor: nextData.bg, ...ANIM })

    // Bloom reposition
    gsap.to(bloomRef.current, {
      left: nextData.bloomLeft,
      top:  nextData.bloomTop,
      ...ANIM,
    })

    // Counter dots
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      gsap.to(dot, {
        width: i === next ? 20 : 6,
        backgroundColor: i === next ? '#EDC967' : 'rgba(255,255,255,0.25)',
        duration: 0.3,
        ease: 'power2.out',
      })
    })

    // Scroll hint: hide when leaving panel 0, restore when returning to it
    if (prev === 0 && next > 0) {
      gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' })
    } else if (next === 0) {
      gsap.to(scrollHintRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    }
  }

  // ── Reduced-motion fallback — stacked static panels ──────────────────
  if (reducedMotion) {
    return (
      <section>
        {PANELS.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: p.bg,
                padding: '80px 8%',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                color: '#ffffff',
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  opacity: 0.55,
                  marginBottom: 16,
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
              >
                {p.tag}
              </p>
              <h2
                className="font-serif"
                style={{
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  lineHeight: 1.1,
                  fontWeight: 400,
                  marginBottom: 16,
                }}
              >
                {p.heading}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  opacity: 0.65,
                  maxWidth: 480,
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
              >
                {p.subtext}
              </p>
            </div>
          )
        )}
      </section>
    )
  }

  // ── Animated layout ───────────────────────────────────────────────────
  return (
    <section ref={sectionRef} style={{ height: '600vh' }}>
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden"
        style={{ height: '100vh', backgroundColor: PANELS[0].bg }}
      >

        {/* Ambient bloom */}
        <div
          ref={bloomRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: PANELS[0].bloomLeft,
            top: PANELS[0].bloomTop,
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(255,240,244,0.45) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Spinning glow ring */}
        <div
          ref={glowRingRef}
          aria-hidden="true"
          className="animate-orbit-glow"
          style={{
            position: 'absolute',
            left: PANELS[0].bottleLeft,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, transparent 0%, rgba(237,201,103,0.28) 15%, rgba(237,201,103,0.06) 30%, transparent 45%)',
            filter: 'blur(5px)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Bottle — outer: XY position + perspective */}
        <div
          ref={bottleOuterRef}
          style={{
            position: 'absolute',
            left: PANELS[0].bottleLeft,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            perspective: '900px',
            zIndex: 10,
          }}
        >
          {/* Inner: 3D rotation target — GSAP owns all transforms here */}
          <div
            ref={bottleInnerRef}
            style={{
              position: 'relative',
              width: 340,
              height: 500,
              transformStyle: 'preserve-3d',
              opacity: 0,
            }}
          >
            <Image
              src="/products/Nexovia_Skin_serum.png"
              alt="Nexovia Skin Serum"
              fill
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Text panels */}
        {PANELS.map((p, i) => {
          const isLeft = p.textSide === 'left'

          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                top: '50%',
                ...(isLeft ? { left: '8%' } : { right: '8%' }),
                transform: 'translateY(-50%)',
                maxWidth: '38%',
                zIndex: 20,
              }}
            >
              {/* GSAP animates opacity + x/y on this inner div */}
              <div
                ref={(el) => { panelRefs.current[i] = el }}
                style={{
                  opacity: 0,
                  color: '#ffffff',
                  pointerEvents: i === 0 ? 'auto' : 'none',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    opacity: 0.55,
                    marginBottom: 20,
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {p.tag}
                </p>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(36px, 4vw, 56px)',
                    lineHeight: 1.1,
                    fontWeight: 400,
                    margin: '0 0 20px',
                  }}
                >
                  {p.heading}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    opacity: 0.65,
                    maxWidth: 340,
                    margin: 0,
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {p.subtext}
                </p>
              </div>
            </div>
          )
        })}

        {/* Counter dots — right edge */}
        <div
          style={{
            position: 'absolute',
            right: 28,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            zIndex: 30,
          }}
        >
          {PANELS.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el }}
              style={{
                width: i === 0 ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === 0 ? '#EDC967' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            zIndex: 30,
          }}
        >
          <div
            className="animate-scroll-line"
            style={{
              width: 1,
              height: 50,
              background:
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))',
            }}
          />
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              margin: 0,
            }}
          >
            Scroll
          </p>
        </div>

      </div>
    </section>
  )
}
