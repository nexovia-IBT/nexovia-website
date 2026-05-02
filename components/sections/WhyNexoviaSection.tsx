'use client'

import { motion } from 'framer-motion'

const GOLD = '#EDC967'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const CARDS = [
  {
    title: '[Feature One]',
    body: '[Feature one description. Replace with final copy from content team.]',
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
    title: '[Feature Two]',
    body: '[Feature two description. Replace with final copy from content team.]',
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
    title: '[Feature Three]',
    body: '[Feature three description. Replace with final copy from content team.]',
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

const STATS = [
  { value: '[96%]', label: '[Efficacy Rate]' },
  { value: '[4.9]', label: '[Customer Rating]' },
  { value: '[30K+]', label: '[Customers Served]' },
  { value: '[12]', label: '[Active Ingredients]' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function WhyNexoviaSection() {
  return (
    <section
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
        .nexovia-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 768px) {
          .nexovia-why-cards {
            grid-template-columns: 1fr;
          }
          .nexovia-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .nexovia-stat-cell:nth-child(3) {
            border-left: none !important;
          }
          .nexovia-stat-cell:nth-child(n+3) {
            border-top: 1px solid #EDC967;
          }
        }
      `}</style>

      {/* Header */}
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
          [Subtitle placeholder. Replace with final copy from content team.]
        </p>
      </motion.div>

      {/* Cards */}
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

      {/* Stats strip */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        className="nexovia-stats-grid"
        style={{
          borderTop: `1px solid ${GOLD}`,
          borderBottom: `1px solid ${GOLD}`,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="nexovia-stat-cell"
            style={{
              padding: '32px 24px',
              textAlign: 'center',
              borderLeft: i > 0 ? `1px solid ${GOLD}` : undefined,
            }}
          >
            <div
              className="font-serif"
              style={{
                fontSize: 42,
                fontWeight: 400,
                color: GOLD,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: SANS,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
