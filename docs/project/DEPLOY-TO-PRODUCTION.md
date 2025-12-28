# Deploy para Produção - Checklist Completo

Guia passo a passo para fazer merge de dev → main e deploy em produção com todas as mudanças implementadas.

## 📋 O que será deployado

### Funcionalidades Principais
- ✅ **Microsoft Clarity** (analytics comportamental)
  - Script inline (runtime)
  - Tracking de eventos customizados (CTAs, formulário, qualificação)
  - Identificação de usuários
- ✅ **Sistema de Logging Customizado**
  - Mostra ambiente, versão, commit SHA nos logs
  - Configurável via `LOG_LEVEL`
- ✅ **Deploy Automation** (skill + script)
- ✅ **Documentação Reorganizada** (analytics/, testing/, project/)
- ✅ **CLAUDE.md** para futuras instâncias

### Mudanças Técnicas
- Clarity mudou de npm package para script inline
- Logs customizados no startup do container
- Docker build com git info via build args
- Variáveis runtime vs build-time bem separadas

---

## 🎯 Pré-requisitos

- [ ] Clarity testado e funcionando em DEV
- [ ] Logs aparecendo corretamente em DEV
- [ ] Site DEV funcionando: https://automatize-nla-portal-dev.keoloh.easypanel.host/
- [ ] Todos os testes passando

---

## 📝 Checklist de Deploy

### Fase 1: Preparação (15 min)

#### 1.1 Verificar diferenças
```bash
# Ver todos os commits que vão para produção
git log main..dev --oneline

# Ver arquivos modificados
git diff main...dev --name-status

# Ver mudanças em arquivos críticos
git diff main...dev Dockerfile
git diff main...dev package.json
git diff main...dev deploy/stack-easypanel.yml
```

#### 1.2 Testar DEV uma última vez
- [ ] Acessar: https://automatize-nla-portal-dev.keoloh.easypanel.host/
- [ ] Testar formulário completo
- [ ] Verificar Clarity no console: `typeof window.clarity` → `"object"`
- [ ] Testar eventos: clicar CTAs, preencher formulário
- [ ] Verificar logs do container mostram SHA correto

---

### Fase 2: Configuração GitHub (5 min)

**IMPORTANTE:** Como Clarity agora é runtime, não precisa configurar variáveis build-time no GitHub para produção!

#### Verificar se já existem (se não, criar):
```
# Variáveis de BUILD (Settings → Variables)
NEXT_PUBLIC_SITE_URL (se não existir, criar)
NEXT_PUBLIC_N8N_WEBHOOK_URL
NEXT_PUBLIC_WHATSAPP_URL
NEXT_PUBLIC_GTM_ID (pode deixar vazio)
NEXT_PUBLIC_POSTHOG_KEY (pode deixar vazio)
NEXT_PUBLIC_META_PIXEL_ID (se tiver)
```

**Nota:** `CLARITY_ID` NÃO precisa no GitHub! É runtime agora.

---

### Fase 3: Atualizar Stack de Produção (5 min)

#### 3.1 Revisar stack-easypanel.yml

Arquivo já foi atualizado em dev. Verificar se está correto:

```yaml
# deploy/stack-easypanel.yml deve ter:
environment:
  # Analytics runtime (pode mudar sem rebuild)
  CLARITY_ID: ""  # ← NOVO! Adicionar

  # Logging (runtime - pode mudar sem rebuild)
  LOG_LEVEL: "info"  # ← NOVO! Adicionar
```

#### 3.2 Preparar valores para produção

**Clarity ID de Produção:**
- Opção 1: Usar mesmo ID de DEV (compartilhar projeto)
  - `CLARITY_ID=uscdlda0qf`
- Opção 2: Criar projeto separado no Clarity
  - Ir em: https://clarity.microsoft.com/
  - Criar novo projeto para produção
  - Usar novo ID

**Logging:**
- Produção: `LOG_LEVEL=info` (recomendado)
- Se quiser debug temporário: `LOG_LEVEL=debug`

---

### Fase 4: Criar Pull Request (10 min)

#### 4.1 Criar PR no GitHub

```bash
# Garantir que dev está atualizado
git checkout dev
git pull origin dev

# Ir para GitHub e criar PR
# https://github.com/NLA-Consultoria/nla-consultoria/compare/main...dev
```

