# Deployment - Ambiente de Desenvolvimento

Guia completo para configurar e fazer deploy do ambiente de desenvolvimento (staging).

## 🎯 Visão Geral

**Ambiente:** Desenvolvimento/Staging
**Branch:** `dev`
**URL:** https://dev.licitacoes.nlaconsultoria.com.br
**Docker Image:** `ghcr.io/nla-consultoria/nla-portal:dev-latest`
**Porta:** 8081 (mapeada para 3000 interno)

---

## 📋 Diferenças entre DEV e PRODUÇÃO

| Aspecto | Produção (main) | Desenvolvimento (dev) |
|---------|----------------|----------------------|
| **Branch** | `main` | `dev` |
| **URL** | licitacoes.nlaconsultoria.com.br | dev.licitacoes.nlaconsultoria.com.br |
| **Docker Tag** | `:latest` | `:dev-latest` |
| **Porta** | 80:3000 | 8081:3000 |
| **Webhook** | N8N produção | N8N teste |
| **Analytics** | IDs produção | IDs teste/separados |
| **Deploy** | Manual/controlado | Automático (push dev) |

---

## 🚀 Setup Inicial

### 1. Configurar Variáveis no GitHub

Vá em: **Settings → Secrets and variables → Actions → Variables**

Adicione as seguintes variáveis com prefixo `DEV_`:

```bash
# Site
DEV_NEXT_PUBLIC_SITE_URL=https://dev.licitacoes.nlaconsultoria.com.br

# Integrations
DEV_NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.nlaconsultoria.com.br/webhook-test/dev-test
DEV_NEXT_PUBLIC_AGENDA_URL=
DEV_NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/556299696842?text=Teste%20DEV

# Analytics
DEV_NEXT_PUBLIC_GTM_ID=
DEV_NEXT_PUBLIC_POSTHOG_KEY=
DEV_NEXT_PUBLIC_CLARITY_ID=uscdlda0qf
DEV_NEXT_PUBLIC_META_PIXEL_ID=
```

**⚠️ IMPORTANTE:**
- Variáveis `NEXT_PUBLIC_*` são incorporadas no BUILD
- Mudanças requerem novo build (push na branch dev)
- Sem o prefixo `DEV_`, usa as variáveis de produção

### 2. Configurar DNS

Adicione registro no seu provedor de DNS:

```dns
Type: A ou CNAME
Host: dev.licitacoes
Value: [IP do servidor]
TTL: 3600
```

### 3. Configurar Servidor

**Opção A: Docker Compose**

```bash
# No servidor, clone o repo
git clone https://github.com/NLA-Consultoria/nla-consultoria.git
cd nla-consultoria
git checkout dev

# Faça login no GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Suba o container
docker-compose -f deploy/stack-dev.yml up -d

# Verifique logs
docker logs -f nla-portal-dev
```

**Opção B: Easypanel / Portainer**

1. Importar `deploy/stack-dev.yml`
2. Ajustar variáveis de ambiente se necessário
3. Deploy

**Opção C: Kubernetes**

```bash
kubectl apply -f deploy/k8s-dev.yml  # (criar se necessário)
```

---

## 🔄 Workflow de Deploy Automático

### Como Funciona

1. **Developer faz push na branch `dev`:**
   ```bash
   git checkout dev
   git add .
   git commit -m "feat: nova feature"
   git push origin dev
   ```

2. **GitHub Actions detecta push:**
   - Workflow `.github/workflows/docker-dev.yml` é disparado

3. **Build Docker:**
   - Constrói imagem com variáveis `DEV_*`
   - Tag: `ghcr.io/nla-consultoria/nla-portal:dev-latest`
   - Tag: `ghcr.io/nla-consultoria/nla-portal:dev-{SHA}`

4. **Push para Registry:**
   - Imagem publicada em GitHub Container Registry

5. **Deploy no Servidor:**
   - **Manual:** Pull nova imagem e restart container
   - **Automático:** Watchtower ou Webhook

### Configurar Deploy Automático no Servidor

**Opção 1: Watchtower (Recomendado)**

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  nla-portal-dev \
  --interval 300 \
  --cleanup
```

**Opção 2: Webhook**

```bash
# Criar webhook que faz:
docker pull ghcr.io/nla-consultoria/nla-portal:dev-latest
docker-compose -f deploy/stack-dev.yml up -d --force-recreate
```

---

## 🧪 Testando o Ambiente DEV

### 1. Verificar Build

Acompanhe o build no GitHub:
- **Actions → Build and Push Docker image (DEV)**

### 2. Verificar Container

```bash
# No servidor
docker ps | grep nla-portal-dev

# Logs
docker logs -f nla-portal-dev

# Inspecionar
docker inspect nla-portal-dev
```

### 3. Testar Aplicação

```bash
# Teste de saúde
curl https://dev.licitacoes.nlaconsultoria.com.br

