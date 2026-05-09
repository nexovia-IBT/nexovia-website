import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import GuidePage from '@/components/GuidePage'
import MainNav from '@/components/MainNav'
import { getGuideWithContentByHref } from '@/lib/guide-content'

const HREF = '/post-procedure-skincare-guide'

export async function generateMetadata(): Promise<Metadata> {
  const guide = await getGuideWithContentByHref(HREF)
  if (!guide) return {}

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: 'https://nexovia.pro' + HREF },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: 'https://nexovia.pro' + HREF,
      siteName: 'Nexovia',
      type: 'article',
      images: [{ url: guide.image }],
    },
  }
}

export default async function PostProcedureSkincareGuidePage() {
  const guide = await getGuideWithContentByHref(HREF)
  if (!guide) return null

  return <><MainNav /><GuidePage guide={guide} /><Footer /></>
}