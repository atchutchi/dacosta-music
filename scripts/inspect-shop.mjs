import nextEnv from '@next/env'
import { createClient } from '@supabase/supabase-js'

nextEnv.loadEnvConfig(process.cwd())
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const { data, error } = await client.from('products').select('id,name,slug,active,stock_quantity')
if (error) { console.error('Não foi possível consultar o catálogo:', error.code, error.message); process.exit(1) }
console.log(JSON.stringify({ products: data }, null, 2))
const { error: variantsError } = await client.from('products').select('stock_by_size').limit(1)
console.log(JSON.stringify({ sizeInventoryInstalled: !variantsError }))
const { count, error: ordersError } = await client.from('orders').select('id', { count: 'exact', head: true }).eq('payment_status', 'pending')
console.log(JSON.stringify({ pendingOrders: ordersError ? 'unavailable' : count }))
