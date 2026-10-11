import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkoutBodySchema } from '@/lib/validations/order'
import { quoteCheckout } from '@/lib/checkout-pricing'
import { getStripeClient } from '@/lib/stripe'
import { stripeCheckoutAvailable } from '@/lib/stripe-checkout-availability'

export async function POST(request: NextRequest) {
  if (!stripeCheckoutAvailable(process.env.STRIPE_SECRET_KEY, process.env.VERCEL_ENV) || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Checkout is temporarily unavailable' }, { status: 503 })
  }
  const stripe = getStripeClient()
  const supabase = createServiceClient()
  let orderId: string | null = null
  let sessionId: string | null = null
  try {
    const raw = await request.json().catch(() => null)
    const parsed = checkoutBodySchema.safeParse(raw)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid checkout payload' }, { status: 400 })
    const { items, customer, shipping, shippingMethod } = parsed.data
    const { data: products, error: productsError } = await supabase.from('products').select('*').in('id', items.map(item => item.productId))
    if (productsError) throw new Error('Unable to load product prices')
    let quote
    try { quote = quoteCheckout(items, products ?? [], shipping.country, shippingMethod) }
    catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }) }

    const { data: customerData, error: customerError } = await supabase.from('customers')
      .insert({ email: customer.email, name: customer.name, phone: customer.phone || null, user_id: null }).select().single()
    if (customerError || !customerData) throw new Error('Unable to create customer')
    const { data: generatedNumber } = await supabase.rpc('generate_order_number')
    const orderNumber = generatedNumber || `DC-${crypto.randomUUID()}`
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      customer_id: customerData.id, order_number: orderNumber, status: 'pending',
      subtotal: quote.subtotal, shipping_cost: quote.shippingCost, tax: 0, total: quote.total, currency: quote.currency,
      shipping_name: shipping.name, shipping_email: shipping.email, shipping_phone: shipping.phone || null,
      shipping_address_line1: shipping.addressLine1, shipping_address_line2: shipping.addressLine2 || null,
      shipping_city: shipping.city, shipping_state: shipping.state || null, shipping_country: shipping.country,
      shipping_postal_code: shipping.postalCode, payment_method: 'stripe', payment_status: 'pending', shipping_method: shippingMethod,
    }).select().single()
    if (orderError || !order) throw new Error('Unable to create order')
    orderId = order.id
    const orderItems = items.map(item => {
      const product = products!.find(entry => entry.id === item.productId)!
      return {
        order_id: order.id, product_id: product.id, product_name: product.name,
        product_image_url: product.image_urls?.[0] || null, size: item.size || null, color: item.color || null,
        quantity: item.quantity, unit_price: product.price, subtotal: Math.round(product.price * 100) * item.quantity / 100,
      }
    })
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw new Error('Unable to create order items')
    const { error: reserveError } = await supabase.rpc('apply_order_stock', { p_order_id: order.id, p_action: 'reserve' })
    if (reserveError) throw new Error('Unable to reserve product stock')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dacosta-music.com'
    const lineItems = items.map(item => {
      const product = products!.find(entry => entry.id === item.productId)!
      const image = product.image_urls?.[0]
      return {
        price_data: { currency: 'eur', unit_amount: Math.round(product.price * 100), product_data: {
          name: product.name, images: image ? [new URL(image, siteUrl).href] : [],
          description: item.size ? `Size: ${item.size}` : undefined,
        } }, quantity: item.quantity,
      }
    })
    if (quote.shippingCost > 0) lineItems.push({
      price_data: { currency: 'eur', unit_amount: Math.round(quote.shippingCost * 100), product_data: {
        name: 'Shipping', images: [], description: shippingMethod === 'dhl' ? 'DHL' : shippingMethod === 'ctt' ? 'CTT' : 'Standard Shipping',
      } }, quantity: 1,
    })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], line_items: lineItems, mode: 'payment',
      adaptive_pricing: { enabled: false },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${siteUrl}/shop/order/${order.id}?success=true`, cancel_url: `${siteUrl}/shop/checkout?cancelled=true`,
      customer_email: customer.email, billing_address_collection: 'auto',
      metadata: { order_id: order.id, order_number: orderNumber },
      payment_intent_data: { metadata: { order_id: order.id, order_number: orderNumber } },
      // O endereço já foi recolhido no site. Uma segunda recolha pode divergir dos portes.
    }, { idempotencyKey: `checkout-${order.id}` })
    sessionId = session.id
    const { error: sessionError } = await supabase.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', order.id)
    if (sessionError || !session.url) throw new Error('Unable to save checkout session')
    return NextResponse.json({ url: session.url, orderId: order.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    if (orderId) {
      try {
        // Expirar a sessão antes de repor stock para impedir pagamentos numa reserva libertada.
        if (sessionId) await stripe.checkout.sessions.expire(sessionId)
        const { error: releaseError } = await supabase.rpc('apply_order_stock', { p_order_id: orderId, p_action: 'release' })
        if (releaseError) throw releaseError
        await supabase.from('orders').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', orderId)
      } catch (cleanupError) { console.error('Checkout requires stock reconciliation:', orderId, cleanupError) }
    }
    return NextResponse.json({ error: 'Unable to start checkout. Please try again.' }, { status: 500 })
  }
}
