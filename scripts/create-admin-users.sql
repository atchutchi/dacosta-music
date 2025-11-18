-- ============================================
-- Criar contas admin para equipa Da Costa Music
-- ============================================

-- Senha temporária para todos: ChangeMe123!
-- IMPORTANTE: Cada usuário deve mudar a senha no primeiro login

-- 1. Criar usuário: socials@dacosta-music.com
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Criar user no auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'socials@dacosta-music.com',
    crypt('ChangeMe123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO new_user_id;

  -- Criar profile com role admin
  IF new_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name, role)
    VALUES (new_user_id, 'socials@dacosta-music.com', 'Socials Team', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
END $$;

-- 2. Criar usuário: tatiana@dacosta-music.com
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'tatiana@dacosta-music.com',
    crypt('ChangeMe123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO new_user_id;

  IF new_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name, role)
    VALUES (new_user_id, 'tatiana@dacosta-music.com', 'Tatiana', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
END $$;

-- 3. Criar usuário: paulo@dacosta-music.com
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'paulo@dacosta-music.com',
    crypt('ChangeMe123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO new_user_id;

  IF new_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name, role)
    VALUES (new_user_id, 'paulo@dacosta-music.com', 'Paulo', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
END $$;

-- Verificar usuários criados
SELECT 
  u.email,
  p.name,
  p.role,
  u.email_confirmed_at as confirmed,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('socials@dacosta-music.com', 'tatiana@dacosta-music.com', 'paulo@dacosta-music.com')
ORDER BY u.email;

-- ============================================
-- CREDENCIAIS TEMPORÁRIAS
-- ============================================
-- Email: socials@dacosta-music.com
-- Senha: ChangeMe123!
-- Login: https://www.dacosta-music.com/login

-- Email: tatiana@dacosta-music.com  
-- Senha: ChangeMe123!
-- Login: https://www.dacosta-music.com/login

-- Email: paulo@dacosta-music.com
-- Senha: ChangeMe123!
-- Login: https://www.dacosta-music.com/login

-- IMPORTANTE: Cada usuário DEVE mudar a senha no primeiro login!
-- ============================================

