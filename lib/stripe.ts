import Stripe from 'stripe'

export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Stripe is not configured')
  return new Stripe(key, { apiVersion: '2025-10-29.clover' })
}
