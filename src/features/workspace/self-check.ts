import { strict as assert } from 'node:assert'
import { clampPanel } from './layout'

const clamped = clampPanel({ x: 9999, y: -40, width: 800, height: 900, open: true }, 1024, 768)
assert.equal(clamped.width, 560)
assert.equal(clamped.height, 720)
assert.equal(clamped.x, 452)
assert.equal(clamped.y, 12)

const mobile = clampPanel({ x: 0, y: 0, width: 360, height: 520, open: true }, 320, 640)
assert.equal(mobile.width, 300)
assert.equal(mobile.x, 12)

console.log('workspace self-check passed')
