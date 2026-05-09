import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import type { Post } from '@/lib/posts'
import Footer from '@/components/Footer'
import MainNav from '@/components/MainNav'
import { formatPostDate, getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const description = post.metaDescription ?? post.excerpt
  return {
    title: `${post.title} | Nexovia`,
    description,
    keywords: post.focusKeyword ? [post.focusKeyword] : undefined,
    alternates: { canonical: `https://nexovia.pro/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | Nexovia`,
      description,
      url: `https://nexovia.pro/blog/${post.slug}`,
      siteName: 'Nexovia',
      type: 'article',
      images: [{ url: post.image }],
    },
  }
}

function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)

  return (
    <div className="mx-auto mt-14 max-w-[760px] font-body text-[20px] font-light leading-[1.75] text-dark/70">
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          return <h2 key={index} className="mb-5 mt-12 font-display text-[34px] font-normal leading-[1.15] text-dark">{block.replace(/^## /, '')}</h2>
        }
        if (block.startsWith('### ')) {
          return <h3 key={index} className="mb-4 mt-9 font-display text-[26px] font-normal leading-[1.2] text-dark">{block.replace(/^### /, '')}</h3>
        }
        if (block.startsWith('- ')) {
          return (
            <ul key={index} className="my-8 list-disc space-y-3 pl-6">
              {block.split('\n').map((item) => <li key={item}>{item.replace(/^- /, '')}</li>)}
            </ul>
          )
        }
        return <p key={index} className="mb-7">{block}</p>
      })}
    </div>
  )
}

function HtmlContent({ content }: { content: string }) {
  return (
    <div
      className="article-html mx-auto mt-14 max-w-[760px]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

function ArticleContent({ post }: { post: Post }) {
  if (post.format === 'html') {
    return <HtmlContent content={post.content} />
  }

  return <MarkdownContent content={post.content} />
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.slug, 3)

  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-pale text-dark">
        <article className="px-6 pb-24 pt-40 sm:px-8 lg:px-12">
          <header className="mx-auto max-w-[980px] text-center">
            <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-burgundy">Journal</p>
            <h1 className="mt-6 font-display text-[clamp(44px,6vw,76px)] font-normal leading-[1.02] text-dark">{post.title}</h1>
            <p className="mx-auto mt-7 max-w-[760px] font-body text-[21px] font-light leading-[1.5] text-dark/50">{post.excerpt}</p>
            <p className="mt-6 font-body text-[14px] tracking-[0.06em] text-dark/40">
              {formatPostDate(post.date)}{post.readTime ? ` / ${post.readTime} min read` : ''}
            </p>
          </header>
          <ArticleContent post={post} />
        </article>

        {related.length > 0 ? (
          <section className="border-t border-burgundy/10 px-6 py-20 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1320px]">
              <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-burgundy">Related Articles</p>
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <ArticleCard
                    key={item.slug}
                    title={item.title}
                    excerpt={item.excerpt}
                    href={`/blog/${item.slug}`}
                    image={item.image}
                    date={formatPostDate(item.date)}
                    readTime={item.readTime}
                    variant="standard"
                    revealDelay={index * 0.08}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}