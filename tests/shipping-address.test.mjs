import test from 'node:test'
import assert from 'node:assert/strict'
import {checkoutBodySchema} from '../lib/validations/order.ts'

const payload={
 items:[{productId:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',quantity:1}],
 customer:{name:'Customer',email:'customer@example.com'},
 shipping:{name:'Customer',email:'customer@example.com',addressLine1:'Example street 1',city:'Dubai',country:'AE',postalCode:''},
 shippingMethod:'standard',subtotal:25,shippingCost:36.95,total:61.95,
}
test('permite concluir uma morada num país sem códigos postais e normaliza o ISO',()=>{
 const parsed=checkoutBodySchema.safeParse({...payload,shipping:{...payload.shipping,country:' ae '}})
 assert.equal(parsed.success,true)
 if(parsed.success)assert.equal(parsed.data.shipping.country,'AE')
})
test('exige o código postal nos países que o usam e rejeita países desconhecidos',()=>{
 assert.equal(checkoutBodySchema.safeParse({...payload,shipping:{...payload.shipping,country:'ZA'}}).success,false)
 assert.equal(checkoutBodySchema.safeParse({...payload,shipping:{...payload.shipping,country:'ZA',postalCode:'2001'}}).success,true)
 assert.equal(checkoutBodySchema.safeParse({...payload,shipping:{...payload.shipping,country:'ZZ'}}).success,false)
})
