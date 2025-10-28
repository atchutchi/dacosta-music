# 🔒 Guia de Segurança - DaCosta Music

## ⚠️ CRÍTICO: Gestão de Segredos

### ❌ O QUE NÃO FAZER:

```javascript
// ❌ NUNCA hardcode chaves no código!
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabaseUrl = "https://oxplahazlmpcpkelpolv.supabase.co";
```

Isto permite que **qualquer pessoa com acesso ao repositório** use as suas credenciais!

### ✅ O QUE FAZER:

```javascript
// ✅ SEMPRE use variáveis de ambiente
const apiKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

// ✅ Validar que existem
if (!apiKey || !supabaseUrl) {
  throw new Error('Variáveis de ambiente não configuradas');
}
```

## 📋 Configurar Variáveis de Ambiente

### Local (Desenvolvimento)

Criar ficheiro `.env.local` (automaticamente ignorado pelo git):

```bash
cp .env.example .env.local
# Editar e adicionar os valores reais
```

### Firebase (Produção)

```bash
firebase functions:config:set \
  supabase.url="https://your-project.supabase.co" \
  supabase.key="your-supabase-anon-key"
```

## 🔑 Tipos de Chaves e Onde Configurar

### Supabase
- **Tipo:** Anon Key (pública, segura para cliente)
- **Onde:** `.env.local` ou Firebase Config
- **Nunca:** Usar chave de serviço no frontend!

### Firebase
- **Tipo:** Múltiplas chaves (API Key, Auth Domain, etc.)
- **Onde:** `.env.local` para dev, Firebase Console para prod
- **Nota:** Firebase Keys são públicas mas seguras com Rules

### CSRF Token
- **Tipo:** Privado
- **Onde:** `.env.local` ou variável do servidor
- **Nunca:** Expor ao frontend!

## 🛡️ Proteções Ativas

### 1. `.gitignore`
```
.env           # Variáveis de ambiente
.env.local     # Desenvolvimento local
.env.*.local   # Ambiente específico
*.pem          # Certificados
```

### 2. `.env.example`
- Template com nomes das variáveis
- **SEM valores reais**
- Commitar para documentar configuração

### 3. Pre-commit Hooks (Recomendado)

Instalar `husky` e `lint-staged`:

```bash
npm install husky lint-staged --save-dev
npx husky install

# Criar hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Verificar se há secrets em files sendo commitados
git diff --cached --name-only | xargs grep -l "supabaseKey\|SUPABASE_KEY.*=" 2>/dev/null && {
  echo "❌ ERRO: Detectado possível secret no commit!"
  echo "Certifique-se de usar variáveis de ambiente"
  exit 1
}
EOF
chmod +x .husky/pre-commit
```

## 🔍 Verificar Exposição de Secrets

Se acidentalmente expôs um secret:

1. **Revogar a chave imediatamente:**
   - Supabase: Settings → API Keys → Regenerate
   - Firebase: Gerar nova chave na Console

2. **Limpar do histórico Git:**
   ```bash
   # Usar BFG Repo-Cleaner (mais seguro)
   bfg --delete-files "id_rsa" 
   git reflog expire --expire=now --all && git gc --prune=now
   ```

3. **Fazer força push:**
   ```bash
   git push --force-with-lease origin [branch]
   ```

4. **Notificar a equipa** para fazer pull da versão limpa

## 📱 GitHub Actions (CI/CD)

Se tiver workflows que usam secrets:

1. **Usar GitHub Secrets:**
```yaml
- name: Deploy
  env:
    SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  run: |
    firebase deploy --only functions
```

2. **Nunca fazer print de secrets:**
```yaml
# ❌ NUNCA
- run: echo $SUPABASE_KEY

# ✅ OK
- run: echo "Deploying..."
```

## 🔄 Rotation de Secrets (Recomendado)

Rodar regularmente (a cada 3-6 meses):

1. Gerar novas chaves
2. Atualizar em todos os ambientes
3. Revogar chaves antigas
4. Documentar no changelog

## 📊 Checklist de Segurança

- [ ] Nenhuma chave hardcoded no código
- [ ] `.env.local` adicionado ao `.gitignore`
- [ ] `.env.example` com template seguro
- [ ] Variáveis validadas na inicialização
- [ ] Secrets configurados no Firebase Console
- [ ] GitHub Secrets configurados (se usar Actions)
- [ ] Pre-commit hooks instalados
- [ ] Auditoria regular de logs de acesso

## 🚨 Incidentes de Segurança

Se descobrir um secret exposto:

1. **Não fazer panic** - é resolvível
2. **Agir rápido** - revogar a chave imediatamente
3. **Comunicar** - avisar a equipa
4. **Documentar** - registar o incidente
5. **Prevenir** - adicionar proteções

## 📚 Recursos

- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api/firebase-ml-rest-api)
- [Supabase Security](https://supabase.com/docs/guides/api/security)

---

**Última atualização:** 28 de outubro de 2025  
**Status:** 🔒 Crítico - Revisar regularmente
