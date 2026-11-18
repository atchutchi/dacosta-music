import { NextResponse } from 'next/server'

// O checkout público usa exclusivamente Stripe e os preços são validados no servidor.
// Impedir que a antiga rota PayPal aceite totais ou portes enviados pelo cliente.
export async function POST() {
  return NextResponse.json(
    { error: 'PayPal checkout is not available. Please use Stripe.' },
    { status: 503 },
  )
}