**Ou via CLI:**
```bash
gh pr create \
  --base main \
  --head dev \
  --title "Release: Clarity analytics + logging system + docs" \
  --body "$(cat <<'EOF'
## 🚀 Release Notes

### Funcionalidades Adicionadas

**Microsoft Clarity Analytics:**
- ✅ Tracking de comportamento de usuários (heatmaps, session recordings)
- ✅ Eventos customizados (CTAs, formulário, qualificação de leads)
- ✅ Identificação de usuários após conversão
- ✅ Agora é runtime (configura via Easypanel, sem rebuild)

**Sistema de Logging:**
- ✅ Logs customizados mostram ambiente, versão, commit SHA
- ✅ Configurável via LOG_LEVEL (debug | info | warn | error)
- ✅ Facilita troubleshooting em produção

**Automação e Documentação:**
- ✅ Script de deploy automatizado (npm run deploy:dev)
- ✅ Skill deploy-dev reorganizada com best practices
- ✅ Documentação completa (analytics/, testing/, project/)
- ✅ CLAUDE.md para futuras instâncias

### Mudanças Técnicas

**Clarity:**
- ❌ Removido: pacote npm @microsoft/clarity
- ✅ Adicionado: script inline oficial Microsoft
- ✅ Variável mudou: NEXT_PUBLIC_CLARITY_ID → CLARITY_ID (runtime)

**Docker:**
- Git info via build args (SHA, branch, date)
- Logs customizados no container startup
- Standalone mode otimizado

**Build vs Runtime:**
- Build-time: NEXT_PUBLIC_* (requer rebuild)
- Runtime: CLARITY_ID, LOG_LEVEL (muda sem rebuild)

### Arquivos Modificados Principais

```
modified:   .env.example (+10 lines - CLARITY_ID, LOG_LEVEL)
modified:   .github/workflows/docker.yml (+9 lines - git args)
modified:   Dockerfile (+20 lines - git args, logging)
modified:   deploy/stack-easypanel.yml (+4 lines - CLARITY_ID, LOG_LEVEL)
modified:   package.json (+1 line - deploy:dev script)
modified:   components/clarity-tracker.tsx (npm → inline script)
modified:   lib/env.ts (aceita runtime + build-time)

