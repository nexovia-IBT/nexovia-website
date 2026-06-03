'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { useState } from 'react'

const BURGUNDY = '#732C3F'
const BURGUNDY_DEEP = '#5A1F2E'
const ROSE = '#C57C8A'
const GOLD = '#EDC967'
const DARK = '#1A0B12'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

type IconKind = 'barrier' | 'hydration' | 'redness' | 'elasticity' | 'tone' | 'lifting'

type Metric = {
  value: string
  label: string
  icon: IconKind
}

type ClinicalCase = {
  before?: string
  after?: string
  image?: string
}

type ImagingGroup = {
  id: 'hydration' | 'tone' | 'texture'
  label: string
  measure: string
  modality: string
  afterLabel: string
  cases: ClinicalCase[]
}

const DAY_7: Metric[] = [
  { value: '98.4%', label: 'Barrier Recovery', icon: 'barrier' },
  { value: '36.8%', label: 'Hydration Improvement', icon: 'hydration' },
  { value: '23.6%', label: 'Redness Decrease', icon: 'redness' },
]

const DAY_28: Metric[] = [
  { value: '1.9x', label: 'Elasticity Improvement', icon: 'elasticity' },
  { value: '3.2x', label: 'Tone Evenness', icon: 'tone' },
  { value: '1.6x', label: 'Facial Lifting', icon: 'lifting' },
]

const IMAGING_GROUPS: ImagingGroup[] = [
  {
    id: 'hydration',
    label: 'Hydration',
    measure: 'Surface hydration recovery',
    modality: 'Epsilon',
    afterLabel: 'After Day 7',
    cases: [
      { before: '/clinical-imagery/epsilon-case-1-before.png', after: '/clinical-imagery/epsilon-case-1-after.png' },
      { before: '/clinical-imagery/epsilon-case-2-before.png', after: '/clinical-imagery/epsilon-case-2-after.png' },
      { before: '/clinical-imagery/epsilon-case-3-before.png', after: '/clinical-imagery/epsilon-case-3-after.png' },
      { before: '/clinical-imagery/epsilon-case-4-before.png', after: '/clinical-imagery/epsilon-case-4-after.png' },
    ],
  },
  {
    id: 'tone',
    label: 'Redness & Tone',
    measure: 'Redness and tone documentation',
    modality: 'VISIA',
    afterLabel: 'After Day 7',
    cases: [
      { image: '/clinical-imagery/visia-case-1.png' },
      { image: '/clinical-imagery/visia-case-2.png' },
      { image: '/clinical-imagery/visia-case-3.png' },
    ],
  },
  {
    id: 'texture',
    label: 'Texture',
    measure: 'Texture and skin-quality mapping',
    modality: 'Antera',
    afterLabel: 'After Day 28',
    cases: [
      { before: '/clinical-imagery/antera-case-1-before.png', after: '/clinical-imagery/antera-case-1-after.png' },
      { before: '/clinical-imagery/antera-case-2-before.png', after: '/clinical-imagery/antera-case-2-after.png' },
      { before: '/clinical-imagery/antera-case-3-before.png', after: '/clinical-imagery/antera-case-3-after.png' },
    ],
  },
]

