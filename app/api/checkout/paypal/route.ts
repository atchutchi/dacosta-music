import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// PayPal API base URL (sandbox or production)
const PAYPAL_API = process.env.PAYPAL_MODE === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, shipping, shippingMethod, subtotal, shippingCost, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Create customer in database
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        email: customer.email,
        name: customer.name,
        phone: customer.phone || null,
        user_id: null
      })
      .select()
      .single();

    if (customerError || !customerData) {
      console.error('Error creating customer:', customerError);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    // Generate order number
    const { data: orderNumberData } = await supabase
      .rpc('generate_order_number');
    
    const orderNumber = orderNumberData || `DC-${Date.now()}`;

    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerData.id,
        order_number: orderNumber,
        status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        tax: 0,
        total,
        currency: 'USD',
        shipping_name: shipping.name,
        shipping_email: shipping.email,
        shipping_phone: shipping.phone || null,
        shipping_address_line1: shipping.addressLine1,
        shipping_address_line2: shipping.addressLine2 || null,
        shipping_city: shipping.city,
        shipping_state: shipping.state || null,
        shipping_country: shipping.country,
        shipping_postal_code: shipping.postalCode,
        payment_method: 'paypal',
        payment_status: 'pending',
        shipping_method: shippingMethod
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Fetch product details and create order items
    const productIds = items.map((item: any) => item.productId);
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (!products) {
      return NextResponse.json(
        { error: 'Products not found' },
        { status: 404 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return {
        order_id: orderData.id,
        product_id: item.productId,
        product_name: product?.name || 'Unknown Product',
        product_image_url: product?.image_urls?.[0] || null,
        size: item.size || null,
        color: item.color || null,
        quantity: item.quantity,
        unit_price: product?.price || 0,
        subtotal: (product?.price || 0) * item.quantity
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const paypalItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return {
        name: product?.name || 'Product',
        description: item.size ? `Size: ${item.size}` : undefined,
        unit_amount: {
          currency_code: 'USD',
          value: (product?.price || 0).toFixed(2)
        },
        quantity: item.quantity.toString()
      };
    });

    const paypalOrderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderNumber,
          custom_id: orderData.id,
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2)
              },
              shipping: {
                currency_code: 'USD',
                value: shippingCost.toFixed(2)
              }
            }
          },
          items: paypalItems,
          shipping: {
            name: {
              full_name: shipping.name
            },
            address: {
              address_line_1: shipping.addressLine1,
              address_line_2: shipping.addressLine2 || undefined,
              admin_area_2: shipping.city,
              admin_area_1: shipping.state || undefined,
              postal_code: shipping.postalCode,
              country_code: shipping.country.substring(0, 2).toUpperCase()
            }
          }
        }
      ],
      application_context: {
        brand_name: 'Da Costa Music',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop/order/${orderData.id}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop/checkout?cancelled=true`
      }
    };

    const paypalResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(paypalOrderData)
    });

    const paypalOrder = await paypalResponse.json();

    if (!paypalResponse.ok) {
      console.error('PayPal order creation failed:', paypalOrder);
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      );
    }

    // Update order with PayPal order ID
    await supabase
      .from('orders')
      .update({ paypal_order_id: paypalOrder.id })
      .eq('id', orderData.id);

    // Get approval URL
    const approvalUrl = paypalOrder.links.find((link: any) => link.rel === 'approve')?.href;

    return NextResponse.json({
      approvalUrl,
      orderId: orderData.id,
      paypalOrderId: paypalOrder.id
    });
  } catch (error: any) {
    console.error('PayPal checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




