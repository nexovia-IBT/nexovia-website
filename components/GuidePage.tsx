import Image from 'next/image'
import Link from 'next/link'
import type { FeaturedGuide, GuideSection } from '@/lib/guides'

function GuideContentSection({ section, index }: { section: GuideSection; index: number }) {
  return (
    <section className="grid gap-7 border-t border-burgundy/10 py-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-burgundy/55">{String(index + 1).padStart(2, '0')}</p>
      </div>
      <div>
        <h2 className="font-display text-[clamp(30px,4vw,48px)] font-normal leading-[1.05] text-dark">{section.title}</h2>

        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph} className="mt-6 max-w-[820px] font-body text-[20px] font-light leading-[1.72] text-dark/62">
            {paragraph}
          </p>
        ))}

        {section.items ? (
          <ul className="mt-8 space-y-4">
            {section.items.map((item) => (
              <li key={item} className="border-l border-gold pl-4 font-body text-[18px] font-light leading-[1.62] text-dark/64">
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {section.subsections ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {section.subsections.map((subsection) => (
              <div key={subsection.title} className="bg-cream/55 p-6 shadow-[0_18px_42px_rgba(115,44,63,0.07)]">
                <h3 className="font-display text-[28px] font-normal leading-[1.12] text-dark">{subsection.title}</h3>
                {subsection.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 font-body text-[18px] font-light leading-[1.62] text-dark/60">
                    {paragraph}
                  </p>
                ))}
                {subsection.items ? (
                  <ul className="mt-5 space-y-3">
                    {subsection.items.map((item) => (
                      <li key={item} className="border-l border-gold pl-4 font-body text-[18px] font-light leading-[1.45] text-dark/60">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}


type GuidePageProps = {
  guide: FeaturedGuide
  publishedAt?: string
  updatedAt?: string
}

function GuideBreadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-burgundy/65">
      <Link href="/" className="no-underline transition-colors hover:text-burgundy">Home</Link>
      <span aria-hidden="true">/</span>
      <Link href="/blog" className="no-underline transition-colors hover:text-burgundy">Recovery Guides</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page" className="text-dark/45">{current}</span>
    </nav>
  )
}

function ImportedGuidePage({ guide, publishedAt, updatedAt }: GuidePageProps) {
  return (
    <main className="min-h-screen bg-pale text-dark">
      <article>
        <section className="px-6 pb-20 pt-40 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-end">
            <div>
              <GuideBreadcrumbs current={guide.title} />
              <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-burgundy">{guide.eyebrow}</p>
              <h1 className="mt-6 font-display text-[clamp(42px,6vw,80px)] font-normal leading-[0.98] text-dark">{guide.pageTitle}</h1>
              <p className="mt-7 max-w-[760px] font-body text-[22px] font-light leading-[1.5] text-dark/54">{guide.excerpt}</p>
              {publishedAt || updatedAt ? (
                <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.12em] text-dark/45">
                  By Nexovia Editorial Team{publishedAt ? ` / Published ${publishedAt}` : ''}{updatedAt ? ` / Updated ${updatedAt}` : ''}
                </p>
              ) : null}
              <a
                href="https://tally.so/r/682L2N"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex min-h-[44px] items-center bg-burgundy px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream no-underline transition-colors duration-200 hover:bg-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
              >
                Discover Your Skin Recovery Score
              </a>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-rose/20 shadow-[0_30px_70px_rgba(115,44,63,0.12)]">
              <Image src={guide.image} alt={`${guide.title} recovery guide`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 sm:px-8 lg:px-12">
          <div
            className="article-html guide-html mx-auto max-w-[860px]"
            dangerouslySetInnerHTML={{ __html: guide.content ?? '' }}
          />
        </section>

        <section className="px-6 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1120px] gap-8 border-t border-burgundy/10 pt-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-[760px] font-body text-[24px] font-light leading-[1.55] text-dark/62">Explore the full Nexovia journal for more recovery guidance, ingredient education, and procedure-specific aftercare.</p>
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] items-center justify-center border border-burgundy/25 px-6 py-3 font-sans text-[11px] uppercase tracking-[0.16em] text-burgundy no-underline transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
            >
              Back to all articles
            </Link>
          </div>
        </section>
      </article>
    </main>
  )
}
export default function GuidePage({ guide, publishedAt, updatedAt }: GuidePageProps) {
  if (guide.content && guide.format === 'html') {
    return <ImportedGuidePage guide={guide} publishedAt={publishedAt} updatedAt={updatedAt} />
  }

  const introParagraphs = Array.isArray(guide.intro) ? guide.intro : [guide.intro]

  return (
    <main className="min-h-screen bg-pale text-dark">
      <article>
        <section className="px-6 pb-20 pt-40 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-end">
            <div>
              <GuideBreadcrumbs current={guide.title} />
              <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-burgundy">{guide.eyebrow}</p>
              <h1 className="mt-6 font-display text-[clamp(42px,6vw,80px)] font-normal leading-[0.98] text-dark">{guide.pageTitle}</h1>
              {introParagraphs.map((paragraph) => (
                <p key={paragraph} className="mt-7 max-w-[760px] font-body text-[22px] font-light leading-[1.5] text-dark/54">
                  {paragraph}
                </p>
              ))}
              {publishedAt || updatedAt ? (
                <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.12em] text-dark/45">
                  By Nexovia Editorial Team{publishedAt ? ` / Published ${publishedAt}` : ''}{updatedAt ? ` / Updated ${updatedAt}` : ''}
                </p>
              ) : null}
              <a
                href="https://tally.so/r/682L2N"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex min-h-[44px] items-center bg-burgundy px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream no-underline transition-colors duration-200 hover:bg-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
              >
                Discover Your Skin Recovery Score
              </a>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-rose/20 shadow-[0_30px_70px_rgba(115,44,63,0.12)]">
              <Image src={guide.image} alt={`${guide.title} recovery guide`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="px-6 pb-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            {guide.sections.map((section, index) => (
              <GuideContentSection key={section.title} section={section} index={index} />
            ))}
          </div>
        </section>

        <section className="bg-cream/45 px-6 py-20 sm:px-8 lg:px-12" aria-labelledby="guide-faq-heading">
          <div className="mx-auto max-w-[1120px]">
            <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-burgundy/65">Recovery FAQ</p>
            <h2 id="guide-faq-heading" className="mt-5 font-display text-[clamp(36px,5vw,58px)] font-normal leading-[1.05] text-dark">
              Frequently Asked Questions
            </h2>
            <dl className="mt-10 grid gap-5 lg:grid-cols-2">
              {guide.faq.map((item) => (
                <div key={item.question} className="bg-pale p-6 shadow-[0_16px_40px_rgba(115,44,63,0.06)]">
                  <dt className="font-display text-[26px] font-normal leading-[1.16] text-dark">{item.question}</dt>
                  <dd className="mt-4 font-body text-[18px] font-light leading-[1.65] text-dark/58">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1120px] gap-8 border-t border-burgundy/10 pt-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-[760px] font-body text-[24px] font-light leading-[1.55] text-dark/62">{guide.closing}</p>
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] items-center justify-center border border-burgundy/25 px-6 py-3 font-sans text-[11px] uppercase tracking-[0.16em] text-burgundy no-underline transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
            >
              Back to all articles
            </Link>
          </div>
        </section>
      </article>
    </main>
  )
}