import path from 'node:path'
import sharp from 'sharp'

const dir = 'public/products/ingredients'

const assets = [
  {
    file: 'adenosine.webp',
    out: 'adenosine-cutout.png',
    crop: { left: 630, top: 110, width: 270, height: 620 },
    masks: [],
  },
  {
    file: 'allantoin.webp',
    out: 'allantoin-cutout.png',
    crop: { left: 205, top: 245, width: 590, height: 360 },
    masks: [],
  },
  {
    file: 'biosaccharide.webp',
    out: 'biosaccharide-cutout.png',
    crop: { left: 210, top: 65, width: 610, height: 515 },
    masks: [],
  },
  {
    file: 'botanical-complex.webp',
    out: 'botanical-complex-cutout.png',
    crop: { left: 20, top: 170, width: 610, height: 470 },
    masks: [],
  },
  {
    file: 'centella-asiatica.webp',
    out: 'centella-asiatica-cutout.png',
    crop: { left: 0, top: 170, width: 405, height: 560 },
    masks: [],
  },
  {
    file: 'hyaluronic-acid.webp',
    out: 'hyaluronic-acid-cutout.png',
    crop: { left: 235, top: 45, width: 535, height: 485 },
    masks: [],
  },
  {
    file: 'niacinamide.webp',
    out: 'niacinamide-cutout.png',
    crop: { left: 185, top: 120, width: 640, height: 350 },
    masks: [],
  },
  {
    file: 'panthenol.webp',
    out: 'panthenol-cutout.png',
    crop: { left: 235, top: 0, width: 530, height: 510 },
    masks: [],
  },
]

function isBackground(pixel, background) {
  const [r, g, b] = pixel
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max - min
  const distance = Math.hypot(r - background[0], g - background[1], b - background[2])

  return (
    (r > 236 && g > 236 && b > 236) ||
    (distance < 42 && max > 214 && saturation < 42)
  )
}

function estimateBackground(data, width, height) {
  const samples = []
  for (let x = 0; x < width; x += 20) {
    for (const y of [0, height - 1]) {
      const idx = (y * width + x) * 4
      samples.push([data[idx], data[idx + 1], data[idx + 2]])
    }
  }
  for (let y = 0; y < height; y += 20) {
    for (const x of [0, width - 1]) {
      const idx = (y * width + x) * 4
      samples.push([data[idx], data[idx + 1], data[idx + 2]])
    }
  }
  return [0, 1, 2].map((channel) => {
    const values = samples.map((sample) => sample[channel]).sort((a, b) => a - b)
    return values[Math.floor(values.length * 0.75)]
  })
}

async function removeConnectedBackground(inputBuffer) {
  const image = sharp(inputBuffer).ensureAlpha()
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const background = estimateBackground(data, width, height)
  const seen = new Uint8Array(width * height)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const offset = y * width + x
    if (seen[offset]) return
    const idx = offset * 4
    if (!isBackground([data[idx], data[idx + 1], data[idx + 2]], background)) return
    seen[offset] = 1
    queue.push([x, y])
  }

  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }

  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  for (let i = 0; i < seen.length; i++) {
    if (!seen[i]) continue
    data[i * 4 + 3] = 0
  }

  return sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer()
}

for (const asset of assets) {
  const input = path.join(dir, asset.file)
  let pipeline = sharp(input)
  if (asset.crop) {
    pipeline = pipeline.extract(asset.crop)
  }

  if (asset.masks.length) {
    const overlay = Buffer.from(`
      <svg width="${asset.crop?.width ?? 1000}" height="${asset.crop?.height ?? 1000}" xmlns="http://www.w3.org/2000/svg">
        <filter id="soften">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <g filter="url(#soften)">${asset.masks.join('')}</g>
      </svg>
    `)
    pipeline = pipeline.composite([{ input: overlay, top: 0, left: 0 }])
  }

  const labelCleaned = await pipeline.png().toBuffer()

  const cutout = await removeConnectedBackground(labelCleaned)
  await sharp(cutout)
    .resize(1000, 1000, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(dir, asset.out))
}