function EvidenceIcon({ kind }: { kind: IconKind }) {
  const common = {
    fill: 'none',
    stroke: '#FFFFFF',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" style={{ width: 42, height: 42, display: 'block' }}>
      {kind === 'barrier' && (
        <g {...common}>
          <path d="M24 5 36 10v10.2c0 8.9-5.2 16.1-12 20.8-6.8-4.7-12-11.9-12-20.8V10L24 5Z" />
          <path d="M19 27c3.1-2 6.9-2 10 0" />
          <path d="M19 21c3.1-2 6.9-2 10 0" opacity="0.62" />
          <path d="M20 16c.8-1.7.8-3.3 0-5" />
          <path d="M24 16c.8-1.7.8-3.3 0-5" />
          <path d="M28 16c.8-1.7.8-3.3 0-5" />
        </g>
      )}
      {kind === 'hydration' && (
        <g {...common}>
          <path d="M24 6c5.8 7.8 9.5 13.2 9.5 19.2a9.5 9.5 0 0 1-19 0C14.5 19.2 18.2 13.8 24 6Z" />
          <path d="M20.2 29.2c2.6 1.7 5.1 1.7 7.6 0" opacity="0.62" />
        </g>
      )}
      {kind === 'redness' && (
        <g {...common}>
          <path d="M10 20c4.2-4 8.3-4 12.5 0s8.3 4 12.5 0 6.3-3.2 8 0" />
          <path d="M10 28c4.2-4 8.3-4 12.5 0s8.3 4 12.5 0 6.3-3.2 8 0" />
          <path d="M16 36h16" opacity="0.62" />
        </g>
      )}
      {kind === 'elasticity' && (
        <g {...common}>
          <path d="M8 28c5-10 11.6-10 16 0s11 10 16 0" />
          <path d="M8 36c5-10 11.6-10 16 0s11 10 16 0" opacity="0.62" />
          <path d="M12 14h24" />
        </g>
      )}
      {kind === 'tone' && (
        <g {...common}>
          <path d="M11 16h26" />
          <path d="M11 24h26" />
          <path d="M11 32h26" />
          <circle cx="16" cy="38" r="1.7" fill="#FFFFFF" stroke="none" />
          <circle cx="24" cy="38" r="1.7" fill="#FFFFFF" stroke="none" />
          <circle cx="32" cy="38" r="1.7" fill="#FFFFFF" stroke="none" />
        </g>
      )}
      {kind === 'lifting' && (
        <g {...common}>
          <path d="M10 34c11-1.2 20.8-9.2 25-21" />
          <path d="M27 12h8v8" />
          <path d="M11 39h26" opacity="0.62" />
        </g>
      )}
    </svg>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  const upToValue = metric.value.startsWith('Up to ')

  return (
    <article className="clinical-metric-card">
      <div className="clinical-icon-shell">
        <EvidenceIcon kind={metric.icon} />
      </div>
      <strong aria-label={metric.value}>
        {upToValue ? (
          <>
            <span className="clinical-value-prefix">Up to</span>
            <span className="clinical-value-main">{metric.value.replace('Up to ', '')}</span>
          </>
        ) : (
          <span className="clinical-value-main">{metric.value}</span>
        )}
      </strong>
      <span aria-hidden="true" className="clinical-gold-rule" />
      <p>{metric.label}</p>
    </article>
  )
}

function CheckpointPanel({
  day,
  title,
  metrics,
}: {
  day: string
  title: string
  metrics: Metric[]
}) {
  return (
    <section className="clinical-panel" aria-labelledby={`clinical-${day.toLowerCase().replace(' ', '-')}`}>
      <div className="clinical-panel-heading">
        <p id={`clinical-${day.toLowerCase().replace(' ', '-')}`}>{day}</p>
        <h3>{title}</h3>
      </div>
      <div className="clinical-metrics">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  )
}

function ClinicalImagingViewer() {
  const [activeGroupId, setActiveGroupId] = useState<ImagingGroup['id']>('hydration')
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [split, setSplit] = useState(50)
  const activeGroup = IMAGING_GROUPS.find((group) => group.id === activeGroupId) ?? IMAGING_GROUPS[0]
  const activeCase = activeGroup.cases[activeCaseIndex] ?? activeGroup.cases[0]
  const hasComparison = Boolean(activeCase.before && activeCase.after)

  function selectGroup(group: ImagingGroup) {
    setActiveGroupId(group.id)
    setActiveCaseIndex(0)
    setSplit(50)
  }

  function changeCase(direction: -1 | 1) {
    setActiveCaseIndex((current) => {
      const next = current + direction
      if (next < 0) return activeGroup.cases.length - 1
      if (next >= activeGroup.cases.length) return 0
      return next
    })
    setSplit(50)
  }

  return (
    <section className="clinical-imagery" aria-labelledby="clinical-imagery-title">
      <div className="clinical-imagery-topline" aria-hidden="true">
        <span />
        <span>Clinical Evidence</span>
        <span />
      </div>
      <header className="clinical-imagery-header">
        <h3 id="clinical-imagery-title">Clinical Imaging Results</h3>
        <p>Nexovia Skin Serum</p>
      </header>

      <div className="clinical-imagery-tabs" role="tablist" aria-label="Clinical imaging measurements">
        {IMAGING_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={group.id === activeGroup.id}
            className={group.id === activeGroup.id ? 'is-active' : ''}
            onClick={() => selectGroup(group)}
          >
            <span>{group.label}</span>
            <small>{group.modality}</small>
          </button>
        ))}
      </div>

        <div className="clinical-viewer-card">
          <div className="clinical-viewer-meta">
            <span>{activeGroup.measure}</span>
          {hasComparison ? <span>{activeGroup.afterLabel}</span> : null}
        </div>

        <div
          className={hasComparison ? 'clinical-comparison' : 'clinical-comparison clinical-comparison-triptych'}
          style={{ '--split': `${split}%` } as CSSProperties & { '--split': string }}
        >
          {hasComparison ? (
            <>
              <div className="clinical-comparison-pane clinical-comparison-before">
                <Image src={activeCase.before as string} alt={`${activeGroup.label} case ${activeCaseIndex + 1} before`} fill sizes="(max-width: 760px) 92vw, 980px" quality={100} unoptimized />
                <span>Before</span>
              </div>
              <div className="clinical-comparison-pane clinical-comparison-after">
                <Image src={activeCase.after as string} alt={`${activeGroup.label} case ${activeCaseIndex + 1} after`} fill sizes="(max-width: 760px) 92vw, 980px" quality={100} unoptimized />
                <span>{activeGroup.afterLabel}</span>
              </div>
              <div className="clinical-comparison-divider" aria-hidden="true">
                <span>‹ ›</span>
              </div>
              <input
                className="clinical-comparison-range"
                type="range"
                min="18"
                max="82"
                value={split}
                aria-label="Adjust before and after comparison"
                onChange={(event) => setSplit(Number(event.target.value))}
              />
            </>
          ) : (
            <div className="clinical-triptych-image">
              <Image src={activeCase.image as string} alt={`${activeGroup.label} case ${activeCaseIndex + 1}`} fill sizes="(max-width: 760px) 92vw, 1200px" quality={100} unoptimized />
              <div className="clinical-triptych-labels" aria-hidden="true">
                <span>Before</span>
                <span>Immediately after treatment</span>
                <span>After 7 days</span>
              </div>
            </div>
          )}
        </div>

        <div className="clinical-case-controls">
          <button type="button" aria-label="Previous case" onClick={() => changeCase(-1)}>
            ←
          </button>
          <div className="clinical-case-list" aria-label={`${activeGroup.label} cases`}>
            {activeGroup.cases.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === activeCaseIndex ? 'is-active' : ''}
                aria-current={index === activeCaseIndex}
                onClick={() => {
                  setActiveCaseIndex(index)
                  setSplit(50)
                }}
              >
                Case {index + 1}
              </button>
            ))}
          </div>
          <button type="button" aria-label="Next case" onClick={() => changeCase(1)}>
            →
          </button>
        </div>
      </div>
    </section>
  )
}

