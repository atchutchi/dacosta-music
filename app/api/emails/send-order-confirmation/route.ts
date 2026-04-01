import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getOrderConfirmationEmailHTML, getAdminNewOrderEmailHTML, OrderEmailData } from '@/lib/email-templates';
import { assertEmailApiAuthorized } from '@/lib/internal-api-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const authError = await assertEmailApiAuthorized(request);
    if (authError) return authError;

    const body: OrderEmailData = await request.json();
    
    // Validar dados obrigatórios
    if (!body.customerEmail || !body.orderNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email do remetente (deve ser verificado no Resend)
    const fromEmail = process.env.EMAIL_FROM || 'bookings@dacosta-music.com';
    
    // Emails dos admins (múltiplos destinatários via variáveis de ambiente)
    const adminEmailsString = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'admin@dacosta-music.com';
    const adminEmails = adminEmailsString.split(',').map(email => email.trim()).filter(Boolean);

    try {
      // 1. Enviar email de confirmação ao cliente
      const customerEmail = await resend.emails.send({
        from: `Da Costa Music <${fromEmail}>`,
        to: [body.customerEmail],
        subject: `Order Confirmation - #${body.orderNumber}`,
        html: getOrderConfirmationEmailHTML(body),
      });

      console.log('✅ Customer email sent:', customerEmail.data?.id);

      // 2. Enviar notificação para múltiplos admins
      const adminEmailResult = await resend.emails.send({
        from: `Da Costa Music Shop <${fromEmail}>`,
        to: adminEmails,
        subject: `🔔 New Order #${body.orderNumber}`,
        html: getAdminNewOrderEmailHTML(body),
      });

      console.log('✅ Admin emails sent to:', adminEmails.join(', '), '| ID:', adminEmailResult.data?.id);

      return NextResponse.json({ 
        success: true,
        customerEmailId: customerEmail.data?.id,
        adminEmailId: adminEmailResult.data?.id
      });
    } catch (emailError: any) {
      console.error('Resend email error:', emailError);
      
      // Se falhar com Resend, tentar com método alternativo ou log
      return NextResponse.json({
        error: 'Failed to send emails',
        details: emailError.message,
        note: 'Order was created successfully but email notification failed'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

