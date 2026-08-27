import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/textures')
const size = 512

function hashNoise(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function sampleNoise(x, y) {
  return (
    hashNoise(x, y) * 0.55 +
    hashNoise(x * 2.03, y * 1.97) * 0.28 +
    hashNoise(x * 4.11, y * 3.89) * 0.17
  )
}

const buf = Buffer.alloc(size * size * 4)

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4
    const n = sampleNoise(x * 0.11, y * 0.11)
    const tone = Math.round(118 + (n - 0.5) * 118)

    buf[i] = tone
    buf[i + 1] = tone
    buf[i + 2] = tone
    buf[i + 3] = 255
  }
}

await mkdir(outDir, { recursive: true })

await sharp(buf, { raw: { width: size, height: size, channels: 4 } })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(path.join(outDir, 'noise.png'))

console.log('Generated film grain tile at public/textures/noise.png')