new:        scripts/deploy-dev.js (automação)
new:        scripts/start.js (logging customizado)
new:        .claude/skills/deploy-dev/* (skill completa)
new:        docs/analytics/* (guias Clarity)
new:        docs/testing/* (testes Clarity)
new:        docs/project/* (deploy, logging)
new:        CLAUDE.md
```

### Variáveis de Ambiente Necessárias

**Runtime (Easypanel/Docker Compose):**
```
CLARITY_ID=uscdlda0qf  # Ou criar projeto novo
LOG_LEVEL=info
```

**Build-time (já configuradas ou não necessárias):**
- Variáveis NEXT_PUBLIC_* já existentes continuam funcionando

### Testado em DEV

- ✅ Site: https://automatize-nla-portal-dev.keoloh.easypanel.host/
- ✅ Clarity funcionando e rastreando eventos
- ✅ Logs customizados mostrando commit SHA correto
- ✅ Deploy automatizado funcionando
- ✅ Formulário e integrações OK

### Deployment

1. **Merge este PR**
2. **Aguardar GitHub Actions** build (~3min)
3. **Configurar variáveis** em produção:
   - Easypanel → nla-portal → Environment
   - Adicionar: `CLARITY_ID` e `LOG_LEVEL`
4. **Deploy** (pull nova imagem)
5. **Verificar** logs e Clarity funcionando

### Rollback (se necessário)

Se algo der errado:
```bash
# Reverter merge
git revert -m 1 <merge-commit-sha>
git push origin main

# Ou reset
git reset --hard <commit-anterior>
git push origin main --force
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

#### 4.2 Review do PR

- [ ] Verificar diff de arquivos importantes
- [ ] Confirmar que mudanças fazem sentido
- [ ] Verificar se não tem secrets expostos
- [ ] Aprovar PR (ou pedir review)

---

### Fase 5: Merge e Build (3 min)

#### 5.1 Fazer merge

**Via GitHub UI:**
- Clicar "Merge pull request"
- Escolher "Create a merge commit"
- Confirmar merge

**Ou via CLI:**
```bash
gh pr merge --merge --delete-branch=false
```

#### 5.2 Acompanhar build

```bash
# Via CLI
gh run watch

# Ou acessar:
# https://github.com/NLA-Consultoria/nla-consultoria/actions
```

**Aguardar ~3 minutos** até build completar.

Verificar se criou tags:
- `ghcr.io/nla-consultoria/nla-portal:latest`
- `ghcr.io/nla-consultoria/nla-portal:<SHA>`

---

### Fase 6: Configurar Produção (5 min)

#### 6.1 Acessar servidor/Easypanel de produção

**Opção A: Via Easypanel UI**
1. Acessar painel de produção
2. Ir em service `nla-portal`
3. Aba "Environment"

**Opção B: Via docker-compose**
1. SSH no servidor
2. Editar `deploy/stack-easypanel.yml` localmente

#### 6.2 Adicionar variáveis runtime

```yaml
environment:
  # ... variáveis existentes ...

  # Clarity (runtime - pode mudar sem rebuild)
  CLARITY_ID: "uscdlda0qf"  # Ou ID de produção

  # Logging (runtime - pode mudar sem rebuild)
  LOG_LEVEL: "info"  # Recomendado para produção
```

**IMPORTANTE:** Estas variáveis podem ser mudadas depois sem rebuild!

#### 6.3 Outros valores importantes

Verificar se estão configurados:
```yaml
NEXT_PUBLIC_SITE_URL: https://licitacoes.nlaconsultoria.com.br
NEXT_PUBLIC_N8N_WEBHOOK_URL: https://n8n.nlaconsultoria.com.br/webhook/...
NEXT_PUBLIC_WHATSAPP_URL: https://wa.me/556299696842?text=...
META_PIXEL_ID: (se tiver)
META_PIXEL_ACCESS_TOKEN: (se tiver)
```

---

### Fase 7: Deploy em Produção (2 min)

#### 7.1 Pull nova imagem

**Via Easypanel:**
- Clicar "Deploy" ou "Rebuild"
- Aguardar pull da imagem

**Via Docker:**
```bash
# SSH no servidor
docker pull ghcr.io/nla-consultoria/nla-portal:latest
docker-compose -f deploy/stack-easypanel.yml up -d
```

#### 7.2 Aguardar container iniciar

```bash
# Ver logs (se tiver SSH)
docker logs -f nla-portal

# Ou via Easypanel UI
# Service → Logs
```

**Verificar logs customizados aparecem:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NLA Portal - Landing Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment:    PRODUCTION
Version:        v0.1.0
Git Branch:     main
Git Commit:     05ac686 (2025-12-28)  ← SHA correto!
Node Version:   v20.x.x
Log Level:      INFO

✓ Starting Next.js server...
```

---

### Fase 8: Verificação (10 min)

#### 8.1 Site funcionando

```bash
# Quick check
curl -I https://licitacoes.nlaconsultoria.com.br/

# Should return HTTP/2 200
```

Acessar no navegador: https://licitacoes.nlaconsultoria.com.br/

#### 8.2 Clarity funcionando

Abrir DevTools Console:
```javascript
// Verificar se Clarity carregou
typeof window.clarity
// Deve retornar: "object"

// Ver ID do projeto
window.clarity.q
// Deve mostrar arrays com comandos
```

#### 8.3 Testar eventos

1. **Clicar em um CTA**
   - Console deve mostrar evento sendo enviado (se em debug mode)
   - Ou verificar em Network tab: clarity.ms

2. **Abrir formulário**
   - Evento `form_opened` deve disparar

3. **Preencher e enviar**
   - Eventos de step, qualificação, identificação

#### 8.4 Verificar no Clarity Dashboard

1. Acessar: https://clarity.microsoft.com/projects/view/uscdlda0qf
2. Aguardar ~5-10 minutos para processar
3. Verificar se sessões aparecem
4. Verificar eventos customizados

#### 8.5 Verificar logs do container

**Via Easypanel:**
- Service → Logs
- Verificar se mostra informações corretas (commit SHA, etc)

**Via SSH:**
```bash
docker logs nla-portal --tail 50
```

Deve mostrar:
- Banner com informações
- Commit SHA correto
- LOG_LEVEL configurado
- No erros de startup

#### 8.6 Smoke tests

- [ ] Página inicial carrega
- [ ] Formulário abre e fecha
- [ ] Formulário valida campos
- [ ] Formulário envia com sucesso
- [ ] Redirecionamento funciona
- [ ] Analytics rastreando (GTM, Meta Pixel, Clarity)
- [ ] Nenhum erro no console
- [ ] Performance OK (Lighthouse > 90)

---

## 🔄 Rollback (Se Necessário)

Se algo der errado em produção:

### Opção 1: Reverter para imagem anterior

```bash
# No servidor
docker pull ghcr.io/nla-consultoria/nla-portal:<SHA-ANTERIOR>

# Ou via Easypanel UI
# Mudar image tag para SHA anterior
```

### Opção 2: Reverter merge no Git

```bash
# Local
git checkout main
git pull origin main

# Reverter merge (encontrar SHA do merge commit)
git log --oneline -5
git revert -m 1 <merge-commit-sha>

# Push
git push origin main

# Aguardar build da versão revertida
```

### Opção 3: Reset hard (emergência)

```bash
git checkout main
git reset --hard <commit-antes-do-merge>
git push origin main --force

# ⚠️ Use com cuidado! Force push pode causar problemas
```

---

## 📊 Checklist Pós-Deploy

### Monitoramento (24h)

- [ ] Verificar erros no console (DevTools)
- [ ] Monitorar logs do servidor
- [ ] Verificar Clarity Dashboard por erros
- [ ] Verificar conversões continuam funcionando
- [ ] Verificar webhook N8N recebendo dados
- [ ] Verificar analytics (GTM, Meta Pixel)

### Performance

- [ ] Lighthouse score mantido (> 90)
- [ ] Tempo de carregamento OK
- [ ] Clarity não impacta performance negativamente

### Analytics

- [ ] Sessões aparecem no Clarity
- [ ] Eventos customizados sendo rastreados
- [ ] Heatmaps gerando
- [ ] Identificação de usuários funcionando

---

## 🎯 Valores para Produção

### Variáveis Runtime (Easypanel)

```yaml
# Clarity
CLARITY_ID: "uscdlda0qf"  # Ou criar projeto prod separado

# Logging
LOG_LEVEL: "info"  # Ou "debug" temporariamente para troubleshooting
```

### Clarity - Projetos Separados (Opcional)

Se quiser separar DEV e PROD:

**DEV:**
- Projeto: NLA Portal - Development
- ID: `uscdlda0qf`
- URL: https://clarity.microsoft.com/projects/view/uscdlda0qf

**PROD (criar novo):**
1. Criar novo projeto no Clarity
2. Nome: "NLA Portal - Production"
3. URL: https://licitacoes.nlaconsultoria.com.br
4. Copiar novo ID
5. Configurar `CLARITY_ID=<novo-id>` em produção

---

## 🚨 Problemas Comuns

### Clarity não carrega

**Sintoma:** `typeof window.clarity` → `undefined`

**Soluções:**
1. Verificar `CLARITY_ID` está configurado
2. Verificar logs do container (startup script)
3. Verificar Network tab se script clarity.ms carregou
4. Aguardar ~30s (pode demorar no primeiro load)

### Logs não mostram SHA correto

**Sintoma:** `Git Commit: unknown`

**Soluções:**
1. Verificar GitHub Actions passou build args corretamente
2. Verificar workflow tem step "Set git info"
3. Rebuild imagem se necessário

### Site com erro 500

**Sintoma:** Página não carrega após deploy

**Soluções:**
1. Verificar logs do container
2. Verificar variáveis de ambiente
3. Verificar se Next.js compilou corretamente
4. Rollback para versão anterior

---

## 📝 Resumo Executivo

**Tempo total estimado:** ~45 minutos

| Fase | Tempo | Ação |
|------|-------|------|
| 1. Preparação | 15min | Verificar diffs, testar DEV |
| 2. GitHub | 5min | Verificar variáveis (não precisa criar novas) |
| 3. Stack | 5min | Já está atualizado |
| 4. PR | 10min | Criar, revisar, aprovar |
| 5. Merge | 3min | Merge + aguardar build |
| 6. Config | 5min | Adicionar CLARITY_ID e LOG_LEVEL |
| 7. Deploy | 2min | Pull imagem, restart |
| 8. Verificação | 10min | Testes completos |

**Principais Riscos:** Baixo
- Mudanças são aditivas (não quebram funcionalidades existentes)
- Clarity é opcional (site funciona sem)
- Logs são informativos (não afetam runtime)
- Rollback simples se necessário

**Recomendação:** ✅ Safe to deploy

---

**Última atualização:** 2025-12-28
**Autor:** Claude Code + Murillo
