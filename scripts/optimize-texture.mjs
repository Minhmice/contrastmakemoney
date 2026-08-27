import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'public/_source/white-abstract-texture-background.jpg')
const outDir = path.join(root, 'public/texture')

async function main() {
  await stat(source).catch(() => {
    throw new Error(
      'Missing source file. Copy the original JPG to public/_source/white-abstract-texture-background.jpg then rerun npm run optimize:texture.',
    )
  })

  await mkdir(outDir, { recursive: true })

  const pipeline = sharp(source).rotate().resize(2048, 2048, {
    fit: 'cover',
    withoutEnlargement: true,
  })

  await pipeline.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(outDir, 'paper-texture.webp'))
  await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, 'paper-texture.jpg'))

  const [webp, jpeg] = await Promise.all([
    stat(path.join(outDir, 'paper-texture.webp')),
    stat(path.join(outDir, 'paper-texture.jpg')),
  ])

  console.log(`paper-texture.webp  ${(webp.size / 1024).toFixed(1)} KB`)
  console.log(`paper-texture.jpg   ${(jpeg.size / 1024).toFixed(1)} KB`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
