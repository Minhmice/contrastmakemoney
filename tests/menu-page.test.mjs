import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { after, before, test } from 'node:test'
import { chromium } from 'playwright'

const HOST = '127.0.0.1'
const PORT = 4317
const BASE_URL = `http://${HOST}:${PORT}`

let browser
let server

function parseColor(value) {
  const channels = value.match(/[\d.]+/g)?.map(Number) ?? []
  return {
    r: channels[0] ?? 0,
    g: channels[1] ?? 0,
    b: channels[2] ?? 0,
    a: channels[3] ?? 1,
  }
}

function relativeLuminance({ r, g, b }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrastRatio(foregroundValue, backgroundValue) {
  const foreground = parseColor(foregroundValue)
  const background = parseColor(backgroundValue)
  const composite = {
    r: foreground.r * foreground.a + background.r * (1 - foreground.a),
    g: foreground.g * foreground.a + background.g * (1 - foreground.a),
    b: foreground.b * foreground.a + background.b * (1 - foreground.a),
  }
  const lighter = Math.max(relativeLuminance(composite), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(composite), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

async function waitForServer() {
  const deadline = Date.now() + 20_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL)
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error(`Vite did not start at ${BASE_URL}`)
}

before(async () => {
  server = spawn(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      '--host',
      HOST,
      '--port',
      String(PORT),
      '--strictPort',
    ],
    {
      cwd: process.cwd(),
      stdio: 'ignore',
      windowsHide: true,
    },
  )

  await waitForServer()
  browser = await chromium.launch({ headless: true })
})

after(async () => {
  await browser?.close()
  server?.kill()
})

test('the /menu route renders a dedicated, honest utility page', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE_URL}/menu`)

  const main = page.locator('main')
  assert.match((await main.getAttribute('class')) ?? '', /menu-page/)
  assert.equal(await page.title(), 'Menu — Contrast Coffee')
  assert.equal(await page.getByRole('heading', { level: 1 }).textContent(), 'MENU')
  assert.equal(await page.getByRole('navigation', { name: 'Danh mục menu' }).count(), 1)
  assert.equal(
    await page.getByText('DỮ LIỆU MENU ĐANG CHỜ XÁC MINH', { exact: true }).count(),
    1,
  )
  assert.equal(await page.getByText('[GIÁ VERIFIED]', { exact: true }).count(), 0)
  assert.ok((await page.getByText('[GIÁ CHỜ XÁC MINH]', { exact: true }).count()) > 0)

  await page.close()
})

test('the mobile first viewport contains the menu sheet and keeps red-field copy accessible', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(`${BASE_URL}/menu`)

  const sheet = await page.locator('.menu-hero__sheet').boundingBox()
  assert.ok(sheet && sheet.y < 844 && sheet.y + sheet.height <= 844, 'expected red sheet inside first viewport')

  const colors = await page.locator('.menu-verification p').evaluate((paragraph) => ({
    foreground: getComputedStyle(paragraph).color,
    background: getComputedStyle(paragraph.parentElement).backgroundColor,
  }))
  assert.ok(
    contrastRatio(colors.foreground, colors.background) >= 4.5,
    `expected WCAG AA contrast, got ${contrastRatio(colors.foreground, colors.background)}`,
  )

  await page.close()
})

test('the homepage menu action points to the dedicated route', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE_URL)

  const menuAction = page.getByRole('link', { name: /XEM MENU/ }).first()
  assert.equal(await menuAction.getAttribute('href'), '/menu')

  await page.close()
})

test('route-scoped menu styles do not change homepage menu row structure', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE_URL)

  const columns = await page.locator('#menu .menu-item').first().evaluate((row) =>
    getComputedStyle(row)
      .gridTemplateColumns.split(' ')
      .filter(Boolean),
  )
  assert.equal(columns.length, 4)

  await page.close()
})

test('the shared Contrast logo resolves to a real asset', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE_URL)

  const logo = page.getByRole('img', { name: 'Contrast Coffee' }).first()
  assert.equal(
    await logo.evaluate((image) => image.complete && image.naturalWidth > 0),
    true,
  )

  await page.close()
})

test('cross-route location links reveal the requested homepage section', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(`${BASE_URL}/menu`)
  await page.getByRole('banner').getByRole('link', { name: 'TÌM CƠ SỞ' }).click()
  await page.waitForURL(`${BASE_URL}/#locations`)

  const sectionTop = await page
    .locator('#locations')
    .evaluate((section) => section.getBoundingClientRect().top)
  assert.ok(
    sectionTop >= 0 && sectionTop < 120,
    `expected locations near viewport top, got ${sectionTop}`,
  )

  await page.close()
})
