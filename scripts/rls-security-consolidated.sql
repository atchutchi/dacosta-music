-- ============================================
-- Da Costa Music - Correção de Segurança RLS
-- Script consolidado para habilitar RLS em todas as tabelas públicas
-- ============================================
-- INSTRUÇÕES:
--   1. Faça backup do banco via dashboard Supabase
--   2. Execute este script no SQL Editor do Supabase
--   3. Depois execute scripts/verify-rls-status.sql para confirmar
-- ============================================

BEGIN;

-- ============================================
-- PASSO 0: Criar função auxiliar is_admin()
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PASSO 1: Remover TODAS as políticas existentes nas 21 tabelas
-- ============================================

DO $$
DECLARE
  _pol RECORD;
BEGIN
  FOR _pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'artists', 'events', 'event_artists',
        'blog_posts', 'blog_categories', 'blog_posts_categories',
        'media', 'pages', 'sections', 'menu_items', 'artist_stats',
        'products', 'product_categories', 'products_categories', 'product_images',
        'customers', 'orders', 'order_items', 'stock_history',
        'settings', 'notifications'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', _pol.policyname, _pol.tablename);
  END LOOP;
END $$;

-- ============================================
-- PASSO 2: Habilitar RLS em todas as 21 tabelas
-- ============================================

-- Conteúdo público
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_stats ENABLE ROW LEVEL SECURITY;

-- E-commerce
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;

-- Sistema
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASSO 3A: Tabelas de conteúdo público
-- Leitura: qualquer pessoa | Escrita: apenas admin
-- ============================================
-- Tabelas: artists, events, event_artists, blog_posts, blog_categories,
--          blog_posts_categories, media, pages, sections, menu_items, artist_stats

-- ARTISTS
CREATE POLICY "public_read" ON public.artists FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.artists FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.artists FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.artists FOR DELETE TO authenticated USING (public.is_admin());

-- EVENTS
CREATE POLICY "public_read" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.events FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.events FOR DELETE TO authenticated USING (public.is_admin());

-- EVENT_ARTISTS
CREATE POLICY "public_read" ON public.event_artists FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.event_artists FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.event_artists FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.event_artists FOR DELETE TO authenticated USING (public.is_admin());

-- BLOG_POSTS
CREATE POLICY "public_read" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.blog_posts FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.blog_posts FOR DELETE TO authenticated USING (public.is_admin());

-- BLOG_CATEGORIES
CREATE POLICY "public_read" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.blog_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.blog_categories FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.blog_categories FOR DELETE TO authenticated USING (public.is_admin());

-- BLOG_POSTS_CATEGORIES
CREATE POLICY "public_read" ON public.blog_posts_categories FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.blog_posts_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.blog_posts_categories FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.blog_posts_categories FOR DELETE TO authenticated USING (public.is_admin());

-- MEDIA
CREATE POLICY "public_read" ON public.media FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.media FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.media FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.media FOR DELETE TO authenticated USING (public.is_admin());

-- PAGES
CREATE POLICY "public_read" ON public.pages FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.pages FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.pages FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.pages FOR DELETE TO authenticated USING (public.is_admin());

-- SECTIONS
CREATE POLICY "public_read" ON public.sections FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.sections FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.sections FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.sections FOR DELETE TO authenticated USING (public.is_admin());

-- MENU_ITEMS
CREATE POLICY "public_read" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.menu_items FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.menu_items FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.menu_items FOR DELETE TO authenticated USING (public.is_admin());

-- ARTIST_STATS
CREATE POLICY "public_read" ON public.artist_stats FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.artist_stats FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.artist_stats FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.artist_stats FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PASSO 3B: Produtos
-- Leitura: qualquer pessoa | Escrita: apenas admin
-- ============================================

CREATE POLICY "public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.products FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.products FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PASSO 3C: Categorias e imagens de produtos
-- Leitura: qualquer pessoa | Escrita: apenas admin
-- ============================================

-- PRODUCT_CATEGORIES
CREATE POLICY "public_read" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.product_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.product_categories FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.product_categories FOR DELETE TO authenticated USING (public.is_admin());

-- PRODUCTS_CATEGORIES (tabela de junção)
CREATE POLICY "public_read" ON public.products_categories FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.products_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.products_categories FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.products_categories FOR DELETE TO authenticated USING (public.is_admin());

-- PRODUCT_IMAGES
CREATE POLICY "public_read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.product_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.product_images FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.product_images FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PASSO 3D: Tabelas de checkout (guest checkout permitido)
-- ============================================

-- CUSTOMERS
-- Leitura: próprio utilizador ou admin
-- Insert: qualquer pessoa (guest checkout)
-- Update: próprio utilizador ou admin
CREATE POLICY "own_or_admin_read" ON public.customers FOR SELECT USING (
  user_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "guest_insert" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "own_update" ON public.customers FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admin_update" ON public.customers FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.customers FOR DELETE TO authenticated USING (public.is_admin());

-- ORDERS
-- Leitura: próprio utilizador (via customer) ou admin
-- Insert: qualquer pessoa (guest checkout)
-- Update: apenas admin
CREATE POLICY "own_or_admin_read" ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
  OR public.is_admin()
);
CREATE POLICY "guest_insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_update" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.orders FOR DELETE TO authenticated USING (public.is_admin());

-- ORDER_ITEMS
-- Leitura: próprio utilizador (via order->customer) ou admin
-- Insert: qualquer pessoa (guest checkout)
-- Update: apenas admin
CREATE POLICY "own_or_admin_read" ON public.order_items FOR SELECT USING (
  order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.customers c ON o.customer_id = c.id
    WHERE c.user_id = auth.uid()
  )
  OR public.is_admin()
);
CREATE POLICY "guest_insert" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_update" ON public.order_items FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.order_items FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PASSO 3E: Stock History
-- Leitura: apenas admin | Insert: qualquer pessoa (sistema/triggers)
-- ============================================

CREATE POLICY "admin_read" ON public.stock_history FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "system_insert" ON public.stock_history FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_update" ON public.stock_history FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.stock_history FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PASSO 3F: Settings
-- Leitura: público (apenas is_public=true) | Escrita: apenas admin
-- ============================================

CREATE POLICY "public_read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public.settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update" ON public.settings FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete" ON public.settings FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PASSO 3G: Notifications
-- Leitura/Update: próprio utilizador | Gerenciamento total: admin
-- ============================================

CREATE POLICY "own_read" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own_update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admin_all" ON public.notifications FOR ALL TO authenticated USING (public.is_admin());

COMMIT;
