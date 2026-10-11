BEGIN;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_by_size jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stock_reserved boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notification_sent_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_checkout_session_unique
  ON public.orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.valid_product_size_stock(p_stock jsonb, p_quantity integer, p_sizes text[])
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = public, pg_temp AS $$
DECLARE item record; quantity_sum bigint := 0; size_count integer := 0;
BEGIN
  IF p_stock IS NULL THEN RETURN true; END IF;
  IF jsonb_typeof(p_stock) <> 'object' OR coalesce(cardinality(p_sizes), 0) = 0 THEN RETURN false; END IF;
  FOR item IN SELECT key, value FROM jsonb_each_text(p_stock) LOOP
    IF NOT item.key = ANY(p_sizes) OR item.value IS NULL OR jsonb_typeof(p_stock -> item.key) <> 'number'
      OR item.value !~ '^[0-9]+$' THEN RETURN false; END IF;
    quantity_sum := quantity_sum + item.value::bigint;
    size_count := size_count + 1;
  END LOOP;
  RETURN quantity_sum = p_quantity AND size_count = cardinality(p_sizes);
EXCEPTION WHEN numeric_value_out_of_range THEN RETURN false;
END;
$$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_size_stock_consistent' AND conrelid = 'public.products'::regclass) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_size_stock_consistent
      CHECK (public.valid_product_size_stock(stock_by_size, stock_quantity, sizes));
  END IF;
END; $$;

-- Executar exclusivamente no servidor com service_role. Cada operação é uma transacção.
CREATE OR REPLACE FUNCTION public.apply_order_stock(p_order_id uuid, p_action text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  order_row public.orders%ROWTYPE;
  product_row public.products%ROWTYPE;
  item record;
  change integer;
  size_stock integer;
  next_sizes jsonb;
BEGIN
  IF p_action NOT IN ('reserve', 'release') THEN RAISE EXCEPTION 'Invalid stock action'; END IF;
  SELECT * INTO order_row FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF order_row.payment_status = 'paid' THEN RETURN false; END IF;
  IF p_action = 'reserve' AND order_row.stock_reserved THEN RETURN false; END IF;
  IF p_action = 'release' AND NOT order_row.stock_reserved THEN RETURN false; END IF;
  IF p_action = 'reserve' AND order_row.payment_status <> 'pending' THEN RAISE EXCEPTION 'Order is not pending'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.order_items WHERE order_id = p_order_id) THEN RAISE EXCEPTION 'Empty order'; END IF;

  -- A ordenação mantém a ordem dos bloqueios entre encomendas concorrentes.
  FOR item IN
    SELECT product_id, size, color, sum(quantity)::integer AS quantity
    FROM public.order_items WHERE order_id = p_order_id
    GROUP BY product_id, size, color ORDER BY product_id, size, color
  LOOP
    SELECT * INTO product_row FROM public.products WHERE id = item.product_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;
    IF item.quantity < 1 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
    change := CASE WHEN p_action = 'reserve' THEN -item.quantity ELSE item.quantity END;
    next_sizes := product_row.stock_by_size;
    IF p_action = 'reserve' THEN
      IF NOT product_row.active THEN RAISE EXCEPTION 'Product inactive'; END IF;
      IF cardinality(product_row.sizes) > 0 AND (item.size IS NULL OR NOT item.size = ANY(product_row.sizes)) THEN
        RAISE EXCEPTION 'Invalid product size';
      END IF;
      IF cardinality(product_row.colors) > 0 AND (item.color IS NULL OR NOT item.color = ANY(product_row.colors)) THEN
        RAISE EXCEPTION 'Invalid product color';
      END IF;
      IF product_row.stock_quantity < item.quantity THEN RAISE EXCEPTION 'Insufficient stock'; END IF;
    END IF;
    IF next_sizes IS NOT NULL THEN
      IF item.size IS NULL OR NOT next_sizes ? item.size THEN RAISE EXCEPTION 'Invalid size stock'; END IF;
      size_stock := (next_sizes ->> item.size)::integer;
      IF size_stock + change < 0 THEN RAISE EXCEPTION 'Insufficient size stock'; END IF;
      next_sizes := jsonb_set(next_sizes, ARRAY[item.size], to_jsonb(size_stock + change));
    END IF;
    UPDATE public.products SET stock_quantity = stock_quantity + change, stock_by_size = next_sizes
    WHERE id = product_row.id;
  END LOOP;
  UPDATE public.orders SET stock_reserved = (p_action = 'reserve') WHERE id = p_order_id;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_stripe_order(
  p_order_id uuid, p_session_id text, p_payment_intent text, p_amount_total bigint, p_currency text
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE order_row public.orders%ROWTYPE;
BEGIN
  SELECT * INTO order_row FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF p_session_id IS NULL OR p_session_id IS DISTINCT FROM coalesce(order_row.stripe_checkout_session_id, order_row.payment_intent_id) THEN
    RAISE EXCEPTION 'Payment session mismatch';
  END IF;
  IF p_amount_total IS DISTINCT FROM round(order_row.total * 100)::bigint
     OR upper(p_currency) IS DISTINCT FROM upper(order_row.currency) THEN RAISE EXCEPTION 'Payment amount or currency mismatch'; END IF;
  IF order_row.payment_status = 'paid' THEN RETURN false; END IF;
  IF order_row.payment_status <> 'pending' THEN RAISE EXCEPTION 'Order is not pending'; END IF;
  -- Compatibilidade com sessões pendentes anteriores à migração.
  IF NOT order_row.stock_reserved THEN PERFORM public.apply_order_stock(p_order_id, 'reserve'); END IF;
  UPDATE public.orders SET status = 'paid', payment_status = 'paid', payment_intent_id = p_payment_intent
    WHERE id = p_order_id;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_stripe_order(p_order_id uuid, p_session_id text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE order_row public.orders%ROWTYPE;
BEGIN
  SELECT * INTO order_row FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND OR order_row.payment_status <> 'pending' THEN RETURN false; END IF;
  IF p_session_id IS NULL OR p_session_id IS DISTINCT FROM coalesce(order_row.stripe_checkout_session_id, order_row.payment_intent_id) THEN RETURN false; END IF;
  PERFORM public.apply_order_stock(p_order_id, 'release');
  UPDATE public.orders SET status = 'cancelled', payment_status = 'failed' WHERE id = p_order_id;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_order_stock(uuid,text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_stripe_order(uuid,text,text,bigint,text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_stripe_order(uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_order_stock(uuid,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_stripe_order(uuid,text,text,bigint,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_stripe_order(uuid,text) TO service_role;

COMMIT;
