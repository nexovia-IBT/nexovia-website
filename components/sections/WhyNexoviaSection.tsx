'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const GOLD = '#EDC967'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const CARDS = [
  {
    title: 'Engineered Synergy',
    body: 'Most serums feature one or two actives at token doses. Nexovia\'s ABA.4 architecture combines four bio-amplifiers, each at concentrations that stand up to scrutiny. PDRN at 1%. NAD+ at 1%. Plant exosomes at 4 billion particles per milliliter. A multi-peptide matrix. They work as a system, not a highlight reel.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" stroke={GOLD} strokeWidth="1.5" />
        <line x1="10" y1="4" x2="10" y2="7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="13" x2="10" y2="16" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="10" x2="7" y2="10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="10" x2="16" y2="10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="3" r="1.2" fill={GOLD} />
        <circle cx="10" cy="17" r="1.2" fill={GOLD} />
        <circle cx="3" cy="10" r="1.2" fill={GOLD} />
        <circle cx="17" cy="10" r="1.2" fill={GOLD} />
      </svg>
    ),
  },
  {
    title: 'Purpose-Built for Aftercare',
    body: 'Nexovia is not a general skincare product repositioned for post-procedure use. It was formulated from the ground up for the 14-to-28-day recovery window. One product. One protocol. One purpose. Every ingredient decision was made with post-treatment skin in mind.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L17 5.5V10C17 14 13.5 17.5 10 18.5C6.5 17.5 3 14 3 10V5.5L10 2Z"
          stroke={GOLD}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M7 10L9 12L13 8"
          stroke={GOLD}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'K-Beauty Formulation Science',
    body: 'Manufactured in South Korea under ISO 22716 GMP standards. The ABA.4 bio-amplifier architecture was developed specifically for post-procedure skin: four actives, each selected for a distinct function in the recovery window, formulated together at concentrations most brands will not match.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 18C10 18 3 13 3 7.5C3 5 5.5 3 8 4C9 4.5 9.5 5 10 6C10.5 5 11 4.5 12 4C14.5 3 17 5 17 7.5C17 13 10 18 10 18Z"
          stroke={GOLD}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="10" y1="8" x2="10" y2="18" stroke={GOLD} strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
]

const TREATMENTS = [
  {
    name: 'Laser',
    label: 'Thermal recovery support',
    icon: 'laser',
    points: ['Calm visible redness', 'Support barrier comfort', 'Hydrate compromised skin'],
  },
  {
    name: 'Microneedling',
    label: 'Channel-based recovery',
    icon: 'needles',
    points: ['Support open-channel aftercare', 'Soothe post-treatment sensitivity', 'Maintain moisture balance'],
  },
  {
    name: 'RF',
    label: 'Energy-based procedure support',
    icon: 'rf',
    points: ['Comfort heat-stressed skin', 'Support the repair window', 'Reinforce hydration'],
  },
  {
    name: 'Peels / IPL',
    label: 'Resurfacing comfort support',
    icon: 'peel',
    points: ['Reduce the look of dryness', 'Support renewed surface comfort', 'Keep skin feeling calm'],
  },
]

