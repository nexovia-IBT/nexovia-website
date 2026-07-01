'use client'

/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const PANELS = [
  {
    id: 0,
    tag: 'The Formula',
    heading: 'Four Bio-Amplifiers. One Focused Serum.',
    subtext: 'A focused at-home serum for the 14-to-28-day window after aesthetic treatment. Formulated with ABA.4 to support hydration, smoothness, and refreshed-looking skin. Plant exosomes - PDRN 1% - NAD+ 1% - peptide matrix',
    bg: '#C57C8A',
    textSide: 'left' as const,
    bottleLeft: '68%',
    scale: 1,
    bottleY: 0,
    bloomLeft: '68%',
    bloomTop: '45%',
  },
  {
    id: 1,
    tag: 'The Problem',
    heading: 'Clinical Treatment Is Only One Part Of The Process',
    subtext: 'Following aesthetic treatment, skin often responds better to lighter textures, measured hydration, and fewer unnecessary layers.',
    bg: '#BA6F7E',
    textSide: 'right' as const,
    bottleLeft: '32%',
    scale: 1.03,
    bottleY: 0,
    bloomLeft: '32%',
    bloomTop: '45%',
  },
  {
    id: 2,
    tag: 'The Synergy',
    heading: 'Designed For The Post-Procedure Window',
    subtext: 'Hydration, softer textures, botanical inputs, and bio-amplifiers composed within one focused post-procedure serum.',
    bg: '#C57C8A',
    textSide: 'left' as const,
    bottleLeft: '68%',
    scale: 0.97,
    bottleY: 10,
    bloomLeft: '68%',
    bloomTop: '55%',
  },
  {
    id: 3,
    tag: 'ABA.4 Complex',
    heading: 'ABA.4 Complex',
    subtext: 'Plant exosomes, PDRN, NAD+, and peptides arranged within a focused post-procedure composition.',
    bg: '#CC8899',
    textSide: 'right' as const,
    bottleLeft: '32%',
    scale: 1.04,
    bottleY: -10,
    bloomLeft: '32%',
    bloomTop: '40%',
  },
]

const ABA4_INGREDIENTS = [
  {
    name: 'Plant Exosomes',
    detail: '4B particles/mL',
    role: 'Delivery + soothing',
    image: 'https://images.squarespace-cdn.com/content/v1/6954c55e1b5b1e1843f265d0/0c5d7bda-d4db-45d1-869a-fc507f4e605f/Exosomes.webp?format=500w',
  },
  {
    name: 'PDRN',
    detail: '1% concentration',
    role: 'Repair + collagen',
    image: 'https://images.squarespace-cdn.com/content/v1/6954c55e1b5b1e1843f265d0/910155c0-a3d9-4af0-bf72-858134b79251/PDRN.webp?format=500w',
  },
  {
    name: 'NAD+',
    detail: '1% concentration',
    role: 'ATP + DNA repair',
    image: 'https://images.squarespace-cdn.com/content/v1/6954c55e1b5b1e1843f265d0/e041a435-b5d9-4751-8dd9-beef9872d751/NAD+plus.webp?format=500w',
  },
  {
    name: 'Peptide Matrix',
    detail: 'EGF-mimetics',
    role: 'Fibroblast signal',
    image: 'https://images.squarespace-cdn.com/content/v1/6954c55e1b5b1e1843f265d0/f0b0174c-3e5f-42a6-8860-b0c50360a019/Peptides+Matrix.webp?format=500w',
  },
]

const DURATION = {
  bottleGlide: 1.3,
  bloomShift: 1.6,
  bgColor: 1.1,
}

