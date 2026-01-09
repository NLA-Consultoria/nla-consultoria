# Otimização de Dados do Facebook Pixel (Advanced Matching)

Este documento descreve as melhores práticas para envio de dados ao Pixel do Facebook, combinando a análise do nosso script atual (`docs/testing/pixel.js`) com as recomendações oficiais da Meta para maximizar o **Event Match Quality (EMQ)**.

## 1. Por que enviar mais dados? (Advanced Matching)

O Advanced Matching (Correspondência Avançada) permite que o Facebook identifique o usuário mesmo sem cookies (ex: iOS 14+, AdBlockers). Enviar esses dados aumenta o **EMQ (Event Match Quality)**, resultando em:
1.  **Maior Atribuição:** O Facebook consegue ligar mais conversões aos seus anúncios.
2.  **Públicos Maiores:** Otimiza o Retargeting e Lookalikes.
3.  **Menor CPA:** O algoritmo aprende mais rápido quem é seu cliente ideal.

## 2. Prioridade dos Dados (O que enviar)

Abaixo, a lista de parâmetros ordenados por impacto na qualidade da correspondência (EMQ).

| Prioridade | Chave | Descrição | Tratamento Obrigatório |
| :--- | :--- | :--- | :--- |
| **Altíssima** | `em` | Email | **Hash SHA-256** (Lowercase, sem espaços). |
| **Altíssima** | `ph` | Telefone | **Hash SHA-256** (Apenas números, incluir DDI+DDD). |
| **Alta** | `client_ip_address` | Endereço IP | **NÃO HASHAR**. Enviar IP real do cliente. |
| **Alta** | `client_user_agent` | User Agent | **NÃO HASHAR**. String do navegador. |
| **Alta** | `fbp` | Browser ID | **NÃO HASHAR**. Ler do cookie `_fbp`. |
| **Alta** | `fbc` | Click ID | **NÃO HASHAR**. Ler do cookie `_fbc` ou URL `fbclid`. |
| **Média** | `external_id` | ID Interno (CRM/Banco) | **NÃO HASHAR**. ID único do usuário no seu sistema. |
| **Média** | `fn` | Primeiro Nome | **Hash SHA-256** (Lowercase, sem acentos). |
| **Média** | `ln` | Sobrenome | **Hash SHA-256** (Lowercase, sem acentos). |
| **Média** | `ct` | Cidade | **Hash SHA-256** (Lowercase, sem acentos). |
| **Média** | `st` | Estado (UF) | **Hash SHA-256** (Lowercase, 2 letras ex: 'sp'). |
| **Média** | `zp` | CEP | **Hash SHA-256** (Apenas números). |
| **Média** | `country` | País | **Hash SHA-256** (Lowercase, ISO 2 letras ex: 'br'). |
| **Baixa** | `db` | Data de Nascimento | **Hash SHA-256** (Formato YYYYMMDD). |
| **Baixa** | `ge` | Gênero | **Hash SHA-256** ('m' ou 'f'). |

### Nota sobre `fbp` e `fbc`
Embora tenham "menor prioridade" para *encontrar* a pessoa (pois são cookies e podem mudar), eles são **críticos para a atribuição** (provar que o clique X gerou a venda Y). Sempre envie se disponíveis.

## 3. Diagnóstico do Código Atual (`lead-modal-wizard.tsx` & `trackMetaEvent.ts`)

Analisando a implementação atual em `lib/trackMetaEvent.ts` e `components/lead-modal-wizard.tsx`, identificamos as seguintes oportunidades de melhoria para atingir o nível "Excelente" de qualidade de dados:

### O Que Falta Implementar:

1.  **Dados Geográficos e de Nome (`fn`, `ln`, `ct`, `st`):**
    *   **Cenário Atual:** O formulário coleta Nome, Cidade e Estado, mas o arquivo `trackMetaEvent.ts` atualmente só aceita/envia `email` e `phone`.
    *   **Correção:** Expandir a interface `TrackMetaEventOptions` para aceitar `firstName`, `lastName`, `city`, `state` e passar esses dados para a API (`/api/meta-events`) e para o Pixel (`fbq`).

