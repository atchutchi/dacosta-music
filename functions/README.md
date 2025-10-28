# Firebase Cloud Functions - DaCosta Music

Este diretório contém as Cloud Functions para o projeto DaCosta Music, que foram migradas das rotas API do Next.js.

## Estrutura

- `index.js` - Função principal com Express app que expõe as rotas API
- `package.json` - Dependências e scripts

## Rotas Disponíveis

### Artistas
- `GET /api/artists` - Lista todos os artistas
- `POST /api/artists` - Criar novo artista
- `GET /api/artists/:slug` - Buscar artista por slug
- `PUT /api/artists/:slug` - Atualizar artista
- `DELETE /api/artists/:slug` - Eliminar artista

### Eventos
- `GET /api/events` - Lista todos os eventos
- `POST /api/events` - Criar novo evento
- `GET /api/events/:id` - Buscar evento por ID
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Eliminar evento

### Saúde
- `GET /api/health` - Health check

## Desenvolvimento Local

1. Instalar Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Autenticar com Firebase:
```bash
firebase login
```

3. Iniciar emuladores:
```bash
cd functions
npm install
npm run serve
```

As funções estarão disponíveis em `http://localhost:5001/dacosta-music/us-central1/api`

## Deploy

Para fazer deploy das funções:

```bash
firebase deploy --only functions
```

Ou apenas das funções + hosting:

```bash
firebase deploy --only functions,hosting
```

## Variáveis de Ambiente

As seguintes variáveis devem estar configuradas no Firebase:

- `SUPABASE_URL` - URL da instância Supabase
- `SUPABASE_KEY` - Chave pública do Supabase

Configure usando:

```bash
firebase functions:config:set supabase.url="..." supabase.key="..."
firebase deploy --only functions
```

## Notas

- O handler de upload necessita de configuração adicional com multer e firebase-admin storage
- CORS é habilitado por padrão para todas as origens
- As funções usam a região `us-central1` (padrão)

