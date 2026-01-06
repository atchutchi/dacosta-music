import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Debug endpoint para verificar storage
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
    const supabase = await createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        error: 'Not authenticated',
        details: authError?.message
      });
    }
    
    // Listar buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return NextResponse.json({
        authenticated: true,
        userId: user.id,
        userEmail: user.email,
        bucketsError: bucketsError.message,
        buckets: null
      });
    }
    
    // Verificar bucket products especificamente
    const productsBucket = buckets?.find(b => b.name === 'products');
    
    // Tentar listar arquivos no bucket
    let filesInBucket = null;
    let filesError = null;
    
    if (productsBucket) {
      const { data: files, error: fError } = await supabase.storage
        .from('products')
        .list('', { limit: 10 });
      
      filesInBucket = files;
      filesError = fError?.message;
    }
    
    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      userEmail: user.email,
      totalBuckets: buckets?.length || 0,
      allBuckets: buckets?.map(b => ({ name: b.name, public: b.public })) || [],
      productsBucket: productsBucket ? {
        name: productsBucket.name,
        public: productsBucket.public,
        created_at: productsBucket.created_at
      } : null,
      productsBucketExists: !!productsBucket,
      filesInBucket,
      filesError,
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Internal error',
      details: error.message
    }, { status: 500 });
  }
}

