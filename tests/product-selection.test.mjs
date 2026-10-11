import test from 'node:test'
import assert from 'node:assert/strict'
import { findProductBySlug, availableStock } from '../lib/product-selection.ts'

const product = { id: 'akhet', slug: 'akhet-ade-2026', stock_quantity: 100, stock_by_size: { XS: 10, M: 30 } }
test('um endereço incompleto não apresenta outro produto', () => {
  assert.equal(findProductBySlug([product], 'akhet'), null)
})
test('a quantidade apresentada corresponde ao tamanho seleccionado', () => {
  assert.equal(availableStock(product, 'XS'), 10)
  assert.equal(availableStock(product, 'M'), 30)
  assert.equal(availableStock(product, 'XL'), 0)
})
test('produtos anteriores continuam a usar o stock total', () => {
  assert.equal(availableStock({ ...product, stock_by_size: null }, 'XS'), 100)
})
