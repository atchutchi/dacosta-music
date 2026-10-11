import nextEnv from '@next/env'
import pg from 'pg'
import { readFile, mkdir, writeFile } from 'node:fs/promises'

nextEnv.loadEnvConfig(process.cwd())
const mode = process.argv[2]
if (!['prepare','activate'].includes(mode)) throw new Error('Use prepare or activate')
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://oxplahazlmpcpkelpolv.supabase.co') throw new Error('Unexpected catalogue database')
const product = JSON.parse(await readFile(new URL('../docs/products/akhet-ade-2026.json',import.meta.url),'utf8'))
const client = new pg.Client({connectionString:process.env.POSTGRES_URL,connectionTimeoutMillis:10000})
try {
  await client.connect()
  await client.query("SET lock_timeout='5s'; SET statement_timeout='30s'")
  const existing = await client.query('SELECT id,name,slug,price,active,stock_quantity FROM public.products ORDER BY slug')
  if (!existing.rows.some(row => row.id === 'a715bb08-039e-4e3e-8eef-ad85a1a25d28')) throw new Error('Expected existing catalogue missing')
  if (mode === 'prepare') {
    await mkdir(new URL('../output/',import.meta.url),{recursive:true})
    await writeFile(new URL('../output/catalogue-before-akhet.json',import.meta.url),JSON.stringify(existing.rows,null,2))
    await client.query(await readFile(new URL('./migrations/2026-10-11-merch-inventory.sql',import.meta.url),'utf8'))
    const inserted = await client.query(`INSERT INTO public.products(name,slug,description,price,category,sizes,colors,
      stock_quantity,stock_by_size,image_urls,featured,active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,false)
      ON CONFLICT (slug) DO NOTHING RETURNING id,slug,active`,
      [product.name,product.slug,product.description,product.price,product.category,product.sizes,product.colors,
      product.stock_quantity,JSON.stringify(product.stock_by_size),product.image_urls])
    await client.query("NOTIFY pgrst, 'reload schema'")
    console.log(JSON.stringify({prepared:true,inserted:inserted.rows}))
  } else {
    const updated = await client.query('UPDATE public.products SET active=true WHERE slug=$1 AND price=25 RETURNING id,slug,active,stock_quantity,stock_by_size',[product.slug])
    if (updated.rowCount !== 1) throw new Error('Prepared AKHET product not found')
    console.log(JSON.stringify({published:updated.rows}))
  }
} catch (error) {
  await client.query('ROLLBACK').catch(()=>{})
  console.error('Catalogue update failed:',error.code ?? error.name)
  process.exitCode = 1
} finally { await client.end() }