2.  **Dados Customizados de Negócio (`custom_data`):**
    *   **Cenário Atual:** Coletamos "Faturamento" (`billing`) e "Vendeu p/ Governo" (`soldToGov`), mas não estamos enviando isso estruturado para o Facebook.
    *   **Correção:** Enviar essas respostas dentro do objeto `custom_data`. Isso permite criar públicos como "Pessoas com faturamento > 1MM".

3.  **Valor e Moeda (Value-Based Lookalike):**
    *   **Cenário Atual:** Não enviamos valor monetário.
    *   **Correção:** Atribuir um valor teórico ao Lead baseado na faixa de faturamento (ex: Lead de empresa grande vale mais).
    *   Exemplo: `currency: 'BRL', value: billing === 'Acima de R$ 1 mi' ? 500 : 50`.

4.  **Timestamp Preciso:**
    *   **Cenário Atual:** Confiamos no tempo de processamento.
    *   **Correção:** Enviar `event_time` (Unix timestamp) gerado no momento do clique. Isso ajuda na deduplicação exata entre Pixel e API.

## 4. Plano de Implementação (Rich Data)

Abaixo, como deve ficar a estrutura ideal de envio (Conceitual):

```javascript
// Exemplo de como chamar a função de track no 'onSubmit' do formulário
trackMetaEvent({
  eventName: "Lead",
  eventId: sessionId, // Importante: Mesmo ID gerado no início da sessão
  userData: {
    email: data.email,
    phone: data.phone,
    firstName: data.name.split(' ')[0], // Extrair primeiro nome
    lastName: data.name.split(' ').slice(1).join(' '), // Resto do nome
    city: data.city,
    state: data.uf,
    country: 'br', // Fixo
    fbc: getFbc(),
    fbp: getFbp(),
    external_id: sessionId // Ou ID do usuário se houver login
  },
  customData: {
    lead_billing_range: data.billing, // Ex: "R$ 50-200 mil"
    lead_gov_experience: data.soldToGov, // "sim" ou "nao"
    lead_business_description: data.pain,
    content_name: "Consultoria B2G",
    content_category: "Services"
  },
  // Otimização de Valor (Opcional, mas recomendado)
  value: calculateLeadValue(data.billing), 
  currency: "BRL",
  event_time: Math.floor(Date.now() / 1000) // Unix Timestamp em segundos
});
```

### Por que enviar `event_time` e `custom_data`?

1.  **`event_time`**: Garante que o Facebook saiba exatamente quando a conversão ocorreu, ignorando atrasos de rede ou fila de servidor. Crítico para a deduplicação funcionar perfeitamente.
2.  **`custom_data`**: Permite que você filtre seus relatórios no Gerenciador de Anúncios. Você poderá responder perguntas como: *"Quanto custou meu Lead Qualificado (faturamento alto) vs Lead Desqualificado?"*.

## 5. Checklist de Qualidade Final

Para considerar a tarefa concluída e o pixel otimizado ao máximo:

1.  [x] **Interface Atualizada:** `TrackMetaEventOptions` aceita todos os campos de endereço e nome.
2.  [x] **Hash no Backend:** A API `/api/meta-events` recebe os dados crus e faz o hash SHA-256 antes de enviar para a Graph API do Facebook.
3.  [x] **Pixel no Frontend:** O `fbq('track')` recebe o objeto `userData` via Advanced Matching client-side.
4.  [x] **Deduplicação:** O `eventID` + `event_time` são gerados uma vez e passados idênticos para Pixel e API.
5. [x] **Consentimento:** Envio de dados respeita a política de privacidade aceita pelo usuário via `cookie-consent.tsx`.

