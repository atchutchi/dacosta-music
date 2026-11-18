import test from 'node:test'
import assert from 'node:assert/strict'
import {getContactContext} from '../lib/contact-context.ts'

test('preserva o artista escolhido no pedido de booking',()=>{
 assert.deepEqual(getContactContext('?artist=caiiro'),{subject:'booking',artists:['Caiiro'],message:''})
 assert.equal(getContactContext('?artist=dacapo').artists[0],'Da Capo')
})
test('preserva o serviço escolhido sem aceitar texto arbitrário do URL',()=>{
 assert.match(getContactContext('?service=travel-logistics').message,/Travel & Logistics Management/)
 assert.equal(getContactContext('?service=unknown'),null)
 assert.equal(getContactContext('?artist=unknown'),null)
 assert.equal(getContactContext('?artist=constructor'),null)
 assert.equal(getContactContext('?service=__proto__'),null)
 assert.equal(getContactContext(''),null)
})
