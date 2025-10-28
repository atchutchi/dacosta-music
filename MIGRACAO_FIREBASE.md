# 🚀 Migração para Firebase Hosting + Cloud Functions

Este documento descreve a migração do projeto DaCosta Music para Firebase Hosting com Cloud Functions.

## 📋 Visão Geral

A migração move as rotas API do Next.js para Firebase Cloud Functions, mantendo o frontend como site estático hospedado no Firebase Hosting.

### Estrutura Atual:
```
┌─────────────────────────────────────┐
│   Firebase Hosting (Next.js Export)  │
│   ├─ Páginas HTML estáticas        │
│   ├─ Imagens/Vídeos               │
│   └─ Reescrita de URLs            │
└─────────────────────────────────────┘
           ↓
    (rewrite /api/**)
           ↓
┌─────────────────────────────────────┐
│ Firebase Cloud Functions (Express)  │
│ ├─ GET /api/artists               │
│ ├─ POST /api/artists              │
│ ├─ GET /api/events                │
│ ├─ POST /api/events               │
│ └─ ...                            │
└─────────────────────────────────────┘
           ↓
      Supabase
```

## 📁 Ficheiros Alterados

### 1. `next.config.mjs`
- Removido `output: 'export'` para manter suporte a funcionalidades dinâmicas
- Mantido `images: { unoptimized: true }` para compatibilidade com Firebase

### 2. `firebase.json`
- Configurado hosting para usar `.next/standalone/public`
- Adicionadas rewrites para `/api/**` → Cloud Function `api`
- Adicionados headers para segurança e cache

### 3. `.firebaserc`
- Configuração do projeto Firebase: `dacosta-music`

### 4. Nova pasta `functions/`
```
functions/
├── index.js           # Express app com todas as rotas API
├── package.json       # Dependências da função
├── .gitignore        # Ficheiros ignorados
└── README.md         # Documentação das Cloud Functions
```

## 🧪 Testar Localmente

### Pré-requisitos:
```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Autenticar com Firebase
firebase login
```

### 1. Instalar dependências da função:
```bash
cd functions
npm install
cd ..
```

### 2. Executar emuladores:
```bash
firebase emulators:start
```

Isto iniciará:
- **Hosting emulator**: http://localhost:5000
- **Functions emulator**: http://localhost:5001

### 3. Testar as rotas API:
```bash
# Health check
curl http://localhost:5001/dacosta-music/us-central1/api/health

# Listar artistas
curl http://localhost:5001/dacosta-music/us-central1/api/artists

# Criar artista
curl -X POST http://localhost:5001/dacosta-music/us-central1/api/artists \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Artist", "slug": "test-artist"}'
```

## 🚀 Deploy para Produção

### 1. Build do Next.js:
```bash
npm run build
```

### 2. Deploy das Cloud Functions:
```bash
firebase deploy --only functions
```

### 3. Deploy do Hosting:
```bash
firebase deploy --only hosting
```

### 4. Deploy completo (funções + hosting):
```bash
firebase deploy
```

## 🔧 Variáveis de Ambiente

Configure as variáveis no Firebase:

```bash
firebase functions:config:set supabase.url="https://oxplahazlmpcpkelpolv.supabase.co"
firebase functions:config:set supabase.key="your-supabase-key"

# Fazer deploy após configurar
firebase deploy --only functions
```

Ou adicionar ao ficheiro `.env.local`:
```env
SUPABASE_URL=https://oxplahazlmpcpkelpolv.supabase.co
SUPABASE_KEY=your-supabase-key
```

## 📊 Rotas API Disponíveis

### Artistas
- `GET /api/artists` - Listar todos
- `POST /api/artists` - Criar
- `GET /api/artists/:slug` - Obter por slug
- `PUT /api/artists/:slug` - Atualizar
- `DELETE /api/artists/:slug` - Eliminar

### Eventos
- `GET /api/events` - Listar todos
- `POST /api/events` - Criar
- `GET /api/events/:id` - Obter por ID
- `PUT /api/events/:id` - Atualizar
- `DELETE /api/events/:id` - Eliminar

### Saúde
- `GET /api/health` - Health check

## ⚠️ Notas Importantes

### Upload de Ficheiros
- O endpoint `/api/upload` ainda necessita configuração com `multer`
- Será implementado com Firebase Storage em versão futura

### CORS
- CORS está habilitado para todas as origens por padrão
- Para restringir, editar o middleware em `functions/index.js`

### Região
- As funções são deployadas em `us-central1` (padrão)
- Para mudar, editar `firebase.json` ou usar Firebase Console

## 📝 Checklist de Deploy

- [ ] Confirmar que `npm run build` compila sem erros
- [ ] Testar localmente com `firebase emulators:start`
- [ ] Testar rotas API manualmente
- [ ] Configurar variáveis de ambiente no Firebase
- [ ] Fazer deploy com `firebase deploy`
- [ ] Testar URLs em produção
- [ ] Monitorar logs: `firebase functions:log`

## 🔗 Recursos Úteis

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Next.js with Firebase](https://firebase.google.com/docs/hosting/nextjs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

## 🆘 Troubleshooting

### Erro: "Cannot find module 'express'"
```bash
cd functions && npm install && cd ..
```

### Erro: "SUPABASE_URL not set"
```bash
firebase functions:config:set supabase.url="..." supabase.key="..."
```

### Erro 404 em /api
- Verificar que a rewrite em `firebase.json` está correta
- Confirmar que a função `api` foi deployada: `firebase functions:list`

### API lenta
- Verificar limites de execução das funções
- Considerar aumentar memória alocada em `firebase.json`

---

**Branch:** `migracao-firebase`  
**Última atualização:** 28 de outubro de 2025
