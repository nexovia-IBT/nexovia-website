'use client'

/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const MOBILE_QUERY = '(max-width: 768px)'
const AMBIENT_BG = ['#F7E8EC', '#F4E2E8', '#F8EBED', '#F2DDE5', '#F6E6EB', '#F3E0E7', '#F8ECF0', '#EDD6DE']
const ILLUSTRATION_ROTATE = [-5, 8, -10, 6, -8, 12, -6, 9]

const SLIDES = [
  { number: '01', title: 'Niacinamide', benefit: 'CELLULAR BALANCE', description: 'A multifunctional form of vitamin B3, known for supporting epidermal barrier function, improving moisture retention, and helping reduce visible redness after aesthetic procedures.', details: ['Moisture retention', 'Reduced visible redness', 'More even-looking skin'], illustration: 'niacinamide' },
  { number: '02', title: 'Biosaccharide', benefit: 'MOISTURE RETENTION', description: 'A plant-derived polysaccharide that forms a lightweight moisture film to reduce water loss and support skin comfort following aesthetic treatment.', details: ['Moisture retention', 'Reduced water loss (Decrease TEWL)', 'Skin comfort'], illustration: 'biosaccharide' },
  { number: '03', title: 'Hyaluronic Acid', benefit: 'MULTI-WEIGHT HYDRATION', description: 'A blend of hyaluronic acid molecules of varying weights designed to attract and retain moisture across multiple layers of the skin following aesthetic treatment.', details: ['Multi-layer hydration', 'Moisture retention', 'Improved skin suppleness'], illustration: 'hyaluronic' },
  { number: '04', title: 'Adenosine', benefit: 'CELLULAR SIGNALING', description: 'A naturally occurring nucleoside included to support skin recovery, improve visible smoothness, and support collagen production following aesthetic treatment.', details: ['Skin recovery', 'Soothing', 'Collagen support'], illustration: 'adenosine' },
  { number: '05', title: 'Centella Asiatica', benefit: 'BOTANICAL RECOVERY SUPPORT', description: 'Centella Asiatica extract and callus culture included to reduce visible redness, support skin comfort, and reinforce post-procedure skin recovery.', details: ['Reduced visible redness', 'Skin comfort', 'Post-procedure recovery'], illustration: 'centella' },
  { number: '06', title: 'Allantoin', benefit: 'SKIN COMFORT SUPPORT', description: 'A botanical-derived active included to reduce visible irritation, support skin comfort, and improve skin texture following aesthetic treatment.', details: ['Reduced visible irritation', 'Skin comfort', 'Improved texture'], illustration: 'allantoin' },
  { number: '07', title: 'Panthenol', benefit: 'MOISTURE & BARRIER SUPPORT', description: 'Provitamin B5 included to support moisture retention, reduce dryness, and improve skin comfort following aesthetic treatment.', details: ['Moisture retention', 'Reduced dryness', 'Skin comfort'], illustration: 'panthenol' },
  { number: '08', title: 'Botanical Complex', benefit: 'BOTANICAL ANTIOXIDANT SUPPORT', description: 'A blend of chamomile, aloe, green tea, lotus, sea buckthorn, and edelweiss included to provide antioxidant support and improve skin comfort following aesthetic treatment.', details: ['Antioxidant support', 'Skin comfort', 'Glass skin finish'], illustration: 'botanical' },
]

type IllustrationKind = typeof SLIDES[number]['illustration']

