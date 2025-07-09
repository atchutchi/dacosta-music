# Configuração do Supabase Storage para Eventos

Este documento explica como configurar completamente o Supabase Storage para fazer upload de imagens e vídeos dos eventos no painel administrativo.

## 📋 Pré-requisitos

1. Conta no Supabase com projeto criado
2. Variáveis de ambiente configuradas no `.env.local`
3. Acesso ao painel do Supabase

## 🚀 Passos de Configuração

### 1. Criar os Buckets no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá para **Storage** no menu lateral
3. Clique em **New bucket** e crie os seguintes buckets:
   - `images` - Para imagens gerais
   - `videos` - Para vídeos
   - `events` - Para mídia específica de eventos
   - `artists` - Para fotos de artistas
   - `media` - Para mídia geral (blog, etc.)

**Importante:** Marque todos os buckets como **Public** durante a criação.

### 2. Configurar as Tabelas do Banco de Dados

Execute o script SQL em `scripts/create-events-table.sql` no SQL Editor do Supabase:

1. No Supabase Dashboard, vá para **SQL Editor**
2. Cole o conteúdo do arquivo `scripts/create-events-table.sql`
3. Execute o script

### 3. Configurar Políticas de Segurança dos Buckets

#### Opção A: Via Interface do Supabase

Para cada bucket criado:

1. Vá para **Storage** → Selecione o bucket
2. Clique em **Policies**
3. Adicione as seguintes políticas:

**Política de Leitura Pública:**
- Policy name: `Permitir leitura pública`
- Allowed operation: `SELECT`
- Target roles: deixe vazio (aplica para todos)
- Policy definition: `true`

**Política de Upload para Autenticados:**
- Policy name: `Permitir upload para autenticados`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition: `true`

#### Opção B: Via SQL

Execute o script em `scripts/setup-storage-policies.sql` no SQL Editor.

### 4. Criar Buckets via Admin Panel (Alternativa)

Se preferir criar os buckets diretamente pelo painel admin:

1. Acesse `/admin/settings` no seu site
2. Vá para a aba **Storage**
3. Clique em **Criar Bucket** para cada bucket que aparecer como não existente

### 5. Testar o Upload

1. Acesse `/admin/events`
2. Crie ou edite um evento
3. No campo **Event Image**, clique em **Selecionar Imagem**
4. Escolha uma imagem e aguarde o upload
5. A URL da imagem será preenchida automaticamente

## 🔧 Estrutura dos Arquivos

### Organização no Storage

```
supabase-storage/
├── events/
│   └── covers/
│       ├── event-name-1234567890.jpg
│       └── event-name-1234567891.png
├── media/
│   ├── blog/
│   └── general/
├── images/
├── videos/
└── artists/
```

### Componentes Principais

- **`lib/supabase/storage.ts`** - Funções utilitárias para upload/download
- **`components/ui/file-uploader.tsx`** - Componente de upload reutilizável
- **`app/api/upload/route.ts`** - API route para processar uploads
- **`app/admin/events/page.tsx`** - Página de gerenciamento de eventos

## 📝 Uso no Código

### Upload de Imagem em um Evento

```typescript
<FileUploader
  onFileUploaded={(url: string) => setNewEvent(prev => ({ ...prev, image: url }))}
  currentFileUrl={newEvent.image}
  bucket={BUCKET_EVENTS}
  folder="covers"
  acceptedFileTypes="image/*"
  maxSizeMB={10}
/>
```

### Upload de Vídeo

```typescript
<FileUploader
  onFileUploaded={(url: string) => setVideoUrl(url)}
  currentFileUrl={videoUrl}
  bucket={BUCKET_VIDEOS}
  folder="events"
  acceptedFileTypes="video/*"
  maxSizeMB={100}
/>
```

## ⚠️ Troubleshooting

### Erro: "Bucket não existe"

1. Verifique se o bucket foi criado no Supabase
2. Acesse `/admin/settings` e crie o bucket se necessário
3. Verifique as variáveis de ambiente

### Erro: "Permission denied"

1. Verifique se as políticas de segurança estão configuradas
2. Certifique-se de estar autenticado no admin
3. Verifique se o bucket está marcado como público

### Upload não funciona

1. Verifique o tamanho do arquivo (máximo configurado)
2. Verifique o tipo de arquivo permitido
3. Verifique a conexão com o Supabase nas configurações

## 🔐 Segurança

- Apenas usuários autenticados podem fazer upload
- Todos os arquivos são públicos para leitura
- Os nomes dos arquivos são sanitizados e recebem timestamp único
- Limite de tamanho configurável por tipo de arquivo

## 📚 Recursos Adicionais

- [Documentação do Supabase Storage](https://supabase.com/docs/guides/storage)
- [Políticas de Segurança RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guia de Upload de Arquivos](https://supabase.com/docs/guides/storage/uploads) 