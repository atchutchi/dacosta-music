import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { productCreateSchema } from '@/lib/validations/product';

// GET /api/products - Listar produtos (com filtros)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Parâmetros de filtro
    const category = searchParams.get('category');
    const artistId = searchParams.get('artistId');
    const featured = searchParams.get('featured');
    const activeParam = searchParams.get('active');
    const search = searchParams.get('search');
    const ids = searchParams.get('ids'); // Para buscar múltiplos IDs (cart/checkout)
    
    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    // Ordenação
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    
    // Construir query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // Aplicar filtros
    // Se ids fornecidos, buscar apenas esses produtos (para cart/checkout)
    if (ids) {
      const idArray = ids.split(',').filter(Boolean);
      if (idArray.length > 0) {
        query = query.in('id', idArray);
        // Não aplicar outros filtros quando buscar por IDs
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching products by IDs:', error);
          return NextResponse.json(
            { error: 'Failed to fetch products', details: error.message },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          products: data,
          pagination: {
            page: 1,
            limit: idArray.length,
            total: data?.length || 0,
            pages: 1
          }
        });
      }
    }
    
    // Só filtra por active se não for 'all'
    if (activeParam !== 'all' && activeParam !== 'false') {
      query = query.eq('active', true);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (artistId) {
      query = query.eq('artist_id', artistId);
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    
    // Aplicar ordenação e paginação
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      products: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Criar produto (Admin apenas)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verificar se é admin
    const { data: userData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to verify admin access', details: profileError.message },
        { status: 500 }
      );
    }
    
    if (!userData || userData.role !== 'admin') {
      console.error('User is not admin:', { userId: user.id, email: user.email, role: userData?.role });
      return NextResponse.json(
        { error: 'Forbidden - Admin access required', details: `User role: ${userData?.role || 'not found'}` },
        { status: 403 }
      );
    }
    
    const raw = await request.json();
    const parsed = productCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // Inserir produto
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description ?? null,
        price: body.price,
        category: body.category,
        artist_id: body.artist_id ?? null,
        sizes: body.sizes ?? null,
        colors: body.colors ?? null,
        stock_quantity: body.stock_quantity ?? 0,
        low_stock_threshold: body.low_stock_threshold ?? 5,
        image_urls: body.image_urls ?? null,
        featured: body.featured ?? false,
        active: body.active !== false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




