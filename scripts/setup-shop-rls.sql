-- ============================================
-- Da Costa Music - Row Level Security (RLS) Policies
-- E-commerce Module
-- ============================================

-- ============================================
-- PRODUTOS
-- ============================================

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem visualizar produtos ativos
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (active = true);

-- Política: Admins podem ver todos os produtos (incluindo inativos)
CREATE POLICY "Admins can view all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Admins podem inserir produtos
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Admins podem atualizar produtos
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Admins podem deletar produtos
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- CLIENTES
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios dados
CREATE POLICY "Users can view their own customer data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Política: Admins podem ver todos os clientes
CREATE POLICY "Admins can view all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Qualquer um pode criar cliente (para guest checkout)
CREATE POLICY "Anyone can create customer"
  ON customers
  FOR INSERT
  WITH CHECK (true);

-- Política: Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update their own customer data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Política: Admins podem atualizar qualquer cliente
CREATE POLICY "Admins can update any customer"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- PEDIDOS
-- ============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios pedidos
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Política: Admins podem ver todos os pedidos
CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Qualquer um pode criar pedido (guest checkout)
CREATE POLICY "Anyone can create order"
  ON orders
  FOR INSERT
  WITH CHECK (true);

-- Política: Admins podem atualizar pedidos
CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- ITENS DO PEDIDO
-- ============================================

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver itens dos seus próprios pedidos
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT orders.id FROM orders
      INNER JOIN customers ON orders.customer_id = customers.id
      WHERE customers.user_id = auth.uid()
    )
  );

-- Política: Admins podem ver todos os itens
CREATE POLICY "Admins can view all order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Qualquer um pode criar itens de pedido (com o pedido)
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  WITH CHECK (true);

-- Política: Admins podem atualizar itens de pedido
CREATE POLICY "Admins can update order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- HISTÓRICO DE STOCK
-- ============================================

ALTER TABLE stock_history ENABLE ROW LEVEL SECURITY;

-- Política: Admins podem ver todo o histórico
CREATE POLICY "Admins can view stock history"
  ON stock_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Sistema pode inserir no histórico (via trigger ou função)
CREATE POLICY "System can insert stock history"
  ON stock_history
  FOR INSERT
  WITH CHECK (true);

-- Política: Admins podem inserir manualmente no histórico
CREATE POLICY "Admins can insert stock history"
  ON stock_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- OBSERVAÇÕES
-- ============================================

-- IMPORTANTE: Para guest checkout funcionar, as políticas permitem
-- INSERT sem autenticação nas tabelas customers, orders e order_items.
-- A segurança é mantida através de:
-- 1. Validação no backend (Server Actions)
-- 2. Webhooks assinados dos gateways de pagamento
-- 3. Rate limiting nos endpoints
-- 4. CSRF protection nos formulários

-- Para produção, considere adicionar:
-- - IP rate limiting
-- - CAPTCHA no checkout
-- - Validação adicional de email




