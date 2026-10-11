import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

const productId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
const orderId = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'

async function database(t, quantity = 2) {
  const db = new PGlite()
  t.after(() => db.close())
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE TABLE products (id uuid PRIMARY KEY, name text, active boolean DEFAULT true,
      stock_quantity integer CHECK (stock_quantity >= 0), sizes text[], colors text[]);
    CREATE TABLE orders (id uuid PRIMARY KEY, status text DEFAULT 'pending', payment_status text DEFAULT 'pending',
      total numeric, currency text DEFAULT 'EUR', payment_intent_id text);
    CREATE TABLE order_items (order_id uuid, product_id uuid, size text, color text, quantity integer);
  `)
  const migration = await readFile(new URL('../scripts/migrations/2026-10-11-merch-inventory.sql', import.meta.url), 'utf8')
  await db.exec(migration)
  await db.query(`INSERT INTO products(id,name,stock_quantity,sizes,colors,stock_by_size) VALUES ($1,'AKHET',100,ARRAY['XS','S','M','L','XL'],ARRAY['Black'],'{"XS":10,"S":10,"M":30,"L":30,"XL":20}')`, [productId])
  await db.query(`INSERT INTO orders(id,total) VALUES ($1,55.5)`, [orderId])
  await db.query(`INSERT INTO order_items VALUES ($1,$2,'XS','Black',$3)`, [orderId, productId, quantity])
  return db
}

test('reserva stock por tamanho uma única vez', async t => {
  const db = await database(t)
  await db.query(`SELECT apply_order_stock($1,'reserve')`, [orderId])
  await db.query(`SELECT apply_order_stock($1,'reserve')`, [orderId])
  const { rows } = await db.query(`SELECT stock_quantity,stock_by_size->>'XS' AS xs FROM products`)
  assert.deepEqual(rows, [{ stock_quantity: 98, xs: '8' }])
})
test('rejeita encomendas sem stock no tamanho e conserva o inventário', async t => {
  const db = await database(t, 11)
  await assert.rejects(db.query(`SELECT apply_order_stock($1,'reserve')`, [orderId]), /stock/i)
  const { rows } = await db.query(`SELECT stock_quantity FROM products`)
  assert.equal(rows[0].stock_quantity, 100)
})
test('liberta uma reserva expirada uma única vez', async t => {
  const db = await database(t)
  await db.query(`SELECT apply_order_stock($1,'reserve')`, [orderId])
  await db.query(`SELECT cancel_stripe_order($1,'cs_test_1')`, [orderId])
  // A sessão desconhecida não pode cancelar a encomenda.
  assert.equal((await db.query(`SELECT stock_quantity FROM products`)).rows[0].stock_quantity, 98)
  await db.query(`UPDATE orders SET stripe_checkout_session_id='cs_test_1' WHERE id=$1`, [orderId])
  await db.query(`SELECT cancel_stripe_order($1,'cs_test_1')`, [orderId])
  await db.query(`SELECT cancel_stripe_order($1,'cs_test_1')`, [orderId])
  assert.equal((await db.query(`SELECT stock_quantity FROM products`)).rows[0].stock_quantity, 100)
  assert.equal((await db.query(`SELECT payment_status FROM orders`)).rows[0].payment_status, 'failed')
})
test('confirmar ou repetir o webhook não desconta stock novamente', async t => {
  const db = await database(t)
  await db.query(`SELECT apply_order_stock($1,'reserve')`, [orderId])
  await db.query(`UPDATE orders SET stripe_checkout_session_id='cs_test_1' WHERE id=$1`, [orderId])
  await db.query(`SELECT complete_stripe_order($1,'cs_test_1','pi_test_1',5550,'eur')`, [orderId])
  const duplicate = await db.query(`SELECT complete_stripe_order($1,'cs_test_1','pi_test_1',5550,'eur') AS changed`, [orderId])
  assert.equal(duplicate.rows[0].changed, false)
  assert.equal((await db.query(`SELECT stock_quantity FROM products`)).rows[0].stock_quantity, 98)
  await db.query(`SELECT cancel_stripe_order($1,'cs_test_1')`, [orderId])
  assert.equal((await db.query(`SELECT stock_quantity FROM products`)).rows[0].stock_quantity, 98)
})
test('rejeita o pagamento com um montante diferente da encomenda', async t => {
  const db = await database(t)
  await db.query(`UPDATE orders SET stripe_checkout_session_id='cs_test_1' WHERE id=$1`, [orderId])
  await assert.rejects(db.query(`SELECT complete_stripe_order($1,'cs_test_1','pi_test_1',1,'eur')`, [orderId]), /amount|payment/i)
  assert.equal((await db.query(`SELECT payment_status FROM orders`)).rows[0].payment_status, 'pending')
})
test('visitantes e utilizadores normais não podem executar as operações de stock', async t => {
  const db = await database(t)
  const { rows } = await db.query(`SELECT has_function_privilege('anon','apply_order_stock(uuid,text)','EXECUTE') AS anon,
    has_function_privilege('authenticated','complete_stripe_order(uuid,text,text,bigint,text)','EXECUTE') AS authenticated`)
  assert.deepEqual(rows, [{ anon: false, authenticated: false }])
})

test('o catálogo rejeita totais incoerentes e tamanhos sem inventário', async t => {
  const db = await database(t)
  await assert.rejects(db.query('UPDATE products SET stock_quantity=999'), /products_size_stock_consistent/)
  await assert.rejects(db.query("UPDATE products SET sizes=ARRAY['XS']"), /products_size_stock_consistent/)
  await assert.rejects(db.query("UPDATE products SET stock_by_size=jsonb_set(stock_by_size,ARRAY['XS'],'-1')"), /products_size_stock_consistent/)
  assert.equal((await db.query('SELECT stock_quantity FROM products')).rows[0].stock_quantity, 100)
})
