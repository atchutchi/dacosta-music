import { NextRequest, NextResponse } from 'next/server';
import type { OrderEmailData } from '@/lib/email-templates';
import { sendOrderConfirmation } from '@/lib/send-order-confirmation';
import { assertEmailApiAuthorized } from '@/lib/internal-api-auth';
import { orderEmailPayloadSchema } from '@/lib/validations/email';

export async function POST(request: NextRequest) {
  try {
    const authError = await assertEmailApiAuthorized(request);
    if (authError) return authError;

    const raw = await request.json();
    const parsed = orderEmailPayloadSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data as OrderEmailData;

    try {
      const result = await sendOrderConfirmation(body);
      return NextResponse.json({ success: true, ...result });
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

