import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import BlogHero from '@/components/BlogHero'
import Footer from '@/components/Footer'
import MainNav from '@/components/MainNav'
import { getFeaturedGuidesWithContent } from '@/lib/guide-content'
import { formatPostDate, getAllPosts } from '@/lib/posts'

const POSTS_PER_PAGE = 12

export const metadata: Metadata = {
  title: 'Post-Procedure Skincare Blog | Nexovia',
  description: 'Expert guides on aftercare for microneedling, laser, chemical peels, and IPL. Science-backed recovery advice and ingredient education from Nexovia.',
  alternates: { canonical: 'https://nexovia.pro/blog' },
  openGraph: {
    title: 'Post-Procedure Skincare Blog | Nexovia',
    description: 'Expert guides on aftercare for microneedling, laser, chemical peels, and IPL.',
    url: 'https://nexovia.pro/blog',
    siteName: 'Nexovia',
    type: 'website',
  },
}

type BlogPageProps = {
  searchParams?: Promise<{ page?: string }>
}

function pageHref(page: number) {
  return page <= 1 ? '/blog' : `/blog?page=${page}`
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const [posts, featuredGuides] = await Promise.all([getAllPosts(), getFeaturedGuidesWithContent()])
  const page = Math.max(1, Number(params?.page ?? 1) || 1)
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * POSTS_PER_PAGE
  const visiblePosts = posts.slice(start, start + POSTS_PER_PAGE)

  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-pale text-black">
        <BlogHero />

        <section className="px-6 pb-4 pt-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-black">Recovery Guides</p>
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
              {featuredGuides.map((guide, index) => (
                <ArticleCard
                  key={guide.href}
                  title={guide.title}
                  excerpt={guide.excerpt}
                  href={guide.href}
                  image={guide.image}
                  tag={guide.tag}
                  variant="featured"
                  revealDelay={index * 0.08}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto my-24 h-px max-w-[1320px] bg-burgundy/10" />

        <section className="px-6 pb-28 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-black">All Articles</p>
              <p className="font-body text-[15px] text-black/45">({posts.length} posts)</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <ArticleCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  href={`/blog/${post.slug}`}
                  image={post.image}
                  date={formatPostDate(post.date)}
                  readTime={post.readTime}
                  variant="standard"
                  revealDelay={index * 0.08}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav aria-label="Blog pagination" className="mt-16 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={pageHref(pageNumber)}
                    className={[
                      'flex h-11 w-11 items-center justify-center font-sans text-[12px] uppercase tracking-[0.12em] no-underline transition-colors duration-200',
                      pageNumber === safePage ? 'bg-burgundy text-cream' : 'text-black hover:bg-burgundy/8',
                    ].join(' ')}
                  >
                    {pageNumber}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}