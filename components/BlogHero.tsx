'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export default function BlogHero() {
  const items = [
    <p key="label" className="font-sans text-[11px] uppercase tracking-[0.4em] text-black">Journal</p>,
    <h1 key="title" className="mt-5 font-display text-[clamp(48px,6vw,80px)] font-normal leading-[0.98] text-black">The Nexovia Journal</h1>,
    <p key="subtitle" className="mx-auto mt-7 max-w-[720px] font-body text-[22px] font-light leading-[1.45] text-black">Post-procedure science. Ingredient insights. Aftercare guidance.</p>,
  ]

  return (
    <section className="bg-pale px-6 pb-16 pt-40 text-center sm:px-8 lg:px-12">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: index * 0.08, ease }}
        >
          {item}
        </motion.div>
      ))}
    </section>
  )
}