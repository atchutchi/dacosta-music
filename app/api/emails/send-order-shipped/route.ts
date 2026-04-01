import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getOrderShippedEmailHTML, OrderEmailData } from '@/lib/email-templates';
import { assertEmailApiAuthorized } from '@/lib/internal-api-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const authError = await assertEmailApiAuthorized(request);
    if (authError) return authError;

    const body: OrderEmailData & { trackingNumber?: string; trackingUrl?: string } = await request.json();
    
    if (!body.customerEmail || !body.orderNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.EMAIL_FROM || 'orders@dacosta-music.com';

    try {
      const emailResult = await resend.emails.send({
        from: `Da Costa Music <${fromEmail}>`,
        to: [body.customerEmail],
        subject: `📦 Your Order #${body.orderNumber} Has Shipped!`,
        html: getOrderShippedEmailHTML(body),
      });

      console.log('Shipping notification sent:', emailResult);

      return NextResponse.json({ 
        success: true,
        emailId: emailResult.data?.id
      });
    } catch (emailError: any) {
      console.error('Resend email error:', emailError);
      return NextResponse.json({
        error: 'Failed to send shipping notification',
        details: emailError.message
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

