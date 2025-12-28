---
name: deploy-dev
description: Automatiza deploy completo no ambiente DEV (commit, push, aguarda build, trigger Easypanel, verifica site)
---

# Deploy DEV - Skill de Automação

Esta skill automatiza o processo completo de deploy no ambiente de desenvolvimento.

## Fluxo Automatizado

1. **Verifica estado do Git** (branch atual, mudanças pendentes)
2. **Commit e Push** (se necessário)
3. **Aguarda GitHub Actions** buildar imagem (~3 minutos)
4. **Trigger deploy Easypanel** via webhook
5. **Aguarda deploy** completar (~30-60 segundos)
6. **Verifica site** está online e respondendo

## Configuração

### URLs e Endpoints

**GitHub Actions:**
- Workflow: `.github/workflows/docker-dev.yml`
- Branch: `dev`
- Image tag: `ghcr.io/nla-consultoria/nla-portal:dev-latest`

**Easypanel:**
- Webhook deploy: `http://37.60.247.149:3000/api/deploy/9f39a3d3dd7f246526cfe27d138cf149b3c238fef23b5de7`
- Site URL: `https://automatize-nla-portal-dev.keoloh.easypanel.host/`

**Timings:**
- Build GitHub Actions: ~3 minutos (180 segundos)
- Deploy Easypanel: ~30-60 segundos
- Health check timeout: 30 segundos

## Quando Usar

Use esta skill quando:
- Fez mudanças e quer deployar no ambiente DEV
- Quer testar mudanças no servidor antes de ir para produção
- Precisa verificar se deploy funcionou

## Comandos

Para invocar a skill:
```
/deploy-dev
```

Ou com mensagem de commit customizada:
```
/deploy-dev "feat: adiciona nova funcionalidade"
```

## Processo Detalhado

### 1. Verificação Inicial

```bash
# Verifica branch atual
git branch --show-current

# Verifica se há mudanças
git status --porcelain
```

**Validações:**
- ✅ Se branch != dev, perguntar se quer trocar
- ✅ Se há mudanças não commitadas, perguntar mensagem de commit
- ✅ Se não há mudanças, verificar se último commit já foi pushed

### 2. Commit e Push

Se houver mudanças:

```bash
# Stage todas as mudanças
git add .

# Commit com mensagem fornecida ou padrão
git commit -m "mensagem"

# Push para origin/dev
git push origin dev
```

**Output esperado:**
```
To https://github.com/NLA-Consultoria/nla-consultoria.git
   abc1234..def5678  dev -> dev
```

### 3. Aguardar GitHub Actions

Acompanha progresso do build:

```bash
# Pega SHA do último commit
git rev-parse HEAD

# Aguarda ~3 minutos com feedback visual
# Mostra progresso: "⏳ Aguardando build... 1/3 min"
```

**Estratégia de espera:**
- Mostra mensagem de progresso a cada 30 segundos
- Tempo total: 180 segundos (3 minutos)
- Pode ser interrompido se build falhar (verificação opcional)

### 4. Trigger Deploy Easypanel

Chama webhook via curl:

```bash
curl -X POST http://37.60.247.149:3000/api/deploy/9f39a3d3dd7f246526cfe27d138cf149b3c238fef23b5de7
```

**Output esperado:**
```json
{"message":"Deployment triggered"}
```

ou similar. Se falhar, mostrar erro.

### 5. Aguardar Deploy

Aguarda container reiniciar:

```bash
# Aguarda ~60 segundos com feedback
# "⏳ Aguardando container reiniciar... 30s"
```

### 6. Health Check

Verifica se site está respondendo:

```bash
curl -I https://automatize-nla-portal-dev.keoloh.easypanel.host/
```

**Validações:**
- ✅ HTTP 200 OK
- ✅ Header contém "text/html" ou similar
- ❌ Timeout ou erro → mostrar falha

Tenta até 3 vezes com intervalo de 10s.

### 7. Resultado Final

**Sucesso:**
```
✅ Deploy DEV concluído com sucesso!

🚀 Informações:
   Branch: dev
   Commit: def5678 (2025-12-28)
   Build: ~3min
   Deploy: ~45s

🌐 Site disponível:
   https://automatize-nla-portal-dev.keoloh.easypanel.host/

📊 Verificar logs:
   Easypanel → automatize/nla-portal-dev → Logs
```

**Falha:**
```
❌ Deploy falhou!

Etapa: [Build | Deploy | Health Check]
Erro: [descrição do erro]

🔍 Próximos passos:
   - Verificar logs do GitHub Actions
   - Verificar logs do Easypanel
   - Verificar se imagem foi gerada
```

## Opções Avançadas

### Flags Opcionais

```
/deploy-dev --skip-build
```
Pula aguardar build (assume que já foi feito)

```
/deploy-dev --no-verify
```
Não faz health check final

```
/deploy-dev --fast
```
Aguarda apenas 2 minutos em vez de 3

## Exemplo de Uso

### Cenário 1: Deploy simples

```
User: /deploy-dev
Assistant:
  ✓ Branch: dev
  ✓ Mudanças detectadas

  Mensagem de commit? (ou Enter para usar padrão)

User: "fix: corrige bug no formulário"