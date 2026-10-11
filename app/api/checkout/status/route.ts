import { NextResponse } from 'next/server'
import { stripeCheckoutAvailable } from '@/lib/stripe-checkout-availability'

export function GET() {
  return NextResponse.json({ available: stripeCheckoutAvailable(process.env.STRIPE_SECRET_KEY, process.env.VERCEL_ENV) },
    {headers:{'Cache-Control':'private, no-store'}})
}
