# 📦 Guia Rápido de Deploy no Firebase

## 🚀 Deploy em 5 Passos

### 1. **Preparar o ambiente**
```bash
# Instalar Firebase CLI (primeira vez)
npm install -g firebase-tools

# Autenticar
firebase login
```

### 2. **Build do projeto**
```bash
npm run build
```

### 3. **Instalar dependências das Cloud Functions**
```bash
cd functions
npm install
cd ..
```

### 4. **Configurar variáveis de ambiente (se necessário)**
```bash
# Opcional: apenas se quiser alterar credenciais
firebase functions:config:set \
  supabase.url="https://oxplahazlmpcpkelpolv.supabase.co" \
  supabase.key="sua-chave-supabase"
```

### 5. **Fazer deploy**
```bash
# Deploy completo (funções + hosting)
firebase deploy

# Ou separadamente:
firebase deploy --only functions    # Apenas Cloud Functions
firebase deploy --only hosting      # Apenas Hosting
```

## 🧪 Testar Localmente Antes

```bash
# Iniciar emuladores locais
firebase emulators:start

# Em outro terminal, testar rotas
curl http://localhost:5001/dacosta-music/us-central1/api/health
curl http://localhost:5001/dacosta-music/us-central1/api/artists
```

## 📊 Monitorar Deploy

```bash
# Ver logs em tempo real
firebase functions:log

# Ver status do deploy
firebase hosting:channel:list

# Ver versões deployadas
firebase hosting:list
```

## 🔄 Rollback (Reverter Deploy)

```bash
# Se algo der errado, voltar à versão anterior
firebase hosting:rollback

# Ou fazer deploy da versão anterior manualmente
git checkout <commit-anterior>
npm run build
firebase deploy
```

## ⚠️ Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| `Cannot find module 'express'` | `cd functions && npm install && cd ..` |
| `SUPABASE_KEY not set` | `firebase functions:config:set supabase.key="..."` |
| Erro 404 em /api | Verificar firebase.json rewrites |
| API lenta | Aumentar memória em firebase.json ou verificar Supabase |
| Páginas não carreguam | Verificar que .next/standalone existe |

## 📝 Checklist Final

- [ ] `npm run build` compila sem erros
- [ ] `firebase emulators:start` funciona
- [ ] Testar `/api/health` localmente
- [ ] Variáveis de ambiente configuradas no Firebase
- [ ] `firebase deploy` completa com sucesso
- [ ] URLs públicas funcionam corretamente
- [ ] Logs mostram sucesso em `firebase functions:log`

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Projeto: dacosta-music](https://console.firebase.google.com/project/dacosta-music)
- [Cloud Functions Logs](https://console.firebase.google.com/project/dacosta-music/functions/list)
- [Hosting Dashboard](https://console.firebase.google.com/project/dacosta-music/hosting/main)

---

**Nota:** Esta branch (migracao-firebase) está pronta para fazer merge na main após testes completos.
