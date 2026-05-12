#!/usr/bin/env node
// Map legacy scientific infographics into articles 9-18 as their middle image.

import { readFile, writeFile, copyFile, access } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')
const LEGACY_DIR = path.join(ROOT, 'public', 'images', 'blog', 'Old articles')
const BLOG_DIR = path.join(ROOT, 'public', 'images', 'blog')

const MAPPING = [
  { n: 9,  slug: 'what-to-eat-to-support-skin-recovery-after-an-aesthetic-procedure', legacy: 'how-to-keep-skin-hydrated-after-laser-resurfacing-without-clogging-pores-2.jpg', desc: 'hydration & nutrient delivery to skin' },
  { n: 10, slug: 'how-sleep-affects-skin-healing-after-a-cosmetic-treatment', legacy: 'how-long-does-redness-last-after-microneedling-2.webp', desc: 'overnight recovery timeline' },
  { n: 11, slug: 'can-you-drink-alcohol-after-microneedling-or-laser-a-practical-guide', legacy: 'what-ingredients-to-avoid-after-laser-treatment-a-complete-checklist-2.jpg', desc: 'what to avoid post-procedure' },
  { n: 12, slug: 'why-hyaluronic-acid-belongs-in-every-post-procedure-routine', legacy: 'exosomes-vs-growth-factors-understanding-the-new-generation-of-skin-recovery-2.jpg', desc: 'premium ingredient mechanism' },
  { n: 13, slug: 'how-to-layer-serums-and-moisturizers-after-an-aesthetic-treatment', legacy: 'can-i-use-vitamin-c-after-microneedling-timing-types-and-safety-2.jpg', desc: 'ingredient timing and sequencing' },
  { n: 14, slug: 'niacinamide-after-microneedling-benefits-and-timing', legacy: 'how-to-reduce-redness-after-laser-treatment-2.webp', desc: 'redness reduction (niacinamide is a key redness-calming ingredient)' },
  { n: 15, slug: 'centella-asiatica-for-post-procedure-skin-what-the-research-says', legacy: 'how-to-calm-swelling-after-rf-microneedling-whats-normal-and-whats-not-2.jpg', desc: 'calming and inflammation reduction (centella is the key calming botanical)' },
  { n: 16, slug: 'how-adenosine-supports-skin-recovery-and-anti-aging', legacy: 'rf-microneedling-vs-traditional-microneedling-recovery-2.webp', desc: 'recovery mechanism comparison' },
  { n: 17, slug: 'what-is-allantoin-and-why-is-it-in-post-procedure-skincare', legacy: '07tu3lf9zx6xx7vh6c8m2gbdujl5nd-2.jpg', desc: 'intact vs compromised skin barrier (allantoin supports barrier)' },
  { n: 18, slug: 'panthenol-for-compromised-skin-how-provitamin-b5-supports-recovery', legacy: 'laser-skin-resurfacing-aftercare-2.webp', desc: 'post-procedure barrier support and hydration' },
]

async function fileExists(p) { try { await access(p); return true } catch { return false } }

for (const item of MAPPING) {
  const folderName = `Article ${item.n} - ${item.slug}`
  const folder = path.join(BLOG_DIR, folderName)
  const legacySrc = path.join(LEGACY_DIR, item.legacy)
  const dst = path.join(folder, `${folderName}_2.webp`)
  const txtPath = path.join(folder, 'images.txt')

  if (!(await fileExists(legacySrc))) {
    console.warn(`[skip] Article ${item.n}: legacy file not found: ${item.legacy}`)
    continue
  }
  if (!(await fileExists(folder))) {
    console.warn(`[skip] Article ${item.n}: folder not found`)
    continue
  }

  if (item.legacy.endsWith('.webp')) {
    await copyFile(legacySrc, dst)
  } else {
    await sharp(legacySrc).webp({ quality: 88 }).toFile(dst)
  }

  if (await fileExists(txtPath)) {
    let s = await readFile(txtPath, 'utf8')
    const note = `--- MIDDLE IMAGE  ---  ALREADY PROVIDED: scientific infographic from Nexovia legacy library (${item.legacy} — ${item.desc}).\nNo image generation needed for the middle slot. The file is already saved as: ${folderName}_2.webp inside this folder.\n`
    s = s.replace(/--- MIDDLE IMAGE  ---[\s\S]*$/, note)
    await writeFile(txtPath, s, 'utf8')
  }

  console.log(`Article ${item.n}  <-  ${item.legacy}`)
}

console.log('\nDone. Articles 9-18 middle images set + images.txt updated.')
