'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const GOLD = '#EDC967'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const FAQS = [
  {
    q: '[What is the Nexovia protocol?]',
    a: '[Answer describing the protocol overview. Replace with final copy.]',
  },
  {
    q: '[Who is Nexovia designed for?]',
    a: '[Answer about target skin types and concerns. Replace with final copy.]',
  },
  {
    q: '[How long until I see results?]',
    a: '[Answer with timeline expectations. Replace with final copy.]',
  },
  {
    q: '[Can I use Nexovia with other products?]',
    a: '[Answer about product compatibility. Replace with final copy.]',
  },
  {
    q: '[Is Nexovia dermatologist-tested?]',
    a: '[Answer about clinical testing and validation. Replace with final copy.]',
  },
  {
    q: '[What are the key active ingredients?]',
    a: '[Answer listing key ingredients and their benefits. Replace with final copy.]',
  },
  {
    q: '[How do I apply the serum?]',
    a: '[Answer with step-by-step application guide. Replace with final copy.]',
  },
  {
    q: '[What is your returns policy?]',
    a: '[Answer with returns and satisfaction guarantee details. Replace with final copy.]',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section
      style={{
        background: 'linear-gradient(to bottom, #C57C8A 0%, #1A0B12 100%)',
        padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
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
            Frequently Asked Questions
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.52)',
              margin: 0,
              fontFamily: SANS,
              lineHeight: 1.6,
            }}
          >
            [Subtitle placeholder. Replace with final copy from content team.]
          </p>
        </motion.div>

        {/* Accordion */}
        {FAQS.map((item, i) => {
          const isOpen = openIdx === i
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: i * 0.06 }}
              style={{
                borderTop: '1px solid rgba(197,124,138,0.18)',
                borderBottom: i === FAQS.length - 1 ? '1px solid rgba(197,124,138,0.18)' : undefined,
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  width: '100%',
                  padding: '24px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  className="font-serif"
                  style={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    flex: 1,
                  }}
                >
                  {item.q}
                </span>
                <div
                  aria-hidden="true"
                  style={{
                    width: 30,
                    height: 30,
                    border: `1px solid ${GOLD}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: isOpen ? 'rgba(237,201,103,0.1)' : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    style={{
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <line x1="7" y1="1" x2="7" y2="13" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="7" x2="13" y2="7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>
              <div
                style={{
                  maxHeight: isOpen ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.58)',
                    fontFamily: SANS,
                    margin: '0 0 24px',
                    paddingRight: 46,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </motion.div>
          )
        })}

      </div>
    </section>
  )
}