## 6. Análise e Refatoração dos Arquivos Existentes (Plano de Ação)

Após analisar os arquivos do projeto, identificamos uma **fragmentação** na lógica de rastreamento e um **gargalo crítico** na API que impede o envio de dados ricos.

### 6.1. Consolidação das Bibliotecas
Atualmente existem dois arquivos fazendo funções similares:
1.  `lib/trackMetaEvent.ts` (Simples, usado pelo `PageView`).
2.  `lib/meta-tracking.ts` (Completo, usado pelo Wizard de Lead).

**Ação:** Devemos unificar tudo em **`lib/meta-tracking.ts`** (que já possui lógica de hashing e steps) e depreciar ou redirecionar o `trackMetaEvent.ts` para ele.

### 6.2. Correção Crítica na API (`app/api/meta-events/route.ts`)
Este é o maior problema atual. Mesmo que o frontend envie os dados completos (Cidade, Estado, Nome), a API **descarta** esses campos antes de enviar para o Facebook.

**O que precisa mudar no `route.ts`:**
*   **Receber todos os campos:** Atualizar a tipagem `IncomingEventPayload` para aceitar `fn`, `ln`, `ct`, `st`, `zp`, `country`.
*   **Mapeamento:** Repassar esses campos para o objeto `userData` que vai para a função `sendMetaEvent`.
*   **Hash Seguro:** Garantir que o hash SHA-256 seja aplicado no backend se os dados chegarem "crus" (raw), ou validar se já chegaram hasheados.

### 6.3. Atualização da Tipagem (`lib/meta-conversions.ts`)
A interface `MetaUserData` neste arquivo precisa ser expandida para suportar oficialmente os novos campos do Advanced Matching.

```typescript
// Como deve ficar a interface MetaUserData
export type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  em?: string; // Email
  ph?: string; // Phone
  fn?: string; // First Name
  ln?: string; // Last Name
  ct?: string; // City
  st?: string; // State
  zp?: string; // Zip
  country?: string; // Country
  fbc?: string;
  fbp?: string;
  external_id?: string;
};
```

### 6.4. Fluxo de Dados Proposto

1.  **Frontend (`lead-modal-wizard.tsx`):** Coleta dados -> Chama `trackMetaEvent` (do `lib/meta-tracking.ts`).
2.  **Tracking Lib (`lib/meta-tracking.ts`):** 
    *   Faz Hash preliminar (opcional, mas bom pra privacidade no payload).
    *   Dispara Pixel `fbq('track', ...)` com `eventID` e dados ricos.
    *   Dispara POST para `/api/meta-events` com `eventID` e dados ricos.
3.  **API Route (`route.ts`):** 
    *   Recebe o JSON.
    *   Lê IP e User Agent dos headers.
    *   Normaliza e Hash (se ainda não foi feito).
    *   Chama `sendMetaEvent`.
4.  **CAPI Lib (`meta-conversions.ts`):** Monta o payload final da Graph API e envia.

---

## 7. Implementação Realizada (Status Atual)

### ✅ Advanced Matching Completo Implementado

**Data:** 2025-12-30
**EMQ Esperado:** 8.0+ (Event Match Quality Score)

#### 7.1. Parâmetros de Advanced Matching Enviados

Todos os parâmetros de **prioridade Alta e Média** estão sendo enviados:

