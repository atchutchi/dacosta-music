import test from 'node:test'
import assert from 'node:assert/strict'
import { createMetaPixel } from '../lib/meta-pixel.ts'

function fixture() {
  const scripts = []
  const win = {}
  const doc = {
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  }
  return { scripts, win, pixel: createMetaPixel(win, doc, 'test-nonce') }
}
test('não carrega o Pixel nem envia eventos antes do consentimento', () => {
  const { pixel, scripts, win } = fixture()
  pixel.pageView('/shop')
  assert.equal(scripts.length, 0)
  assert.equal(win.fbq, undefined)
})
test('carrega uma vez com nonce e evita PageView duplicado na mesma página', () => {
  const { pixel, scripts, win } = fixture()
  pixel.consent(true)
  pixel.pageView('/shop')
  pixel.pageView('/shop')
  pixel.pageView('/shop/cart')
  assert.equal(scripts.length, 1)
  assert.equal(scripts[0].nonce, 'test-nonce')
  assert.equal(scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js')
  assert.deepEqual(win.fbq.queue.map(args => Array.from(args)), [
    ['consent', 'grant'], ['init', '834660132483518'],
    ['track', 'PageView'], ['track', 'PageView'],
  ])
})
test('revogar o consentimento interrompe eventos e permite uma aceitação posterior', () => {
  const { pixel, win, scripts } = fixture()
  pixel.consent(true)
  pixel.pageView('/shop')
  pixel.consent(false)
  pixel.pageView('/shop/cart')
  assert.equal(win.fbq.queue.filter(args => args[0] === 'track').length, 1)
  pixel.consent(true)
  pixel.pageView('/shop/cart')
  assert.equal(win.fbq.queue.filter(args => args[0] === 'track').length, 2)
  assert.equal(scripts.length, 1)
})
test('as páginas de administração não enviam PageView', () => {
  const { pixel, scripts } = fixture()
  pixel.consent(true)
  pixel.pageView('/admin/shop')
  assert.equal(scripts.length, 0)
})
