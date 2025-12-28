# Deploy Configurations

Configurações de deploy para diferentes ambientes.

## 📁 Arquivos

### [stack-easypanel.yml](./stack-easypanel.yml)
**Ambiente:** Produção
**Branch:** `main`
**URL:** https://licitacoes.nlaconsultoria.com.br
**Docker Image:** `ghcr.io/nla-consultoria/nla-portal:latest`
**Porta:** 80:3000

Configuração Docker Compose para ambiente de **produção**.
- Deploy manual ou via Easypanel
- Usa variáveis de produção
- Porta 80 (HTTP/HTTPS via proxy)

### [stack-dev.yml](./stack-dev.yml)
**Ambiente:** Desenvolvimento/Staging
**Branch:** `dev`
**URL:** https://dev.licitacoes.nlaconsultoria.com.br
**Docker Image:** `ghcr.io/nla-consultoria/nla-portal:dev-latest`
**Porta:** 8080:3000

Configuração Docker Compose para ambiente de **desenvolvimento/staging**.
- Deploy automático ao push em `dev`
- Usa variáveis prefixadas com `DEV_`
- Porta 8080 (separada de produção)
- Webhooks e analytics de teste

---

## 🚀 Como Usar

### Produção

```bash
# Pull imagem
docker pull ghcr.io/nla-consultoria/nla-portal:latest

# Deploy
docker-compose -f deploy/stack-easypanel.yml up -d

# Logs
docker logs -f nla-portal
```

### Desenvolvimento

```bash
# Pull imagem
docker pull ghcr.io/nla-consultoria/nla-portal:dev-latest

# Deploy
docker-compose -f deploy/stack-dev.yml up -d

# Logs
docker logs -f nla-portal-dev
```

---

## ⚙️ Variáveis de Ambiente

### Produção
Configuradas em **GitHub → Settings → Variables**
Sem prefixo `DEV_`

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_N8N_WEBHOOK_URL
NEXT_PUBLIC_GTM_ID
...
```

### Desenvolvimento
Configuradas em **GitHub → Settings → Variables**
Com prefixo `DEV_`

```
DEV_NEXT_PUBLIC_SITE_URL
DEV_NEXT_PUBLIC_N8N_WEBHOOK_URL
DEV_NEXT_PUBLIC_GTM_ID
...
```

---

## 🔄 Workflows

### Produção: `.github/workflows/docker.yml`
- Dispara em push para `main`
- Build e push `:latest`
- Deploy manual

### Desenvolvimento: `.github/workflows/docker-dev.yml`
- Dispara em push para `dev`
- Build e push `:dev-latest`
- Deploy automático (com Watchtower)

---

## 📚 Documentação Completa

- **Deploy DEV:** `/docs/project/DEPLOYMENT-DEV.md`
- **Deploy PROD:** `/docs/project/DEPLOYMENT-PROD.md` (criar se necessário)

---

**Última atualização:** 2025-12-28
