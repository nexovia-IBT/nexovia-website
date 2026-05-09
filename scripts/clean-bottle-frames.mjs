import sharp from 'sharp'
import { readdirSync } from 'fs'
import { join } from 'path'

const FRAME_DIR = 'public/products/bottle-frames'
const ALPHA_KEEP = 238
const EDGE_ALPHA = 220

const frames = readdirSync(FRAME_DIR)
  .filter(name => /^frame_\d{3}\.png$/.test(name))
  .sort()

for (const frame of frames) {
  const file = join(FRAME_DIR, frame)
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(data)
  const { width, height, channels } = info

  for (let i = 0; i < pixels.length; i += channels) {
    const alpha = pixels[i + 3]

    if (alpha < EDGE_ALPHA) {
      pixels[i + 3] = 0
    } else if (alpha < ALPHA_KEEP) {
      pixels[i + 3] = Math.round((alpha - EDGE_ALPHA) / (ALPHA_KEEP - EDGE_ALPHA) * 180)
    }
  }

  await sharp(pixels, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(file)
}

console.log(`Cleaned ${frames.length} transparent bottle frames.`)
