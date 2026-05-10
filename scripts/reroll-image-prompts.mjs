#!/usr/bin/env node
// Re-roll just the image prompts for an existing article folder.
// Usage: node scripts/reroll-image-prompts.mjs "Article 2 - bbl-photofacial-aftercare-what-to-expect-and-how-to-heal"

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')
const TEXT_MODEL = 'gemini-2.5-flash'

async function loadEnv() {
  try {
    const txt = await readFile(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of txt.split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {}
}

async function callGemini(prompt) {
  const RETRYABLE = new Set([429, 500, 502, 503, 504])
  for (let i = 1; i <= 5; i++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, responseMimeType: 'application/json' },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? ''
      try { return JSON.parse(text) } catch { if (i === 5) throw new Error('parse fail') }
    } else if (!RETRYABLE.has(res.status)) {
      throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`)
    }
    await new Promise(r => setTimeout(r, 5000 * i))
  }
}

const folderName = process.argv[2]
if (!folderName) { console.error('Usage: node scripts/reroll-image-prompts.mjs "Article N - slug"'); process.exit(1) }
const folderPath = path.join(ROOT, 'public', 'images', 'blog', folderName)

await loadEnv()
const md = await readFile(path.join(folderPath, 'article.md'), 'utf8')
const { data } = matter(md)

const prompt = `You are creating image prompts for a Nexovia blog article. Brand: editorial luxury post-procedure skincare (Hermes meets Aesop). Brand palette ONLY: pale blush #F7E8EC, deep burgundy #732C3F, muted gold #EDC967, near-black #1A0B12. Photoreal, no text, no logos, no clearly identifiable faces.

Article title: "${data.title}"
Focus keyword: ${data.focusKeyword}

PICK SCENE TYPE BASED ON THE ARTICLE TOPIC:
- If the article is about a SPECIFIC TREATMENT or DEVICE (HydraFacial, microneedling, laser, BBL, PRP, Morpheus8, RF microneedling, IPL, dermaplaning, sofwave, peels): one image SHOULD show a practitioner-patient scene — gloved practitioner hands operating the device on a patient's face/cheek/forehead in an upscale clinic, photoreal, professional, calm. Patient eyes closed or face in soft profile. The OTHER image: related close-up (skin recovery texture, serum macro, soothing botanical, calm spa surface).
- If the article is about a ROUTINE / PROTOCOL / TIMELINE / DAY-BY-DAY: one image is an editorial flat-lay of skincare products and tools on linen/marble (no branded packaging). The other: hands with a planner or calendar — minimalist, no text visible.
- If the article is about an INGREDIENT: one image is the botanical or molecular subject in artistic macro. The other: close-up of skin showing the result.
- If the article is about a LIFESTYLE topic (sleep, stress, diet, alcohol, exercise, travel, sun exposure): editorial lifestyle moment + paired skin close-up.
- If the article is about a SYMPTOM (redness, swelling, tightness, sensitivity): close-up of bare cheek/jawline showing the symptom + soothed skin or gentle compress.

The TWO prompts MUST be visually distinct from each other. Do NOT make both abstract serum/droplet macros. Choose the most fitting scene type from the list above.

Each prompt must be 30-50 words, end with: "16:9 landscape, photoreal, editorial luxury, soft cinematic light, brand palette pale blush, deep burgundy, muted gold and near-black only. No text, no logos, no faces. Negative space, calm composition."

Return STRICT JSON only:
{ "imagePromptTop": "...", "imagePromptMiddle": "..." }`

const out = await callGemini(prompt)
const slug = data.slug

const sidecar = [
  `IMAGE PROMPTS for: ${data.title}`,
  `Slug: ${slug}`,
  `Folder: public/images/blog/${folderName}/`,
  ``,
  `--- TOP IMAGE  ---  save as: public/images/blog/${folderName}/${folderName}_1.webp`,
  out.imagePromptTop,
  ``,
  `--- MIDDLE IMAGE  ---  save as: public/images/blog/${folderName}/${folderName}_2.webp`,
  out.imagePromptMiddle,
  ``,
].join('\n')

await writeFile(path.join(folderPath, 'images.txt'), sidecar, 'utf8')
console.log('Updated images.txt')
console.log('\n=========== NEW PROMPTS ===========')
console.log(sidecar)
console.log('===================================')
