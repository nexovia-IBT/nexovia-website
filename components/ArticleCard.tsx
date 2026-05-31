'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export type ArticleCardProps = {
  title: string
  excerpt: string
  href: string
  image: string
  date?: string
  readTime?: number
  tag?: string
  variant?: 'featured' | 'standard'
  revealDelay?: number
}

const ease = [0.16, 1, 0.3, 1] as const

export default function ArticleCard({
  title,
  excerpt,
  href,
  image,
  date,
  readTime,
  tag,
  variant = 'standard',
  revealDelay = 0,
}: ArticleCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: revealDelay, ease }}
      className="group"
    >
      <Link
        href={href}
        className="block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy/35"
      >
        <div
          className={[
            'relative overflow-hidden bg-rose/25',
            isFeatured
              ? 'aspect-[3/4] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_rgba(115,44,63,0.12)]'
              : 'aspect-[16/10]',
          ].join(' ')}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes={isFeatured ? '(min-width: 1024px) 33vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            loading={isFeatured ? 'eager' : 'lazy'}
          />
          {isFeatured && tag ? (
            <span className="absolute left-0 top-0 m-4 bg-burgundy px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.25em] text-gold">
              {tag}
            </span>
          ) : null}
        </div>

        <div className={isFeatured ? 'pt-7' : 'pt-5'}>
          {!isFeatured && date ? (
            <p className="font-body text-[13px] tracking-[0.04em] text-black/40">
              {date}
              {readTime ? <span className="ml-3">{readTime} min read</span> : null}
            </p>
          ) : null}
          <h3 className={isFeatured ? 'font-display text-[28px] leading-[1.15] text-black' : 'mt-2 line-clamp-2 font-display text-[22px] leading-[1.2] text-black'}>
            {title}
          </h3>
          <p className={isFeatured ? 'mt-3 font-body text-[16px] font-light leading-[1.55] text-black/50' : 'mt-2 line-clamp-3 font-body text-[15px] font-light leading-[1.55] text-black/45'}>
            {excerpt}
          </p>
          {!isFeatured ? (
            <span className="mt-4 inline-flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.16em] text-black">
              Read more
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          ) : null}
        </div>
      </Link>
    </motion.article>
  )
}