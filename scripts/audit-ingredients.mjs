#!/usr/bin/env node
// Audit all per-article article.md files (and legacy content/posts/*.md) for
// non-Nexovia ingredient recommendations and replace them with Nexovia-aligned
// alternatives. Preserves "to avoid" warning contexts intact.

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')

// Recommendation-context replacements (ingredients in Nexovia stay; alternatives are swapped).
// Each pair is { from: regex, to: replacement, label: short note }
const REPLACEMENTS = [
  // Triple/multi-ingredient lists referencing ceramides
  {
    from: /Ceramides,\s*fatty acids,?\s*and\s*cholesterol[^.]*lipid matrix[^.]*\./gi,
    to: 'Panthenol, allantoin, and the peptide matrix support the structural rebuilding of the barrier',
    label: 'ceramide+fatty acids+cholesterol → Nexovia barrier ingredients',
  },
  {
    from: /Ceramides\s+and\s+fatty acids\s+help rebuild the lipid barrier/gi,
    to: 'Panthenol and allantoin help rebuild the lipid barrier',
    label: 'ceramides+fatty acids → panthenol+allantoin',
  },
  // Two-ingredient lists with squalane
  {
    from: /Emollients,?\s+like\s+squalane\s+or\s+shea butter,?\s+smooth and soften the skin,?\s+reducing any potential dryness or tightness\./gi,
    to: 'Emollients within the Nexovia ABA.4 architecture, such as biosaccharide gum-1 and panthenol, smooth and soften the skin, reducing any potential dryness or tightness.',
    label: 'squalane/shea butter emollient mention → Nexovia ingredients',
  },
  // Single-ingredient mentions in recommendation contexts
  {
    from: /Hyaluronic acid,\s*glycerin,?\s*and\s*ceramides are indispensable/gi,
    to: 'Hyaluronic acid, panthenol, and biosaccharide gum-1 are indispensable',
    label: 'HA+glycerin+ceramides → HA+panthenol+biosaccharide',
  },
  {
    from: /Ceramides,\s*natural lipids found in the skin barrier,\s*help to fortify[^.]*\./gi,
    to: 'Panthenol, a provitamin B5 that converts in skin cells, helps to fortify barrier integrity, retain moisture, and protect against environmental stressors.',
    label: 'standalone ceramide description → panthenol',
  },
  {
    from: /<li><strong>Ceramides:<\/strong>[^<]*<\/li>/gi,
    to: '<li><strong>Panthenol (Provitamin B5):</strong> A barrier-supporting ingredient that draws moisture into skin cells and reinforces the lipid matrix, restoring integrity after procedural compromise.</li>',
    label: 'ceramides bullet → panthenol bullet',
  },
  {
    from: /<li><strong>Squalane:<\/strong>[^<]*<\/li>/gi,
    to: '<li><strong>Biosaccharide Gum-1:</strong> A film-forming hydrator that holds moisture on the surface for hours, reducing the tight feeling after cleansing without occluding the skin.</li>',
    label: 'squalane bullet → biosaccharide bullet',
  },
  // Petrolatum recommendation
  {
    from: /Heavy occlusives like petrolatum slow loss further but are sometimes counterproductive/gi,
    to: 'Heavy occlusive balms slow loss further but are sometimes counterproductive',
    label: 'petrolatum specific mention → generic occlusive',
  },
  // Vitamin C recommendation
  {
    from: /(While strong )?Vitamin C serums should be avoided immediately post-procedure, gentle antioxidant formulations can be beneficial\.\s*Ingredients like green tea extract or Vitamin E offer protection against free radical damage,\s*supporting overall skin health without inducing sensitivity\./gi,
    to: 'Antioxidant defense is best delivered through gentle, well-tolerated ingredients during recovery. Niacinamide and centella asiatica extract provide antioxidant protection without inducing sensitivity, supporting overall skin health alongside the active repair signaling of the ABA.4 architecture.',
    label: 'Vitamin C antioxidant mention → niacinamide+centella',
  },
  // The line in Article 13 about Vitamin C plus ceramides
  {
    from: /Ceramides and fatty acids help rebuild the lipid barrier, while anti-inflammatory ingredients like centella asiatica or niacinamide calm redness and discomfort\.\s*Introducing potent actives like Vitamin C should be approached with caution[^.]*\./gi,
    to: 'Panthenol and allantoin help rebuild the lipid barrier, while anti-inflammatory ingredients like centella asiatica and niacinamide calm redness and discomfort. Active ingredients outside the Nexovia routine should be reintroduced only once the barrier has fully recovered.',
    label: 'Article 13 ceramide+vitamin C line → Nexovia ingredients',
  },
  // Ceramides line in Article 19
  {
    from: /Glycerin, a smaller humectant,?\s*integrates with the skin's natural moisture factors\.\s*Ceramides rebuild the lipid matrix between cells\./gi,
    to: 'Glycerin, a smaller humectant, integrates with the skin\'s natural moisture factors. Panthenol and allantoin support the rebuilding of the lipid matrix between cells.',
    label: 'Article 19 glycerin+ceramide → glycerin+panthenol+allantoin',
  },
  // Squalane in Article 20
  {
    from: /Squalane,\s*glycerin in a balanced formulation,?\s*and\s*<a href="\/blog\/biosaccharide-gum-1[^"]*">biosaccharide gum-1<\/a> all reduce evaporation/gi,
    to: 'Glycerin in a balanced formulation and <a href="/blog/biosaccharide-gum-1-explained-the-hidden-hero-of-sensitive-skincare">biosaccharide gum-1</a> reduce evaporation',
    label: 'Article 20 squalane removed from recommendation',
  },
  // Ceramides standalone bullet in Article 30
  {
    from: /<p>Ceramides and barrier-supporting lipids\. Important for the rebuilding phase\.<\/p>/gi,
    to: '<p>Panthenol, allantoin, and barrier-supporting hydrators. Important for the rebuilding phase.</p>',
    label: 'Article 30 ceramides line → panthenol+allantoin',
  },
]

async function walkArticles() {
  const files = []
  const blogDir = path.join(ROOT, 'public', 'images', 'blog')
  for (const entry of await readdir(blogDir, { withFileTypes: true })) {
    if (entry.isDirectory() && /^Article \d+ - /.test(entry.name)) {
      const candidate = path.join(blogDir, entry.name, 'article.md')
      try { await stat(candidate); files.push(candidate) } catch {}
    }
  }
  // Also include legacy content/posts/*.md
  const flatDir = path.join(ROOT, 'content', 'posts')
  try {
    for (const f of await readdir(flatDir)) {
      if (f.endsWith('.md') || f.endsWith('.mdx')) files.push(path.join(flatDir, f))
    }
  } catch {}
  return files
}

const files = await walkArticles()
const report = []

for (const f of files) {
  const orig = await readFile(f, 'utf8')
  let next = orig
  const hits = []
  for (const rule of REPLACEMENTS) {
    const before = next
    next = next.replace(rule.from, rule.to)
    if (next !== before) hits.push(rule.label)
  }
  if (next !== orig) {
    await writeFile(f, next, 'utf8')
    report.push({ file: path.relative(ROOT, f), hits })
  }
}

console.log('Scanned', files.length, 'articles')
console.log('Updated', report.length, 'articles:\n')
for (const r of report) {
  console.log('-', r.file)
  for (const h of r.hits) console.log('    ✓', h)
}
