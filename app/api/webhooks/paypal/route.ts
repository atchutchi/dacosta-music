import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { headers } from 'next/headers';

const PAYPAL_API = process.env.PAYPAL_MODE === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Verify PayPal webhook signature
async function verifyPayPalWebhook(webhookId: string, headers: any, body: any) {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  // Get access token
  const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const { access_token } = await tokenResponse.json();

  // Verify signature
  const verifyResponse = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_sig: headers['paypal-transmission-sig'],
      webhook_id: webhookId,
      webhook_event: body
    })
  });

  const verifyData = await verifyResponse.json();
  return verifyData.verification_status === 'SUCCESS';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = headers();
    
    // Optional: Verify webhook signature for production
    if (process.env.PAYPAL_WEBHOOK_ID && process.env.NODE_ENV === 'production') {
      const isValid = await verifyPayPalWebhook(
        process.env.PAYPAL_WEBHOOK_ID,
        {
          'paypal-transmission-id': headersList.get('paypal-transmission-id'),
          'paypal-transmission-time': headersList.get('paypal-transmission-time'),
          'paypal-cert-url': headersList.get('paypal-cert-url'),
          'paypal-auth-algo': headersList.get('paypal-auth-algo'),
          'paypal-transmission-sig': headersList.get('paypal-transmission-sig')
        },
        body
      );

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 400 }
        );
      }
    }

    const supabase = createServiceClient();
    const eventType = body.event_type;

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
      case 'PAYMENT.CAPTURE.COMPLETED':
        const orderId = body.resource.custom_id || body.resource.purchase_units?.[0]?.custom_id;
        
        if (orderId) {
          // Update order status
          await supabase
            .from('orders')
            .update({
              status: 'paid',
              payment_status: 'paid',
              paypal_order_id: body.resource.id
            })
            .eq('id', orderId);

          // Deduct stock
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

          if (orderItems) {
            for (const item of orderItems) {
              if (item.product_id) {
                const { data: product } = await supabase
                  .from('products')
                  .select('stock_quantity')
                  .eq('id', item.product_id)
                  .single();

                if (product) {
                  const newStock = product.stock_quantity - item.quantity;
                  
                  await supabase
                    .from('products')
                    .update({ stock_quantity: newStock })
                    .eq('id', item.product_id);

                  await supabase
                    .from('stock_history')
                    .insert({
                      product_id: item.product_id,
                      change_type: 'sale',
                      quantity_change: -item.quantity,
                      quantity_after: newStock,
                      reference_id: orderId,
                      notes: `Sold via PayPal order`
                    });
                }
              }
            }
          }

          console.log(`Order ${orderId} marked as paid via PayPal`);
        }
        break;

      case 'CHECKOUT.ORDER.VOIDED':
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED':
        const failedOrderId = body.resource.custom_id || body.resource.purchase_units?.[0]?.custom_id;
        
        if (failedOrderId) {
          await supabase
            .from('orders')
            .update({
              status: eventType.includes('REFUNDED') ? 'refunded' : 'cancelled',
              payment_status: eventType.includes('REFUNDED') ? 'refunded' : 'failed'
            })
            .eq('id', failedOrderId);

          console.log(`Order ${failedOrderId} updated: ${eventType}`);
        }
        break;

      default:
        console.log(`Unhandled PayPal event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}




