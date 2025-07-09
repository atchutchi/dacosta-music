-- Políticas de Storage para o bucket 'media'
-- Permite leitura pública de todos os arquivos
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('media', 'Permitir leitura pública', 
   '{"Select": {"rule": "true"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Permite upload apenas para usuários autenticados
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('media', 'Permitir upload para usuários autenticados', 
   '{"Insert": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Permite atualização apenas para usuários autenticados
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('media', 'Permitir atualização para usuários autenticados', 
   '{"Update": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Permite deleção apenas para usuários autenticados
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('media', 'Permitir deleção para usuários autenticados', 
   '{"Delete": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Políticas para o bucket 'events'
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('events', 'Permitir leitura pública', 
   '{"Select": {"rule": "true"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('events', 'Permitir upload para usuários autenticados', 
   '{"Insert": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('events', 'Permitir atualização para usuários autenticados', 
   '{"Update": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('events', 'Permitir deleção para usuários autenticados', 
   '{"Delete": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Políticas para o bucket 'images'
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('images', 'Permitir leitura pública', 
   '{"Select": {"rule": "true"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('images', 'Permitir upload para usuários autenticados', 
   '{"Insert": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Políticas para o bucket 'videos'
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('videos', 'Permitir leitura pública', 
   '{"Select": {"rule": "true"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('videos', 'Permitir upload para usuários autenticados', 
   '{"Insert": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Políticas para o bucket 'artists'
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('artists', 'Permitir leitura pública', 
   '{"Select": {"rule": "true"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING;

INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
VALUES 
  ('artists', 'Permitir upload para usuários autenticados', 
   '{"Insert": {"rule": "auth.role() = ''authenticated''"}}', 
   NULL)
ON CONFLICT (bucket_id, name) DO NOTHING; 