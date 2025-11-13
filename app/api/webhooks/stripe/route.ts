import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.order_id) {
          // Update order status to paid
          await supabase
            .from('orders')
            .update({
              status: 'paid',
              payment_status: 'paid',
              payment_intent_id: session.payment_intent as string
            })
            .eq('id', session.metadata.order_id);

          // Deduct stock for order items
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', session.metadata.order_id);

          if (orderItems) {
            for (const item of orderItems) {
              if (item.product_id) {
                // Get current stock
                const { data: product } = await supabase
                  .from('products')
                  .select('stock_quantity')
                  .eq('id', item.product_id)
                  .single();

                if (product) {
                  const newStock = product.stock_quantity - item.quantity;
                  
                  // Update stock
                  await supabase
                    .from('products')
                    .update({ stock_quantity: newStock })
                    .eq('id', item.product_id);

                  // Record in stock history
                  await supabase
                    .from('stock_history')
                    .insert({
                      product_id: item.product_id,
                      change_type: 'sale',
                      quantity_change: -item.quantity,
                      quantity_after: newStock,
                      reference_id: session.metadata.order_id,
                      notes: `Sold via order ${session.metadata.order_number}`
                    });
                }
              }
            }
          }

          console.log(`Order ${session.metadata.order_id} marked as paid`);
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        
        if (expiredSession.metadata?.order_id) {
          await supabase
            .from('orders')
            .update({
              status: 'cancelled',
              payment_status: 'failed'
            })
            .eq('id', expiredSession.metadata.order_id);

          console.log(`Order ${expiredSession.metadata.order_id} cancelled - session expired`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        // Find order by payment intent
        const { data: failedOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('payment_intent_id', failedPayment.id)
          .single();

        if (failedOrder) {
          await supabase
            .from('orders')
            .update({
              status: 'cancelled',
              payment_status: 'failed'
            })
            .eq('id', failedOrder.id);

          console.log(`Order ${failedOrder.id} payment failed`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}




