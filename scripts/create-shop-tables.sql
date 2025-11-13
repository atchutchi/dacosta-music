-- ============================================
-- Da Costa Music - E-commerce Database Schema
-- ============================================

-- Extensão para UUID (se ainda não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  sizes TEXT[], -- ['S', 'M', 'L', 'XL', 'XXL']
  colors TEXT[], -- ['Black', 'White', 'Red', 'Blue']
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  image_urls TEXT[], -- Array de URLs do Supabase Storage
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_artist_id ON products(artist_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- ============================================
-- TABELA: customers
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL para guest checkout
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- ============================================
-- TABELA: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL, -- DC-20250106-XXXX
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, processing, shipped, delivered, cancelled, refunded
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost DECIMAL(10,2) NOT NULL CHECK (shipping_cost >= 0),
  tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Endereço de envio
  shipping_name VARCHAR(255) NOT NULL,
  shipping_email VARCHAR(255) NOT NULL,
  shipping_phone VARCHAR(50),
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100),
  shipping_country VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(20) NOT NULL,
  
  -- Pagamento
  payment_method VARCHAR(50), -- stripe, paypal
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_intent_id VARCHAR(255), -- Stripe Payment Intent ID
  paypal_order_id VARCHAR(255), -- PayPal Order ID
  
  -- Envio
  shipping_method VARCHAR(100), -- manual, dhl, fedex
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON orders(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- TABELA: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL, -- Snapshot do nome
  product_image_url TEXT, -- Snapshot da primeira imagem
  size VARCHAR(10),
  color VARCHAR(50),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para itens do pedido
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- TABELA: stock_history
-- ============================================
CREATE TABLE IF NOT EXISTS stock_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  change_type VARCHAR(50) NOT NULL, -- sale, restock, adjustment, reservation, release
  quantity_change INTEGER NOT NULL, -- Positivo para aumento, negativo para diminuição
  quantity_after INTEGER NOT NULL CHECK (quantity_after >= 0),
  reference_id UUID, -- order_id se for venda/reserva
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Admin que fez o ajuste
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para histórico de stock
CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_change_type ON stock_history(change_type);
CREATE INDEX IF NOT EXISTS idx_stock_history_reference_id ON stock_history(reference_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created_at ON stock_history(created_at DESC);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para produtos
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para customers
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÃO: Gerar número de pedido único
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
  order_exists BOOLEAN;
BEGIN
  LOOP
    -- Formato: DC-YYYYMMDD-XXXX (XXXX = número aleatório de 4 dígitos)
    new_order_number := 'DC-' || 
                        TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_order_number) INTO order_exists;
    
    -- Se não existe, retornar
    IF NOT order_exists THEN
      RETURN new_order_number;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNÇÃO: Registrar mudança de stock
-- ============================================
CREATE OR REPLACE FUNCTION record_stock_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o stock_quantity mudou, registrar no histórico
  IF OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity THEN
    INSERT INTO stock_history (
      product_id,
      change_type,
      quantity_change,
      quantity_after,
      notes
    ) VALUES (
      NEW.id,
      'adjustment',
      NEW.stock_quantity - OLD.stock_quantity,
      NEW.stock_quantity,
      'Stock updated manually'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar mudanças de stock
DROP TRIGGER IF EXISTS track_stock_changes ON products;
CREATE TRIGGER track_stock_changes
    AFTER UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity)
    EXECUTE FUNCTION record_stock_change();

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================
COMMENT ON TABLE products IS 'Produtos disponíveis na loja (camisas, merchadising, etc)';
COMMENT ON TABLE customers IS 'Clientes (registrados via auth.users ou guest checkout)';
COMMENT ON TABLE orders IS 'Pedidos realizados pelos clientes';
COMMENT ON TABLE order_items IS 'Itens individuais de cada pedido';
COMMENT ON TABLE stock_history IS 'Histórico de mudanças no estoque para auditoria';

COMMENT ON COLUMN customers.user_id IS 'NULL para guest checkout, referencia auth.users para usuários registrados';
COMMENT ON COLUMN orders.order_number IS 'Número único do pedido no formato DC-YYYYMMDD-XXXX';
COMMENT ON COLUMN orders.status IS 'pending, paid, processing, shipped, delivered, cancelled, refunded';
COMMENT ON COLUMN orders.payment_status IS 'pending, paid, failed, refunded';
COMMENT ON COLUMN stock_history.change_type IS 'sale, restock, adjustment, reservation, release';
COMMENT ON COLUMN stock_history.quantity_change IS 'Positivo para aumento, negativo para diminuição';