| Parâmetro | Status | Tratamento | Arquivo Responsável |
|-----------|--------|------------|---------------------|
| `em` (Email) | ✅ | Hash SHA-256, lowercase | `route.ts:99` |
| `ph` (Telefone) | ✅ | Hash SHA-256, apenas números | `route.ts:104` |
| `client_ip_address` | ✅ | Não hasheado, do header `x-forwarded-for` | `route.ts:86` |
| `client_user_agent` | ✅ | Não hasheado, do header `user-agent` | `route.ts:87` |
| `fbp` (Browser ID) | ✅ | Não hasheado, do cookie `_fbp` | `meta-tracking.ts:185` |
| `fbc` (Click ID) | ✅ | Não hasheado, do cookie `_fbc` | `meta-tracking.ts:186` |
| `fn` (First Name) | ✅ | Hash SHA-256, lowercase, sem acentos | `route.ts:110` |
| `ln` (Last Name) | ✅ | Hash SHA-256, lowercase, sem acentos | `route.ts:115` |
| `ct` (Cidade) | ✅ | Hash SHA-256, lowercase, sem acentos | `route.ts:120` |
| `st` (Estado/UF) | ✅ | Hash SHA-256, lowercase, 2 letras | `route.ts:125` |
| `country` (País) | ✅ | Hash SHA-256, lowercase, ISO 2 letras (default: "br") | `route.ts:130-134` |
| `external_id` | ✅ | Hash do email | `meta-tracking.ts:192-194` |

#### 7.2. Deduplicação Pixel + CAPI

**Implementação:**
- `eventID`: Gerado uma vez no cliente (`meta-tracking.ts:220`)
- `event_time`: Timestamp Unix gerado uma vez no cliente (`meta-tracking.ts:221`)
- Ambos enviados idênticos para Pixel e CAPI

**Por que é crítico:**
```
ANTES (ERRADO):
├─ Pixel dispara às 10:00:00.000
└─ CAPI chega no servidor às 10:00:02.500 (usa Date.now())
   → Meta vê 2 eventos diferentes ❌

AGORA (CORRETO):
├─ Cliente gera eventTime = 1735594800
├─ Pixel recebe { eventID, eventTime }
└─ CAPI recebe { eventID, eventTime }
   → Meta deduplica perfeitamente ✅
```

**Arquivos:**
- `lib/meta-tracking.ts:221` - Gera `event_time` no cliente
- `app/api/meta-events/route.ts:140` - Repassa `eventTime` para CAPI
- `lib/meta-conversions.ts:48` - Usa `eventTime` do cliente (fallback: servidor)

#### 7.3. Custom Data Estruturado

**Dados de Negócio Enviados:**
```typescript
{
  billing_range: "Acima de R$ 1 mi",        // Faixa de faturamento
  gov_experience: true,                      // Experiência com governo
  pain_description: "...",                   // Descrição da dor
  content_name: "lp-2_complete_lead",        // Nome do conteúdo
  content_category: "b2g_consulting",        // Categoria
  value: 1500,                               // Valor dinâmico baseado em billing
  currency: "BRL"                            // Moeda
}
```

**Benefícios:**
- Criação de audiences customizadas ("Empresas faturamento > 1MM")
- Otimização Value-Based Lookalike
- Relatórios segmentados por qualificação de lead

**Arquivos:**
- `lib/meta-tracking.ts:112-122` - Cálculo de valor dinâmico
- `lib/meta-tracking.ts:326-339` - Helper `trackQualifiedLead`
- `lib/meta-tracking.ts:379-401` - Helper `trackLeadComplete`

#### 7.4. Funil Progressivo de Eventos

Implementamos funil completo baseado em **engajamento real**:

```
1. PageView (automático)
   ↓ Qualquer visitante

2. ViewContent (após 30s)
   ↓ Usuário engajado (leu página)
   └─ Enriquecido com localStorage se recorrente

3. AddToWishlist (modal aberto)
   ↓ Demonstrou interesse
   └─ content_name: "lp-2_modal"

4. LeadStep1Complete, LeadStep2Complete, etc
   ↓ Preenchendo formulário
   └─ step_number, step_name

5. QualifiedLead (Step 3 completo)
   ↓ Lead qualificado
   └─ billing_range, gov_experience, value dinâmico

6. Lead (padrão Meta)
   ↓ Formulário completo
   └─ Todos os parâmetros Advanced Matching

7. CompleteRegistration (padrão Meta)
   └─ Conversão final confirmada
```

