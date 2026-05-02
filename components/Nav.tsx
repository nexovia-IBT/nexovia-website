'use client'

import { useEffect, useState } from 'react'

const NAV_LINKS = ['Formula', 'Protocol', 'Science', 'About'] as const

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
      <a
        href="/"
        className="font-serif text-gold text-2xl tracking-[0.05em] no-underline"
      >
        Nexovia
      </a>

      <ul className="hidden lg:flex gap-10 list-none m-0 p-0">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="text-[12px] uppercase tracking-[0.12em] text-white/60 no-underline
                transition-colors duration-300 hover:text-gold"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="bg-gold text-burgundy text-[12px] uppercase tracking-[0.14em]
          font-sans font-semibold px-6 py-[10px] border-0 cursor-pointer
          transition-opacity duration-300 hover:opacity-[0.85]"
      >
        Shop Now
      </button>
    </nav>
  )
}
