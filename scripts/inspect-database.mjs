import nextEnv from '@next/env'
import pg from 'pg'

nextEnv.loadEnvConfig(process.cwd())
const client = new pg.Client({ connectionString: process.env.POSTGRES_URL, connectionTimeoutMillis: 10000 })
try {
  await client.connect()
  await client.query('BEGIN READ ONLY')
  const schema = await client.query(`SELECT column_name,data_type FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('products','orders') ORDER BY table_name,ordinal_position`)
  console.log(JSON.stringify({ schema: schema.rows }))
  const pending = await client.query(`SELECT count(*)::integer AS pending, min(created_at) AS oldest, max(created_at) AS newest,
    count(*) FILTER (WHERE created_at > now()-interval '24 hours')::integer AS last24h
    FROM public.orders WHERE payment_status='pending' AND payment_method='stripe'`)
  console.log(JSON.stringify({ stripePendingOrders: pending.rows }))
  await client.query('ROLLBACK')
} catch (error) {
  console.error('Não foi possível consultar a base de dados:', error.code || error.name)
  process.exitCode = 1
} finally { await client.end() }
