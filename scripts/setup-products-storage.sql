-- ============================================
-- CONFIGURAR STORAGE POLICIES PARA BUCKET 'products'
-- Execute este script no Supabase SQL Editor
-- IMPORTANTE: Crie o bucket 'products' no Supabase Dashboard primeiro!
-- ============================================

-- 1. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update products images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete products images" ON storage.objects;

-- 2. Política de leitura pública (qualquer um pode ver imagens)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- 3. Política de upload para usuários autenticados
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

-- 4. Política de atualização para admins
CREATE POLICY "Admins can update products images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'products'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5. Política de exclusão para admins
CREATE POLICY "Admins can delete products images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'products'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. Verificar se o bucket existe
-- Se retornar 0, você precisa criar o bucket no Supabase Dashboard
SELECT COUNT(*) as bucket_exists
FROM storage.buckets
WHERE name = 'products';