function TreatmentIcon({ kind }: { kind: string }) {
  const common = {
    fill: 'none',
    stroke: GOLD,
    strokeWidth: 1.45,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" style={{ width: 78, height: 78, display: 'block' }}>
      {kind === 'laser' && (
        <g {...common}>
          <path d="M8 44h48" />
          <path d="M36 10 27 41" />
          <path d="M27 41l-8-8" />
          <path d="M27 41l8-7" />
          <path d="M27 41l-3 7" />
          <path d="M27 41l5 6" />
          {[14, 19, 24, 29, 34, 39, 44, 49].map((cx) => (
            <circle key={`laser-dot-a-${cx}`} cx={cx} cy="50" r="0.9" fill={GOLD} stroke="none" />
          ))}
          {[18, 23, 28, 33, 38, 43].map((cx) => (
            <circle key={`laser-dot-b-${cx}`} cx={cx} cy="55" r="0.7" fill={GOLD} stroke="none" opacity="0.75" />
          ))}
        </g>
      )}
      {kind === 'needles' && (
        <g {...common}>
          {[14, 22, 30, 38, 46, 54].map((cx) => (
            <path key={`needle-${cx}`} d={`M${cx} 9v29l-2 5 2 3 2-3-2-5V9`} />
          ))}
          <path d="M9 48c6-1.8 11-1.8 17 0s10 1.8 16 0 9-1.7 13 0" />
          {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((cx) => (
            <circle key={`needle-dot-${cx}`} cx={cx} cy="54" r="0.8" fill={GOLD} stroke="none" />
          ))}
        </g>
      )}
      {kind === 'rf' && (
        <g {...common}>
          <circle cx="32" cy="13" r="6" />
          <path d="M24 23a12 12 0 0 0 16 0" />
          <path d="M18 27a20 20 0 0 0 28 0" />
          <path d="M13 32a27 27 0 0 0 38 0" />
          <path d="M8 37a34 34 0 0 0 48 0" />
        </g>
      )}
      {kind === 'peel' && (
        <g {...common}>
          <path d="M9 14c9-2.4 18-2.4 27 0s13 2.4 19 0" />
          <path d="M9 23c9-2.4 18-2.4 27 0s13 2.4 19 0" />
          <path d="M9 42c9-2.4 18-2.4 27 0s13 2.4 19 0" />
          <path d="M9 51c9-2.4 18-2.4 27 0s13 2.4 19 0" />
          {[12, 17, 22, 27, 32, 37, 42, 47].map((cx) => (
            <circle key={`peel-dot-a-${cx}`} cx={cx} cy="31" r="0.8" fill={GOLD} stroke="none" />
          ))}
          {[15, 20, 25, 30, 35, 40, 45].map((cx) => (
            <circle key={`peel-dot-b-${cx}`} cx={cx} cy="36" r="0.75" fill={GOLD} stroke="none" opacity="0.72" />
          ))}
        </g>
      )}
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function WhyNexoviaSection() {
  const [activeTreatment, setActiveTreatment] = useState(0)
  const treatment = TREATMENTS[activeTreatment]

  return (
    <section
      id="why-nexovia"
      className="nexovia-why-section"
      style={{
        backgroundColor: '#C57C8A',
        padding: 'clamp(36px, 5vw, 72px) clamp(24px, 6vw, 80px) clamp(64px, 10vw, 120px)',
      }}
    >
      <style>{`
        .nexovia-why-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-bottom: 64px;
        }
        .nexovia-treatment-module {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr);
          gap: clamp(32px, 6vw, 92px);
          align-items: center;
          border-top: 1px solid rgba(237,201,103,0.72);
          border-bottom: 1px solid rgba(237,201,103,0.72);
          padding: clamp(46px, 6vw, 84px) 0;
        }
        .nexovia-treatment-tabs {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(237,201,103,0.45);
          margin-top: 30px;
        }
        @media (max-width: 900px) {
          .nexovia-why-section {
            scroll-margin-top: 76px;
            padding: 92px 20px 64px !important;
          }
          .nexovia-why-header {
            margin-bottom: 30px !important;
          }
          .nexovia-why-title {
            font-size: 38px !important;
            line-height: 1.08 !important;
            margin-bottom: 12px !important;
          }
          .nexovia-why-intro,
          .nexovia-why-card-copy,
          .nexovia-treatment-copy {
            font-size: 15px !important;
            line-height: 1.58 !important;
          }
          .nexovia-why-cards {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-bottom: 44px;
          }
          .nexovia-why-card {
            padding: 30px 22px !important;
          }
          .nexovia-why-card-icon {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 18px !important;
          }
          .nexovia-why-card-title {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
          .nexovia-treatment-module {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 38px 0;
          }
          .nexovia-treatment-kicker {
            font-size: 11px !important;
            margin-bottom: 12px !important;
          }
          .nexovia-treatment-title {
            font-size: 36px !important;
            line-height: 1.06 !important;
            margin-bottom: 14px !important;
          }
          .nexovia-treatment-detail {
            border-top: 1px solid rgba(237,201,103,0.52);
            border-left: 0 !important;
            padding: 28px 0 0 !important;
          }
          .nexovia-treatment-heading-row {
            gap: 16px !important;
          }
          .nexovia-treatment-icon {
            width: 72px !important;
            height: 72px !important;
          }
          .nexovia-treatment-name {
            font-size: 32px !important;
          }
          .nexovia-treatment-label {
            font-size: 11px !important;
            letter-spacing: 0.1em !important;
          }
          .nexovia-treatment-points {
            margin-top: 22px !important;
            gap: 10px !important;
          }
          .nexovia-treatment-point {
            font-size: 13px !important;
            letter-spacing: 0.06em !important;
          }
          .nexovia-treatment-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            margin-top: 24px;
          }
          .nexovia-treatment-tab {
            min-height: 54px !important;
            padding: 11px 8px !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <motion.div
        className="nexovia-why-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <h2
          className="nexovia-why-title font-serif"
          style={{
            fontSize: 'clamp(38px, 4.6vw, 62px)',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 16px',
            lineHeight: 1.15,
          }}
        >
          Why Nexovia
        </h2>
        <p
          className="nexovia-why-intro"
          style={{
            fontSize: 20,
            color: '#ffffff',
            margin: 0,
            fontFamily: SANS,
            lineHeight: 1.6,
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Designed for the quiet part of skincare: the days when consistency, comfort, and restraint matter most.
        </p>
      </motion.div>

      <div className="nexovia-why-cards">
        {CARDS.map((card, i) => (
          <motion.div
            className="nexovia-why-card"
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 }}
            whileHover={{
              y: -4,
              borderColor: 'rgba(237,201,103,0.4)',
              boxShadow: '0 8px 32px rgba(237,201,103,0.1)',
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgba(237,201,103,0.1)',
              padding: '72px 48px',
              cursor: 'default',
            }}
          >
            <div
              className="nexovia-why-card-icon"
              style={{
                width: 60,
                height: 60,
                border: `1px solid ${GOLD}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              {card.icon}
            </div>
            <h3
              className="nexovia-why-card-title font-serif"
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 12px',
                lineHeight: 1.2,
              }}
            >
              {card.title}
            </h3>
            <p
              className="nexovia-why-card-copy"
              style={{
                fontSize: 20,
                lineHeight: 1.7,
                color: '#ffffff',
                margin: 0,
                fontFamily: SANS,
              }}
            >
              {card.body}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        className="nexovia-treatment-module"
      >
        <div>
          <p
            className="nexovia-treatment-kicker"
            style={{
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 18px',
              fontFamily: SANS,
            }}
          >
            Treatment Compatibility
          </p>
          <h3
            className="nexovia-treatment-title font-serif"
            style={{
              fontSize: 'clamp(42px, 5vw, 72px)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.08,
              margin: '0 0 18px',
            }}
          >
            Built For The Recovery Window
          </h3>
          <p
            className="nexovia-treatment-copy"
            style={{
              fontSize: 20,
              lineHeight: 1.75,
              color: '#ffffff',
              maxWidth: 'none',
              margin: 0,
              fontFamily: SANS,
            }}
          >
            Nexovia supports the post-treatment window after energy, resurfacing, and channel-based procedures, when skin needs hydration, comfort, and barrier-focused care.
          </p>
        </div>

        <div
          className="nexovia-treatment-detail"
          style={{
            borderLeft: '1px solid rgba(237,201,103,0.52)',
            paddingLeft: 'clamp(28px, 4vw, 54px)',
          }}
        >
          <div className="nexovia-treatment-heading-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>
            <div
              className="nexovia-treatment-icon"
              style={{
                width: 100,
                height: 100,
                border: '1px solid rgba(237,201,103,0.72)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TreatmentIcon kind={treatment.icon} />
            </div>
            <div>
              <h4
                className="nexovia-treatment-name font-serif"
                style={{
                  fontSize: 'clamp(36px, 4.6vw, 58px)',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                  margin: '0 0 10px',
                }}
              >
                {treatment.name}
              </h4>
              <p
                className="nexovia-treatment-label"
                style={{
                  fontSize: 15,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  margin: 0,
                  fontFamily: SANS,
                }}
              >
                {treatment.label}
              </p>
            </div>
          </div>

          <div className="nexovia-treatment-points" style={{ marginTop: 28, display: 'grid', gap: 12 }}>
            {treatment.points.map((point) => (
              <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 1, backgroundColor: GOLD, flexShrink: 0 }} />
                <span
                  className="nexovia-treatment-point"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.45,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    fontFamily: SANS,
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>

          <div className="nexovia-treatment-tabs">
            {TREATMENTS.map((item, i) => {
              const active = i === activeTreatment
              return (
                <button
                  className="nexovia-treatment-tab"
                  key={item.name}
                  type="button"
                  onClick={() => setActiveTreatment(i)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    borderLeft: i > 0 ? '1px solid rgba(237,201,103,0.28)' : 'none',
                    backgroundColor: active ? 'rgba(237,201,103,0.14)' : 'transparent',
                    color: active ? GOLD : '#ffffff',
                    cursor: 'pointer',
                    fontFamily: SANS,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    lineHeight: 1.2,
                    minHeight: 62,
                    padding: '14px 10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