# Testar formulário
# - Abrir no navegador
# - Preencher e submeter
# - Verificar webhook N8N recebeu
```

### 4. Validar Analytics

```bash
# Abrir DevTools Console
# Executar docs/testing/clarity-console-test.js
runClarityTests()
monitorClarityEvents()

# Interagir com página
# Verificar eventos aparecem no Clarity Dashboard
```

---

## 📊 Monitoramento

### Logs

```bash
# Tempo real
docker logs -f nla-portal-dev

# Últimas 100 linhas
docker logs --tail 100 nla-portal-dev

# Com timestamps
docker logs -t nla-portal-dev
```

### Recursos

```bash
# CPU, memória, rede
docker stats nla-portal-dev

# Processos
docker top nla-portal-dev
```

### Health Check

```bash
# Status do container
docker inspect --format='{{.State.Health.Status}}' nla-portal-dev

# Endpoint de health (criar se necessário)
curl https://dev.licitacoes.nlaconsultoria.com.br/api/health
```

---

## 🔧 Troubleshooting

### Build Falha no GitHub Actions

**Problema:** Workflow falha no step "Build and push"

**Soluções:**
```bash
# 1. Verificar se variáveis DEV_* estão configuradas
# GitHub → Settings → Variables → Conferir todas DEV_*

# 2. Verificar permissões GITHUB_TOKEN
# Settings → Actions → General → Workflow permissions
# Marcar "Read and write permissions"

# 3. Re-executar workflow
# Actions → Failed workflow → Re-run all jobs
```

### Container não Inicia

**Problema:** Container para logo após iniciar

**Soluções:**
```bash
# 1. Ver logs
docker logs nla-portal-dev

# 2. Verificar variáveis de ambiente
docker inspect nla-portal-dev | grep -A 20 Env

# 3. Testar imagem manualmente
docker run -p 8081:3000 ghcr.io/nla-consultoria/nla-portal:dev-latest

# 4. Verificar porta não está em uso
lsof -i :8081
```

### Deploy não Atualiza

**Problema:** Push na dev mas servidor não atualiza

**Soluções:**
```bash
# 1. Pull manual
docker pull ghcr.io/nla-consultoria/nla-portal:dev-latest

# 2. Verificar Watchtower
docker logs watchtower

# 3. Force recreate
docker-compose -f deploy/stack-dev.yml up -d --force-recreate

# 4. Verificar tag da imagem
docker images | grep nla-portal
```

### SSL/HTTPS não Funciona

**Problema:** Certificado inválido ou não encontrado

**Soluções:**
```bash
# Se usando Traefik
docker logs traefik | grep dev.licitacoes

# Se usando Nginx/Certbot
certbot certificates
certbot renew --force-renewal -d dev.licitacoes.nlaconsultoria.com.br
```

---

## 🔄 Promover DEV → PRODUÇÃO

Quando código em `dev` está pronto para produção:

### Opção 1: Merge via Pull Request (Recomendado)

```bash
# 1. Criar PR no GitHub
# dev → main

# 2. Review e aprovação

# 3. Merge

# 4. Deploy automático de main
```

### Opção 2: Merge Local

```bash
# 1. Checkout main
git checkout main
git pull origin main

# 2. Merge dev
git merge dev

# 3. Push
git push origin main

# 4. Aguardar deploy automático
```

---

## 📚 Arquivos Relacionados

```
.github/workflows/
├── docker.yml         # Produção (main)
└── docker-dev.yml     # Desenvolvimento (dev)

deploy/
├── stack-easypanel.yml   # Produção
└── stack-dev.yml         # Desenvolvimento

.env.example              # Template produção
.env.development.example  # Template desenvolvimento
```

---

## 🎯 Checklist de Deploy DEV

Antes de fazer deploy:

### Setup Inicial (uma vez)
- [ ] Variáveis `DEV_*` configuradas no GitHub
- [ ] DNS apontando para servidor
- [ ] SSL configurado
- [ ] `deploy/stack-dev.yml` atualizado

### Deploy
- [ ] Push para branch `dev`
- [ ] GitHub Actions build com sucesso
- [ ] Container reiniciou no servidor
- [ ] Site acessível via HTTPS
- [ ] Formulário funciona
- [ ] Webhook N8N recebe dados
- [ ] Analytics rastreando eventos

### Pós-Deploy
- [ ] Smoke tests executados
- [ ] Logs sem erros críticos
- [ ] Recursos (CPU/RAM) normais
- [ ] Notificar equipe

---

## 🔗 Links Úteis

- **GitHub Actions:** https://github.com/NLA-Consultoria/nla-consultoria/actions
- **Packages (Docker):** https://github.com/orgs/NLA-Consultoria/packages
- **Site DEV:** https://dev.licitacoes.nlaconsultoria.com.br
- **Clarity Dashboard:** https://clarity.microsoft.com/projects/view/uscdlda0qf

---

**Última atualização:** 2025-12-28
**Mantido por:** Equipe de Desenvolvimento NLA
