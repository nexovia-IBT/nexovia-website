'use client'

/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const GOLD = '#EDC967'
const BURGUNDY = '#732C3F'
const MOBILE_QUERY = '(max-width: 768px)'
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
    title: 'The First 7 Days',
    subtext: 'The protocol begins on the evening following aesthetic treatment with 1 mL applied to clean, dry skin. During the first 7 days, continue applying 1 mL morning and evening to support hydration, skin comfort, and post-procedure recovery.',
    bg: '#732C3F',
    bgWord: 'PROTOCOL',
    isDark: true,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0-7', 'Day 7-14', 'Day 14-28'],
    activeChip: 0,
    accordion: [
      {
        q: 'What is the focus of phase one?',
        a: 'The first seven days after your treatment are when your skin is working hardest. The barrier is at its most vulnerable. Hydration loss is at its peak. This is the intensive phase, and the protocol reflects it: twice-daily application at full dosage, morning and evening. Nexovia Skin Serum, formulated with plant exosomes and PDRN at 1%, supports the skin through this critical window.',
      },
      {
        q: 'What should I expect in week one?',
        a: 'In a clinical evaluation conducted on post-laser skin, 100% of subjects using Nexovia recovered full skin barrier function within 7 days. The untreated side showed no recovery. Hydration on the treated side measured 37.5% above pre-procedure baseline, compared to 20.6% on the untreated side. In practice, this means your skin should feel calmer, more hydrated, and noticeably more comfortable by the end of the first week',
      },
      {
        q: 'When should I apply phase one?',
        a: 'Phase 1 covers the day of your treatment through Day 7. On the evening of your procedure, apply one full dropper (1 mL) to clean skin. From Day 1 onward, apply one full dropper morning and evening. This is the intensive phase. Your skin\'s barrier is at its most vulnerable and its demand for support is at its highest. In the morning, layer SPF over Nexovia. In the evening, apply Nexovia serum before moisturizer.',
      },
    ],
  },
  {
    number: '02',
    label: 'Phase Two',
    title: 'Build Hydration',
    subtext: 'Your skin has moved past the most intensive phase of recovery. The protocol reduces to a half dropper, morning and evening. The focus shifts from acute support to sustained hydration and surface smoothness.',
    bg: '#C57C8A',
    bgWord: 'PROTOCOL',
    isDark: false,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0-7', 'Day 7-14', 'Day 14-28'],
    activeChip: 1,
    accordion: [
      {
        q: 'How does phase two build on phase one?',
        a: 'Phase 1 addressed the immediate post-procedure window when the barrier was most compromised. Phase 2 maintains consistent support as the skin stabilizes. The dosage reduces by half because the skin\'s acute demand has eased, but twice-daily frequency continues to sustain hydration levels built during the first week.',
      },
      {
        q: 'Can I skip phase two?',
        a: 'Phase 2 is where the hydration gains from the first week are consolidated. Stopping at Day 7 risks losing the momentum your skin built during the intensive phase. The barrier has recovered, but the skin is still stabilizing underneath. Seven more days of consistent, reduced-dose application helps lock in that progress.',
      },
      {
        q: 'How long is phase two?',
        a: 'Seven days. Day 8 through Day 14. Half a dropper (0.5 mL), morning and evening. By the end of Phase 2, your skin should feel noticeably more settled, with improved hydration and a smoother surface texture.',
      },
    ],
  },
  {
    number: '03',
    label: 'Phase Three',
    title: 'Refine The Finish',
    subtext: 'Your skin has stabilized. The protocol reduces to a single morning application. The focus shifts from recovery support to refinement: smoother texture, more even tone, and a lasting foundation for your results.',
    bg: '#5A1F2E',
    bgWord: 'NEXOVIA',
    isDark: true,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0-7', 'Day 7-14', 'Day 14-28'],
    activeChip: 2,
    accordion: [
      {
        q: 'What results does phase three support?',
        a: 'By this stage, the barrier is intact and hydration is established. The protocol\'s focus shifts from recovery to anti-aging. The peptide matrix, including EGF-mimetics, Matrixyl, and Argireline, supports skin firmness and smoothness. NAD+ at 1% supports cellular energy at a concentration up to ten times higher than most formulations. Phase 3 is where the serum transitions from aftercare into targeted anti-aging support, refining texture and tone evenness while your treatment results settle into place.',
      },
      {
        q: 'Is phase three for all skin types?',
        a: 'Yes. Nexovia is formulated at pH 5.5, compatible with all Fitzpatrick skin types. Our clinical evaluation included subjects across across multiple Fitzpatrick skin types. By Phase 3, the skin is past the sensitive post-procedure window, so tolerance is typically at its highest.',
      },
      {
        q: 'How does phase three complete the protocol?',
        a: 'Phase 3 runs from Day 15 through Day 27. One half dropper (0.5 mL), morning only, under SPF. This gradual tapering mirrors your skin\'s decreasing need for targeted support. By Day 28, the post-procedure window closes and you transition back to your regular skincare routine',
      },
    ],
  },
  {
    number: '04',
    label: 'Phase Four',
    title: 'Maintain Calm',
    subtext: 'The 28-day protocol is complete. Your skin has been supported through every phase of recovery. What you built in the last four weeks is the foundation for how your treatment results age.',
    bg: '#1A0B12',
    bgWord: 'NEXOVIA',
    isDark: true,
    stripLabel: 'Protocol Timeline',
    chips: ['Day 0-7', 'Day 7-14', 'Day 14-28'],
    activeChip: 2,
    accordion: [
      {
        q: 'How do I maintain results long-term?',
        a: 'The post-procedure window is where treatment results are either protected or lost. In the 28 days following your procedure, your skin rebuilt its barrier, restored hydration, and refined its texture with the support of four bio-amplifiers at concentrations most formulations will not match. Maintaining those results long-term means protecting your skin with SPF daily, avoiding aggressive actives too soon, and repeating the Nexovia protocol after your next treatment.',
      },
      {
        q: 'When will I see final results?',
        a: 'Most aesthetic procedures reach their full visible results between four and twelve weeks post-treatment. The Nexovia protocol covers the first 28 days, the window where your skin is most responsive to targeted support. What you see at Day 28 is a strong foundation. What you see at week eight or twelve is the full expression of both the procedure and the care that followed it.',
      },
      {
        q: 'Can the protocol be repeated?',
        a: 'Yes. Nexovia is designed to be used after every aesthetic treatment. Each procedure opens a new post-procedure window, and each window benefits from the same structured support. One bottle, one protocol, one treatment cycle. The formula\'s anti-aging ingredients, including NAD+ at 1% and the peptide matrix, also mean that repeating the protocol builds cumulative benefits for skin firmness, smoothness, and tone over time.',
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
      number: GOLD,
      label: 'rgba(115,44,63,0.5)',
      title: '#ffffff',
      subtext: '#ffffff',
      accordionQ: '#ffffff',
      accordionA: '#ffffff',
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
    subtext: '#ffffff',
    accordionQ: '#ffffff',
    accordionA: '#ffffff',
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

function MobileProtocolSection({
  openItems,
  toggle,
}: {
  openItems: Record<string, boolean>
  toggle: (pIdx: number, aIdx: number) => void
}) {
  return (
    <section id="protocol-section" style={{ backgroundColor: PHASES[0].bg, overflow: 'hidden' }}>
      {PHASES.map((phase, i) => {
        const c = getColors(phase.isDark)

        return (
          <article
            key={phase.number}
            style={{
              position: 'relative',
              minHeight: '100svh',
              backgroundColor: phase.bg,
              padding: '112px 24px 34px',
              overflow: 'hidden',
              borderTop: i > 0 ? `1px solid ${c.stripBorder}` : undefined,
            }}
          >
            {phase.bgWord && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '36%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <span
                  className="font-serif"
                  style={{
                    fontSize: '31vw',
                    fontWeight: 400,
                    color: c.bgWord,
                    letterSpacing: 0,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {phase.bgWord}
                </span>
              </div>
            )}

            <div style={{ position: 'relative', zIndex: 2, maxWidth: 360, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 18 }}>
                <div>
                  <span
                    className="font-serif"
                    style={{
                      fontSize: 86,
                      fontWeight: 400,
                      color: c.number,
                      lineHeight: 0.82,
                      display: 'block',
                    }}
                  >
                    {phase.number}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: 9,
                      fontSize: 11,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: c.label,
                      fontFamily: SANS,
                    }}
                  >
                    {phase.label}
                  </span>
                </div>

                <div style={{ position: 'relative', width: 92, height: 148, marginBottom: -4 }}>
                  <Image
                    src="/products/Nexovia_wo_background.png"
                    alt="Nexovia Skin Serum"
                    fill
                    unoptimized
                    sizes="92px"
                    style={{
                      objectFit: 'contain',
                      filter: phase.isDark
                        ? 'drop-shadow(0 20px 28px rgba(0,0,0,0.22))'
                        : 'drop-shadow(0 18px 24px rgba(90,31,46,0.18))',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 42 }}>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 34,
                    fontWeight: 400,
                    color: c.title,
                    margin: '0 0 12px',
                    lineHeight: 1.06,
                  }}
                >
                  {phase.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: c.subtext,
                    margin: 0,
                    fontFamily: SANS,
                  }}
                >
                  {phase.subtext}
                </p>
              </div>

              <div style={{ marginTop: 30 }}>
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: c.label,
                    fontFamily: SANS,
                  }}
                >
                  Questions
                </p>

                {phase.accordion.map((item, j) => {
                  const isOpen = openItems[`${i}-${j}`] ?? false

                  return (
                    <div
                      key={item.q}
                      style={{
                        borderTop: `1px solid ${c.accordionDivider}`,
                        borderBottom: j === phase.accordion.length - 1 ? `1px solid ${c.accordionDivider}` : undefined,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(i, j)}
                        aria-expanded={isOpen}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 14,
                          width: '100%',
                          minHeight: 58,
                          padding: '14px 0',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            color: c.accordionQ,
                            fontFamily: SANS,
                            lineHeight: 1.38,
                            flex: 1,
                          }}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          style={{
                            width: 28,
                            height: 28,
                            border: `1px solid ${c.indicatorBorder}`,
                            borderRadius: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: c.indicatorColor,
                            fontSize: 20,
                            fontFamily: SANS,
                            lineHeight: 1,
                          }}
                        >
                          {isOpen ? '-' : '+'}
                        </span>
                      </button>

                      {isOpen && (
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: 1.66,
                            color: c.accordionA,
                            fontFamily: SANS,
                            margin: '0 0 18px',
                          }}
                        >
                          {item.a}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              <div
                style={{
                  marginTop: 30,
                  paddingTop: 16,
                  borderTop: `1px solid ${c.stripBorder}`,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: c.stripLabel,
                    fontFamily: SANS,
                    marginBottom: 10,
                  }}
                >
                  {phase.stripLabel}
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 4,
                    scrollbarWidth: 'none',
                  }}
                >
                  {phase.chips.map((chip, k) => {
                    const isActive = k === phase.activeChip
                    return (
                      <span
                        key={chip}
                        style={{
                          padding: '8px 13px',
                          borderRadius: 999,
                          border: `1px solid ${isActive ? c.chipActiveBorder : c.chipDefaultBorder}`,
                          backgroundColor: isActive ? c.chipActiveBg : c.chipDefaultBg,
                          color: isActive ? c.chipActiveText : c.chipDefaultText,
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily: SANS,
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {chip}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default function ProtocolSection() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mobileLayout, setMobileLayout] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const sectionRef   = useRef<HTMLElement>(null)
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([])
  const bottleRefs   = useRef<(HTMLDivElement | null)[]>([])
  const bgWordRefs   = useRef<(HTMLDivElement | null)[]>([])
  const currentPanel = useRef(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const updateLayout = () => setMobileLayout(mediaQuery.matches)

    updateLayout()
    mediaQuery.addEventListener('change', updateLayout)
    return () => mediaQuery.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) return
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
  }, [])

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
  if (mobileLayout) {
    return <MobileProtocolSection openItems={openItems} toggle={toggle} />
  }

  if (reducedMotion) {
    return (
      <section id="protocol-section">
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
    <section id="protocol-section" ref={sectionRef} style={{ height: '600vh', backgroundColor: '#732C3F' }}>
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
                  gridTemplateColumns: '180px 1fr 430px',
                  columnGap: 40,
                  padding: '0 120px 0 64px',
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
                    style={{ position: 'relative', width: 200, height: 320, flexShrink: 0, background: 'transparent' }}
                  >
                    <Image
                      src="/products/Nexovia_wo_background.png"
                      alt="Nexovia Skin Serum"
                      fill
                      unoptimized
                      sizes="200px"
                      style={{ objectFit: 'contain', background: 'transparent' }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: 'clamp(28px, 3vw, 46px)',
                        fontWeight: 700,
                        color: c.title,
                        margin: '0 0 10px',
                        lineHeight: 1.15,
                      }}
                    >
                      {phase.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 22,
                        lineHeight: 1.7,
                        color: c.subtext,
                        margin: '0 auto',
                        maxWidth: 760,
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
                              fontSize: 19,
                              fontWeight: 700,
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
                            maxHeight: isOpen ? '1000px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.3s ease',
                          }}
                        >
                          <p
                            style={{
                              fontSize: 18,
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
