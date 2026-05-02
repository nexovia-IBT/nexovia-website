'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const GOLD = '#EDC967'
const BURGUNDY = '#732C3F'
const STRIP_H = 68

interface AccordionItem {
  q: string
  a: string
}

interface PhaseData {
  number: string
  label: string
  title: string
  subtext: string
  bg: string
  bgWord: string | null
  isDark: boolean
  stripLabel: string
  chips: string[]
  activeChip: number
  accordion: AccordionItem[]
}

const PHASES: PhaseData[] = [
  {
    number: '01',
    label: 'Phase One',
    title: '[Phase One — The Foundation]',
    subtext: '[Phase one description. Replace with final copy from content team.]',
    bg: '#732C3F',
    bgWord: 'PROTOCOL',
    isDark: true,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0–7', 'Day 7–14', 'Day 14–28'],
    activeChip: 0,
    accordion: [
      {
        q: '[How does phase one activate the formula?]',
        a: '[Answer explaining phase one mechanism. Replace with final copy.]',
      },
      {
        q: '[What should I expect in week one?]',
        a: '[Answer describing expected results and timeline. Replace with final copy.]',
      },
      {
        q: '[When should I apply phase one?]',
        a: '[Answer with usage instructions and timing. Replace with final copy.]',
      },
    ],
  },
  {
    number: '02',
    label: 'Phase Two',
    title: '[Phase Two — The Amplifier]',
    subtext: '[Phase two description. Replace with final copy from content team.]',
    bg: '#C57C8A',
    bgWord: 'PROTOCOL',
    isDark: false,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0–7', 'Day 7–14', 'Day 14–28'],
    activeChip: 1,
    accordion: [
      {
        q: '[How does phase two build on phase one?]',
        a: '[Answer explaining synergy between phases. Replace with final copy.]',
      },
      {
        q: '[Can I skip phase one?]',
        a: '[Answer about protocol adherence. Replace with final copy.]',
      },
      {
        q: '[How long is phase two?]',
        a: '[Answer with duration and schedule. Replace with final copy.]',
      },
    ],
  },
  {
    number: '03',
    label: 'Phase Three',
    title: '[Phase Three — The Seal]',
    subtext: '[Phase three description. Replace with final copy from content team.]',
    bg: '#5A1F2E',
    bgWord: 'NEXOVIA',
    isDark: true,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0–7', 'Day 7–14', 'Day 14–28'],
    activeChip: 2,
    accordion: [
      {
        q: '[What results does phase three deliver?]',
        a: '[Answer describing outcomes. Replace with final copy.]',
      },
      {
        q: '[Is phase three for all skin types?]',
        a: '[Answer about skin compatibility. Replace with final copy.]',
      },
      {
        q: '[How does phase three complete the protocol?]',
        a: '[Answer explaining completion. Replace with final copy.]',
      },
    ],
  },
  {
    number: '04',
    label: 'Phase Four',
    title: '[Phase Four — Maintenance]',
    subtext: '[Phase four description. Replace with final copy from content team.]',
    bg: '#1A0B12',
    bgWord: null,
    isDark: true,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0–7', 'Day 7–14', 'Day 14–28'],
    activeChip: 2,
    accordion: [
      {
        q: '[How do I maintain results long-term?]',
        a: '[Answer with maintenance routine. Replace with final copy.]',
      },
      {
        q: '[When will I see final results?]',
        a: '[Answer with result timeline. Replace with final copy.]',
      },
      {
        q: '[Can the protocol be repeated?]',
        a: '[Answer about protocol cycling. Replace with final copy.]',
      },
    ],
  },
]

interface PanelColors {
  number: string
  label: string
  title: string
  subtext: string
  accordionQ: string
  accordionA: string
  accordionDivider: string
  indicatorBorder: string
  indicatorColor: string
  bgWord: string
  chipDefaultBorder: string
  chipDefaultText: string
  chipDefaultBg: string
  chipActiveBorder: string
  chipActiveText: string
  chipActiveBg: string
  stripBorder: string
  stripBg: string
  stripLabel: string
}

