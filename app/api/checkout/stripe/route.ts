import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

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

    const supabase = createServiceClient();

    // Create customer in database
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        email: customer.email,
        name: customer.name,
        phone: customer.phone || null,
        user_id: null // Guest checkout
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
        payment_method: 'stripe',
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

    // Create Stripe line items
    const lineItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return {
        price_data: {
          currency: 'eur', // Mudado para EUR
          product_data: {
            name: product?.name || 'Product',
            images: product?.image_urls?.slice(0, 1) || [],
            description: item.size ? `Size: ${item.size}` : undefined
          },
          unit_amount: Math.round((product?.price || 0) * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur', // Mudado para EUR
          product_data: {
            name: 'Shipping',
            description: shippingMethod === 'dhl' ? 'DHL Express' : shippingMethod === 'fedex' ? 'FedEx Priority' : 'Standard Shipping'
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dacosta-music.com"}/shop/order/${orderData.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dacosta-music.com"}/shop/checkout?cancelled=true`,
      customer_email: customer.email,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['PT', 'ES', 'FR', 'DE', 'IT', 'GB', 'US', 'BR', 'ZA'], // Portugal, EU, UK, Americas, Africa
      },
      metadata: {
        order_id: orderData.id,
        order_number: orderNumber
      }
    });

    // Update order with Stripe payment intent ID
    await supabase
      .from('orders')
      .update({ payment_intent_id: session.id })
      .eq('id', orderData.id);

    return NextResponse.json({ url: session.url, orderId: orderData.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




