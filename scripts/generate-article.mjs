#!/usr/bin/env node
// Generate a single Nexovia article + 2 images from the topics CSV.
// Usage: node scripts/generate-article.mjs [csvPath]
// Defaults to C:/Users/orhun/Desktop/nexovia-article-ideas.csv
//
// Reads next 'pending' row, calls Gemini to write the article HTML and 2 images,
// writes content/posts/[slug].md and public/images/blog/[slug].webp + [slug]-2.webp,
// then flips the CSV row to 'published'.

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import matter from 'gray-matter'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')
const POSTS_DIR = path.join(ROOT, 'content', 'posts')
const IMG_DIR = path.join(ROOT, 'public', 'images', 'blog')
const DEFAULT_CSV = 'C:/Users/orhun/Desktop/nexovia-article-ideas.csv'

const TEXT_MODEL = 'gemini-2.5-flash'
const IMAGE_MODEL = 'gemini-2.5-flash-image'

// --- env ---
async function loadEnv() {
  try {
    const txt = await readFile(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of txt.split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {}
}

// --- CSV (very small parser; fields are simple, may be quoted) ---
function parseCsv(text) {
  const rows = []
  let i = 0, field = '', row = [], inQuotes = false
  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue }
      if (c === '"') { inQuotes = false; i++; continue }
      field += c; i++
    } else {
      if (c === '"') { inQuotes = true; i++; continue }
      if (c === ',') { row.push(field); field = ''; i++; continue }
      if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue }
      if (c === '\r') { i++; continue }
      field += c; i++
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter(r => r.some(v => v.length))
}

function stringifyCsv(rows) {
  return rows.map(r => r.map(v => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v).join(',')).join('\n') + '\n'
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function todayIso() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

// --- Gemini calls ---
async function callGeminiJson(prompt) {
  const RETRYABLE = new Set([429, 500, 502, 503, 504])
  const MAX_TRIES = 6
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    let res
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
        }),
      })
    } catch (e) {
      if (attempt === MAX_TRIES) throw e
      console.warn(`  !! network error, retry ${attempt}/${MAX_TRIES} in 8s...`)
      await new Promise(r => setTimeout(r, 8000))
      continue
    }
    if (res.ok) {
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? ''
      try {
        return JSON.parse(text)
      } catch (e) {
        // Sometimes Gemini emits unescaped quotes inside the html field. Retry with more attempts.
        if (attempt === MAX_TRIES) {
          console.error('Last raw output snippet:', text.slice(0, 600))
          throw new Error(`JSON parse failed after ${MAX_TRIES} tries: ${e.message}`)
        }
        console.warn(`  !! JSON parse error, retry ${attempt}/${MAX_TRIES} in 5s...`)
        await new Promise(r => setTimeout(r, 5000))
        continue
      }
    }
    const body = await res.text()
    if (!RETRYABLE.has(res.status) || attempt === MAX_TRIES) throw new Error(`Gemini text ${res.status}: ${body.slice(0, 250)}`)
    const wait = Math.min(60, 8 * attempt) * 1000
    console.warn(`  !! ${res.status}, retry ${attempt}/${MAX_TRIES} in ${wait/1000}s...`)
    await new Promise(r => setTimeout(r, wait))
  }
  throw new Error('unreachable')
}

