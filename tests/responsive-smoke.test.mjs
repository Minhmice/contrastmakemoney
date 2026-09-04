import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { after, before, test } from 'node:test'
import { chromium } from 'playwright'

const HOST = '127.0.0.1'
const PORT = 4318
let baseUrl = `http://${HOST}:${PORT}`
const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 375, height: 667 },
  { width: 768, height: 900 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]
const ROUTES = ['/', '/auth', '/menu', '/space', '/profile', '/workspace', '/staff/check-in']

let browser
let server

async function waitForServer() {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    try {
      if ((await fetch(baseUrl)).ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`Next did not start at ${baseUrl}`)
}

before(async () => {
  try {
    const response = await fetch('http://127.0.0.1:3000')
    if (response.ok) baseUrl = 'http://127.0.0.1:3000'
  } catch {}

  if (baseUrl.endsWith(`:${PORT}`)) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', HOST, '--port', String(PORT)], {
      cwd: process.cwd(),
      stdio: 'ignore',
      windowsHide: true,
    })
    await waitForServer()
  }

  browser = await chromium.launch({ headless: true })
})

after(async () => {
  await browser?.close()
  server?.kill()
})

for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    test(`${route} stays inside viewport at ${viewport.width}px`, async () => {
      const page = await browser.newPage({ viewport })
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      assert.ok(
        dimensions.scrollWidth <= dimensions.clientWidth + 1,
        `${route} creates document overflow: ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`,
      )
      await page.close()
    })
  }
}

test('/menu keeps horizontal journey inside scene', async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } })
  await page.goto(`${baseUrl}/menu`, { waitUntil: 'networkidle' })
  const layout = await page.evaluate(() => {
    const scene = document.querySelector('.menu-horizontal-scene')?.getBoundingClientRect()
    const nav = document.querySelector('.menu-journey-nav')?.getBoundingClientRect()
    const heading = document.querySelector('.menu-chapter__head h2')?.getBoundingClientRect()
    return { scene, nav, heading }
  })
  assert.ok(layout.scene && layout.scene.height > 0, 'menu scene missing')
  assert.ok(layout.nav && layout.nav.top >= 0 && layout.nav.bottom <= 667, 'menu category index escapes viewport')
  assert.ok(layout.heading && layout.heading.height > 0, 'menu heading is clipped')
  await page.close()
})

test('/workspace keeps focus controls and panels inside scene', async () => {
  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage({ viewport })
    await page.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' })
    const layout = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth
      const viewportHeight = document.documentElement.clientHeight
      const clock = document.querySelector('.workspace-clock')?.getBoundingClientRect()
      const panel = document.querySelector('#workspace-task-panel')?.getBoundingClientRect()
      const toolTrigger = document.querySelector('.workspace-tool-trigger')?.getBoundingClientRect()
      return { viewportWidth, viewportHeight, clock, panel, toolTrigger }
    })
    assert.ok(layout.clock && layout.clock.width > 0 && layout.clock.height > 0, `workspace clock missing at ${viewport.width}px`)
    assert.ok(layout.clock.left >= -1 && layout.clock.right <= layout.viewportWidth + 1, `workspace clock escapes horizontally at ${viewport.width}px`)
    if (layout.panel) {
      assert.ok(layout.panel.left >= -1 && layout.panel.right <= layout.viewportWidth + 1, `workspace panel escapes horizontally at ${viewport.width}px`)
      assert.ok(layout.panel.top >= -1 && layout.panel.bottom <= layout.viewportHeight + 1, `workspace panel escapes vertically at ${viewport.width}px`)
    }
    assert.ok(layout.toolTrigger && layout.toolTrigger.width >= 44 && layout.toolTrigger.height >= 44, `tool trigger missing at ${viewport.width}px`)
    assert.ok(layout.toolTrigger.left >= 0 && layout.toolTrigger.bottom <= layout.viewportHeight, `tool trigger escapes at ${viewport.width}px`)
    await page.close()
  }
})

test('/workspace mobile tools open a full-width bottom sheet', async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } })
  await page.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Công cụ' }).click()
  await page.locator('#workspace-tool-menu').getByRole('button', { name: 'Ghi chú' }).click()
  const sheet = await page.locator('#workspace-notes-panel').evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return { left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width }
  })
  assert.ok(Math.abs(sheet.left) <= 1 && Math.abs(sheet.right - 375) <= 1, 'workspace bottom sheet is not full width')
  assert.ok(Math.abs(sheet.bottom - 667) <= 1, 'workspace bottom sheet is not anchored to bottom')
  await page.close()
})

test('long Vietnamese menu title wraps without clipping', async () => {
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } })
  await page.goto(`${baseUrl}/menu`, { waitUntil: 'networkidle' })
  const result = await page.locator('.menu-chapter__head h2').first().evaluate((heading) => {
    heading.textContent = 'CÀ PHÊ SỮA ĐÁ ĐẶC BIỆT THƠM NGON'
    const { clientHeight, scrollHeight, clientWidth, scrollWidth } = heading
    return { clientHeight, scrollHeight, clientWidth, scrollWidth }
  })
  assert.ok(result.scrollHeight <= result.clientHeight + 1, 'Vietnamese heading clips vertically')
  assert.ok(result.scrollWidth <= result.clientWidth + 1, 'Vietnamese heading clips horizontally')
  await page.close()
})

test('/workspace exposes focus state without moving controls', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' })
  const root = page.locator('.workspace-page')
  assert.equal(await root.getAttribute('data-status'), 'idle')
  await page.getByRole('button', { name: 'Bắt đầu' }).click()
  assert.equal(await root.getAttribute('data-status'), 'running')
  await page.getByRole('button', { name: 'Tạm dừng' }).click()
  assert.equal(await root.getAttribute('data-status'), 'idle')
  await page.close()
})