function IngredientIllustration({ kind }: { kind: IllustrationKind }) {
  const common = { stroke: '#732C3F', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 260 260" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id={`glow-${kind}`} cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" /><stop offset="56%" stopColor="#F5C5D0" stopOpacity="0.54" /><stop offset="100%" stopColor="#C57C8A" stopOpacity="0" /></radialGradient>
        <linearGradient id={`rose-${kind}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFF6F4" /><stop offset="48%" stopColor="#F4B9C6" /><stop offset="100%" stopColor="#C57C8A" /></linearGradient>
        <linearGradient id={`gold-${kind}`} x1="10%" y1="0%" x2="90%" y2="100%"><stop offset="0%" stopColor="#FFF0A6" /><stop offset="50%" stopColor="#EDC967" /><stop offset="100%" stopColor="#B78336" /></linearGradient>
      </defs>
      <circle cx="130" cy="130" r="116" fill={`url(#glow-${kind})`} />
      {kind === 'niacinamide' && <g><polygon points="130,54 190,88 190,158 130,194 70,158 70,88" fill="rgba(255,255,255,0.42)" {...common} /><polygon points="130,80 168,102 168,146 130,168 92,146 92,102" fill="none" {...common} opacity="0.5" /><circle cx="130" cy="124" r="18" fill={`url(#gold-${kind})`} stroke="#732C3F" strokeWidth="1.5" /><text x="130" y="130" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#732C3F">B3</text>{[[130,54],[190,88],[190,158],[130,194],[70,158],[70,88]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill={`url(#rose-${kind})`} stroke="#732C3F" strokeWidth="1.4" />)}</g>}
      {kind === 'biosaccharide' && <g>{[76,112,148,184].map((x,i) => <g key={x} transform={`translate(${x} ${i % 2 === 0 ? 120 : 140})`}><polygon points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12" fill={i % 2 === 0 ? `url(#gold-${kind})` : `url(#rose-${kind})`} {...common} /></g>)}<path d="M96 132c10 10 18 10 30 0M132 130c11-10 20-10 32 0M168 132c10 10 18 10 30 0" fill="none" {...common} opacity="0.58" /></g>}
      {kind === 'hyaluronic' && <g><path d="M130 42c33 46 58 81 58 119 0 34-25 59-58 59s-58-25-58-59c0-38 25-73 58-119Z" fill={`url(#rose-${kind})`} {...common} /><circle cx="84" cy="84" r="10" fill={`url(#gold-${kind})`} /><circle cx="178" cy="190" r="8" fill={`url(#gold-${kind})`} /><circle cx="190" cy="96" r="10" fill="#fff" opacity="0.72" /></g>}
      {kind === 'adenosine' && <image href="/products/adenosine-molecule.png" x="40" y="48" width="180" height="166" preserveAspectRatio="xMidYMid meet" />}
      {kind === 'allantoin' && <image href="/products/allantoin-molecule.svg" x="22" y="70" width="216" height="118" preserveAspectRatio="xMidYMid meet" />}
      {kind === 'centella' && <g><path d="M132 205c-4-44 0-81 10-111" {...common} /><path d="M132 128C85 92 83 55 83 55s46 2 70 49c-16 1-27 9-21 24Z" fill={`url(#rose-${kind})`} {...common} /><path d="M142 121c44-36 80-25 80-25s-12 43-62 55c1-15-6-27-18-30Z" fill="rgba(237,201,103,0.62)" {...common} /><path d="M126 150c-46-8-68 18-68 18s31 29 77 12c-10-9-13-19-9-30Z" fill="rgba(255,255,255,0.52)" {...common} /></g>}
      {kind === 'panthenol' && <g><polygon points="130,64 184,96 184,158 130,190 76,158 76,96" fill={`url(#rose-${kind})`} {...common} /><polygon points="130,88 162,107 162,145 130,164 98,145 98,107" fill="rgba(255,255,255,0.38)" stroke="#732C3F" strokeWidth="1.5" />{[[130,64],[184,96],[184,158],[130,190],[76,158],[76,96]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill={`url(#gold-${kind})`} stroke="#732C3F" strokeWidth="1.4" />)}<text x="130" y="134" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="23" fontWeight="700" fill="#732C3F">B5</text><circle cx="190" cy="74" r="9" fill="rgba(255,255,255,0.75)" /></g>}
      {kind === 'botanical' && <g>{[[130,72,0],[174,98,60],[174,150,120],[130,176,180],[86,150,240],[86,98,300]].map(([x,y,r]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r})`}><path d="M0-36c21 11 28 31 0 56-28-25-21-45 0-56Z" fill={`url(#rose-${kind})`} {...common} /></g>)}<circle cx="130" cy="130" r="26" fill={`url(#gold-${kind})`} stroke="#732C3F" strokeWidth="1.5" /></g>}
    </svg>
  )
}

function getDetailIconKind(detail: string, index: number) {
  const normalized = detail.toLowerCase()
  if (normalized.includes('multi-layer') || normalized.includes('hydration')) return 'layers'
  if (normalized.includes('moisture retention')) return index === 0 ? 'drop' : 'dropPlus'
  if (normalized.includes('dryness')) return 'dryness'
  if (normalized.includes('water loss') || normalized.includes('tewl')) return 'shieldDrop'
  if (normalized.includes('redness')) return 'calm'
  if (normalized.includes('irritation') || normalized.includes('soothing')) return 'leaf'
  if (normalized.includes('comfort')) return 'hand'
  if (normalized.includes('suppleness')) return 'elastic'
  if (normalized.includes('recovery')) return 'renewal'
  if (normalized.includes('collagen')) return 'network'
  if (normalized.includes('antioxidant')) return 'shieldSparkle'
  if (normalized.includes('glass skin')) return 'diamond'
  return 'surface'
}

function DetailIcon({ detail, index }: { detail: string; index: number }) {
  const kind = getDetailIconKind(detail, index)
  const common = { fill: 'none', stroke: '#B05C72', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'rgba(197,124,138,0.13)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg viewBox="0 0 24 24" style={{ width: 14, height: 14, display: 'block' }}>{kind === 'drop' && <path d="M12 3c3 4 5 6.8 5 10a5 5 0 0 1-10 0c0-3.2 2-6 5-10Z" {...common} />}{kind === 'dropPlus' && <g {...common}><path d="M10.5 4c2.5 3.4 4.1 5.6 4.1 8.1a4.1 4.1 0 0 1-8.2 0c0-2.5 1.6-4.7 4.1-8.1Z" /><path d="M17 13v5M14.5 15.5h5" /></g>}{kind === 'dryness' && <g {...common}><path d="M4.5 8.5h5.2l1.1-1.8 1.4 3.1 1.2-1.3h6.1" /><path d="M4.5 13h4.1l1.3-1.7 1.6 3.1 1.4-1.4h6.6" /><path d="M4.5 17.5h5.8l1.2-1.5 1.5 2.4 1.3-.9h5.2" /></g>}{kind === 'layers' && <g {...common}><path d="M12 4 4.8 8l7.2 4 7.2-4L12 4Z" /><path d="M5 12l7 4 7-4" /><path d="M5 16l7 4 7-4" /></g>}{kind === 'shieldDrop' && <g {...common}><path d="M12 3 18 5.4v5.2c0 4-2.4 7.1-6 9.4-3.6-2.3-6-5.4-6-9.4V5.4L12 3Z" /><path d="M12 8.2c1.5 2 2.4 3.3 2.4 4.7a2.4 2.4 0 0 1-4.8 0c0-1.4.9-2.7 2.4-4.7Z" /></g>}{kind === 'calm' && <g {...common}><path d="M4 9c2-2 4-2 6 0s4 2 6 0 3-1.5 4 0" /><path d="M4 14c2-2 4-2 6 0s4 2 6 0 3-1.5 4 0" /></g>}{kind === 'leaf' && <g {...common}><path d="M6 17c6.5.4 11-3.5 12-11-7.5 1-11.4 5.5-11 12" /><path d="M7 17c2.6-3.2 5.4-5.4 9-7" /></g>}{kind === 'hand' && <g {...common}><path d="M5 14.5c2.4-1 4.4-1.2 6.3-.4l2.1.9" /><path d="M9.8 14.2h4.1c1.2 0 1.8.7 1.8 1.5 0 .7-.5 1.3-1.5 1.4l-3.3.2" /><path d="M15.4 15.4 18.8 13c.9-.6 1.8-.3 2.2.4.3.6.1 1.3-.6 1.8l-5.1 3.7c-.7.5-1.5.7-2.4.5L5 17.6" /></g>}{kind === 'elastic' && <g {...common}><path d="M5 13c2.2-4.5 5.1-4.5 7 0s4.8 4.5 7 0" /><path d="M5 17c2.2-4.5 5.1-4.5 7 0s4.8 4.5 7 0" /></g>}{kind === 'renewal' && <g {...common}><path d="M18.2 8.2A7 7 0 0 0 6.6 6.7L5 8.3" /><path d="M5 4.5v3.8h3.8" /><path d="M5.8 15.8a7 7 0 0 0 11.6 1.5l1.6-1.6" /><path d="M19 19.5v-3.8h-3.8" /></g>}{kind === 'network' && <g {...common}><path d="M7 7h10v10H7Z" /><path d="M7 7l10 10M17 7 7 17" /></g>}{kind === 'shieldSparkle' && <g {...common}><path d="M12 3 18 5.4v5.2c0 4-2.4 7.1-6 9.4-3.6-2.3-6-5.4-6-9.4V5.4L12 3Z" /><path d="M12 8v6M9 11h6" /></g>}{kind === 'diamond' && <g {...common}><path d="M6 8h12l-6 11L6 8Z" /><path d="M8.5 5h7L18 8H6l2.5-3Z" /><path d="M10 8l2 11 2-11" /></g>}{kind === 'surface' && <g {...common}><path d="M5 8h14" /><path d="M5 12h14" /><path d="M5 16h14" /></g>}</svg></span>
}

function MobileSupportingArchitectureSection() {
  return (
    <section id="sa-section" style={{ backgroundColor: AMBIENT_BG[0], overflow: 'hidden' }}>
      {SLIDES.map((slide, i) => (
        <article
          key={slide.title}
          style={{
            position: 'relative',
            minHeight: '100svh',
            backgroundColor: AMBIENT_BG[i],
            padding: '92px 20px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '24%',
              transform: 'translateX(-50%)',
              color: '#732C3F',
              opacity: 0.055,
              fontSize: slide.title.length > 13 ? 54 : 68,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              zIndex: 1,
              pointerEvents: 'none',
            }}
            className="font-serif"
          >
            {slide.title}
          </div>

          <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 372 }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <h2
                className="font-serif"
                style={{
                  fontSize: 30,
                  fontWeight: 400,
                  color: '#732C3F',
                  lineHeight: 1.06,
                  margin: '0 0 9px',
                }}
              >
                Supporting Architecture
              </h2>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#C57C8A',
                  margin: 0,
                  fontFamily: SANS,
                }}
              >
                Formula Components
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.12em', color: '#732C3F', fontFamily: SANS, fontWeight: 700 }}>
                {slide.number}
                <span style={{ color: '#C57C8A', fontWeight: 500, marginLeft: 5 }}>/ 08</span>
              </p>
              <div style={{ display: 'flex', gap: 5 }}>
                {SLIDES.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    aria-hidden="true"
                    style={{
                      width: dotIdx === i ? 18 : 5,
                      height: 5,
                      borderRadius: 999,
                      backgroundColor: dotIdx === i ? '#732C3F' : 'rgba(197,124,138,0.24)',
                      display: 'block',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#C57C8A',
                  fontFamily: SANS,
                  fontWeight: 700,
                }}
              >
                {slide.benefit}
              </p>
              <h3
                className="font-serif"
                style={{
                  margin: 0,
                  color: '#732C3F',
                  fontSize: slide.title.length > 14 ? 30 : 34,
                  fontWeight: 400,
                  lineHeight: 1.05,
                }}
              >
                {slide.title}
              </h3>
            </div>

            <div
              style={{
                width: 138,
                height: 138,
                margin: '14px auto 12px',
                filter: 'drop-shadow(0 22px 30px rgba(115,44,63,0.14))',
              }}
            >
              <IngredientIllustration kind={slide.illustration} />
            </div>

            <p
              style={{
                margin: '0 auto',
                maxWidth: 326,
                textAlign: 'center',
                fontSize: 13,
                lineHeight: 1.52,
                color: 'rgba(90,31,46,0.82)',
                fontFamily: SANS,
              }}
            >
              {slide.description}
            </p>

            <div style={{ marginTop: 16 }}>
              {slide.details.map((detail, detailIdx) => (
                <div
                  key={detail}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '30px 24px minmax(0, 1fr)',
                    alignItems: 'center',
                    columnGap: 10,
                    padding: detailIdx === 0 ? '0 0 10px' : '10px 0',
                    borderBottom: detailIdx < slide.details.length - 1 ? '1px solid rgba(115,44,63,0.11)' : undefined,
                  }}
                >
                  <DetailIcon detail={detail} index={detailIdx} />
                  <span aria-hidden="true" style={{ width: 24, height: 1, backgroundColor: '#EDC967', display: 'block' }} />
                  <span
                    style={{
                      color: '#732C3F',
                      fontSize: 11,
                      lineHeight: 1.28,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontFamily: SANS,
                      fontWeight: 700,
                    }}
                  >
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export default function SupportingArchitectureSection() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mobileLayout, setMobileLayout] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const illustrationRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentSlide = useRef(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const updateLayout = () => setMobileLayout(mediaQuery.matches)

    updateLayout()
    mediaQuery.addEventListener('change', updateLayout)
    return () => mediaQuery.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setReducedMotion(true); return }
    let scrollRaf: number | null = null
    const getSectionProgress = () => {
      const section = sectionRef.current
      if (!section) return 0
      const top = section.getBoundingClientRect().top + window.scrollY
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      return Math.min(Math.max((window.scrollY - top) / distance, 0), 1)
    }
    const updateFromScroll = () => {
      const progress = getSectionProgress()
      const idx = Math.min(Math.floor(progress * SLIDES.length), SLIDES.length - 1)
      if (idx !== currentSlide.current) transitionSlide(idx, currentSlide.current)
    }
    const requestUpdate = () => {
      if (scrollRaf !== null) return
      scrollRaf = window.requestAnimationFrame(() => { scrollRaf = null; updateFromScroll() })
    }
    const ctx = gsap.context(() => {
      slideRefs.current.forEach((el, i) => { if (el && i !== 0) gsap.set(el, { opacity: 0, y: 60, pointerEvents: 'none', zIndex: 0 }) })
      gsap.set(illustrationRefs.current[0], { rotate: ILLUSTRATION_ROTATE[0] })
    })
    updateFromScroll()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => { window.removeEventListener('scroll', requestUpdate); window.removeEventListener('resize', requestUpdate); if (scrollRaf !== null) window.cancelAnimationFrame(scrollRaf); ctx.revert() }
  }, [])

  function transitionSlide(next: number, prev: number) {
    currentSlide.current = next
    const slides = slideRefs.current
    slides.forEach((s) => { if (s) gsap.killTweensOf(s) })
    slides.forEach((s, i) => { if (s && i !== next) gsap.set(s, { opacity: 0, y: 0, pointerEvents: 'none', zIndex: 0 }) })
    gsap.fromTo(slides[next], { opacity: 0, y: next > prev ? 60 : -60, pointerEvents: 'auto', zIndex: 5 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    const illustration = illustrationRefs.current[next]
    if (illustration) { gsap.killTweensOf(illustration); gsap.set(illustration, { rotate: ILLUSTRATION_ROTATE[prev], scale: 0.96 }); gsap.to(illustration, { rotate: ILLUSTRATION_ROTATE[next], scale: 1, duration: 0.7, ease: 'power2.out' }) }
    gsap.to(stageRef.current, { backgroundColor: AMBIENT_BG[next], duration: 0.6, ease: 'power2.inOut' })
    dotRefs.current.forEach((dot, i) => { if (dot) gsap.to(dot, { backgroundColor: i === next ? '#732C3F' : 'rgba(197,124,138,0.2)', duration: 0.3 }) })
  }

  if (mobileLayout) {
    return <MobileSupportingArchitectureSection />
  }

  if (reducedMotion) {
    return <section id="sa-section" style={{ backgroundColor: '#F7E8EC', padding: '80px 0' }}>{SLIDES.map((slide, i) => <div key={i} style={{ padding: '64px 8%', borderTop: i > 0 ? '1px solid rgba(115,44,63,0.08)' : undefined }}><p style={{ fontSize: 11, letterSpacing: '0.12em', color: '#C57C8A', marginBottom: 8, textTransform: 'uppercase', fontFamily: SANS }}>{slide.number} / 08</p><h3 className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: '#732C3F', margin: '0 0 12px' }}>{slide.title}</h3><p style={{ fontSize: 13, color: '#5A1F2E', lineHeight: 1.75, maxWidth: 520, margin: 0, fontFamily: SANS }}>{slide.description}</p></div>)}</section>
  }

  return (
    <section id="sa-section" ref={sectionRef} style={{ height: '800vh', backgroundColor: '#F7E8EC' }}>
      <div ref={stageRef} style={{ position: 'sticky', top: 0, height: '100vh', backgroundColor: AMBIENT_BG[0], display: 'flex', flexDirection: 'column', paddingTop: 88, overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, textAlign: 'center', paddingBottom: 14, zIndex: 10 }}><h2 className="font-serif" style={{ fontSize: 'clamp(22px, 2.6vw, 36px)', fontWeight: 400, color: '#000000', lineHeight: 1.1, margin: '0 0 10px' }}>Supporting Architecture</h2><p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000000', margin: 0, fontFamily: SANS }}>Formula Components</p></div>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          {SLIDES.map((slide, i) => <div key={i} ref={(el) => { slideRefs.current[i] = el }} style={{ position: 'absolute', inset: 0, opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none', zIndex: i === 0 ? 5 : 0 }}>
            <div style={{ position: 'absolute', left: '52%', top: slide.illustration === 'adenosine' || slide.illustration === 'allantoin' ? '76%' : '68%', transform: 'translateX(-50%)', zIndex: 4, pointerEvents: 'auto', textAlign: 'center', whiteSpace: 'nowrap' }}><h3 className="font-serif" style={{ fontSize: slide.illustration === 'botanical' ? 'clamp(42px, 6vw, 88px)' : 'clamp(48px, 7vw, 110px)', fontWeight: 400, color: '#000000', opacity: slide.illustration === 'botanical' ? 0.16 : 0.18, letterSpacing: '-0.02em', lineHeight: 1, margin: 0, whiteSpace: 'nowrap' }}>{slide.title}</h3></div>
            <div ref={(el) => { illustrationRefs.current[i] = el }} style={{ position: 'absolute', left: '52%', top: slide.illustration === 'adenosine' || slide.illustration === 'allantoin' ? '50%' : '47%', transform: 'translate(-50%, -50%)', width: slide.illustration === 'adenosine' || slide.illustration === 'allantoin' ? 'min(390px, 42vw)' : slide.illustration === 'botanical' ? 'min(260px, 28vw)' : 'min(280px, 30vw)', height: slide.illustration === 'adenosine' || slide.illustration === 'allantoin' ? 'min(390px, 54vh)' : slide.illustration === 'botanical' ? 'min(260px, 39vh)' : 'min(280px, 42vh)', zIndex: 3, background: 'transparent', filter: 'drop-shadow(0 24px 34px rgba(115,44,63,0.16))' }}><IngredientIllustration kind={slide.illustration} /></div>
            <div style={{ position: 'absolute', top: 20, left: 48, zIndex: 4 }}><span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', color: '#000000', fontFamily: SANS }}>{slide.number}</span><span style={{ fontSize: 11, color: '#000000', letterSpacing: '0.06em', marginLeft: 5, fontFamily: SANS }}>/ 08</span></div>
            <div style={{ position: 'absolute', top: slide.illustration === 'botanical' ? '16%' : '17%', right: slide.illustration === 'botanical' ? '7.6vw' : '9vw', width: slide.illustration === 'botanical' ? 'min(340px, 28vw)' : 'min(285px, 24vw)', zIndex: 4, textAlign: 'left' }}><p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#000000', margin: '0 0 14px', fontFamily: SANS }}>{slide.benefit}</p><p style={{ fontSize: 18, lineHeight: 1.65, color: '#000000', opacity: 1, margin: 0, fontFamily: SANS }}>{slide.description}</p></div>
            <div style={{ position: 'absolute', bottom: 'max(52px, 7vh)', left: slide.illustration === 'botanical' ? '4.2vw' : '4.8vw', zIndex: 4, width: slide.illustration === 'botanical' ? 'min(238px, 19vw)' : 'min(292px, 24vw)' }}>{slide.details.map((detail, d) => { const isBotanical = slide.illustration === 'botanical'; return <div key={detail} style={{ display: 'grid', gridTemplateColumns: isBotanical ? '24px 16px minmax(0, 1fr)' : '26px 22px minmax(0, 1fr)', alignItems: 'center', columnGap: isBotanical ? 8 : 10, paddingBottom: d < slide.details.length - 1 ? 8 : 0, marginBottom: d < slide.details.length - 1 ? 8 : 0, borderBottom: d < slide.details.length - 1 ? '1px solid rgba(115,44,63,0.1)' : undefined }}><DetailIcon detail={detail} index={d} /><div style={{ width: isBotanical ? 16 : 22, height: 1, backgroundColor: '#EDC967' }} /><span style={{ fontSize: isBotanical ? 14 : 15, color: '#000000', opacity: 1, letterSpacing: '0.1em', lineHeight: 1.3, fontWeight: 700, textTransform: 'uppercase', fontFamily: SANS }}>{detail}</span></div> })}</div>
          </div>)}
        </div>
        <div style={{ position: 'absolute', right: 26, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 20 }}>{SLIDES.map((_, i) => <div key={i} ref={(el) => { dotRefs.current[i] = el }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === 0 ? '#732C3F' : 'rgba(197,124,138,0.2)' }} />)}</div>
      </div>
    </section>
  )
}
