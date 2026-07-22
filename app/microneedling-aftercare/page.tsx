import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import GuidePage from '@/components/GuidePage'
import MainNav from '@/components/MainNav'
import { getGuideWithContentByHref } from '@/lib/guide-content'

const HREF = '/microneedling-aftercare'
const PAGE_URL = 'https://nexovia.pro' + HREF
const PUBLISHED_AT = '2026-05-09'
const UPDATED_AT = '2026-07-22'

export async function generateMetadata(): Promise<Metadata> {
  const guide = await getGuideWithContentByHref(HREF)
  if (!guide) return {}

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: PAGE_URL,
      siteName: 'Nexovia',
      type: 'article',
      publishedTime: PUBLISHED_AT,
      modifiedTime: UPDATED_AT,
      authors: ['Nexovia Editorial Team'],
      images: [{ url: guide.image }],
    },
  }
}

export default async function MicroneedlingAftercarePage() {
  const guide = await getGuideWithContentByHref(HREF)
  if (!guide) return null

  const imageUrl = guide.image.startsWith('http') ? guide.image : `https://nexovia.pro${guide.image}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${PAGE_URL}#article`,
        headline: guide.pageTitle,
        description: guide.metaDescription,
        image: [imageUrl],
        datePublished: PUBLISHED_AT,
        dateModified: UPDATED_AT,
        inLanguage: 'en',
        isAccessibleForFree: true,
        mainEntityOfPage: { '@id': PAGE_URL },
        author: {
          '@type': 'Organization',
          '@id': 'https://nexovia.pro/#editorial-team',
          name: 'Nexovia Editorial Team',
          url: 'https://nexovia.pro',
        },
        publisher: { '@id': 'https://nexovia.pro/#organization' },
        about: {
          '@type': 'MedicalProcedure',
          name: 'Microneedling',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nexovia.pro/' },
          { '@type': 'ListItem', position: 2, name: 'Recovery Guides', item: 'https://nexovia.pro/blog' },
          { '@type': 'ListItem', position: 3, name: 'Microneedling Aftercare', item: PAGE_URL },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <MainNav />
      <GuidePage guide={guide} publishedAt="May 9, 2026" updatedAt="July 22, 2026" />
      <Footer />
    </>
  )
}
