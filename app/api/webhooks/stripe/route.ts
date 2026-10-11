import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/service';
import { sendOrderConfirmation } from '@/lib/send-order-confirmation';
import { getStripeClient } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 });
  }
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

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

    const configuredLiveMode = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY!);
    if (event.livemode !== configuredLiveMode || (process.env.VERCEL_ENV === 'production' && !event.livemode)) {
      return NextResponse.json({ error: 'Stripe environment mismatch' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.order_id && session.payment_status === 'paid') {
          if (session.amount_total === null || !session.currency || typeof session.payment_intent !== 'string') {
            throw new Error('Incomplete Stripe payment data');
          }
          const { data: changed, error: confirmationError } = await supabase.rpc('complete_stripe_order', {
            p_order_id: session.metadata.order_id, p_session_id: session.id,
            p_payment_intent: session.payment_intent, p_amount_total: session.amount_total, p_currency: session.currency,
          });
          if (confirmationError) throw confirmationError;

          console.log(`Order ${session.metadata.order_id} marked as paid`);
          
          // Enviar emails de confirmação
          try {
            // Buscar detalhes completos do pedido
            const { data: orderDetails } = await supabase
              .from('orders')
              .select(`
                *,
                order_items (*)
              `)
              .eq('id', session.metadata.order_id)
              .single();

            if (orderDetails) {
              if (orderDetails.notification_sent_at) break;
              // Preparar dados para o email
              const emailData = {
                orderNumber: orderDetails.order_number,
                customerName: orderDetails.shipping_name,
                customerEmail: orderDetails.shipping_email,
                items: orderDetails.order_items.map((item: any) => ({
                  name: item.product_name,
                  quantity: item.quantity,
                  price: item.unit_price,
                  size: item.size || undefined,
                  color: item.color || undefined,
                  image: item.product_image_url || undefined
                })),
                subtotal: orderDetails.subtotal,
                shipping: orderDetails.shipping_cost,
                total: orderDetails.total,
                shippingAddress: {
                  name: orderDetails.shipping_name,
                  addressLine1: orderDetails.shipping_address_line1,
                  addressLine2: orderDetails.shipping_address_line2 || undefined,
                  city: orderDetails.shipping_city,
                  state: orderDetails.shipping_state || undefined,
                  country: orderDetails.shipping_country,
                  postalCode: orderDetails.shipping_postal_code
                }
              };

              await sendOrderConfirmation(emailData);
              const { error: notificationError } = await supabase.from('orders')
                .update({ notification_sent_at: new Date().toISOString() }).eq('id', session.metadata.order_id);
              if (notificationError) throw notificationError;
            } else throw new Error('Unable to load paid order for notification');
          } catch (emailError) {
            console.error('❌ Error preparing confirmation email:', emailError);
            // Repetir sem descontar stock novamente. O Resend evita duplicados durante 24 horas.
            throw emailError;
          }
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        
        if (expiredSession.metadata?.order_id) {
          const { error: cancellationError } = await supabase.rpc('cancel_stripe_order', {
            p_order_id: expiredSession.metadata.order_id, p_session_id: expiredSession.id,
          });
          if (cancellationError) throw cancellationError;

          console.log(`Order ${expiredSession.metadata.order_id} cancelled - session expired`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        // Uma tentativa recusada pode ser repetida na mesma sessão. Só a expiração liberta a reserva.
        console.log(`Stripe payment attempt failed: ${failedPayment.id}`);
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




