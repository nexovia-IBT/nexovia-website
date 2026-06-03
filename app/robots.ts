import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://nexovia.pro/sitemap.xml',
    host: 'https://nexovia.pro',
  }
}
