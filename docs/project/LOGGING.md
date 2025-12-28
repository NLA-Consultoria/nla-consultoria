# Sistema de Logging

Sistema customizado de logs para o NLA Portal com informações de ambiente, versão e configuração.

## 🎯 Objetivo

Facilitar monitoramento e debugging mostrando informações úteis ao iniciar o servidor:
- Ambiente (DEV/PROD)
- Versão e commit Git
- Configurações de analytics e webhooks
- Nível de log configurável

---

## 📋 Níveis de Log

Configure através da variável de ambiente `LOG_LEVEL`:

| Nível | Descrição | Quando usar |
|-------|-----------|-------------|
| **debug** | Logs completos + configurações de ambiente | Desenvolvimento local, staging |
| **info** | Logs básicos de inicialização | Produção (padrão) |
| **warn** | Apenas avisos e erros | Produção (minimal) |
| **error** | Apenas erros críticos | Produção (silent) |

---

## 🚀 Uso

### Local (desenvolvimento)

```bash
# .env.local
LOG_LEVEL=debug

# Rodar servidor
npm run dev
```

### Docker (produção)

```yaml
# deploy/stack-easypanel.yml
environment:
  LOG_LEVEL: "info"
```

### Docker (development)

```yaml
# deploy/stack-dev.yml
environment:
  LOG_LEVEL: "debug"
```

---

## 📊 Informações Exibidas

### Sempre exibido (todos os níveis)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NLA Portal - Landing Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment:    DEVELOPMENT
Version:        v0.1.0
Git Branch:     dev
Git Commit:     a19bdb7 (2025-12-28)
Node Version:   v20.11.0
Log Level:      DEBUG
```

### Exibido apenas em `LOG_LEVEL=debug`

```
⚙️  Environment Configuration:
────────────────────────────────────────────────────────────
  Site URL        https://dev.licitacoes.nlaconsultoria.com.br
  N8N Webhook     configured ✓
  GTM ID          not set
  PostHog         not set
  Clarity         configured ✓
  Meta Pixel      not set
```

---

## 🔧 Como Funciona

### 1. Script Customizado (`scripts/start.js`)

O script substitui o comando `next dev` ou `next start` padrão:

**Antes:**
```json
{
  "scripts": {
    "dev": "next dev",
    "start": "next start -p 3000"
  }
}
```

**Depois:**
```json
{
  "scripts": {
    "dev": "node scripts/start.js",
    "start": "NODE_ENV=production node scripts/start.js -p 3000"
  }
}
```

### 2. Fluxo de Execução

**Desenvolvimento (local):**
1. Script `start.js` é executado
2. Lê variáveis de ambiente e git info
3. Imprime banner com informações
4. Spawna processo `npx next dev`
5. Repassa STDIO (logs do Next.js aparecem normalmente)

**Produção (Docker standalone):**
1. Container inicia com `CMD ["node", "scripts/start.js"]`
2. Script lê variáveis de ambiente e git info (do .git copiado)
3. Imprime banner com informações
4. Detecta presença de `server.js` (standalone mode)
5. Spawna processo `node server.js`
6. Next.js standalone inicia e logs aparecem normalmente

### 3. Detecção de Ambiente

O script detecta o ambiente baseado em `NODE_ENV`:

```javascript
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
```

- `npm run dev` → DEVELOPMENT (verde claro)
- `npm run start` → PRODUCTION (verde escuro)

---

## 📝 Variáveis de Ambiente Monitoradas

O script verifica se as seguintes variáveis estão configuradas:

### Obrigatórias
- `NEXT_PUBLIC_SITE_URL` — URL do site

### Integrações
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` — Webhook N8N
- `NEXT_PUBLIC_AGENDA_URL` — Link agendamento
- `NEXT_PUBLIC_WHATSAPP_URL` — Link WhatsApp

### Analytics
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog
- `NEXT_PUBLIC_CLARITY_ID` — Microsoft Clarity
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel

**Nota:** Valores não são exibidos por segurança, apenas status "configured ✓" ou "not set ✗"

