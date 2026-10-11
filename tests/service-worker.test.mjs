import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')
function intercept(path, mode = 'cors') {
  let handler
  let handled = false
  const context = vm.createContext({
    URL, console, location: { origin: 'https://example.com' },
    fetch: async () => ({ ok: true, clone: () => ({}) }),
    caches: { match: async () => undefined, open: async () => ({ match: async () => undefined, put: async () => undefined }) },
    self: { addEventListener: (name, callback) => { if (name === 'fetch') handler = callback } },
  })
  vm.runInContext(source, context)
  handler({ request: { url: `https://example.com${path}`, method: 'GET', mode, headers: { get: () => null } }, respondWith: () => { handled = true } })
  return handled
}
test('o service worker não guarda respostas de encomendas nem tokens CSRF', () => {
  assert.equal(intercept('/api/orders/example'), false)
  assert.equal(intercept('/api/csrf'), false)
})
test('a navegação recebe páginas actuais sem reutilizar HTML com nonce antigo', () => {
  assert.equal(intercept('/shop', 'navigate'), false)
})
