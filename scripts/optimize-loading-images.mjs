import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'public/images/space')
const outDir = path.join(sourceDir, 'loading')

const MAX_EDGE = 1080
const WEBP_QUALITY = 82

async function main() {
  const entries = (await readdir(sourceDir))
    .filter((name) => name.toLowerCase().endsWith('.jpg'))
    .sort((a, b) => a.localeCompare(b))

  if (entries.length === 0) {
    throw new Error(`No JPG files found in ${sourceDir}`)
  }

  await mkdir(outDir, { recursive: true })

  let totalIn = 0
  let totalOut = 0

  for (const [index, name] of entries.entries()) {
    const sourcePath = path.join(sourceDir, name)
    const outName = `loading-${String(index + 1).padStart(2, '0')}.webp`
    const outPath = path.join(outDir, outName)

    const inputStat = await stat(sourcePath)
    totalIn += inputStat.size

    const meta = await sharp(sourcePath).metadata()

    await sharp(sourcePath)
      .rotate()
      .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outPath)

    const outputStat = await stat(outPath)
    totalOut += outputStat.size

    const outMeta = await sharp(outPath).metadata()
    console.log(
      `${name}`,
      `  ${meta.width}x${meta.height} ${(inputStat.size / 1024).toFixed(1)} KB`,
      `→ ${outName} ${outMeta.width}x${outMeta.height} ${(outputStat.size / 1024).toFixed(1)} KB`,
    )
  }

  console.log('')
  console.log(`Total: ${(totalIn / 1024).toFixed(1)} KB → ${(totalOut / 1024).toFixed(1)} KB`)
  console.log(`Output: public/images/space/loading/`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
