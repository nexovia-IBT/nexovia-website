import { existsSync, promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { featuredGuides, type FeaturedGuide } from '@/lib/guides'

const cwdGuidesDir = path.join(process.cwd(), 'content', 'guides')
const localProjectRoot = 'C:/Users/orhun/Desktop/nexovia-website'
const PROJECT_ROOT = process.env.NEXOVIA_PROJECT_ROOT || (existsSync(cwdGuidesDir) ? process.cwd() : localProjectRoot)
const GUIDES_DIR = path.join(PROJECT_ROOT, 'content', 'guides')

type ImportedGuideFields = {
  title?: string
  pageTitle?: string
  excerpt?: string
  href?: string
  image?: string
  tag?: string
  eyebrow?: string
  metaTitle?: string
  metaDescription?: string
  format?: 'html' | 'markdown'
}

export type GuideWithContent = FeaturedGuide & {
  content?: string
  format?: 'html' | 'markdown'
}

function slugFromHref(href: string) {
  return href.replace(/^\//, '').replace(/\/$/, '')
}

async function loadImportedGuide(href: string): Promise<Partial<GuideWithContent> | null> {
  try {
    const filePath = path.join(GUIDES_DIR, `${slugFromHref(href)}.md`)
    const raw = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(raw)
    const fields = data as ImportedGuideFields

    return {
      title: fields.title,
      pageTitle: fields.pageTitle,
      excerpt: fields.excerpt,
      href: fields.href,
      image: fields.image,
      tag: fields.tag,
      eyebrow: fields.eyebrow,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
      format: fields.format === 'html' ? 'html' : 'markdown',
      content,
    }
  } catch {
    return null
  }
}

export async function getGuideWithContentByHref(href: string): Promise<GuideWithContent | null> {
  const fallback = featuredGuides.find((guide) => guide.href === href)
  if (!fallback) return null

  const imported = await loadImportedGuide(href)
  return {
    ...fallback,
    ...imported,
    href,
    sections: fallback.sections,
    faq: fallback.faq,
    closing: fallback.closing,
  }
}

export async function getFeaturedGuidesWithContent(): Promise<GuideWithContent[]> {
  return Promise.all(featuredGuides.map((guide) => getGuideWithContentByHref(guide.href))).then((guides) => guides.filter((guide): guide is GuideWithContent => guide !== null))
}