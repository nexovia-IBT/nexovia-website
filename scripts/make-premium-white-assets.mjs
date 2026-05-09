import path from 'node:path'
import sharp from 'sharp'

const dir = 'public/products/ingredients'
const assets = [
  { file: 'adenosine.webp', out: 'adenosine-premium-clean.webp', crop: { left: 595, top: 110, width: 330, height: 610 } },
  { file: 'allantoin.webp', out: 'allantoin-premium-clean.webp', crop: { left: 130, top: 225, width: 740, height: 430 } },
  { file: 'biosaccharide.webp', out: 'biosaccharide-premium-clean.webp', crop: { left: 170, top: 60, width: 665, height: 510 } },
  { file: 'botanical-complex.webp', out: 'botanical-complex-premium-clean.webp', crop: { left: 20, top: 145, width: 700, height: 500 } },
  { file: 'centella-asiatica.webp', out: 'centella-asiatica-premium-clean.webp', crop: { left: 0, top: 170, width: 430, height: 570 } },
  { file: 'hyaluronic-acid.webp', out: 'hyaluronic-acid-premium-clean.webp', crop: { left: 215, top: 40, width: 575, height: 500 } },
  { file: 'niacinamide.webp', out: 'niacinamide-premium-clean.webp', crop: { left: 185, top: 120, width: 640, height: 350 } },
  { file: 'panthenol.webp', out: 'panthenol-premium-clean.webp', crop: { left: 220, top: 0, width: 560, height: 515 } },
]

function shouldWhiten(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max - min
  return max > 225 && saturation < 32
}

async function whitenStudioBackground(buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 3) {
    if (!shouldWhiten(data[i], data[i + 1], data[i + 2])) continue
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer()
}

for (const asset of assets) {
  const base = await sharp(path.join(dir, asset.file))
    .extract(asset.crop)
    .resize(1320, 1320, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer()

  const cleaned = await whitenStudioBackground(base)
  await sharp(cleaned)
    .webp({ quality: 98, smartSubsample: true })
    .toFile(path.join(dir, asset.out))
}