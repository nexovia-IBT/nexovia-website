'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const RECOVERY_GUIDE_LINKS = [
  { label: 'Post-Procedure Skincare Guide', href: '/post-procedure-skincare-guide' },
  { label: 'Microneedling Aftercare', href: '/microneedling-aftercare' },
  { label: 'Laser Treatment Aftercare', href: '/laser-treatment-aftercare' },
  { label: 'All Articles', href: '/blog' },
] as const

export default function RecoveryGuidesDropdown() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const closeTimer = useRef<number | null>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()

      const focused = document.activeElement
      const currentIndex = itemRefs.current.findIndex((el) => el === focused)
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = (currentIndex + direction + itemRefs.current.length) % itemRefs.current.length
      itemRefs.current[nextIndex]?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  function openMenu() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
    setOpen(true)
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <div ref={wrapperRef} className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onFocus={openMenu}
        className="flex min-h-[44px] items-center gap-2 font-sans text-[12px] uppercase tracking-[0.12em] text-dark/70 transition-colors duration-200 hover:text-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy/35"
      >
        Recovery Guides
        <span aria-hidden="true" className={open ? 'rotate-180 text-burgundy transition-transform duration-200' : 'text-burgundy transition-transform duration-200'}>
          v
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full mt-3 w-[320px] -translate-x-1/2 bg-pale/95 p-3 shadow-[0_8px_32px_rgba(115,44,63,0.08)] backdrop-blur-md"
          >
            <ul className="m-0 list-none p-0">
              {RECOVERY_GUIDE_LINKS.map((item, index) => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    ref={(el) => { itemRefs.current[index] = el }}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-[44px] items-center px-4 py-2 font-body text-[14px] tracking-[0.05em] text-dark/75 outline-none transition-colors duration-200 hover:text-burgundy focus:text-burgundy"
                  >
                    <span aria-hidden="true" className="mr-4 h-px w-5 bg-burgundy/20 transition-colors duration-200 group-hover:bg-burgundy" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}