function getColors(isDark: boolean): PanelColors {
  if (!isDark) {
    return {
      number: BURGUNDY,
      label: 'rgba(115,44,63,0.5)',
      title: BURGUNDY,
      subtext: 'rgba(115,44,63,0.6)',
      accordionQ: BURGUNDY,
      accordionA: 'rgba(115,44,63,0.6)',
      accordionDivider: 'rgba(115,44,63,0.12)',
      indicatorBorder: 'rgba(115,44,63,0.2)',
      indicatorColor: BURGUNDY,
      bgWord: 'rgba(115,44,63,0.06)',
      chipDefaultBorder: 'rgba(115,44,63,0.3)',
      chipDefaultText: BURGUNDY,
      chipDefaultBg: 'transparent',
      chipActiveBorder: BURGUNDY,
      chipActiveText: '#ffffff',
      chipActiveBg: BURGUNDY,
      stripBorder: 'rgba(115,44,63,0.12)',
      stripBg: 'rgba(197,124,138,0.15)',
      stripLabel: 'rgba(115,44,63,0.4)',
    }
  }
  return {
    number: GOLD,
    label: 'rgba(237,201,103,0.55)',
    title: '#ffffff',
    subtext: 'rgba(255,255,255,0.6)',
    accordionQ: '#ffffff',
    accordionA: 'rgba(255,255,255,0.55)',
    accordionDivider: 'rgba(255,255,255,0.1)',
    indicatorBorder: 'rgba(255,255,255,0.2)',
    indicatorColor: GOLD,
    bgWord: 'rgba(255,255,255,0.05)',
    chipDefaultBorder: 'rgba(255,255,255,0.25)',
    chipDefaultText: 'rgba(255,255,255,0.65)',
    chipDefaultBg: 'transparent',
    chipActiveBorder: GOLD,
    chipActiveText: GOLD,
    chipActiveBg: 'transparent',
    stripBorder: 'rgba(255,255,255,0.08)',
    stripBg: 'rgba(0,0,0,0.12)',
    stripLabel: 'rgba(255,255,255,0.4)',
  }
}

