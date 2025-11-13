import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/auth/check-admin - Verificar se usuário é admin (para debug)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        isAdmin: false,
        error: 'Not authenticated',
        details: authError?.message
      });
    }
    
    // Verificar perfil
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return NextResponse.json({
        authenticated: true,
        isAdmin: false,
        userId: user.id,
        userEmail: user.email,
        profileExists: false,
        error: 'Profile not found',
        details: profileError.message,
        suggestion: 'Execute o script fix-admin-authentication.sql no Supabase SQL Editor'
      });
    }
    
    const isAdmin = userProfile?.role === 'admin';
    
    return NextResponse.json({
      authenticated: true,
      isAdmin,
      userId: user.id,
      userEmail: user.email,
      profileExists: true,
      role: userProfile?.role || 'not set',
      profileCreated: userProfile?.created_at,
      message: isAdmin 
        ? 'User is admin - access granted' 
        : `User is not admin (role: ${userProfile?.role}) - access denied`
    });
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

