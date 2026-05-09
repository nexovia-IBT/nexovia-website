import sharp from 'sharp'
import { copyFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const PRODUCTS_DIR    = 'public/products'
const BACKUP_DIR      = 'public/products/originals'
const BRIGHT_THRESH   = 230   // luminance above → background (white)
const DARK_THRESH     = 30    // luminance below → background (black)
const FEATHER_RADIUS  = 2     // px soft edge

const FILES = [
  'Nex_front.png',
  'Nex_front 2.png',
  'Nex_side_1.png',
  'Nex_side_2.png',
  'Nex_Back_1.png',
  'Nex_Back_2.png',
  'Nexovia_wo_background.png',
]

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

async function processImage(filename) {
  const inputPath  = join(PRODUCTS_DIR, filename)
  const backupPath = join(BACKUP_DIR, filename)

  copyFileSync(inputPath, backupPath)

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const px = Buffer.from(data)

  // ── Pass 1: build opaque mask (1 = keep, 0 = remove) ──────────────────
  const mask = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const o = i * channels
    const a = px[o + 3]
    if (a === 0) { mask[i] = 0; continue }
    const l = lum(px[o], px[o + 1], px[o + 2])
    mask[i] = (l > BRIGHT_THRESH || l < DARK_THRESH) ? 0 : 1
  }

  // ── Pass 2: feather — for each opaque pixel find nearest bg neighbour ──
  const alpha = new Float32Array(width * height)
  const R = FEATHER_RADIUS

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (mask[idx] === 0) { alpha[idx] = 0; continue }

      let minDist = R + 1
      outer: for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const ny = y + dy, nx = x + dx
          if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue
          if (mask[ny * width + nx] === 0) {
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < minDist) {
              minDist = d
              if (minDist < 1) break outer
            }
          }
        }
      }

      alpha[idx] = minDist > R ? 1 : minDist / R
    }
  }

  // ── Pass 3: write alpha back ───────────────────────────────────────────
  for (let i = 0; i < width * height; i++) {
    px[i * channels + 3] = Math.round(alpha[i] * 255)
  }

  await sharp(px, { raw: { width, height, channels } }).png().toFile(inputPath)
  console.log(`✓ ${filename}  (${width}×${height})`)
}

mkdirSync(BACKUP_DIR, { recursive: true })

for (const file of FILES) {
  try {
    await processImage(file)
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`)
  }
}

console.log('All done.')
