import nextEnv from '@next/env'
import Stripe from 'stripe'

nextEnv.loadEnvConfig(process.cwd())
const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.log(JSON.stringify({ configured: false }))
} else {
  try {
    const stripe = new Stripe(key)
    const account = await stripe.accounts.retrieve()
    console.log(JSON.stringify({
      configured: true, mode: /^(sk|rk)_live_/.test(key) ? 'live' : 'test',
      accountId: account.id, chargesEnabled: account.charges_enabled, payoutsEnabled: account.payouts_enabled,
      country: account.country,
    }))
  } catch (error) {
    console.log(JSON.stringify({configured:true, mode:/^(sk|rk)_live_/.test(key) ? 'live' : 'test', verified:false, errorType:error.type ?? error.name, errorCode:error.code ?? null}))
    process.exitCode = 1
  }
}
