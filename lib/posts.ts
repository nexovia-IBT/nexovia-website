import { existsSync, promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type PostFrontmatter = {
  title: string
  slug: string
  excerpt: string
  date: string
  image: string
  focusKeyword?: string
  metaDescription?: string
  readTime?: number
  order?: number
  format?: 'markdown' | 'html'
}

export type Post = PostFrontmatter & {
  content: string
}

const cwdPostsDir = path.join(process.cwd(), 'content', 'posts')
const localProjectRoot = 'C:/Users/orhun/Desktop/nexovia-website'
const PROJECT_ROOT = process.env.NEXOVIA_PROJECT_ROOT || (existsSync(cwdPostsDir) ? process.cwd() : localProjectRoot)
const POSTS_DIR = path.join(PROJECT_ROOT, 'content', 'posts')

async function readPostsDir(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR)
    return files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
  } catch {
    return []
  }
}

async function loadPost(filename: string): Promise<Post | null> {
  try {
    const fullPath = path.join(POSTS_DIR, filename)
    const raw = await fs.readFile(fullPath, 'utf8')
    const { data, content } = matter(raw)
    const fallbackSlug = filename.replace(/\.(md|mdx)$/i, '')

    return {
      title: String(data.title ?? fallbackSlug),
      slug: String(data.slug ?? fallbackSlug),
      excerpt: String(data.excerpt ?? ''),
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      image: String(data.image ?? '/images/blog/placeholder.jpg'),
      focusKeyword: data.focusKeyword ? String(data.focusKeyword) : undefined,
      metaDescription: data.metaDescription ? String(data.metaDescription) : undefined,
      readTime: typeof data.readTime === 'number' ? data.readTime : undefined,
      order: typeof data.order === 'number' ? data.order : undefined,
      format: data.format === 'html' ? 'html' : 'markdown',
      content,
    }
  } catch {
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await readPostsDir()
  const posts = (await Promise.all(files.map(loadPost))).filter((post): post is Post => post !== null)
  return posts.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') return a.order - b.order
    if (typeof a.order === 'number') return -1
    if (typeof b.order === 'number') return 1
    return a.date < b.date ? 1 : -1
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function getRelatedPosts(slug: string, n = 3): Promise<Post[]> {
  const posts = await getAllPosts()
  const current = posts.find((post) => post.slug === slug)
  if (!current || typeof current.order !== 'number') return posts.filter((post) => post.slug !== slug).slice(0, n)

  return posts
    .filter((post) => post.slug !== slug && typeof post.order === 'number')
    .sort((a, b) => Math.abs((a.order ?? 0) - current.order!) - Math.abs((b.order ?? 0) - current.order!))
    .slice(0, n)
}

export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = year && month && day ? new Date(Date.UTC(year, month - 1, day)) : new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date)
}