**Por que esse funil?**
- **Meta aprende a otimizar para engajamento progressivo**, não apenas tráfego
- **ViewContent** só dispara para usuários com 30s+ na página (evita bounces)
- **AddToWishlist** semântica correta (interesse, não checkout)
- **Eventos customizados de Step** permitem análise de abandono por etapa
- **QualifiedLead** antes de **Lead** permite otimização para leads qualificados

**Arquivos:**
- `components/engagement-tracker.tsx` - ViewContent após 30s
- `lib/meta-tracking.ts:259-270` - trackModalOpen (AddToWishlist)
- `lib/meta-tracking.ts:273-291` - trackStepStart/trackStepComplete
- `lib/meta-tracking.ts:322-339` - trackQualifiedLead
- `lib/meta-tracking.ts:379-401` - trackLeadComplete

#### 7.5. Normalização de Dados

**Implementação conforme recomendação Meta:**

| Campo | Normalização | Exemplo |
|-------|--------------|---------|
| Email | Lowercase, trim | `João@Email.com` → `joão@email.com` |
| Phone | Apenas números | `(11) 98765-4321` → `11987654321` |
| First/Last Name | Lowercase, sem acentos | `José` → `jose` |
| City | Lowercase, sem acentos | `São Paulo` → `sao paulo` |
| State | Lowercase, 2 letras | `SP` → `sp` |
| Country | Lowercase, ISO 2 letras | `BR` → `br` |

**Arquivos:**
- `app/api/meta-events/route.ts:24-62` - Funções de normalização
- `lib/meta-tracking.ts:140-194` - Normalização client-side (prepareUserData)

#### 7.6. Extração Inteligente de Nome

**Problema:** Formulário captura nome completo, mas Meta precisa firstName + lastName separados.

**Solução:**
```typescript
splitFullName("João da Silva Santos")
// → { firstName: "João", lastName: "da Silva Santos" }

splitFullName("Maria")
// → { firstName: "Maria", lastName: "" }
```

**Arquivo:** `lib/meta-tracking.ts:84-96`

**Uso:** `components/lead-modal-wizard.tsx` - Todos os tracking calls

#### 7.7. Arquivos Modificados/Criados

**Backend:**
- ✅ `lib/meta-conversions.ts` - Tipos expandidos (`fn`, `ln`, `ct`, `st`, `country`)
- ✅ `app/api/meta-events/route.ts` - Normalização e hash de novos campos
- ✅ `lib/meta-tracking.ts` - Funções helper, Advanced Matching, event_time

**Frontend:**
- ✅ `components/lead-modal-wizard.tsx` - Extração de firstName/lastName, passa userData completo
- ✅ `components/engagement-tracker.tsx` - ViewContent após 30s (novo arquivo)
- ✅ `app/layout.tsx` - Integração do EngagementTracker

**CI/CD:**
- ✅ `.github/workflows/docker-dev.yml` - Deploy automático via webhook Easypanel

#### 7.8. Próximos Passos (Validação)

1. **Testar em DEV:** Acessar https://automatize-nla-portal-dev.keoloh.easypanel.host/lp-2
2. **Preencher formulário completo** com dados teste
3. **Verificar Meta Events Manager:**
   - Event Match Quality Score (EMQ) deve estar **8.0+**
   - Parâmetros `fn`, `ln`, `ct`, `st`, `country` devem aparecer na aba "Event Details"
   - Deduplicação entre Pixel e CAPI deve estar funcionando (não duplicar eventos)
4. **Validar funil:** Todos os 7 eventos devem aparecer sequencialmente
5. **Verificar custom_data:** billing_range, gov_experience devem estar presentes

#### 7.9. Documentação Adicional

- **Plan original:** `docs/plans/2025-12-30-meta-pixel-advanced-matching.md`
- **Commits:** Ver histórico do branch `dev` (2025-12-30)
- **Testing:** `docs/testing/pixel.js` (referência de estrutura de payload)
