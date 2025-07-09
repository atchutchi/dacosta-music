-- Script para habilitar Row Level Security (RLS) em todas as tabelas públicas
-- Execute este script no SQL Editor do Supabase para resolver os problemas de segurança

-- Habilitar RLS em todas as tabelas públicas
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Políticas de LEITURA PÚBLICA para conteúdo que deve ser visível para todos

-- Artists (público pode ver artistas)
CREATE POLICY "Allow public read access to artists" ON public.artists
    FOR SELECT USING (true);

-- Events (público pode ver eventos)
CREATE POLICY "Allow public read access to events" ON public.events
    FOR SELECT USING (true);

-- Event Artists (público pode ver relação eventos-artistas)
CREATE POLICY "Allow public read access to event_artists" ON public.event_artists
    FOR SELECT USING (true);

-- Blog Posts (público pode ver posts do blog)
CREATE POLICY "Allow public read access to blog_posts" ON public.blog_posts
    FOR SELECT USING (true);

-- Blog Categories (público pode ver categorias do blog)
CREATE POLICY "Allow public read access to blog_categories" ON public.blog_categories
    FOR SELECT USING (true);

-- Blog Posts Categories (público pode ver relação posts-categorias)
CREATE POLICY "Allow public read access to blog_posts_categories" ON public.blog_posts_categories
    FOR SELECT USING (true);

-- Media (público pode ver mídia)
CREATE POLICY "Allow public read access to media" ON public.media
    FOR SELECT USING (true);

-- Products (público pode ver produtos)
CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

-- Product Categories (público pode ver categorias de produtos)
CREATE POLICY "Allow public read access to product_categories" ON public.product_categories
    FOR SELECT USING (true);

-- Products Categories (público pode ver relação produtos-categorias)
CREATE POLICY "Allow public read access to products_categories" ON public.products_categories
    FOR SELECT USING (true);

-- Product Images (público pode ver imagens de produtos)
CREATE POLICY "Allow public read access to product_images" ON public.product_images
    FOR SELECT USING (true);

-- Pages (público pode ver páginas)
CREATE POLICY "Allow public read access to pages" ON public.pages
    FOR SELECT USING (true);

-- Sections (público pode ver seções)
CREATE POLICY "Allow public read access to sections" ON public.sections
    FOR SELECT USING (true);

-- Menu Items (público pode ver itens do menu)
CREATE POLICY "Allow public read access to menu_items" ON public.menu_items
    FOR SELECT USING (true);

-- Artist Stats (público pode ver estatísticas de artistas)
CREATE POLICY "Allow public read access to artist_stats" ON public.artist_stats
    FOR SELECT USING (true);

-- Settings (público pode ver algumas configurações - ajustar conforme necessário)
CREATE POLICY "Allow public read access to public_settings" ON public.settings
    FOR SELECT USING (is_public = true);

-- Políticas de ESCRITA APENAS PARA USUÁRIOS AUTENTICADOS

-- Artists (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage artists" ON public.artists
    FOR ALL USING (auth.role() = 'authenticated');

-- Events (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage events" ON public.events
    FOR ALL USING (auth.role() = 'authenticated');

-- Event Artists (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage event_artists" ON public.event_artists
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog Posts (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage blog_posts" ON public.blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog Categories (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage blog_categories" ON public.blog_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog Posts Categories (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage blog_posts_categories" ON public.blog_posts_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Media (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage media" ON public.media
    FOR ALL USING (auth.role() = 'authenticated');

-- Products (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Product Categories (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage product_categories" ON public.product_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Products Categories (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage products_categories" ON public.products_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Product Images (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage product_images" ON public.product_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Pages (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage pages" ON public.pages
    FOR ALL USING (auth.role() = 'authenticated');

-- Sections (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage sections" ON public.sections
    FOR ALL USING (auth.role() = 'authenticated');

-- Menu Items (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage menu_items" ON public.menu_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Artist Stats (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage artist_stats" ON public.artist_stats
    FOR ALL USING (auth.role() = 'authenticated');

-- Settings (apenas usuários autenticados podem modificar)
CREATE POLICY "Allow authenticated users to manage settings" ON public.settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas ESPECÍFICAS para tabelas sensíveis

-- Profiles (usuários podem ver apenas o próprio perfil e perfis públicos)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR is_public = true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow signup" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders (usuários podem ver apenas as próprias compras)
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Order Items (usuários podem ver apenas itens das próprias compras)
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Notifications (usuários podem ver apenas as próprias notificações)
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins podem fazer tudo
CREATE POLICY "Admins can manage notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Política para admins em todas as tabelas (sobrescreve outras políticas)
-- Nota: Ajuste conforme a estrutura da sua tabela de perfis

-- Comentário: Descomente as linhas abaixo se você tiver uma coluna 'role' na tabela profiles
/*
CREATE POLICY "Admins can manage all artists" ON public.artists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
*/

-- Para verificar as políticas criadas, execute:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname; 