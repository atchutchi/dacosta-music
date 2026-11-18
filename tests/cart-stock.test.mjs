import test from 'node:test'
import assert from 'node:assert/strict'
import {maxCartItemQuantity} from '../lib/cart-stock.ts'

const product={id:'akhet',stock_quantity:8,stock_by_size:{S:3,M:5}}
test('o carrinho limita a variante sem deixar outras linhas ultrapassar o stock global',()=>{
 const items=[{productId:'akhet',size:'S',color:'Black',quantity:3},{productId:'akhet',size:'M',color:'Black',quantity:5}]
 assert.equal(maxCartItemQuantity(product,items,items[0]),3)
 assert.equal(maxCartItemQuantity(product,items,items[1]),5)
 assert.equal(maxCartItemQuantity({...product,stock_quantity:6},items,items[0]),1)
})
test('cores diferentes não duplicam o inventário do tamanho e artigos inactivos não aumentam',()=>{
 const item={productId:'akhet',size:'S',color:'Black',quantity:1}
 assert.equal(maxCartItemQuantity(product,[item,{...item,color:'White',quantity:2}],item),1)
 assert.equal(maxCartItemQuantity({...product,active:false},[item],item),0)
})
