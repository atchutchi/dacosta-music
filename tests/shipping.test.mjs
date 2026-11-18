import test from 'node:test'
import assert from 'node:assert/strict'
import {calculateShipping,SHIPPING_COUNTRIES} from '../lib/checkout-pricing.ts'

test('reconhece os países nas zonas comerciais aprovadas, sem portes gratuitos antigos',()=>{
 for(const [country,first,second] of [['NL',11.95,11.95],['BE',17.95,18.95],['DE',17.95,18.95],['PT',20.95,22.95],['IE',20.95,22.95],['HU',22.95,25.95],['GR',24.95,30.95],['GB',18.95,20.95],['CH',21.95,23.95],['ZA',32.95,39.95],['GW',36.95,44.95],['CA',32.95,39.95],['BR',36.95,44.95],['CN',36.95,44.95],['AE',36.95,44.95],['AU',36.95,44.95]]){
  assert.equal(calculateShipping(country,1000),first,country+' first band')
  assert.equal(calculateShipping(country,1001),second,country+' second band')
  assert.equal(calculateShipping(country,2000),second,country+' maximum band')
 }
})
test('os países seleccionáveis têm códigos únicos e incluem novos destinos de todos os continentes',()=>{
 const codes=SHIPPING_COUNTRIES.map(country=>country.code)
 assert.equal(new Set(codes).size,codes.length)
 for(const code of ['NL','PT','ZA','GW','AO','SN','NG','KE','CA','MX','JP','IN','AE','AU','NZ','US','PR'])assert.ok(codes.includes(code),code)
 assert.ok(codes.length>150)
})
test('peso acima de 2 kg e destinos sujeitos a cotação não recebem um preço automático',()=>{
 for(const country of ['US','PR','AQ','RU','BQ','BL','BM','KY','TC','AI','AW','CW','SX','CK'])assert.throws(()=>calculateShipping(country,500),/quote/i)
 assert.throws(()=>calculateShipping('PT',2001),/quote/i)
 for(const weight of [0,-1,NaN,Infinity,500.5])assert.throws(()=>calculateShipping('PT',weight),/weight/i)
 for(const country of ['ZZ','Portugal',''])assert.throws(()=>calculateShipping(country,500),/country/i)
})
test('territórios com formalidades específicas exigem cotação, mesmo com o país principal escolhido',()=>{
 for(const postalCode of ['35001','38001','51001','52001'])assert.throws(()=>calculateShipping('ES',500,postalCode),/quote/i)
 assert.throws(()=>calculateShipping('GB',500,'BT1 1AA'),/quote/i)
 assert.equal(calculateShipping('ES',500,'28001'),20.95)
 assert.equal(calculateShipping('GB',500,'SW1A 1AA'),18.95)
})
