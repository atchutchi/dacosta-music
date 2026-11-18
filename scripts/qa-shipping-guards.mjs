// Apenas pedidos que têm de ser rejeitados antes de criar clientes ou encomendas.
import assert from 'node:assert/strict'

const base = process.argv[2] || 'http://127.0.0.1:3010'
const csrf = await fetch(base+'/api/csrf')
const token = csrf.headers.get('set-cookie')?.match(/csrf_token=([^;]+)/)?.[1]
assert.ok(token,'CSRF cookie missing')
const catalogue = await fetch(base+'/api/products?slug=akhet-ade-2026-limited-edition-oversized-t-shirt').then(r=>r.json())
const product = catalogue.products?.[0]
assert.ok(product,'AKHET missing')
const address = {name:'Shipping QA',email:'qa@example.invalid',phone:'+221 770000000',addressLine1:'QA address',city:'QA city',country:'PT',postalCode:'1000-001'}
const body = {items:[{productId:product.id,size:'M',color:'Black',quantity:1}],customer:{name:address.name,email:address.email},shipping:address,shippingMethod:'standard',paymentMethod:'stripe',subtotal:0,shippingCost:0,total:0}
const headers = {'content-type':'application/json',cookie:'csrf_token='+token,'x-csrf-token':decodeURIComponent(token),origin:base}
for (const [name,changes,status,pattern] of [
  ['tampered totals',{},409,/total has changed/i],
  ['US quote',{shipping:{...address,country:'US'}},400,/quote/i],
  ['over 2 kg',{items:[{...body.items[0],quantity:5}]},400,/quote/i],
  ['legacy courier',{shippingMethod:'dhl'},400,/shipping method/i],
  ['unknown country',{shipping:{...address,country:'ZZ'}},400,/invalid checkout/i],
]) {
  const response = await fetch(base+'/api/checkout/stripe',{method:'POST',headers,body:JSON.stringify({...body,...changes})})
  const result = await response.json()
  assert.equal(response.status,status,name)
  assert.match(result.error,pattern,name)
  assert.ok(!result.url && !result.orderId,name+' must not create checkout')
  console.log(JSON.stringify({scenario:name,status:response.status,passed:true}))
}
const paypal = await fetch(base+'/api/checkout/paypal',{method:'POST',headers,body:'{}'})
assert.equal(paypal.status,503,'Legacy PayPal must not bypass price validation')
console.log(JSON.stringify({scenario:'legacy PayPal disabled',status:paypal.status,passed:true}))
