import test from 'node:test'
import assert from 'node:assert/strict'
import { stripeCheckoutAvailable } from '../lib/stripe-checkout-availability.ts'

test('pagamentos de teste nunca são apresentados como pagamentos reais em produção', () => {
  assert.equal(stripeCheckoutAvailable('sk_test_fixture','production'),false)
  assert.equal(stripeCheckoutAvailable('rk_test_fixture','production'),false)
  assert.equal(stripeCheckoutAvailable('sk_live_fixture','production'),true)
  assert.equal(stripeCheckoutAvailable('rk_live_fixture','production'),true)
})
test('uma configuração ausente falha fechada e o ambiente local permite testes', () => {
  assert.equal(stripeCheckoutAvailable(undefined,'production'),false)
  assert.equal(stripeCheckoutAvailable('unconfigured','production'),false)
  assert.equal(stripeCheckoutAvailable('sk_test_fixture',undefined),true)
})
