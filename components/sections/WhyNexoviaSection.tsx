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
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" style={{ width: 58, height: 58, display: 'block' }}>
      {kind === 'laser' && (
        <g {...common}>
          <path d="M8 36c7-2.6 13-2.6 20 0s9 2.2 12 0" />
          <path d="M36 8 18 29" />
          <path d="M30 8h8v8" />
          <path d="M19 28l5 5" />
          <path d="M24 22l4 4" opacity="0.55" />
          <path d="M29 16l4 4" opacity="0.55" />
        </g>
      )}
      {kind === 'needles' && (
        <g {...common}>
          <path d="M10 11h28" />
          <path d="M10 29h28" />
          <path d="M14 11v18M20 11v18M26 11v18M32 11v18" />
          <path d="M14 29l-2.4 7M20 29l-2.4 7M26 29l-2.4 7M32 29l-2.4 7M38 29l-2.4 7" />
          <path d="M12 36h26" opacity="0.38" />
        </g>
      )}
      {kind === 'rf' && (
        <g {...common}>
          <path d="M8 36c6-2.1 11.5-2.1 17.5 0s9.5 2.1 14.5 0" />
          <circle cx="24" cy="21" r="3.2" />
          <path d="M18 15a9 9 0 0 1 12 0" />
          <path d="M14 10.5a15 15 0 0 1 20 0" />
          <path d="M10 6a21 21 0 0 1 28 0" />
          <path d="M20 28c2.5 1.8 5.5 1.8 8 0" />
        </g>
      )}
      {kind === 'peel' && (
        <g {...common}>
          <path d="M8 33c7-3 14-3 21 0s8 2.8 11 1" />
          <path d="M10 26c7-3 14-3 21 0s7 2.3 9 1" />
          <path d="M13 19c7-2.8 13-2.8 19 0" />
          <path d="M31 19c5 4.2 6 9.5 2.5 15" />
          <path d="M34 34c-4-3.2-4-7.2-.2-11.5" />
          <path d="M17 15h13" opacity="0.45" />
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
      style={{
        backgroundColor: '#C57C8A',
        padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 80px)',
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
          padding: clamp(34px, 5vw, 62px) 0;
        }
        .nexovia-treatment-tabs {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(237,201,103,0.45);
          margin-top: 30px;
        }
        @media (max-width: 900px) {
          .nexovia-why-cards {
            grid-template-columns: 1fr;
          }
          .nexovia-treatment-module {
            grid-template-columns: 1fr;
          }
          .nexovia-treatment-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ textAlign: 'center', marginBottom: 64 }}
      >
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400,
            color: '#ffffff',
            margin: '0 0 16px',
            lineHeight: 1.15,
          }}
        >
          Why Nexovia
        </h2>
        <p
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.58)',
            margin: 0,
            fontFamily: SANS,
            lineHeight: 1.6,
            maxWidth: 480,
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
              padding: '44px 32px',
              cursor: 'default',
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
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
              className="font-serif"
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: '#ffffff',
                margin: '0 0 12px',
                lineHeight: 1.2,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.6)',
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
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: GOLD,
              margin: '0 0 18px',
              fontFamily: SANS,
            }}
          >
            Treatment Compatibility
          </p>
          <h3
            className="font-serif"
            style={{
              fontSize: 'clamp(32px, 4vw, 54px)',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1.08,
              margin: '0 0 18px',
            }}
          >
            Built For The Recovery Window
          </h3>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.68)',
              maxWidth: 430,
              margin: 0,
              fontFamily: SANS,
            }}
          >
            Nexovia supports the post-treatment window after energy, resurfacing, and channel-based procedures, when skin needs hydration, comfort, and barrier-focused care.
          </p>
        </div>

        <div
          style={{
            borderLeft: '1px solid rgba(237,201,103,0.52)',
            paddingLeft: 'clamp(28px, 4vw, 54px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>
            <div
              style={{
                width: 82,
                height: 82,
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
                className="font-serif"
                style={{
                  fontSize: 'clamp(30px, 4vw, 50px)',
                  fontWeight: 400,
                  color: GOLD,
                  lineHeight: 1,
                  margin: '0 0 10px',
                }}
              >
                {treatment.name}
              </h4>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                  fontFamily: SANS,
                }}
              >
                {treatment.label}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
            {treatment.points.map((point) => (
              <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 1, backgroundColor: GOLD, flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 13,
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
                  key={item.name}
                  type="button"
                  onClick={() => setActiveTreatment(i)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    borderLeft: i > 0 ? '1px solid rgba(237,201,103,0.28)' : 'none',
                    backgroundColor: active ? 'rgba(237,201,103,0.14)' : 'transparent',
                    color: active ? GOLD : 'rgba(255,255,255,0.64)',
                    cursor: 'pointer',
                    fontFamily: SANS,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    lineHeight: 1.2,
                    minHeight: 54,
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
