-- ============================================
-- CONFIGURAR BUCKET 'products' - SCRIPT CORRETO
-- Execute este script no Supabase SQL Editor
-- ============================================

-- ============================================
-- PASSO 1: Verificar se o bucket existe
-- ============================================
SELECT 
  name,
  public,
  created_at
FROM storage.buckets
WHERE name = 'products';

-- Se retornar 0 rows:
-- 1. Vá para Supabase Dashboard → Storage
-- 2. Clique em "New bucket"
-- 3. Nome: products
-- 4. Marque como "Public"
-- 5. Clique em "Create bucket"
-- 6. Depois volte aqui e execute o PASSO 2

-- ============================================
-- PASSO 2: Remover políticas antigas (se existirem)
-- ============================================
DROP POLICY IF EXISTS "Public Access products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
DROP POLICY IF EXISTS "Admins update products images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete products images" ON storage.objects;

-- ============================================
-- PASSO 3: Criar política de LEITURA PÚBLICA
-- ============================================
CREATE POLICY "Public Access products"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- ============================================
-- PASSO 4: Criar política de UPLOAD para autenticados
-- ============================================
CREATE POLICY "Authenticated upload products"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

-- ============================================
-- PASSO 5: Criar política de ATUALIZAÇÃO para autenticados
-- ============================================
CREATE POLICY "Authenticated update products"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products');

-- ============================================
-- PASSO 6: Criar política de EXCLUSÃO para autenticados
-- ============================================
CREATE POLICY "Authenticated delete products"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');

-- ============================================
-- PASSO 7: Verificar políticas criadas
-- ============================================
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%products%';

-- Deve mostrar 4 políticas:
-- - Public Access products (SELECT)
-- - Authenticated upload products (INSERT)
-- - Authenticated update products (UPDATE)
-- - Authenticated delete products (DELETE)

-- ============================================
-- PASSO 8: Verificar se o bucket está público
-- ============================================
SELECT 
  name,
  public as is_public,
  CASE 
    WHEN public = true THEN '✅ PÚBLICO'
    ELSE '❌ PRIVADO - Mude para público!'
  END as status
FROM storage.buckets
WHERE name = 'products';

-- ============================================
-- RESUMO DE CONFIGURAÇÃO
-- ============================================
SELECT 
  'Configuração do bucket products:' as tipo,
  (SELECT COUNT(*) FROM storage.buckets WHERE name = 'products') as bucket_existe,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%products%') as total_policies,
  (SELECT public FROM storage.buckets WHERE name = 'products') as is_public;

-- Resultado esperado:
-- bucket_existe: 1
-- total_policies: 4
-- is_public: true

-- ============================================
-- PRONTO!
-- ============================================
-- Agora você pode:
-- 1. Fazer logout e login novamente (limpar sessão)
-- 2. Tentar adicionar produto com imagem
-- 3. Upload deve funcionar!

