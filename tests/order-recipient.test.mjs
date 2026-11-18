import test from 'node:test'
import assert from 'node:assert/strict'
import { paidOrderRecipient } from '../lib/order-notifications.ts'

test('a confirmação da compra usa o comprador mesmo quando a entrega é para outra pessoa',()=>{
 const customer={name:'Buyer',email:'buyer@example.invalid'}
 assert.deepEqual(paidOrderRecipient(customer),{customerName:'Buyer',customerEmail:'buyer@example.invalid'})
})
test('sem comprador identificado não se envia a confirmação para um destinatário alternativo',()=>{
 assert.throws(()=>paidOrderRecipient(null),/buyer/i)
 assert.throws(()=>paidOrderRecipient({name:'Buyer',email:''}),/buyer/i)
})
