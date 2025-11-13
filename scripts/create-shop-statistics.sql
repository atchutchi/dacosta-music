-- ============================================
-- CRIAR VIEW E FUNÇÕES PARA ESTATÍSTICAS DA LOJA
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Criar view para estatísticas gerais
CREATE OR REPLACE VIEW shop_statistics AS
SELECT 
  COUNT(DISTINCT o.id) FILTER (WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')) as total_orders,
  COUNT(DISTINCT o.customer_id) FILTER (WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')) as total_customers,
  COALESCE(SUM(o.total) FILTER (WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')), 0) as total_revenue,
  COALESCE(AVG(o.total) FILTER (WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')), 0) as average_order_value,
  COUNT(DISTINCT oi.product_id) FILTER (WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')) as products_sold,
  COALESCE(SUM(oi.quantity) FILTER (WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')), 0) as total_items_sold,
  COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'pending') as pending_orders,
  COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'cancelled') as cancelled_orders
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id;

-- 2. Criar função RPC para obter estatísticas
CREATE OR REPLACE FUNCTION get_shop_statistics()
RETURNS TABLE (
  total_orders BIGINT,
  total_customers BIGINT,
  total_revenue NUMERIC,
  average_order_value NUMERIC,
  products_sold BIGINT,
  total_items_sold BIGINT,
  pending_orders BIGINT,
  cancelled_orders BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM shop_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar função para produtos mais vendidos
CREATE OR REPLACE FUNCTION get_top_selling_products(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  total_sold BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oi.product_id,
    oi.product_name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.subtotal) as total_revenue
  FROM order_items oi
  INNER JOIN orders o ON oi.order_id = o.id
  WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')
  GROUP BY oi.product_id, oi.product_name
  ORDER BY total_sold DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar função para vendas por mês
CREATE OR REPLACE FUNCTION get_monthly_sales(months_back INTEGER DEFAULT 12)
RETURNS TABLE (
  month DATE,
  total_orders BIGINT,
  total_revenue NUMERIC,
  average_order_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('month', o.created_at)::DATE as month,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_revenue,
    COALESCE(AVG(o.total), 0) as average_order_value
  FROM orders o
  WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')
    AND o.created_at >= DATE_TRUNC('month', NOW() - (months_back || ' months')::INTERVAL)
  GROUP BY DATE_TRUNC('month', o.created_at)
  ORDER BY month DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar função para produtos com estoque baixo
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  current_stock INTEGER,
  low_stock_threshold INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    p.stock_quantity as current_stock,
    p.low_stock_threshold
  FROM products p
  WHERE p.active = true
    AND p.stock_quantity <= p.low_stock_threshold
  ORDER BY p.stock_quantity ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Verificar se as funções foram criadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_shop_statistics',
    'get_top_selling_products',
    'get_monthly_sales',
    'get_low_stock_products'
  );

