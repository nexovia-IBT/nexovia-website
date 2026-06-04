'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RecoveryGuidesDropdown, { RECOVERY_GUIDE_LINKS } from '@/components/RecoveryGuidesDropdown'

const CTA_URL = 'https://tally.so/r/682L2N'

export default function MainNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className={[
        'fixed left-0 right-0 top-0 z-[1000] transition-colors duration-300',
        scrolled ? 'border-b border-burgundy/5 bg-pale/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-display text-[22px] uppercase tracking-[0.25em] text-burgundy no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy/35"
          onClick={() => setMobileOpen(false)}
        >
          Nexovia
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          <Link className="min-h-[44px] content-center font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-dark/70 no-underline transition-colors duration-200 hover:text-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy/35" href="/">
            Home
          </Link>
          <RecoveryGuidesDropdown />
          <Link className="min-h-[44px] content-center font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-dark/70 no-underline transition-colors duration-200 hover:text-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy/35" href="/contact">
            Contact
          </Link>
        </div>

        <div className="hidden items-center lg:flex">
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center bg-burgundy px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream no-underline transition-colors duration-200 hover:bg-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy/35"
          >
            Discover Your Skin Recovery Score
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 text-burgundy lg:hidden"
        >
          <span className="h-px w-6 bg-current" />
          <span className="h-px w-6 bg-current" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-pale/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-[1440px] flex-col px-5 pb-6 pt-2 sm:px-8">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex min-h-[44px] items-center font-sans text-[12px] uppercase tracking-[0.12em] text-dark/75 no-underline">
                Home
              </Link>

              <button
                type="button"
                aria-expanded={mobileGuidesOpen}
                onClick={() => setMobileGuidesOpen((value) => !value)}
                className="flex min-h-[44px] items-center justify-between border-0 bg-transparent p-0 font-sans text-[12px] uppercase tracking-[0.12em] text-dark/75"
              >
                Recovery Guides
                <span aria-hidden="true">{mobileGuidesOpen ? '-' : '+'}</span>
              </button>

              <AnimatePresence initial={false}>
                {mobileGuidesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col py-2 pl-5">
                      {RECOVERY_GUIDE_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex min-h-[44px] items-center border-l border-burgundy/12 pl-4 font-body text-[15px] tracking-[0.05em] text-dark/70 no-underline"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex min-h-[44px] items-center font-sans text-[12px] uppercase tracking-[0.12em] text-dark/75 no-underline">
                Contact
              </Link>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[44px] items-center justify-center bg-burgundy px-5 py-3 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream no-underline"
              >
                Discover Your Skin Recovery Score
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
