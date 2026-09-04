import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8')
const marker = 'WORKSPACE ROUTE (Controlled Focus / Focus Desk)'
const workspace = css.slice(css.indexOf(marker))

test('workspace motion avoids broad and paint-heavy transitions', () => {
  assert.doesNotMatch(workspace, /transition\s*:\s*all\b/)
  assert.doesNotMatch(workspace, /transition\s*:[^;]*(?:filter|backdrop-filter|box-shadow)/)
})

test('workspace defines a reduced-motion policy', () => {
  assert.match(workspace, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
})
