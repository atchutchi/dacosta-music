import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

// API para testar o fluxo completo de envio de emails
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({
        error: 'Order ID is required'
      }, { status: 400 });
    }

    const supabase = await createServerClient();
    
    // Buscar pedido
    const { data: orderDetails, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error || !orderDetails) {
      return NextResponse.json({
        error: 'Order not found',
        details: error
      }, { status: 404 });
    }

    // Preparar dados do email
    const emailData = {
      orderNumber: orderDetails.order_number,
      customerName: orderDetails.shipping_name,
      customerEmail: orderDetails.shipping_email,
      items: orderDetails.order_items.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        size: item.size,
        color: item.color,
        image: item.product_image_url
      })),
      subtotal: orderDetails.subtotal,
      shipping: orderDetails.shipping_cost,
      total: orderDetails.total,
      shippingAddress: {
        name: orderDetails.shipping_name,
        addressLine1: orderDetails.shipping_address_line1,
        addressLine2: orderDetails.shipping_address_line2,
        city: orderDetails.shipping_city,
        state: orderDetails.shipping_state,
        country: orderDetails.shipping_country,
        postalCode: orderDetails.shipping_postal_code
      }
    };

    logger.log('📧 Testando envio de emails para pedido:', orderDetails.order_number);
    
    // Chamar API de emails
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://192.168.22.202:3000'}/api/emails/send-order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to send emails',
        emailError: emailResult,
        orderData: emailData
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Emails enviados com sucesso!',
      emailResult,
      orderNumber: orderDetails.order_number,
      sentTo: {
        customer: orderDetails.shipping_email,
        admin: process.env.ADMIN_EMAIL
      }
    });
  } catch (error: any) {
    logger.error('❌ Erro no teste:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
