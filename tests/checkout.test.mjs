import test from 'node:test'
import assert from 'node:assert/strict'
import { quoteCheckout } from '../lib/checkout-pricing.ts'

const product = {
  id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', name: 'T-shirt', price: 25,
  active: true, sizes: ['XS', 'M'], colors: ['Black'], stock_quantity: 100,
  stock_by_size: { XS: 10, M: 30 },
}
const item = { productId: product.id, quantity: 2, size: 'XS', color: 'Black' }

test('recalcula o total com o preço do catálogo e os portes existentes', () => {
  assert.deepEqual(quoteCheckout([item], [product], 'PT', 'manual'), {
    subtotal: 50, shippingCost: 5.5, total: 55.5, currency: 'EUR',
  })
})
test('não permite ultrapassar o stock de um tamanho com linhas repetidas', () => {
  assert.throws(() => quoteCheckout([{ ...item, quantity: 6 }, { ...item, quantity: 5 }], [product], 'PT', 'manual'), /stock/i)
})
test('rejeita produtos inexistentes ou inactivos', () => {
  assert.throws(() => quoteCheckout([item], [], 'PT', 'manual'), /product/i)
  assert.throws(() => quoteCheckout([item], [{ ...product, active: false }], 'PT', 'manual'), /product/i)
})
test('rejeita tamanhos que não pertencem ao produto', () => {
  assert.throws(() => quoteCheckout([{ ...item, size: 'XL' }], [product], 'PT', 'manual'), /size/i)
})
test('rejeita métodos e países não suportados', () => {
  assert.throws(() => quoteCheckout([item], [product], 'Portugal', 'manual'), /country/i)
  assert.throws(() => quoteCheckout([item], [product], 'PT', 'free'), /shipping/i)
})
test('aplica a regra existente de portes grátis apenas acima de 100 euros em Portugal', () => {
  assert.equal(quoteCheckout([{ ...item, size: 'M', quantity: 4 }], [product], 'PT', 'manual').total, 105.5)
  assert.equal(quoteCheckout([{ ...item, size: 'M', quantity: 5 }], [product], 'PT', 'manual').total, 125)
  assert.equal(quoteCheckout([{ ...item, size: 'M', quantity: 5 }], [product], 'NL', 'manual').total, 137.5)
})
