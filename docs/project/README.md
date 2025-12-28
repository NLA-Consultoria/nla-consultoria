# Project Documentation

Documentação de produto, arquitetura e decisões de design do projeto NLA Consultoria.

## 📋 Documentos Disponíveis

### [prd.md](./prd.md)
**Product Requirements Document**

Documento principal de requisitos do produto, incluindo:
- Visão geral do produto
- Objetivos de negócio
- Personas e público-alvo
- Features e funcionalidades
- Requisitos técnicos
- Critérios de sucesso

### [design.md](./design.md)
**Design Decisions**

Decisões de design e UI/UX, cobrindo:
- Sistema de design
- Paleta de cores
- Tipografia
- Componentes principais
- Padrões de interação
- Acessibilidade

### [folders.md](./folders.md)
**Folder Structure**

Documentação da estrutura de pastas do projeto:
- Organização de diretórios
- Convenções de nomenclatura
- Localização de arquivos chave
- Padrões de código

### [LOGGING.md](./LOGGING.md)
**Sistema de Logging**

Sistema customizado de logs com informações de ambiente:
- Níveis de log (debug, info, warn, error)
- Script de inicialização customizado
- Informações de versão e commit Git
- Monitoramento de configurações

### [DEPLOYMENT-DEV.md](./DEPLOYMENT-DEV.md)
**Deployment - Ambiente DEV**

Guia completo para deploy do ambiente de desenvolvimento:
- Configuração de variáveis DEV_*
- Workflow automático de CI/CD
- Docker image: dev-latest
- Troubleshooting

---

## 🎯 Para Novos Desenvolvedores

### 1. Entender o Produto
Comece lendo na ordem:
1. **prd.md** - Entenda o que é o produto e por quê existe
2. **design.md** - Entenda as decisões de UI/UX
3. **folders.md** - Entenda como o código está organizado

### 2. Setup do Ambiente
Após ler a documentação:
```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Iniciar desenvolvimento
npm run dev
```

### 3. Fluxo de Desenvolvimento
1. Escolha uma task/feature
2. Consulte **folders.md** para saber onde adicionar código
3. Consulte **design.md** para decisões de UI
4. Implemente seguindo padrões existentes
5. Teste com `/docs/testing/`

---

## 🏗️ Arquitetura do Projeto

### Stack Tecnológico
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **Validation:** Zod
- **Analytics:** Clarity, Meta Pixel, GTM/PostHog

### Estrutura de Alto Nível
```
/app          → Pages e API routes
/components   → React components
/content      → Conteúdo estático (copy)
/lib          → Utilities e helpers
/docs         → Documentação
/public       → Assets estáticos
```

### Padrões de Código
- **Content Management:** Todo copy em `/content/home.ts`
- **Styling:** Utility-first com Tailwind
- **Components:** Client components quando necessário
- **Forms:** Validação com Zod schemas
- **Analytics:** Events centralizados em `/lib/clarity-events.ts`

---

## 🚀 Features Principais

### Landing Page
- Hero section com CTA principal
- Seções informativas (Why, How, Benefits, Audience)
- FAQ com JSON-LD
- Footer com contatos

### Lead Capture
- Modal multi-step (3 steps)
- Validação em tempo real
- Integração com N8N webhook
- Tracking completo (Clarity + Meta)

### Analytics
- Microsoft Clarity (behavior analytics)
- Meta Pixel (conversion tracking)
- GTM/PostHog (opcional)
- Custom events para todo funil

---

## 📊 Métricas de Sucesso

### Conversão
- **Form Open Rate:** >15%
- **Form Completion Rate:** >40%
- **Overall Conversion Rate:** >6%

### Qualidade
- **Lighthouse Score:** >90
- **Core Web Vitals:** All green
- **Accessibility:** WCAG AA

### Engajamento
- **Avg Time on Page:** >2min
- **Scroll Depth:** >75%
- **CTA Click Rate:** >20%

---

## 🔗 Links Relacionados

- **Analytics:** `/docs/analytics/`
- **Testing:** `/docs/testing/`
- **Features:** `/docs/features/`
- **Code:** `/` (root do projeto)

---

**Última atualização:** 2025-12-27
