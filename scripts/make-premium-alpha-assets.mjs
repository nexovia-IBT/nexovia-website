import path from 'node:path'
import sharp from 'sharp'

const dir = 'public/products/ingredients'
const assets = [
  { file: 'adenosine.webp', out: 'adenosine-premium-alpha.png', crop: { left: 595, top: 110, width: 330, height: 610 } },
  { file: 'allantoin.webp', out: 'allantoin-premium-alpha.png', crop: { left: 130, top: 225, width: 740, height: 430 } },
  { file: 'biosaccharide.webp', out: 'biosaccharide-premium-alpha.png', crop: { left: 170, top: 60, width: 665, height: 510 } },
  { file: 'botanical-complex.webp', out: 'botanical-complex-premium-alpha.png', crop: { left: 20, top: 145, width: 700, height: 500 } },
  { file: 'centella-asiatica.webp', out: 'centella-asiatica-premium-alpha.png', crop: { left: 0, top: 170, width: 430, height: 570 } },
  { file: 'hyaluronic-acid.webp', out: 'hyaluronic-acid-premium-alpha.png', crop: { left: 215, top: 40, width: 575, height: 500 } },
  { file: 'niacinamide.webp', out: 'niacinamide-premium-alpha.png', crop: { left: 185, top: 120, width: 640, height: 350 } },
  { file: 'panthenol.webp', out: 'panthenol-premium-alpha.png', crop: { left: 220, top: 0, width: 560, height: 515 } },
]

function isEdgeWhite(data, idx) {
  const r = data[idx]
  const g = data[idx + 1]
  const b = data[idx + 2]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return r > 238 && g > 238 && b > 238 && max - min < 34
}

async function removeConnectedWhite(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const seen = new Uint8Array(width * height)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (seen[p]) return
    const idx = p * 4
    if (!isEdgeWhite(data, idx)) return
    seen[p] = 1
    queue.push([x, y])
  }

  for (let x = 0; x < width; x += 1) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y)
    push(width - 1, y)
  }

  for (let i = 0; i < queue.length; i += 1) {
    const [x, y] = queue[i]
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  for (let i = 0; i < seen.length; i += 1) {
    if (!seen[i]) continue
    data[i * 4 + 3] = 0
  }

  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer()
}

for (const asset of assets) {
  const padded = await sharp(path.join(dir, asset.file))
    .extract(asset.crop)
    .resize(1200, 1200, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer()

  const transparent = await removeConnectedWhite(padded)
  await sharp(transparent)
    .png({ compressionLevel: 9 })
    .toFile(path.join(dir, asset.out))
}