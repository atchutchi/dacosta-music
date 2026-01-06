import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { logger } from '@/lib/logger';

// API de teste para verificar se Resend está funcionando
// APENAS disponível em desenvolvimento
export async function GET(request: NextRequest) {
  // Bloquear em produção
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Este endpoint não está disponível em produção' },
      { status: 403 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Log para debug (apenas em desenvolvimento)
    logger.log('🧪 Testing Resend configuration...');
    logger.log('API Key exists:', !!process.env.RESEND_API_KEY);
    logger.log('API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 7));
    logger.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    logger.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    
    const testEmail = await resend.emails.send({
      from: `Da Costa Music <${process.env.EMAIL_FROM || 'bookings@dacosta-music.com'}>`,
      to: [process.env.ADMIN_EMAIL || 'admin@dacosta-music.com'],
      subject: '🧪 Teste Resend - Da Costa Music',
      html: `
        <h1>✅ Teste Bem-Sucedido!</h1>
        <p>Se recebeu este email, significa que o Resend está configurado corretamente.</p>
        <hr>
        <p><strong>Configuração:</strong></p>
        <ul>
          <li>FROM: ${process.env.EMAIL_FROM}</li>
          <li>TO: ${process.env.ADMIN_EMAIL}</li>
          <li>Data: ${new Date().toLocaleString('pt-PT')}</li>
        </ul>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email de teste enviado!',
      emailId: testEmail.data?.id,
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_FROM
    });
  } catch (error: any) {
    logger.error('❌ Erro ao enviar email de teste:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        statusCode: error.statusCode,
        hasApiKey: !!process.env.RESEND_API_KEY,
        emailFrom: process.env.EMAIL_FROM,
        adminEmail: process.env.ADMIN_EMAIL
      }
    }, { status: 500 });
  }
}
