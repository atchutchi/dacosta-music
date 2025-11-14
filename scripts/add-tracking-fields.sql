-- ============================================
-- Adicionar campos de tracking/envio aos pedidos
-- ============================================

-- Adicionar campos de tracking à tabela orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS carrier VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

-- Criar índice para buscar pedidos por tracking number
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- Criar índice para buscar pedidos enviados
CREATE INDEX IF NOT EXISTS idx_orders_shipped_at ON orders(shipped_at);

-- Comentários explicativos
COMMENT ON COLUMN orders.tracking_number IS 'Número de rastreamento da transportadora';
COMMENT ON COLUMN orders.tracking_url IS 'URL completa para rastreamento do pedido';
COMMENT ON COLUMN orders.carrier IS 'Nome da transportadora (DHL, FedEx, CTT, etc)';
COMMENT ON COLUMN orders.shipped_at IS 'Data e hora em que o pedido foi despachado';

-- Verificação: Listar todos os status possíveis de pedidos
SELECT DISTINCT status FROM orders;

-- Resultado esperado:
-- - pending: Pedido criado, aguardando pagamento
-- - paid: Pagamento confirmado, aguardando envio
-- - shipped: Pedido despachado/enviado
-- - delivered: Pedido entregue
-- - cancelled: Pedido cancelado

