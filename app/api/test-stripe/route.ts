import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Endpoint de teste do Stripe
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
    // Verificar se as variáveis de ambiente estão configuradas
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!hasSecretKey) {
      return NextResponse.json({
        configured: false,
        error: 'STRIPE_SECRET_KEY não está configurada no .env',
        help: 'Adicione: STRIPE_SECRET_KEY=sk_test_... (do Stripe Dashboard → Developers → API keys)'
      });
    }

    // Tentar criar cliente Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    });

    // Testar conexão listando produtos (ou criando um test)
    const balance = await stripe.balance.retrieve();

    return NextResponse.json({
      configured: true,
      secretKey: hasSecretKey ? 'SET ✅' : 'NOT SET ❌',
      publishableKey: hasPublishableKey ? 'SET ✅' : 'NOT SET ❌',
      publishableKeyValue: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...' : 
        'NOT SET',
      connection: 'OK ✅',
      mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST MODE' : 'LIVE MODE',
      balance: {
        available: balance.available,
        pending: balance.pending,
        currency: balance.available[0]?.currency || 'N/A'
      },
      message: 'Stripe está configurado e funcionando!',
      nextSteps: [
        '1. Verifique se NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY está no .env',
        '2. Reinicie o servidor Next.js',
        '3. Teste o checkout'
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: false,
      error: error.message,
      details: error.type || 'Unknown error',
      help: error.message.includes('API key') 
        ? 'Verifique se a STRIPE_SECRET_KEY está correta (deve começar com sk_test_ ou sk_live_)'
        : 'Verifique a configuração do Stripe'
    }, { status: 500 });
  }
}