---

## 🎨 Cores e Formatação

O script usa ANSI escape codes para cores:

| Elemento | Cor | Código |
|----------|-----|--------|
| Banner | Azul brilhante | `\x1b[1m\x1b[34m` |
| PRODUCTION | Verde | `\x1b[32m` |
| DEVELOPMENT | Ciano | `\x1b[36m` |
| Versão | Magenta | `\x1b[35m` |
| Branch | Amarelo | `\x1b[33m` |
| Commit SHA | Dim | `\x1b[2m` |
| Configured ✓ | Verde | `\x1b[32m` |
| Not set ✗ | Amarelo | `\x1b[33m` |

---

## 🐛 Troubleshooting

### Logs não aparecem

**Problema:** Script roda mas não mostra informações

**Solução:**
```bash
# Verificar se LOG_LEVEL está configurado
echo $LOG_LEVEL

# Tentar com debug explícito
LOG_LEVEL=debug npm run dev
```

### Git info mostra "unknown"

**Problema:** Branch, commit SHA ou data aparecem como "unknown"

**Causa:** Não está em um repositório Git ou git não está instalado

**Solução:**
```bash
# Verificar git
git --version

# Verificar se está em repo
git status
```

### Script não inicia Next.js

**Problema:** Banner aparece mas servidor não sobe

**Solução:**
```bash
# Verificar se next está instalado
npm list next

# Reinstalar dependências
npm install

# Rodar Next.js diretamente (bypass script)
npx next dev
```

### Cores não aparecem

**Problema:** Terminal mostra códigos ANSI em vez de cores

**Causa:** Terminal não suporta cores (ex: alguns CIs)

**Solução:** As cores são opcionais e não afetam funcionalidade. Considere usar terminal moderno (iTerm2, Hyper, Windows Terminal).

---

## 🔄 Exemplo de Output

### Desenvolvimento (LOG_LEVEL=debug)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NLA Portal - Landing Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment:    DEVELOPMENT
Version:        v0.1.0
Git Branch:     dev
Git Commit:     a19bdb7 (2025-12-28)
Node Version:   v20.11.0
Log Level:      DEBUG

⚙️  Environment Configuration:
────────────────────────────────────────────────────────────
  Site URL        https://dev.licitacoes.nlaconsultoria.com.br
  N8N Webhook     configured ✓
  GTM ID          not set
  PostHog         not set
  Clarity         configured ✓
  Meta Pixel      not set

✓ Starting Next.js server...
  Port: 3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.5s
```

### Produção (LOG_LEVEL=info)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NLA Portal - Landing Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment:    PRODUCTION
Version:        v0.1.0
Git Branch:     main
Git Commit:     fcb76a8 (2025-12-27)
Node Version:   v20.11.0
Log Level:      INFO

✓ Starting Next.js server...
  Port: 3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ▲ Next.js 14.2.5
  - Local:        http://0.0.0.0:3000

 ✓ Ready in 1.2s
```

---

## 📚 Arquivos Relacionados

```
scripts/
└── start.js                      # Script de inicialização customizado

.env.example                      # Template produção (LOG_LEVEL=info)
.env.development.example          # Template desenvolvimento (LOG_LEVEL=debug)
.env.local                        # Configuração local

deploy/
├── stack-easypanel.yml          # Produção: LOG_LEVEL=info
└── stack-dev.yml                # Desenvolvimento: LOG_LEVEL=debug

package.json                     # Scripts npm usando start.js
```

---

## 🎯 Benefícios

1. **Visibilidade:** Sabe imediatamente em qual ambiente está rodando
2. **Rastreabilidade:** Identifica versão e commit deployados
3. **Debug:** Vê configurações sem expor valores sensíveis
4. **Monitoramento:** Facilita identificar problemas em logs do servidor
5. **Produtividade:** Informações úteis sem precisar rodar comandos extras

---

**Última atualização:** 2025-12-28
**Mantido por:** Equipe de Desenvolvimento NLA
