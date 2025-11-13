-- ============================================
-- Script de Verificação - Sistema de Loja
-- Execute este script para verificar se tudo está configurado corretamente
-- ============================================

-- 1. Verificar se as tabelas existem
SELECT 
    'TABLES CHECK' as check_type,
    COUNT(*) as found_tables,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ ALL TABLES EXIST'
        ELSE '❌ MISSING TABLES - Run create-shop-tables.sql'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'customers', 'orders', 'order_items', 'stock_history');

-- 2. Verificar estrutura da tabela products
SELECT 
    'PRODUCTS COLUMNS' as check_type,
    COUNT(*) as found_columns,
    CASE 
        WHEN COUNT(*) >= 15 THEN '✅ PRODUCTS TABLE OK'
        ELSE '❌ PRODUCTS TABLE INCOMPLETE'
    END as status
FROM information_schema.columns 
WHERE table_name = 'products';

-- 3. Listar todas as colunas de products (para debug)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 4. Verificar se a coluna 'active' existe
SELECT 
    'ACTIVE COLUMN CHECK' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'active'
        ) THEN '✅ Column active EXISTS'
        ELSE '❌ Column active MISSING - Run create-shop-tables.sql again'
    END as status;

-- 5. Verificar políticas RLS
SELECT 
    'RLS POLICIES CHECK' as check_type,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) >= 10 THEN '✅ RLS POLICIES OK'
        ELSE '⚠️ FEW POLICIES - Run setup-shop-rls.sql'
    END as status
FROM pg_policies 
WHERE tablename IN ('products', 'customers', 'orders', 'order_items', 'stock_history');

-- 6. Verificar bucket products
SELECT 
    'STORAGE BUCKET CHECK' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets WHERE name = 'products'
        ) THEN '✅ Bucket products EXISTS'
        ELSE '❌ Bucket products MISSING - Create it in Storage Dashboard'
    END as status;

-- 7. Verificar se bucket é público
SELECT 
    name,
    public,
    CASE 
        WHEN public = true THEN '✅ PUBLIC'
        ELSE '❌ NOT PUBLIC - Make it public!'
    END as status
FROM storage.buckets 
WHERE name = 'products';

-- 8. Verificar função generate_order_number
SELECT 
    'ORDER NUMBER FUNCTION' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname = 'generate_order_number'
        ) THEN '✅ Function EXISTS'
        ELSE '❌ Function MISSING'
    END as status;

-- 9. RESUMO FINAL
SELECT 
    '========== SUMMARY ==========' as summary,
    CASE 
        WHEN 
            (SELECT COUNT(*) FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name IN ('products', 'customers', 'orders', 'order_items', 'stock_history')) = 5
            AND
            (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'active') = 1
            AND
            (SELECT COUNT(*) FROM storage.buckets WHERE name = 'products') = 1
        THEN '✅✅✅ SETUP COMPLETE! Ready to add products! ✅✅✅'
        ELSE '❌❌❌ SETUP INCOMPLETE - Check errors above ❌❌❌'
    END as status;

