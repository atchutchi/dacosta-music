import test from 'node:test'
import assert from 'node:assert/strict'
import { quoteCheckout, checkoutTotalsMatch } from '../lib/checkout-pricing.ts'

const product = {
  id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', name: 'T-shirt', slug: 'akhet-ade-2026-limited-edition-oversized-t-shirt', price: 25,
  active: true, sizes: ['XS', 'M'], colors: ['Black'], stock_quantity: 100,
  stock_by_size: { XS: 10, M: 30 },
}
const item = { productId: product.id, quantity: 2, size: 'XS', color: 'Black' }

test('recalcula o catálogo, o peso embalado e os portes sem confiar em preços do browser', () => {
  const quote=quoteCheckout([item], [product], 'PT', 'standard')
  assert.equal(quote.subtotal,50)
  assert.equal(quote.shippingCost,20.95)
  assert.equal(quote.total,70.95)
  assert.equal(quote.currency,'EUR')
  assert.equal(quote.shipping.weightGrams,830)
  assert.equal(quote.shipping.zoneId,'euWest')
})
test('não permite ultrapassar o stock de um tamanho com linhas repetidas', () => {
  assert.throws(() => quoteCheckout([{ ...item, quantity: 6 }, { ...item, quantity: 5 }], [product], 'PT', 'standard'), /stock/i)
})
test('rejeita produtos inexistentes ou inactivos', () => {
  assert.throws(() => quoteCheckout([item], [], 'PT', 'standard'), /product/i)
  assert.throws(() => quoteCheckout([item], [{ ...product, active: false }], 'PT', 'standard'), /product/i)
})
test('rejeita tamanhos que não pertencem ao produto', () => {
  assert.throws(() => quoteCheckout([{ ...item, size: 'XL' }], [product], 'PT', 'standard'), /size/i)
})
test('rejeita métodos e países não suportados', () => {
  assert.throws(() => quoteCheckout([item], [product], 'Portugal', 'standard'), /country/i)
  assert.throws(() => quoteCheckout([item], [product], 'PT', 'free'), /shipping/i)
})
test('soma a embalagem uma vez, muda de escalão e nunca reutiliza portes grátis antigos', () => {
  const three=quoteCheckout([{ ...item, quantity: 3 }], [product], 'PT', 'standard')
  assert.equal(three.shipping.weightGrams,1230)
  assert.equal(three.shippingCost,22.95)
  assert.equal(three.total,97.95)
  assert.equal(quoteCheckout([{ ...item, quantity: 4 }], [product], 'PT', 'standard').total,122.95)
  assert.throws(()=>quoteCheckout([{ ...item,quantity:5 }],[product],'PT','standard'),/quote/i)
})
test('um carrinho misto usa os pesos dos dois modelos e mantém os cêntimos exactos',()=>{
 const caiiro={...product,id:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',slug:'caiiro-london-2025-limited-edition-oversized-t-shirt',price:40}
 const quote=quoteCheckout([{...item,quantity:1},{...item,productId:caiiro.id,quantity:1}],[product,caiiro],'ZA','standard')
 assert.equal(quote.shipping.weightGrams,830)
 assert.equal(quote.subtotal,65)
 assert.equal(quote.total,97.95)
 assert.equal(quote.shippingCost,32.95)
 assert.equal(checkoutTotalsMatch(quote,{subtotal:65,shippingCost:32.95,total:97.95}),true)
 assert.equal(checkoutTotalsMatch(quote,{subtotal:65,shippingCost:0,total:65}),false)
 assert.equal(checkoutTotalsMatch(quote,{subtotal:0,shippingCost:32.95,total:32.95}),false)
})
test('artigos sem peso configurado exigem cotação em vez de assumir que pesam zero',()=>{
 assert.throws(()=>quoteCheckout([item],[{...product,slug:'new-unknown-product'}],'PT','standard'),/quote/i)
})
