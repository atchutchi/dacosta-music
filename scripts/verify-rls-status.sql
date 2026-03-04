-- ============================================
-- Da Costa Music - Verificação de RLS
-- Execute após fix-rls-security.sql para confirmar que tudo está correto
-- ============================================

-- 1. Verificar quais tabelas têm RLS habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'artists', 'events', 'event_artists',
    'blog_posts', 'blog_categories', 'blog_posts_categories',
    'media', 'pages', 'sections', 'menu_items', 'artist_stats',
    'products', 'product_categories', 'products_categories', 'product_images',
    'customers', 'orders', 'order_items', 'stock_history',
    'settings', 'notifications'
  )
ORDER BY tablename;

-- 2. Listar todas as políticas RLS criadas
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS with_check_expression
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
ORDER BY tablename, policyname;

-- 3. Verificar tabelas públicas SEM RLS (deveria retornar 0 linhas)
SELECT
  schemaname,
  tablename,
  'RLS DESABILITADO - RISCO DE SEGURANÇA' AS status
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE '_prisma%'
ORDER BY tablename;

-- 4. Verificar que a função is_admin() existe
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'is_admin';

-- 5. Contagem de políticas por tabela (resumo)
SELECT
  tablename,
  COUNT(*) AS total_policies,
  COUNT(*) FILTER (WHERE cmd = 'SELECT') AS select_policies,
  COUNT(*) FILTER (WHERE cmd = 'INSERT') AS insert_policies,
  COUNT(*) FILTER (WHERE cmd = 'UPDATE') AS update_policies,
  COUNT(*) FILTER (WHERE cmd = 'DELETE') AS delete_policies,
  COUNT(*) FILTER (WHERE cmd = 'ALL') AS all_policies
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
GROUP BY tablename
ORDER BY tablename;