const EASE = {
  bottleGlide: 'power2.inOut',
  bloomShift: 'power1.inOut',
  bgColor: 'power1.inOut',
}

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const TOTAL_FRAMES = 58
const FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/products/bottle-frames/frame_${String(i + 1).padStart(3, '0')}.png`
)

export default function OrbitSection() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bottleOuterRef = useRef<HTMLDivElement>(null)
  const bottleInnerRef = useRef<HTMLDivElement>(null)
  const bottleFloatRef = useRef<HTMLDivElement>(null)
  const frameImgRef = useRef<HTMLImageElement>(null)
  const glowRingRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const panelLabelRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const panelTitleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const panelBodyRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentPanel = useRef(0)
  const scrollHintFaded = useRef(false)
  const pendingDelays = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      return
    }

    let scrollRaf: number | null = null
    const loadedFrames = new Set<number>()

    const preloadFrame = (idx: number) => {
      if (loadedFrames.has(idx)) return
      loadedFrames.add(idx)
      const img = new window.Image()
      img.src = FRAMES[idx]
    }

    const getSectionProgress = () => {
      const section = sectionRef.current
      if (!section) return 0
      const top = section.getBoundingClientRect().top + window.scrollY
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      return Math.min(Math.max((window.scrollY - top) / distance, 0), 1)
    }

    const updateFromScroll = () => {
      const progress = getSectionProgress()
      const img = frameImgRef.current

      if (img) {
        const frameIdx = Math.min(Math.round(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
        img.src = FRAMES[frameIdx]
        preloadFrame(Math.min(frameIdx + 1, TOTAL_FRAMES - 1))
      }

      if (progress > 0.05 && !scrollHintFaded.current) {
        gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.3 })
        scrollHintFaded.current = true
      } else if (progress <= 0.02 && scrollHintFaded.current) {
        gsap.to(scrollHintRef.current, { opacity: 1, duration: 0.3 })
        scrollHintFaded.current = false
      }

      const idx = Math.min(Math.floor(progress * PANELS.length), PANELS.length - 1)
      if (idx !== currentPanel.current) {
        transitionToPanel(idx, currentPanel.current)
        currentPanel.current = idx
      }
    }

    const requestUpdate = () => {
      if (scrollRaf !== null) return
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = null
        updateFromScroll()
      })
    }

    const ctx = gsap.context(() => {
      const mobileLayout = window.matchMedia('(max-width: 768px)').matches
      const initialBottleLeft = mobileLayout ? '76%' : PANELS[0].bottleLeft
      panelLabelRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 })
      })
      panelTitleRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 })
      })
      panelBodyRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 22 })
      })
      gsap.set(bottleInnerRef.current, { opacity: 1, y: PANELS[0].bottleY, scale: PANELS[0].scale })
      gsap.set(bottleOuterRef.current, { left: initialBottleLeft })
      gsap.set(glowRingRef.current, { left: initialBottleLeft })
      gsap.set(bloomRef.current, { left: initialBottleLeft })
      gsap.set(bloomRef.current, { opacity: 1 })
      gsap.set(scrollHintRef.current, { opacity: 1 })
      gsap.set(stageRef.current, { backgroundColor: PANELS[0].bg })

      const heroTl = gsap.timeline()
      heroTl.from(stageRef.current, { backgroundColor: '#000000', duration: 0.8, ease: 'power1.out' }, 0)
      heroTl.from(bloomRef.current, { opacity: 0, duration: 1.2, ease: 'power3.out' }, 0.2)
      heroTl.from(bottleInnerRef.current, { opacity: 0, y: 40, scale: 0.94, duration: 1.1, ease: 'power3.out' }, 0.35)
      heroTl.from(panelLabelRefs.current[0], { opacity: 0, y: 20, duration: 0.65, ease: 'power3.out' }, 0.6)
      heroTl.from(panelTitleRefs.current[0], { opacity: 0, y: 30, duration: 0.85, ease: 'power3.out' }, 0.78)
      heroTl.from(panelBodyRefs.current[0], { opacity: 0, y: 22, duration: 0.75, ease: 'power3.out' }, 1)
      heroTl.from(scrollHintRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.5)
    })

    updateFromScroll()
    ;[0, 1, 2, 3].forEach(preloadFrame)
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (scrollRaf !== null) window.cancelAnimationFrame(scrollRaf)
      ctx.revert()
    }
  }, [])

  function transitionToPanel(next: number, prev: number) {
    const nextData = PANELS[next]
    const mobileLayout = window.matchMedia('(max-width: 768px)').matches
    const bottleLeft = mobileLayout ? (nextData.textSide === 'left' ? '76%' : '24%') : nextData.bottleLeft
    const prevLabel = panelLabelRefs.current[prev]
    const prevTitle = panelTitleRefs.current[prev]
    const prevBody = panelBodyRefs.current[prev]
    const nextLabel = panelLabelRefs.current[next]
    const nextTitle = panelTitleRefs.current[next]
    const nextBody = panelBodyRefs.current[next]

    pendingDelays.current.forEach((d) => d.kill())
    pendingDelays.current = []

    ;[
      bottleInnerRef.current,
      bottleOuterRef.current,
      glowRingRef.current,
      bloomRef.current,
      stageRef.current,
      prevLabel,
      prevTitle,
      prevBody,
      nextLabel,
      nextTitle,
      nextBody,
    ].forEach((el) => {
      if (el) gsap.killTweensOf(el)
    })

    gsap.to(prevBody, { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in', delay: 0 })
    gsap.to(prevTitle, { opacity: 0, y: -18, duration: 0.4, ease: 'power2.in', delay: 0.08 })
    gsap.to(prevLabel, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', delay: 0.14 })

    pendingDelays.current.push(
      gsap.delayedCall(0.22, () => {
        const inner = panelRefs.current[prev]
        if (inner) {
          inner.style.pointerEvents = 'none'
          const outer = inner.parentElement?.parentElement
          if (outer) outer.style.pointerEvents = 'none'
        }
      })
    )

    gsap.to(bottleOuterRef.current, {
      left: bottleLeft,
      duration: DURATION.bottleGlide,
      ease: EASE.bottleGlide,
      delay: 0.18,
    })
    gsap.to(bottleInnerRef.current, {
      y: nextData.bottleY,
      duration: DURATION.bottleGlide,
      ease: EASE.bottleGlide,
      delay: 0.18,
    })
    gsap.timeline({ delay: 0.18 })
      .to(bottleInnerRef.current, { scale: 1.015, duration: 0.65, ease: 'power2.out' })
      .to(bottleInnerRef.current, { scale: nextData.scale, duration: 0.65, ease: 'power2.in' })

    gsap.to(glowRingRef.current, {
      left: bottleLeft,
      duration: DURATION.bottleGlide,
      ease: EASE.bottleGlide,
      delay: 0.18,
    })
    gsap.to(bloomRef.current, {
      left: mobileLayout ? bottleLeft : nextData.bloomLeft,
      top: nextData.bloomTop,
      duration: DURATION.bloomShift,
      ease: EASE.bloomShift,
      delay: 0,
    })
    gsap.to(stageRef.current, {
      backgroundColor: nextData.bg,
      duration: DURATION.bgColor,
      ease: EASE.bgColor,
      delay: 0.1,
    })

    pendingDelays.current.push(
      gsap.delayedCall(0.4, () => {
        dotRefs.current.forEach((dot, i) => {
          if (!dot) return
          gsap.to(dot, {
            width: i === next ? 18 : 6,
            backgroundColor: i === next ? '#EDC967' : 'rgba(255,255,255,0.25)',
            duration: 0.35,
            ease: 'power2.inOut',
          })
        })
      })
    )

    pendingDelays.current.push(
      gsap.delayedCall(0.5, () => {
        const inner = panelRefs.current[next]
        if (inner) {
          inner.style.pointerEvents = 'auto'
          const outer = inner.parentElement?.parentElement
          if (outer) outer.style.pointerEvents = 'auto'
        }
        gsap.set(nextLabel, { opacity: 0, y: 20 })
        gsap.set(nextTitle, { opacity: 0, y: 30 })
        gsap.set(nextBody, { opacity: 0, y: 22 })
      })
    )

    gsap.to(nextLabel, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: 0.52 })
    gsap.to(nextTitle, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.67 })
    gsap.to(nextBody, { opacity: next === 3 ? 1 : next === 0 || next === 1 || next === 2 ? 1 : 0.65, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.82 })
  }

  if (reducedMotion) {
    return (
      <section id="orbit-outer">
        {PANELS.map((p) => (
          <div key={p.id} style={{ backgroundColor: p.bg, padding: '80px 8%', color: '#ffffff' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 16, fontFamily: SANS }}>{p.tag}</p>
            <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.1, fontWeight: 400, marginBottom: 16 }}>{p.heading}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.75, opacity: 0.65, maxWidth: 480, fontFamily: SANS }}>{p.subtext}</p>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section id="orbit-outer" ref={sectionRef} style={{ height: '600vh' }}>
      <style>{`
        @keyframes nexoviaBottleFloat { 0%, 100% { transform: translateY(-5px); } 50% { transform: translateY(5px); } }
        @keyframes nexoviaCameraDrift {
          0% { transform: translate3d(-2.8%, 0, 0) scale(0.985) rotateZ(-0.35deg); }
          45% { transform: translate3d(2.4%, -0.8%, 0) scale(1.018) rotateZ(0.22deg); }
          100% { transform: translate3d(-1.2%, 0.3%, 0) scale(1.045) rotateZ(-0.12deg); }
        }
        @keyframes nexoviaBloomDrift { 0%, 100% { transform: translate(-8px, -5px); } 50% { transform: translate(8px, 5px); } }
        @keyframes nexoviaTextDrift { 0%, 100% { transform: translateX(-2px); } 50% { transform: translateX(2px); } }
        .nexovia-bottle-float { animation: nexoviaBottleFloat 3.8s ease-in-out infinite; }
        .nexovia-camera-drift { animation: nexoviaCameraDrift 13.5s cubic-bezier(0.45, 0, 0.2, 1) infinite alternate; transform-origin: 50% 56%; will-change: transform; }
        .nexovia-bloom-drift { animation: nexoviaBloomDrift 5.2s ease-in-out infinite; }
        .nexovia-text-drift { animation: nexoviaTextDrift 6s ease-in-out infinite; }
        @media (max-width: 768px) {
          .nexovia-camera-drift { animation-duration: 11s; }
          .nexovia-orbit-stage { height: 100svh !important; min-height: 680px; }
          .nexovia-orbit-bloom { width: 440px !important; height: 420px !important; }
          .nexovia-orbit-glow { width: 250px !important; height: 250px !important; }
          .nexovia-orbit-bottle-frame { width: clamp(104px, 28vw, 124px) !important; height: clamp(205px, 52vw, 245px) !important; }
          .nexovia-orbit-panel { max-width: 50% !important; }
          .nexovia-orbit-panel-left { left: 24px !important; }
          .nexovia-orbit-panel-right { right: 24px !important; }
          .nexovia-orbit-panel.is-aba4 { max-width: 52% !important; }
          .nexovia-orbit-tag { font-size: 11px !important; margin-bottom: 12px !important; }
          .nexovia-orbit-title { font-size: clamp(31px, 8.7vw, 38px) !important; line-height: 1.06 !important; margin-bottom: 14px !important; }
          .nexovia-orbit-body { max-width: 100% !important; font-size: clamp(13px, 3.55vw, 15px) !important; line-height: 1.5 !important; }
          .nexovia-orbit-dots { right: 10px !important; gap: 8px !important; }
          .nexovia-orbit-scroll-hint { bottom: 16px !important; }
          .aba4-matrix { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px !important; max-width: 100%; }
          .aba4-image { height: 64px !important; }
          .aba4-name { font-size: 10px !important; }
          .aba4-detail, .aba4-role { font-size: 9px !important; }
        }
      `}</style>

      <div ref={stageRef} className="nexovia-orbit-stage sticky top-0 overflow-hidden" style={{ height: '100vh', backgroundColor: PANELS[0].bg }}>
        <div ref={bloomRef} className="nexovia-orbit-bloom" style={{ position: 'absolute', left: PANELS[0].bloomLeft, top: PANELS[0].bloomTop, transform: 'translate(-50%, -50%)', width: 800, height: 600, pointerEvents: 'none', zIndex: 1 }}>
          <div className="nexovia-bloom-drift" style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,240,244,0.45) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div ref={glowRingRef} aria-hidden="true" className="nexovia-orbit-glow animate-orbit-glow" style={{ position: 'absolute', left: PANELS[0].bottleLeft, top: '50%', transform: 'translate(-50%, -50%)', width: 480, height: 480, borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 0%, rgba(237,201,103,0.28) 15%, rgba(237,201,103,0.06) 30%, transparent 45%)', filter: 'blur(5px)', pointerEvents: 'none', zIndex: 2 }} />

        <div ref={bottleOuterRef} style={{ position: 'absolute', left: PANELS[0].bottleLeft, top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <div ref={bottleInnerRef} className="nexovia-orbit-bottle-frame" style={{ position: 'relative', width: 'clamp(220px, 25vw, 360px)', height: 'clamp(330px, 38vw, 520px)', opacity: 1 }}>
            <div ref={bottleFloatRef} className="nexovia-bottle-float" style={{ width: '100%', height: '100%', position: 'relative' }}>
              <div className="nexovia-camera-drift" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Image src="/products/Nexovia_wo_background.png" alt="Nexovia Skin Serum" fill unoptimized priority sizes="(max-width: 768px) 62vw, 360px" style={{ objectFit: 'contain', transform: 'scale(1.1)', transformOrigin: '50% 56%', filter: 'drop-shadow(0 28px 42px rgba(72, 18, 35, 0.22))' }} />
              </div>
            </div>
          </div>
        </div>

        {PANELS.map((p, i) => {
          const isLeft = p.textSide === 'left'
          return (
            <div key={p.id} className={`nexovia-orbit-panel nexovia-orbit-panel-${isLeft ? 'left' : 'right'}${i === 3 ? ' is-aba4' : ''}`} style={{ position: 'absolute', top: '50%', ...(isLeft ? { left: '8%' } : { right: '8%' }), transform: 'translateY(-50%)', maxWidth: i === 0 || i === 1 || i === 2 || i === 3 ? '47%' : '38%', zIndex: 20, pointerEvents: i === 0 ? 'auto' : 'none' }}>
              <div className="nexovia-text-drift" style={{ pointerEvents: 'inherit' }}>
                <div ref={(el) => { panelRefs.current[i] = el }} style={{ color: '#ffffff', pointerEvents: 'inherit' }}>
                  <p ref={(el) => { panelLabelRefs.current[i] = el }} className="nexovia-orbit-tag" style={{ fontSize: i === 0 || i === 1 || i === 2 || i === 3 ? 18 : 11, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20, fontFamily: SANS, opacity: i === 0 ? 1 : 0 }}>{p.tag}</p>
                  <h2 ref={(el) => { panelTitleRefs.current[i] = el }} className="nexovia-orbit-title font-serif" style={{ fontSize: i === 0 || i === 1 || i === 2 || i === 3 ? 'clamp(44px, 5vw, 74px)' : 'clamp(36px, 4vw, 56px)', lineHeight: 1.1, fontWeight: 400, margin: '0 0 20px', opacity: i === 0 ? 1 : 0 }}>{p.heading}</h2>
                  <div ref={(el) => { panelBodyRefs.current[i] = el }} className="nexovia-orbit-body" style={{ fontSize: i === 0 || i === 1 || i === 2 || i === 3 ? 22 : 14, lineHeight: 1.7, maxWidth: p.id === 3 ? 'none' : p.id === 0 || p.id === 1 || p.id === 2 ? 'none' : 340, margin: 0, fontFamily: SANS, opacity: p.id === 3 ? 1 : i === 0 ? 1 : 0 }}>
                    {p.id === 3 ? (
                      <div>
                        <p style={{ margin: '0 0 24px', maxWidth: 'none', color: '#ffffff' }}>Four coordinated actives arranged for post-procedure recovery.</p>
                        <div className="aba4-matrix" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, width: '100%' }}>
                          {ABA4_INGREDIENTS.map((ingredient) => (
                            <div key={ingredient.name} style={{ borderTop: '1px solid rgba(255,255,255,0.26)', paddingTop: 9 }}>
                              <div className="aba4-image" style={{ height: 120, marginBottom: 10, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                <img src={ingredient.image} alt={ingredient.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                              </div>
                              <p className="aba4-name" style={{ margin: '0 0 2px', fontSize: 16, lineHeight: 1.2, fontWeight: 600, color: '#ffffff' }}>{ingredient.name}</p>
                              <p className="aba4-detail" style={{ margin: '0 0 2px', fontSize: 14, lineHeight: 1.35, color: '#FFE680', fontWeight: 800, textShadow: '0 1px 10px rgba(90,31,46,0.28)' }}>{ingredient.detail}</p>
                              <p className="aba4-role" style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: '#ffffff' }}>{ingredient.role}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p style={{ margin: 0 }}>{p.subtext}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="nexovia-orbit-dots" style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 30 }}>
          {PANELS.map((_, i) => (
            <div key={i} ref={(el) => { dotRefs.current[i] = el }} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? '#EDC967' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>

        <div ref={scrollHintRef} className="nexovia-orbit-scroll-hint" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 30 }}>
          <div className="animate-scroll-line" style={{ width: 1, height: 50, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))' }} />
          <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: SANS, margin: 0 }}>Scroll</p>
        </div>
      </div>
    </section>
  )
}
