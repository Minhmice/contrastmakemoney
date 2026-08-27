import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/texture')
const size = 2048

function hashNoise(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function sampleNoise(x, y) {
  return (
    hashNoise(x, y) * 0.52 +
    hashNoise(x * 2.07, y * 2.11) * 0.27 +
    hashNoise(x * 4.13, y * 3.97) * 0.14 +
    (Math.random() - 0.5) * 0.07
  )
}

const buf = Buffer.alloc(size * size * 3)

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 3
    const n = sampleNoise(x * 0.024, y * 0.024)
    const tone = 231 + (n - 0.5) * 34

    buf[i] = Math.min(252, Math.max(206, tone - 1))
    buf[i + 1] = Math.min(250, Math.max(204, tone))
    buf[i + 2] = Math.min(246, Math.max(200, tone - 4))
  }
}

await mkdir(outDir, { recursive: true })

const pipeline = sharp(buf, { raw: { width: size, height: size, channels: 3 } })
  .blur(0.8)
  .modulate({ brightness: 1.02, saturation: 0.55 })

await pipeline.clone().webp({ quality: 86, effort: 6 }).toFile(path.join(outDir, 'paper-texture.webp'))
await pipeline.clone().jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(outDir, 'paper-texture.jpg'))

console.log('Generated visible paper texture in public/texture/')
