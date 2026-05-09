import sharp from 'sharp'
import { copyFileSync } from 'fs'

const INPUT  = 'public/products/Nexovia_Skin_serum.png'
const BACKUP = 'public/products/Nexovia_Skin_serum_original.png'
const OUTPUT = INPUT

copyFileSync(INPUT, BACKUP)
console.log('Backup saved:', BACKUP)

const img  = sharp(INPUT)
const { data, info } = await img
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = data

for (let i = 0; i < pixels.length; i += channels) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]
  if (r > 240 && g > 240 && b > 240) {
    pixels[i + 3] = 0
  }
}

await sharp(pixels, { raw: { width, height, channels } })
  .png()
  .toFile(OUTPUT)

console.log(`Done. ${width}x${height}, channels: ${channels}`)
