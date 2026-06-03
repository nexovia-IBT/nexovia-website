import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const BASE_URL = 'https://nexovia.pro'

// Static, indexable routes that exist as app/<path>/page.tsx
const STATIC_PATHS = [
  '',
  '/blog',
  '/contact',
  '/post-procedure-skincare-guide',
  '/microneedling-aftercare',
  '/laser-treatment-aftercare',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  // getAllPosts() already filters out drafts and future-dated posts.
  const posts = await getAllPosts()
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = post.date ? new Date(post.date) : now
    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  })

  return [...staticEntries, ...postEntries]
}