async function callGeminiImage(prompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  })
  if (!res.ok) throw new Error(`Gemini image ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
  if (!part) throw new Error('No image returned: ' + JSON.stringify(data).slice(0, 400))
  return Buffer.from(part.inlineData.data, 'base64')
}

// --- existing posts: order + slug list for internal linking ---
async function existingPosts() {
  let entries
  try { entries = await readdir(POSTS_DIR) } catch { return { maxOrder: 0, slugs: [] } }
  let maxOrder = 0
  const slugs = []
  for (const f of entries) {
    if (!/\.(md|mdx)$/i.test(f)) continue
    try {
      const raw = await readFile(path.join(POSTS_DIR, f), 'utf8')
      const { data } = matter(raw)
      if (typeof data.order === 'number' && data.order > maxOrder) maxOrder = data.order
      if (data.slug) slugs.push({ slug: String(data.slug), title: String(data.title ?? '') })
    } catch {}
  }
  return { maxOrder, slugs }
}

const BRAND_VOICE = `
You are writing for Nexovia, a premium post-procedure skincare brand. Tone: editorial luxury (Hermes meets Aesop) with clinical/scientific credibility underneath. No emojis. No marketing fluff. No exclamation points. Write in HTML, not markdown.

Format requirements (study existing articles):
- HTML only. Wrap paragraphs in <p>. Use <h2><strong>...</strong></h2> for top-level sections, <h3><strong>...</strong></h3> for subsections.
- Article length: TARGET 1400 words. Hard maximum 1900 words counted in body text. Be concise; cut adjectives. If you exceed 1900 the output will be rejected. Better short and sharp than padded.
- Structure: short intro (2-3 paragraphs) -> 4 to 6 H2 sections, each with 2-4 paragraphs, some with H3 subsections -> a section titled "Why [topic] Works Best With Complementary Technologies" near the end that organically introduces Nexovia's ABA.4 Bio-Intelligent Architecture (peptide matrix, plant exosomes 4 billion particles/mL, PDRN 1%, NAD+ 1%) -> a Frequently Asked Questions section with 5 questions, FORMATTED AS ACCORDION ITEMS using <details><summary><strong>Question?</strong></summary><p>Answer paragraph.</p></details> for EACH FAQ entry. Do NOT use <h3> for FAQ questions — use the details/summary pattern. The H2 "Frequently Asked Questions" heading stays as a normal h2. -> a final italic disclaimer paragraph.
- Place the FIRST <figure><img src="{TOP_IMG_URL}" alt="..." /></figure> tag right after the article title's first paragraph (top of the body).
- Place the SECOND <figure><img src="{MID_IMG_URL}" alt="..." /></figure> in the middle of the article (between two H2 sections, around the halfway point).
- Use 2-4 internal links to other Nexovia articles. IMPORTANT: blog articles live at /blog/[slug], so use <a href="/blog/[slug]">anchor</a>. The three pillar guides at /post-procedure-skincare-guide, /microneedling-aftercare, and /laser-treatment-aftercare are top-level routes — link to them as <a href="/post-procedure-skincare-guide">...</a> WITHOUT the /blog prefix. The available slugs will be provided; assume they are blog articles unless they match one of the three guide routes above.
- Disclaimer (verbatim, italic, last paragraph): This content is for informational purposes only and does not constitute medical advice. Always follow the specific aftercare instructions provided by your practitioner, as recommendations may vary based on your individual treatment and skin type.
`.trim()

function buildArticlePrompt({ title, focusKeyword, slug, internalLinks, topImgUrl, midImgUrl }) {
  const linksList = internalLinks.slice(0, 25).map(l => `- /${l.slug} ("${l.title}")`).join('\n')
  const voice = BRAND_VOICE
    .replace('{TOP_IMG_URL}', topImgUrl)
    .replace('{MID_IMG_URL}', midImgUrl)
  return `${voice}

You are writing the article: "${title}"
Focus keyword (use naturally, not stuffed): ${focusKeyword}
The slug is: ${slug}

Available internal links to weave in (pick 2-4 that fit the topic):
${linksList}

Return STRICT JSON with these keys exactly:
{
  "excerpt": "1-2 sentence editorial excerpt, ~30 words, no marketing tone",
  "metaDescription": "150-160 character SEO meta description",
  "readTime": integer minutes (estimate),
  "imagePromptTop": "concise descriptive prompt for a hero image, ~40 words, see image guidelines",
  "imagePromptMiddle": "concise descriptive prompt for a mid-article image, ~40 words, different scene from the top",
  "html": "the full article body as HTML (no <html>/<body>, just inner content). MUST include the two <figure> tags using src '/images/blog/${slug}.webp' and '/images/blog/${slug}-2.webp'."
}

Image guidelines (BOTH prompts must be visually distinct from each other AND match the article subject):

PICK SCENE TYPE BASED ON THE ARTICLE TOPIC:
- If the article is about a SPECIFIC TREATMENT or DEVICE (e.g. HydraFacial, microneedling, laser, BBL, PRP, Morpheus8, RF microneedling, IPL, dermaplaning, sofwave, peels): one of the two images SHOULD show a practitioner-patient scene — gloved practitioner hands operating the device on a patient's face/cheek/forehead in an upscale clinic, photoreal, professional, calm. The patient's eyes can be closed or face partially shown in soft profile (no full identifiable face). The OTHER image can be a related close-up (skin recovery texture, serum macro, soothing botanical, calm spa surface).
- If the article is about a ROUTINE / PROTOCOL / TIMELINE / DAY-BY-DAY (e.g. day-by-day recovery, how to layer products, when to reintroduce X, prep before procedure): one image can be a thoughtful editorial flat-lay of skincare products and tools arranged on linen/marble (no branded packaging). The other can be a calendar/diary page or hands holding a planner — minimalist, no text visible, suggesting structure and time. Avoid literal infographic style with words.
- If the article is about an INGREDIENT (e.g. niacinamide, peptides, hyaluronic acid, panthenol, centella, allantoin, exosomes, NAD+, PDRN): one image can be the botanical or molecular subject in artistic macro (centella leaves under soft light, salmon fillet abstracted, water sphere with green tint for green tea, lab pipette and petri dish). The other can be a close-up of skin showing the result (luminous skin texture, calm cheek with soft light).
- If the article is about a LIFESTYLE TOPIC (sleep, stress, diet, alcohol, exercise, travel, sun exposure): show the lifestyle moment in editorial taste — hands holding a glass of water, a bedside table with linen pillow at dawn, a passport on stone, runner's silhouette at golden hour. Tie back to skin via a paired skin close-up.
- If the article is about a SYMPTOM or SKIN STATE (redness, swelling, tightness, sensitivity, barrier compromise): close-up of bare cheek/jawline showing realistic redness, gentle hand applying compress, ice cube macro, soothed skin texture comparison.

UNIVERSAL RULES (apply to every prompt):
- 16:9 landscape, photoreal, editorial luxury, soft cinematic light, shallow depth of field, magazine-quality.
- Brand palette only: pale blush/pink (#F7E8EC), deep burgundy (#732C3F), muted gold (#EDC967), near-black (#1A0B12). Avoid bright primaries.
- NO text, NO logos, NO product packaging or branded bottles, NO clearly identifiable faces (profile, partial face, eyes closed, or framed below the eyes is fine).
- Photoreal, not illustrated. Hushed, refined, hospitality-grade — not sterile hospital aesthetic.
- The TWO image prompts MUST NOT both be "drop of serum" macros. They must be visually different scenes appropriate to the article subject.

Output JSON only.`
}

function buildImageEnvelope(prompt) {
  return `${prompt} 16:9 landscape, photoreal, editorial luxury, soft cinematic light, brand palette pale blush, deep burgundy, muted gold and near-black only. No text, no logos, no faces. Negative space, calm composition.`
}

// --- main ---
async function main() {
  await loadEnv()
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing in .env.local')

  const csvPath = process.argv[2] || DEFAULT_CSV
  if (!existsSync(csvPath)) throw new Error(`CSV not found: ${csvPath}`)

  console.log('Reading queue:', csvPath)
  const csvText = await readFile(csvPath, 'utf8')
  const rows = parseCsv(csvText)
  const header = rows[0]
  const titleIdx = header.indexOf('title')
  const kwIdx = header.indexOf('focusKeyword')
  const statusIdx = header.indexOf('status')
  if (titleIdx < 0 || kwIdx < 0 || statusIdx < 0) throw new Error('CSV must have title,focusKeyword,status')

  const pendingRowIdx = rows.findIndex((r, i) => i > 0 && r[statusIdx] === 'pending')
  if (pendingRowIdx < 0) { console.log('No pending rows.'); return }

  const row = rows[pendingRowIdx]
  const title = row[titleIdx]
  const focusKeyword = row[kwIdx]
  const slug = slugify(title)
  // Determine "Article N" number from existing per-article folders under public/images/blog/
  let articleN = 1
  try {
    const dirs = (await readdir(IMG_DIR)).filter(n => /^Article \d+ - /.test(n))
    const nums = dirs.map(n => parseInt(n.match(/^Article (\d+)/)[1], 10)).filter(Number.isFinite)
    if (nums.length) articleN = Math.max(...nums) + 1
  } catch {}
  const folderName = `Article ${articleN} - ${slug}`
  const imgFolderPath = path.join(IMG_DIR, folderName)
  const topImgUrl = `/images/blog/${folderName}/${folderName}_1.webp`
  const midImgUrl = `/images/blog/${folderName}/${folderName}_2.webp`

  console.log(`Generating: "${title}"`)
  console.log(`  slug: ${slug}`)
  console.log(`  Article number: ${articleN} -> folder: ${folderName}`)

  const { maxOrder, slugs } = await existingPosts()
  const order = maxOrder + 1

  // 1. Article
  console.log('  -> generating article HTML...')
  const t0 = Date.now()
  const article = await callGeminiJson(buildArticlePrompt({ title, focusKeyword, slug, internalLinks: slugs, topImgUrl, midImgUrl }))
  console.log(`     done in ${((Date.now() - t0) / 1000).toFixed(1)}s`)

  // 2. Save markdown FIRST so a quota error on images doesn't lose the article
  const frontmatter = matter.stringify(article.html, {
    title,
    slug,
    excerpt: article.excerpt,
    date: todayIso(),
    image: topImgUrl,
    focusKeyword,
    metaDescription: article.metaDescription,
    readTime: article.readTime || 8,
    order,
    format: 'html',
  })
  // Ensure article folder exists, then write article.md inside it
  await import('node:fs/promises').then(m => m.mkdir(imgFolderPath, { recursive: true }))
  const mdPath = path.join(imgFolderPath, 'article.md')
  await writeFile(mdPath, frontmatter, 'utf8')
  console.log(`  -> wrote ${path.relative(ROOT, mdPath)}`)

  // 3. Update CSV (article saved successfully)
  rows[pendingRowIdx][statusIdx] = 'published'
  await writeFile(csvPath, stringifyCsv(rows), 'utf8')
  console.log(`  -> CSV row marked published`)

  // 3b. Save image prompts to a sidecar file so you can copy/paste them into ChatGPT or Gemini chat
  await import('node:fs/promises').then(m => m.mkdir(imgFolderPath, { recursive: true }))
  const sidecar = path.join(imgFolderPath, 'images.txt')
  const sidecarBody = [
    `IMAGE PROMPTS for: ${title}`,
    `Slug: ${slug}`,
    `Folder: public/images/blog/${folderName}/`,
    ``,
    `--- TOP IMAGE  ---  save as: public/images/blog/${folderName}/${folderName}_1.webp`,
    buildImageEnvelope(article.imagePromptTop),
    ``,
    `--- MIDDLE IMAGE  ---  save as: public/images/blog/${folderName}/${folderName}_2.webp`,
    buildImageEnvelope(article.imagePromptMiddle),
    ``,
  ].join('\n')
  await writeFile(sidecar, sidecarBody, 'utf8')
  console.log(`  -> wrote ${path.relative(ROOT, sidecar)} (paste into ChatGPT/Gemini)`)
  console.log('\n=========== IMAGE PROMPTS ===========')
  console.log(sidecarBody)
  console.log('======================================\n')

  // 4. Images (best-effort — script does not crash if quota hits)
  // Ensure the per-article folder exists (gemini image quota usually blocks below; user fills in manually)
  await import('node:fs/promises').then(m => m.mkdir(imgFolderPath, { recursive: true }))

  const imageJobs = [
    { prompt: buildImageEnvelope(article.imagePromptTop),    file: `${folderName}_1.webp` },
    { prompt: buildImageEnvelope(article.imagePromptMiddle), file: `${folderName}_2.webp` },
  ]
  for (const job of imageJobs) {
    try {
      console.log(`  -> generating ${job.file}...`)
      const t = Date.now()
      const png = await callGeminiImage(job.prompt)
      const out = path.join(imgFolderPath, job.file)
      await sharp(png).webp({ quality: 86 }).toFile(out)
      console.log(`     ${job.file} (${(png.length / 1024).toFixed(0)} KB) in ${((Date.now() - t) / 1000).toFixed(1)}s`)
      // small pacing delay to respect per-minute quota
      await new Promise(r => setTimeout(r, 6000))
    } catch (e) {
      console.warn(`  !! image ${job.file} failed: ${String(e.message).slice(0, 200)}`)
      console.warn('     Run scripts/generate-missing-images.mjs later to retry.')
    }
  }

  const folderUrl = 'file:///' + imgFolderPath.replace(/\\/g, '/').replace(/ /g, '%20')
  console.log('\n=========== ARTICLE FOLDER ===========')
  console.log('Path:  ' + imgFolderPath)
  console.log('Click: ' + folderUrl)
  console.log('Open:  explorer "' + imgFolderPath + '"')
  console.log('======================================\n')

  console.log('Next step: cd to project root, then:')
  console.log('  git add public/images/blog')
  console.log(`  git commit -m "Add article: ${title}"`)
  console.log('  git push')
}

main().catch((e) => { console.error(e); process.exit(1) })
