import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { buildInternalEmailHeaders } from '@/lib/internal-api-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    // Verificar autenticação e permissões de admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { trackingNumber, trackingUrl, carrier } = body;

    // Atualizar pedido para status "shipped"
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber || null,
        tracking_url: trackingUrl || null,
        carrier: carrier || null,
        shipped_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        order_items (*)
      `)
      .single();

    if (updateError || !order) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Enviar email de notificação ao cliente
    try {
      const emailData = {
        orderNumber: order.order_number,
        customerName: order.shipping_name,
        customerEmail: order.shipping_email,
        items: order.order_items.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
          size: item.size,
          color: item.color,
          image: item.product_image_url
        })),
        subtotal: order.subtotal,
        shipping: order.shipping_cost,
        total: order.total,
        shippingAddress: {
          name: order.shipping_name,
          addressLine1: order.shipping_address_line1,
          addressLine2: order.shipping_address_line2,
          city: order.shipping_city,
          state: order.shipping_state,
          country: order.shipping_country,
          postalCode: order.shipping_postal_code
        },
        trackingNumber,
        trackingUrl
      };

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dacosta-music.com"
      const emailHeaders = buildInternalEmailHeaders()
      if (emailHeaders) {
        fetch(`${baseUrl}/api/emails/send-order-shipped`, {
          method: "POST",
          headers: emailHeaders,
          body: JSON.stringify(emailData),
        }).catch((err) => console.error("Failed to send shipping email:", err))
      } else {
        console.error("INTERNAL_API_SECRET not set; skipped send-order-shipped")
      }
    } catch (emailError) {
      console.error('Error sending shipping notification:', emailError);
      // Não falhar a operação se o email falhar
    }

    return NextResponse.json({ 
      success: true,
      order,
      message: 'Order marked as shipped and notification sent to customer'
    });
  } catch (error: any) {
    console.error('Error shipping order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

