import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(root, 'public/images')

const MAX_EDGE = 1080
const WEBP_QUALITY = 82

async function collectPngFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'space') continue
      files.push(...(await collectPngFiles(fullPath)))
      continue
    }
    if (entry.name.toLowerCase().endsWith('.png')) files.push(fullPath)
  }

  return files.sort((a, b) => a.localeCompare(b))
}

async function main() {
  const pngFiles = await collectPngFiles(imagesDir)

  if (pngFiles.length === 0) {
    console.log('No menu PNG files to optimize.')
    return
  }

  let totalIn = 0
  let totalOut = 0

  for (const sourcePath of pngFiles) {
    const rel = path.relative(path.join(root, 'public'), sourcePath)
    const outPath = sourcePath.replace(/\.png$/i, '.webp')

    const inputStat = await stat(sourcePath)
    totalIn += inputStat.size

    const meta = await sharp(sourcePath).metadata()

    await sharp(sourcePath)
      .rotate()
      .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6, alphaQuality: 82 })
      .toFile(outPath)

    const outputStat = await stat(outPath)
    totalOut += outputStat.size

    await unlink(sourcePath)

    const outMeta = await sharp(outPath).metadata()
    console.log(
      rel,
      `${meta.width}x${meta.height} ${(inputStat.size / 1024).toFixed(1)} KB`,
      `→ ${(outputStat.size / 1024).toFixed(1)} KB (${outMeta.width}x${outMeta.height})`,
    )
  }

  console.log('')
  console.log(`Menu images: ${(totalIn / 1024 / 1024).toFixed(2)} MB → ${(totalOut / 1024 / 1024).toFixed(2)} MB`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
