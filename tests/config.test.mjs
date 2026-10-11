import test from 'node:test'
import assert from 'node:assert/strict'

test('a configuração pública não inclui o segredo CSRF', async () => {
  process.env.CSRF_SECRET = 'local-regression-test-secret'
  const { default: config } = await import('../next.config.mjs')
  assert.equal(Object.hasOwn(config.env ?? {}, 'CSRF_SECRET'), false)
  delete process.env.CSRF_SECRET
})
