import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/shop/stats - Obter estatísticas da loja (Admin apenas)
export async function GET(request: NextRequest) {
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
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Buscar estatísticas usando a função RPC
    const { data: stats, error: statsError } = await supabase
      .rpc('get_shop_statistics');
    
    if (statsError) {
      console.error('Error fetching shop statistics:', statsError);
      // Se a função RPC não existir, calcular manualmente
      const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_id, total, status');
      
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity');
      
      const completedOrders = orders?.filter(o => 
        ['paid', 'processing', 'shipped', 'delivered'].includes(o.status)
      ) || [];
      
      const stats = {
        total_orders: completedOrders.length,
        total_customers: new Set(completedOrders.map(o => o.customer_id)).size,
        total_revenue: completedOrders.reduce((sum, o) => sum + Number(o.total), 0),
        average_order_value: completedOrders.length > 0 
          ? completedOrders.reduce((sum, o) => sum + Number(o.total), 0) / completedOrders.length 
          : 0,
        products_sold: new Set(orderItems?.map(oi => oi.product_id) || []).size,
        total_items_sold: orderItems?.reduce((sum, oi) => sum + oi.quantity, 0) || 0,
        pending_orders: orders?.filter(o => o.status === 'pending').length || 0,
        cancelled_orders: orders?.filter(o => o.status === 'cancelled').length || 0
      };
      
      return NextResponse.json({ stats });
    }
    
    // Buscar produtos mais vendidos
    const { data: topProducts, error: topProductsError } = await supabase
      .rpc('get_top_selling_products', { limit_count: 10 });
    
    // Buscar vendas por mês
    const { data: monthlySales, error: monthlySalesError } = await supabase
      .rpc('get_monthly_sales', { months_back: 12 });
    
    // Buscar produtos com estoque baixo
    const { data: lowStockProducts, error: lowStockError } = await supabase
      .rpc('get_low_stock_products');
    
    return NextResponse.json({
      stats: stats || {},
      topProducts: topProducts || [],
      monthlySales: monthlySales || [],
      lowStockProducts: lowStockProducts || []
    });
  } catch (error: any) {
    console.error('Error fetching shop stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

