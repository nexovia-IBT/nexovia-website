'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const GOLD = '#EDC967'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const FAQS = [
  {
    q: 'What is the Nexovia protocol?',
    a: 'A 28-day structured skincare protocol designed around the post-procedure recovery window. It starts with intensive twice-daily application in the first week, when the skin\'s need is greatest, then tapers gradually as the skin stabilizes. One serum. Three phases. Each phase matches your skin\'s changing needs.',
  },
  {
    q: 'Who is Nexovia designed for?',
    a: 'Anyone undergoing aesthetic treatments such as laser resurfacing, microneedling, RF microneedling, chemical peels, IPL, PRP, or dermal fillers. Nexovia is also suitable for those seeking a concentrated anti-aging serum formulated with PDRN at 1%, NAD+ at 1%, and plant exosomes. Always consult your treating physician before starting any new skincare product after a procedure',
  },
  {
    q: 'How long until I see results?',
    a: 'In our clinical evaluation on post-laser skin, 100% of subjects recovered full skin barrier function within 7 days on the treated side, with hydration measuring 37.5% above pre-procedure baseline. Most users notice calmer, more hydrated skin within the first week. Full treatment results typically mature between weeks four and twelve.',
  },
  {
    q: 'Can I use Nexovia with other products?',
    a: 'Yes. Apply Nexovia to clean skin first and allow it to absorb. Layer moisturizer over it, and SPF in the morning. During the first two weeks of recovery, avoid retinol, AHA, BHA, vitamin C at active concentrations, and other exfoliating treatments unless your clinician advises otherwise. Nexovia is designed to sit between gentle cleansing and your moisturizer.',
  },
  {
    q: 'Is Nexovia dermatologist-tested?',
    a: 'Nexovia was evaluated in a split-face clinical study conducted by an IRB-registered, ISO-compliant laboratory in South Korea. The study was performed on post-laser skin across multiple Fitzpatrick skin types. Results showed statistically significant improvements in barrier recovery and hydration on the treated side versus the untreated side.',
  },
  {
    q: 'What are the key formula pillars?',
    a: 'Nexovia is built on ABA.4, a four-pillar bio-amplifier architecture. Plant exosomes at 4 billion particles per milliliter for cellular communication. PDRN at 1%, twice the industry standard, studied for its role in tissue support. NAD+ at 1%, up to ten times the concentration found in most formulations, a cofactor central to cellular energy. And a multi-peptide matrix including EGF-mimetics, Matrixyl, and Argireline, studied for their role in skin firmness and smoothness.',
  },
  {
    q: 'How do I apply the serum?',
    a: 'Apply to clean, dry skin using the dropper. Use gentle patting motions to spread evenly across the face. Avoid rubbing or pulling, especially in the first two weeks. Allow Nexovia to absorb fully before layering moisturizer and SPF. Dosage follows the protocol: one full dropper during Phase 1, half a dropper during Phases 2 and 3.',
  },
  {
    q: 'What if my practitioner gives different instructions?',
    a: 'Follow your practitioner. They know your skin, your procedure, and your recovery. The Nexovia protocol is a general framework designed to complement professional aftercare guidance. If your clinician adjusts the timing, dosage, or product layering, their direction takes priority.',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="nexovia-faq-section"
      style={{
        background: 'linear-gradient(to bottom, #C57C8A 0%, #1A0B12 100%)',
        padding: 'clamp(32px, 4vw, 56px) clamp(24px, 6vw, 80px) clamp(64px, 10vw, 120px)',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .nexovia-faq-section {
            scroll-margin-top: 76px;
            padding: 92px 20px 64px !important;
          }
          .nexovia-faq-header {
            margin-bottom: 38px !important;
          }
          .nexovia-faq-title {
            font-size: 38px !important;
            line-height: 1.08 !important;
            margin-bottom: 12px !important;
          }
          .nexovia-faq-intro {
            font-size: 15px !important;
            line-height: 1.55 !important;
          }
          .nexovia-faq-button {
            min-height: 68px;
            padding: 18px 0 !important;
          }
          .nexovia-faq-question {
            font-size: 21px !important;
            line-height: 1.2 !important;
          }
          .nexovia-faq-answer {
            padding-right: 38px !important;
            font-size: 15px !important;
            line-height: 1.6 !important;
          }
        }
      `}</style>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          className="nexovia-faq-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2
            className="nexovia-faq-title font-serif"
            style={{
              fontSize: 'clamp(46px, 5.4vw, 76px)',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 16px',
              lineHeight: 1.15,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="nexovia-faq-intro"
            style={{
              fontSize: 21,
              color: '#ffffff',
              margin: 0,
              fontFamily: SANS,
              lineHeight: 1.6,
            }}
          >
            Clear answers about Nexovia Skin Serum, the protocol, and post-procedure skincare.
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
                className="nexovia-faq-button"
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
                  className="nexovia-faq-question font-serif"
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
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
                  maxHeight: isOpen ? '600px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <p
                  className="nexovia-faq-answer"
                  style={{
                    fontSize: 19,
                    lineHeight: 1.75,
                    color: '#ffffff',
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
