#!/usr/bin/env node
// One-shot maintenance: fix internal blog links and convert FAQ <h3>?</h3><p>...</p>
// patterns into <details><summary>?</summary><p>...</p></details> across all articles.
//
// Targets: content/posts/*.md AND public/images/blog/Article*/article.md

import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')

// Routes that are NOT under /blog/ — leave their links alone
const TOP_LEVEL_ROUTES = new Set([
  'post-procedure-skincare-guide',
  'microneedling-aftercare',
  'laser-treatment-aftercare',
  'contact',
])

async function findArticles() {
  const out = []
  const flatDir = path.join(ROOT, 'content', 'posts')
  try {
    for (const f of await readdir(flatDir)) {
      if (f.endsWith('.md') || f.endsWith('.mdx')) out.push(path.join(flatDir, f))
    }
  } catch {}
  const bundledDir = path.join(ROOT, 'public', 'images', 'blog')
  try {
    for (const d of await readdir(bundledDir, { withFileTypes: true })) {
      if (d.isDirectory() && /^Article \d+ - /.test(d.name)) {
        const p = path.join(bundledDir, d.name, 'article.md')
        try { await stat(p); out.push(p) } catch {}
      }
    }
  } catch {}
  return out
}

function fixInternalLinks(html) {
  // Match <a href="/something"> where 'something' is a single path segment (no /blog/ prefix yet, no http)
  return html.replace(/<a\s+([^>]*?)href="\/([a-z0-9][a-z0-9\-]*?)"([^>]*)>/gi, (full, before, slug, after) => {
    if (TOP_LEVEL_ROUTES.has(slug)) return full // leave as-is
    if (slug.startsWith('blog')) return full
    return `<a ${before}href="/blog/${slug}"${after}>`
  })
}

function convertFaqAccordion(html) {
  // Find the FAQ section start (the H2 containing 'Frequently Asked Questions' or 'FAQ')
  const headingRe = /<h2[^>]*>(?:\s*<strong>)?\s*(?:Frequently Asked Questions|Frequently Asked Question|FAQ|FAQs)[^<]*(?:<\/strong>\s*)?<\/h2>/i
  const m = html.match(headingRe)
  if (!m) return html
  const startIdx = m.index + m[0].length

  // Find end of FAQ section: next h2 OR the disclaimer paragraph (em italic)
  const tail = html.slice(startIdx)
  const nextH2 = tail.search(/<h2[\s>]/i)
  const disclaimer = tail.search(/<p[^>]*>\s*<em>/i)
  let endRel = tail.length
  if (nextH2 !== -1) endRel = Math.min(endRel, nextH2)
  if (disclaimer !== -1) endRel = Math.min(endRel, disclaimer)

  const before = html.slice(0, startIdx)
  const faq = tail.slice(0, endRel)
  const after = tail.slice(endRel)

  // Convert each <h3>...</h3>(<p>...</p>)+ pair into <details>
  // Allow optional <strong> wrapping, multiple paragraphs after the question.
  const converted = faq.replace(
    /<h3[^>]*>([\s\S]*?)<\/h3>\s*((?:<p[^>]*>[\s\S]*?<\/p>\s*)+)/gi,
    (_, q, answers) => {
      const cleanQ = q.replace(/<\/?strong>/gi, '').trim()
      return `<details><summary><strong>${cleanQ}</strong></summary>${answers.trim()}</details>\n`
    }
  )

  return before + converted + after
}

async function main() {
  const files = await findArticles()
  console.log(`Found ${files.length} articles`)
  let linkFixed = 0, faqFixed = 0
  for (const f of files) {
    const orig = await readFile(f, 'utf8')
    let next = fixInternalLinks(orig)
    const linksChanged = next !== orig
    const beforeFaq = next
    next = convertFaqAccordion(next)
    const faqChanged = next !== beforeFaq
    if (linksChanged || faqChanged) {
      await writeFile(f, next, 'utf8')
      console.log(`  fixed ${path.relative(ROOT, f)}  links:${linksChanged}  faq:${faqChanged}`)
      if (linksChanged) linkFixed++
      if (faqChanged) faqFixed++
    }
  }
  console.log(`\nLinks fixed in ${linkFixed} files, FAQ converted in ${faqFixed} files.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
