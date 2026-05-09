import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = 'public/products/ingredients'
const useCutouts = process.argv.includes('--cutouts')
const files = fs.readdirSync(dir)
  .filter((file) => useCutouts ? file.endsWith('-cutout.png') : file.endsWith('.webp'))
  .sort()

const thumbs = []
for (const file of files) {
  const label = Buffer.from(`
    <svg width="220" height="34" xmlns="http://www.w3.org/2000/svg">
      <text x="110" y="23" text-anchor="middle" font-family="Arial" font-size="13" fill="#732C3F">${file}</text>
    </svg>
  `)

  const thumb = await sharp(path.join(dir, file))
    .resize(220, 220, { fit: 'contain', background: '#f7e8ec' })
    .extend({ top: 34, bottom: 10, left: 0, right: 0, background: '#f7e8ec' })
    .composite([{ input: label, top: 0, left: 0 }])
    .png()
    .toBuffer()

  thumbs.push(thumb)
}

await sharp({
  create: {
    width: 440,
    height: Math.ceil(files.length / 2) * 264,
    channels: 4,
    background: '#f7e8ec',
  },
})
  .composite(thumbs.map((input, i) => ({
    input,
    left: (i % 2) * 220,
    top: Math.floor(i / 2) * 264,
  })))
  .png()
  .toFile(path.join(dir, useCutouts ? 'cutout-contact-sheet.png' : 'contact-sheet.png'))