export default function ClinicalEvidenceSection() {
  return (
    <section id="clinical-evidence" className="clinical-evidence-section" aria-labelledby="clinical-evidence-title">
      <style>{`
        .clinical-evidence-section {
          position: relative;
          overflow: hidden;
          background: ${ROSE};
          color: ${DARK};
          padding: clamp(72px, 8vw, 108px) clamp(20px, 5vw, 72px) clamp(84px, 9vw, 126px);
        }
        .clinical-evidence-inner {
          width: min(1680px, 100%);
          margin: 0 auto;
        }
        .clinical-topline {
          display: grid;
          grid-template-columns: auto minmax(120px, 1fr);
          align-items: center;
          gap: 24px;
          margin-bottom: clamp(26px, 3vw, 42px);
        }
        .clinical-topline span:first-child {
          font-family: ${SANS};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #000000;
          white-space: nowrap;
        }
        .clinical-topline span:last-child {
          height: 1px;
          background: ${GOLD};
          opacity: 0.9;
        }
        .clinical-header {
          max-width: none;
          margin-bottom: clamp(44px, 5.2vw, 68px);
        }
        .clinical-header h2 {
          margin: 0;
          color: #000000;
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(30px, 4.1vw, 78px);
          font-weight: 400;
          line-height: 1.03;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .clinical-header p {
          max-width: none;
          margin: 22px 0 0;
          color: #000000;
          font-family: ${SANS};
          font-size: clamp(13px, 1.05vw, 18px);
          line-height: 1.65;
          white-space: nowrap;
        }
        .clinical-stage {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: end;
          gap: clamp(72px, 13vw, 240px);
        }
        .clinical-panel {
          position: relative;
          z-index: 1;
          border: 1px solid rgba(237, 201, 103, 0.72);
          background: ${BURGUNDY};
          padding: clamp(32px, 3.2vw, 48px);
          min-height: 560px;
          box-shadow: 0 26px 90px rgba(90, 31, 46, 0.12);
        }
        .clinical-panel:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        .clinical-panel:last-child {
          grid-column: 2;
          grid-row: 1;
        }
        .clinical-panel-heading {
          text-align: center;
          border-bottom: 1px solid rgba(237, 201, 103, 0.7);
          padding-bottom: 22px;
          margin-bottom: 28px;
        }
        .clinical-panel-heading p {
          margin: 0;
          color: #FFFFFF;
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(64px, 6vw, 104px);
          font-weight: 400;
          line-height: 0.9;
        }
        .clinical-panel-heading h3 {
          margin: 18px 0 0;
          color: #FFFFFF;
          font-family: ${SANS};
          font-size: clamp(12px, 1.15vw, 15px);
          font-weight: 700;
          letter-spacing: 0.18em;
          line-height: 1.3;
          text-transform: uppercase;
        }
        .clinical-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 1.4vw, 22px);
        }
        .clinical-metric-card {
          display: flex;
          min-height: 280px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
          padding: 28px 18px;
          text-align: center;
        }
        .clinical-icon-shell {
          display: flex;
          width: 64px;
          height: 64px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          margin-bottom: 24px;
        }
        .clinical-metric-card strong {
          display: flex;
          min-width: 0;
          max-width: 100%;
          min-height: 78px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(34px, 2.75vw, 50px);
          font-weight: 400;
          line-height: 0.98;
          white-space: nowrap;
        }
        .clinical-value-prefix {
          margin-bottom: 6px;
          font-family: ${SANS};
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
        }
        .clinical-value-main {
          display: block;
          white-space: nowrap;
        }
        .clinical-gold-rule {
          display: block;
          width: min(92px, 70%);
          height: 1px;
          background: ${GOLD};
          margin: 22px 0 16px;
        }
        .clinical-metric-card p {
          margin: 0;
          color: #FFFFFF;
          font-family: ${SANS};
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.09em;
          line-height: 1.35;
          text-transform: uppercase;
        }
        .clinical-product {
          position: absolute;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          left: 50%;
          top: 50%;
          width: clamp(190px, 13vw, 260px);
          min-height: 0;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .clinical-product::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 190px;
          height: 28px;
          background: rgba(90, 31, 46, 0.24);
          filter: blur(18px);
          transform: translateX(-50%);
        }
        .clinical-product-frame {
          position: relative;
          width: 100%;
          filter: drop-shadow(0 32px 40px rgba(90, 31, 46, 0.26));
        }
        .clinical-product-frame img {
          object-fit: contain;
        }
        .clinical-imagery {
          position: relative;
          z-index: 1;
          margin-top: clamp(72px, 8vw, 118px);
          border: 1px solid rgba(237, 201, 103, 0.7);
          background: rgba(255, 242, 246, 0.28);
          padding: clamp(34px, 5vw, 72px);
          box-shadow: 0 34px 100px rgba(90, 31, 46, 0.16);
        }
        .clinical-imagery-topline {
          display: grid;
          grid-template-columns: minmax(48px, 1fr) auto minmax(48px, 1fr);
          align-items: center;
          gap: 22px;
          max-width: 720px;
          margin: 0 auto 22px;
        }
        .clinical-imagery-topline span:first-child,
        .clinical-imagery-topline span:last-child {
          height: 1px;
          background: ${GOLD};
        }
        .clinical-imagery-topline span:nth-child(2) {
          color: #000000;
          font-family: ${SANS};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .clinical-imagery-header {
          text-align: center;
          margin-bottom: clamp(34px, 4.5vw, 58px);
        }
        .clinical-imagery-header h3 {
          margin: 0;
          color: #000000;
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(38px, 5.1vw, 86px);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0;
        }
        .clinical-imagery-header p {
          margin: 18px 0 0;
          color: #000000;
          font-family: ${SANS};
          font-size: clamp(13px, 1vw, 16px);
          line-height: 1.6;
        }
        .clinical-imagery-tabs {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(12px, 2vw, 30px);
          max-width: 1040px;
          margin: 0 auto 0;
        }
        .clinical-imagery-tabs button {
          appearance: none;
          border: 0;
          border-bottom: 2px solid rgba(90, 31, 46, 0.22);
          background: transparent;
          color: rgba(0, 0, 0, 0.66);
          cursor: pointer;
          font-family: ${SANS};
          padding: 0 10px 18px;
          text-align: center;
          transition: border-color 180ms ease, color 180ms ease;
        }
        .clinical-imagery-tabs button span {
          display: block;
          font-size: clamp(13px, 1.25vw, 18px);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .clinical-imagery-tabs button small {
          display: block;
          margin-top: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .clinical-imagery-tabs button.is-active {
          border-bottom-color: ${BURGUNDY};
          color: ${BURGUNDY};
        }
        .clinical-viewer-card {
          border: 1px solid rgba(115, 44, 63, 0.2);
          background: rgba(255, 246, 249, 0.5);
          padding: clamp(18px, 2.8vw, 34px);
        }
        .clinical-viewer-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
          color: ${BURGUNDY};
          font-family: ${SANS};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.17em;
          line-height: 1.45;
          text-transform: uppercase;
        }
        .clinical-comparison {
          position: relative;
          overflow: hidden;
          min-height: clamp(420px, 48vw, 760px);
          border: 1px solid rgba(115, 44, 63, 0.22);
          background: #140b10;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }
        .clinical-comparison-pane {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #140b10;
        }
        .clinical-comparison-pane img,
        .clinical-triptych-image img {
          object-fit: contain;
        }
        .clinical-comparison-before {
          clip-path: inset(0 calc(100% - var(--split)) 0 0);
          border-right: 1px solid rgba(255, 255, 255, 0.8);
        }
        .clinical-comparison-after {
          clip-path: inset(0 0 0 var(--split));
        }
        .clinical-comparison-pane span {
          position: absolute;
          top: 22px;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(115, 44, 63, 0.86);
          color: #FFFFFF;
          font-family: ${SANS};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          padding: 10px 13px;
          text-transform: uppercase;
        }
        .clinical-comparison-before span {
          left: 20px;
        }
        .clinical-comparison-after span {
          right: 20px;
        }
        .clinical-comparison-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--split);
          z-index: 4;
          width: 1px;
          background: rgba(255, 255, 255, 0.86);
          pointer-events: none;
        }
        .clinical-comparison-divider span {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          width: 58px;
          height: 58px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 50%;
          background: ${BURGUNDY};
          color: #FFFFFF;
          font-family: ${SANS};
          font-size: 24px;
          letter-spacing: -0.08em;
          transform: translate(-50%, -50%);
        }
        .clinical-comparison-range {
          position: absolute;
          inset: 0;
          z-index: 5;
          width: 100%;
          height: 100%;
          cursor: ew-resize;
          opacity: 0;
        }
        .clinical-comparison-triptych {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }
        .clinical-triptych-image {
          position: absolute;
          inset: 0;
        }
        .clinical-triptych-image img {
          object-fit: contain;
          image-rendering: auto;
        }
        .clinical-triptych-labels {
          position: absolute;
          top: clamp(10px, 1.4vw, 18px);
          left: 0;
          right: 0;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
          padding: 0 clamp(14px, 1.8vw, 28px);
          pointer-events: none;
        }
        .clinical-triptych-labels span {
          display: block;
          color: ${BURGUNDY};
          font-family: ${SANS};
          font-size: clamp(10px, 0.9vw, 14px);
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.2;
          text-align: center;
        }
        .clinical-case-controls {
          display: grid;
          grid-template-columns: 48px 1fr 48px;
          align-items: center;
          gap: 18px;
          margin-top: 28px;
        }
        .clinical-case-controls > button {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(115, 44, 63, 0.18);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          color: ${BURGUNDY};
          cursor: pointer;
          font-family: ${SANS};
          font-size: 22px;
          transition: background 180ms ease, color 180ms ease;
        }
        .clinical-case-controls > button:hover {
          background: ${BURGUNDY};
          color: #FFFFFF;
        }
        .clinical-case-list {
          display: flex;
          min-width: 0;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }
        .clinical-case-list button {
          appearance: none;
          min-width: 108px;
          border: 1px solid rgba(115, 44, 63, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.26);
          color: ${BURGUNDY};
          cursor: pointer;
          font-family: ${SANS};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          padding: 13px 18px;
          text-transform: uppercase;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }
        .clinical-case-list button.is-active {
          border-color: ${BURGUNDY};
          background: ${BURGUNDY};
          color: #FFFFFF;
        }
        @media (max-width: 1180px) {
          .clinical-stage {
            grid-template-columns: 1fr;
            align-items: stretch;
            gap: 28px;
          }
          .clinical-panel:first-child,
          .clinical-panel:last-child {
            grid-column: auto;
            grid-row: auto;
          }
          .clinical-product {
            display: none;
          }
          .clinical-comparison {
            min-height: clamp(360px, 58vw, 620px);
          }
        }
        @media (max-width: 760px) {
          .clinical-evidence-section {
            padding: 64px 18px;
          }
          .clinical-topline {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .clinical-header {
            margin-bottom: 34px;
          }
          .clinical-header h2 {
            font-size: clamp(34px, 9.5vw, 52px);
            line-height: 1.02;
            white-space: normal;
          }
          .clinical-header p {
            font-size: 14px;
            white-space: normal;
          }
          .clinical-panel {
            padding: 30px 18px;
            min-height: auto;
          }
          .clinical-panel-heading p {
            font-size: clamp(56px, 18vw, 82px);
          }
          .clinical-metrics {
            grid-template-columns: 1fr;
          }
          .clinical-metric-card {
            min-height: 184px;
          }
          .clinical-metric-card strong {
            font-size: clamp(40px, 13vw, 54px);
          }
          .clinical-imagery {
            margin-top: 56px;
            padding: 30px 14px;
          }
          .clinical-imagery-topline {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .clinical-imagery-topline span:first-child,
          .clinical-imagery-topline span:last-child {
            display: none;
          }
          .clinical-imagery-header h3 {
            font-size: clamp(34px, 11vw, 52px);
          }
          .clinical-imagery-tabs {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .clinical-imagery-tabs button {
            padding: 16px 8px;
          }
          .clinical-viewer-card {
            padding: 14px;
          }
          .clinical-viewer-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .clinical-comparison {
            min-height: 420px;
          }
          .clinical-comparison-pane span {
            top: 12px;
            font-size: 9px;
            padding: 8px 10px;
          }
          .clinical-comparison-before span {
            left: 12px;
          }
          .clinical-comparison-after span {
            right: 12px;
          }
          .clinical-comparison-divider span {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }
          .clinical-case-controls {
            grid-template-columns: 42px 1fr 42px;
            gap: 10px;
          }
          .clinical-case-controls > button {
            width: 42px;
            height: 42px;
          }
          .clinical-case-list {
            gap: 8px;
          }
          .clinical-case-list button {
            min-width: 86px;
            padding: 11px 12px;
          }
        }
      `}</style>

      <div className="clinical-evidence-inner">
        <div className="clinical-topline" aria-hidden="true">
          <span>Clinical Evidence</span>
          <span />
        </div>

        <header className="clinical-header">
          <h2 id="clinical-evidence-title">Nexovia Clinical Evidence</h2>
          <p>
            Split-face, single-blind evaluation following fractional Er:YAG laser treatment. Final analysis set:
            21 female participants, ages 30-60.
          </p>
        </header>

        <div className="clinical-stage">
          <CheckpointPanel day="DAY 7" title="Day 7 Recovery" metrics={DAY_7} />

          <div className="clinical-product" aria-hidden="true">
            <div className="clinical-product-frame">
              <Image
                src="/products/Nexovia_wo_background.png"
                alt=""
                width={220}
                height={520}
                sizes="(max-width: 1180px) 0px, 260px"
              />
            </div>
          </div>

          <CheckpointPanel day="DAY 28" title="Day 28 Skin Quality" metrics={DAY_28} />
        </div>

        <ClinicalImagingViewer />
      </div>
    </section>
  )
}
