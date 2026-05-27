import Image from 'next/image'

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

const DAY_7: Metric[] = [
  { value: '98.4%', label: 'TEWL Recovery', icon: 'barrier' },
  { value: '+36.8%', label: 'Hydration', icon: 'hydration' },
  { value: '-23.6%', label: 'Redness', icon: 'redness' },
]

const DAY_28: Metric[] = [
  { value: 'Up to 3.0x', label: 'Elasticity', icon: 'elasticity' },
  { value: '2.2x', label: 'Tone Evenness', icon: 'tone' },
  { value: '2.2x', label: 'Skin Lifting', icon: 'lifting' },
]

function EvidenceIcon({ kind }: { kind: IconKind }) {
  const common = {
    fill: 'none',
    stroke: ROSE,
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
          <circle cx="16" cy="38" r="1.7" fill={ROSE} stroke="none" />
          <circle cx="24" cy="38" r="1.7" fill={ROSE} stroke="none" />
          <circle cx="32" cy="38" r="1.7" fill={ROSE} stroke="none" />
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
          color: ${BURGUNDY};
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
          color: ${BURGUNDY_DEEP};
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
          color: rgba(26, 11, 18, 0.72);
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
          background: rgba(247, 232, 236, 0.46);
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
          color: ${BURGUNDY_DEEP};
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(64px, 6vw, 104px);
          font-weight: 400;
          line-height: 0.9;
        }
        .clinical-panel-heading h3 {
          margin: 18px 0 0;
          color: ${BURGUNDY};
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
          border: 1px solid rgba(115, 44, 63, 0.2);
          background: rgba(247, 232, 236, 0.42);
          padding: 28px 18px;
          text-align: center;
        }
        .clinical-icon-shell {
          display: flex;
          width: 64px;
          height: 64px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(115, 44, 63, 0.26);
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
          color: ${BURGUNDY_DEEP};
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
          color: rgba(26, 11, 18, 0.78);
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
        }
      `}</style>

      <div className="clinical-evidence-inner">
        <div className="clinical-topline" aria-hidden="true">
          <span>Clinical Evidence</span>
          <span />
        </div>

        <header className="clinical-header">
          <h2 id="clinical-evidence-title">Nexovia Skin Serum Clinical Study</h2>
          <p>
            Split-face, single-blind evaluation after fractional Er:YAG laser. Final analysis set:
            21 female participants, ages 39-59.
          </p>
        </header>

        <div className="clinical-stage">
          <CheckpointPanel day="DAY 7" title="Recovery Checkpoint" metrics={DAY_7} />

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

          <CheckpointPanel day="DAY 28" title="Skin Quality Checkpoint" metrics={DAY_28} />
        </div>
      </div>
    </section>
  )
}
