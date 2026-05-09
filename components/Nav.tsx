'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Home',              href: null },
  { label: 'Recovery Guides',   href: '/recovery-guides' },
  { label: 'For Practitioners', href: '/for-practitioners' },
] as const

export default function Nav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between
        px-7 py-[18px] lg:px-12 lg:py-6
        border-b border-gold/10
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[10px]'}`}
      style={{
        background: 'rgba(115,44,63,0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      <Link
        href="/"
        className="font-serif text-gold text-2xl tracking-[0.05em] no-underline"
      >
        Nexovia
      </Link>

      <ul className="hidden lg:flex gap-10 list-none m-0 p-0">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href ?? '#'}
              onClick={link.href ? undefined : (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'auto' }) }}
              className="text-[12px] uppercase tracking-[0.12em] text-white/60 no-underline
                transition-colors duration-300 hover:text-gold cursor-pointer"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="mailto:hello@nexovia.pro"
        className="bg-gold text-burgundy text-[12px] uppercase tracking-[0.14em]
          font-sans font-semibold px-6 py-[10px] no-underline
          transition-opacity duration-300 hover:opacity-[0.85]"
      >
        Contact
      </a>
    </nav>
  )
}