export default function ProtocolSection() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const sectionRef   = useRef<HTMLElement>(null)
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([])
  const bottleRefs   = useRef<(HTMLDivElement | null)[]>([])
  const bgWordRefs   = useRef<(HTMLDivElement | null)[]>([])
  const currentPanel = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Initial clip states — panel 0 fully visible, rest hidden via right inset
      panelRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { clipPath: i === 0 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' })
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self) {
          const idx = Math.min(Math.floor(self.progress * 4), 3)
          if (idx !== currentPanel.current) {
            transitionPanel(idx, currentPanel.current)
            currentPanel.current = idx
          }
        },
      })
    })

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function transitionPanel(next: number, prev: number) {
    const forward = next > prev

    if (forward) {
      // Ensure incoming panel starts fully clipped from the right
      gsap.set(panelRefs.current[next], { clipPath: 'inset(0 100% 0 0)' })
      // Wipe in from left to right
      gsap.to(panelRefs.current[next], {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.65,
        ease: 'power2.inOut',
      })
    } else {
      // Ensure the panel we're returning to is fully visible underneath
      gsap.set(panelRefs.current[next], { clipPath: 'inset(0 0% 0 0)' })
      // Wipe current panel out to the right
      gsap.to(panelRefs.current[prev], {
        clipPath: 'inset(0 0% 0 100%)',
        duration: 0.65,
        ease: 'power2.inOut',
      })
    }

    // Bottle scale pulse on the panel becoming active
    const bottleEl = bottleRefs.current[next]
    if (bottleEl) {
      gsap.timeline()
        .to(bottleEl, { scale: 1.05, duration: 0.325, ease: 'power2.out' })
        .to(bottleEl, { scale: 1.0,  duration: 0.325, ease: 'power2.in'  })
    }

    // Background word slides in on the incoming panel
    const bgWordEl = bgWordRefs.current[next]
    if (bgWordEl) {
      gsap.set(bgWordEl, { x: forward ? 70 : -70 })
      gsap.to(bgWordEl, { x: 0, duration: 0.65, ease: 'power2.out' })
    }
  }

  // Only one accordion item open per panel at a time
  function toggle(pIdx: number, aIdx: number) {
    setOpenItems(prev => {
      const next: Record<string, boolean> = {}
      // Carry over state for all other panels
      Object.entries(prev).forEach(([key, val]) => {
        if (!key.startsWith(`${pIdx}-`)) next[key] = val
      })
      // Toggle this item, close siblings
      next[`${pIdx}-${aIdx}`] = !prev[`${pIdx}-${aIdx}`]
      return next
    })
  }

  // ── Reduced-motion fallback — stacked panels ──────────────────────────────
  if (reducedMotion) {
    return (
      <section>
        {PHASES.map((phase, i) => {
          const c = getColors(phase.isDark)
          return (
            <div
              key={i}
              style={{
                backgroundColor: phase.bg,
                padding: '80px 8%',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined,
              }}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: 'clamp(48px, 6vw, 80px)',
                  fontWeight: 400,
                  color: c.number,
                  lineHeight: 0.9,
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                {phase.number}
              </span>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase' as const,
                  color: c.label,
                  fontFamily: SANS,
                  display: 'block',
                  marginBottom: 16,
                }}
              >
                {phase.label}
              </span>
              <h3
                className="font-serif"
                style={{
                  fontSize: 'clamp(22px, 2.4vw, 34px)',
                  fontWeight: 400,
                  color: c.title,
                  margin: '0 0 10px',
                  lineHeight: 1.15,
                }}
              >
                {phase.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: c.subtext,
                  margin: 0,
                  maxWidth: 480,
                  fontFamily: SANS,
                }}
              >
                {phase.subtext}
              </p>
            </div>
          )
        })}
      </section>
    )
  }

  // ── Animated layout ───────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} style={{ height: '600vh', backgroundColor: '#732C3F' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {PHASES.map((phase, i) => {
          const c = getColors(phase.isDark)

          return (
            <div
              key={i}
              ref={(el) => { panelRefs.current[i] = el }}
              style={{ position: 'absolute', inset: 0, backgroundColor: phase.bg }}
            >

              {/* Background word */}
              {phase.bgWord && (
                <div
                  ref={(el) => { bgWordRefs.current[i] = el }}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  <span
                    className="font-serif"
                    style={{
                      fontSize: 'clamp(140px, 20vw, 260px)',
                      fontWeight: 400,
                      color: c.bgWord,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {phase.bgWord}
                  </span>
                </div>
              )}

              {/* 3-column content grid */}
              <div
                style={{
                  position: 'absolute',
                  top: 80,
                  left: 0,
                  right: 0,
                  bottom: STRIP_H,
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr 300px',
                  columnGap: 40,
                  padding: '0 64px',
                  alignItems: 'center',
                  alignContent: 'center',
                  zIndex: 2,
                }}
              >

                {/* Left: phase number + label */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span
                    className="font-serif"
                    style={{
                      fontSize: 'clamp(80px, 9vw, 130px)',
                      fontWeight: 400,
                      color: c.number,
                      lineHeight: 0.9,
                      display: 'block',
                    }}
                  >
                    {phase.number}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase' as const,
                      color: c.label,
                      fontFamily: SANS,
                    }}
                  >
                    {phase.label}
                  </span>
                </div>

                {/* Center: bottle + title + subtext */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 20,
                  }}
                >
                  <div
                    ref={(el) => { bottleRefs.current[i] = el }}
                    style={{ position: 'relative', width: 200, height: 320, flexShrink: 0 }}
                  >
                    <Image
                      src="/products/Nexovia_Skin_serum.png"
                      alt="Nexovia Skin Serum"
                      fill
                      sizes="200px"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: 'clamp(20px, 2.2vw, 32px)',
                        fontWeight: 400,
                        color: c.title,
                        margin: '0 0 10px',
                        lineHeight: 1.15,
                      }}
                    >
                      {phase.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: c.subtext,
                        margin: 0,
                        maxWidth: 340,
                        fontFamily: SANS,
                      }}
                    >
                      {phase.subtext}
                    </p>
                  </div>
                </div>

                {/* Right: accordion */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {phase.accordion.map((item, j) => {
                    const isOpen = openItems[`${i}-${j}`] ?? false
                    return (
                      <div key={j}>
                        {j > 0 && (
                          <div style={{ height: 1, backgroundColor: c.accordionDivider }} />
                        )}
                        <button
                          type="button"
                          onClick={() => toggle(i, j)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            width: '100%',
                            padding: '18px 0',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: c.accordionQ,
                              fontFamily: SANS,
                              lineHeight: 1.4,
                              flex: 1,
                            }}
                          >
                            {item.q}
                          </span>
                          <div
                            aria-hidden="true"
                            style={{
                              width: 22,
                              height: 22,
                              border: `1px solid ${c.indicatorBorder}`,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              color: c.indicatorColor,
                              fontSize: 18,
                              fontFamily: SANS,
                              lineHeight: 1,
                            }}
                          >
                            {isOpen ? '−' : '+'}
                          </div>
                        </button>
                        <div
                          style={{
                            maxHeight: isOpen ? '200px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.3s ease',
                          }}
                        >
                          <p
                            style={{
                              fontSize: 12,
                              lineHeight: 1.75,
                              color: c.accordionA,
                              fontFamily: SANS,
                              margin: '0 0 18px',
                            }}
                          >
                            {item.a}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>

              {/* Bottom chip strip */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: STRIP_H,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 64,
                  paddingRight: 64,
                  gap: 16,
                  borderTop: `1px solid ${c.stripBorder}`,
                  backgroundColor: c.stripBg,
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const,
                    color: c.stripLabel,
                    fontFamily: SANS,
                    flexShrink: 0,
                    marginRight: 4,
                  }}
                >
                  {phase.stripLabel}
                </span>
                <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
                  {phase.chips.map((chip, k) => {
                    const isActive = k === phase.activeChip
                    return (
                      <div
                        key={k}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          border: `1px solid ${isActive ? c.chipActiveBorder : c.chipDefaultBorder}`,
                          backgroundColor: isActive ? c.chipActiveBg : c.chipDefaultBg,
                          color: isActive ? c.chipActiveText : c.chipDefaultText,
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase' as const,
                          fontFamily: SANS,
                          flexShrink: 0,
                          whiteSpace: 'nowrap' as const,
                        }}
                      >
                        {chip}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )
        })}

      </div>
    </section>
  )
}
