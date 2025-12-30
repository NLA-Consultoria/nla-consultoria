# Especificação UX/UI — Formulário Progressivo /lp-2

## Objetivo

Criar experiência de formulário que maximize conversão através de:
- **Redução de ansiedade**: revelar campos progressivamente (um de cada vez)
- **Foco em benefícios**: copy orientada ao valor para o lead
- **Recuperação de leads**: captura parcial a cada campo preenchido
- **Gatilho de reciprocidade**: quanto mais informação, melhor o atendimento

---

## ✅ Decisões de Design (atualizado 28/12/2025)

### Estrutura
- **3 etapas** (não 4) com campos progressivos dentro de cada etapa
- Campos **aparecem um por vez** mas **não somem** após preenchimento
- Botão **"Continuar"** obrigatório para avançar entre etapas (com validação)
- Botão **"Voltar"** disponível para corrigir dados de etapas anteriores

### Triggers de Revelação
Campo seguinte aparece quando:
1. ✅ Usuário **clica** no campo atual (onFocus)
2. ✅ Usuário **para de digitar** por 800ms (debounced onChange)
3. ✅ Usuário **sai** do campo (onBlur)

**Botão "Continuar"** aparece quando:
- Último campo da etapa recebe foco OU está preenchido

### Copy
- ✅ Aprovada: orientada a benefícios, não menciona dados "opcionais"
- ✅ Helper texts dinâmicos por campo
- ✅ Foco no valor da consultoria personalizada

### Tracking
- ✅ **Meta Pixel**: eventos personalizados em cada etapa crítica
- ✅ **Dual tracking**: Pixel (client) + Conversions API (server)
- ✅ **Clarity**: eventos de interação e abandono
- ✅ **Webhooks parciais**: n8n após cada campo crítico

### Tecnologia
- ✅ React hooks (useState, useEffect, useCallback)
- ✅ Debounce customizado ou lodash.debounce
- ✅ CSS transitions (fallback) + Framer Motion (opcional)
- ✅ Validação inline (onBlur) + validação de etapa (onSubmit)

---

## Princípios de UX aplicados

### 1. Progressive Disclosure (Revelação Progressiva)
- **Por quê**: Reduz cognitive load e ansiedade ao mostrar apenas o necessário
- **Como**: Campos aparecem um por vez, com animação suave (fade in + slide up)
- **Efeito**: Usuário foca em uma tarefa por vez, aumenta taxa de conclusão

### 2. Microcommitments (Micro-compromissos)
- **Por quê**: Cada campo preenchido é um pequeno compromisso que aumenta a probabilidade de continuar
- **Como**: Validação em tempo real + auto-save no localStorage após cada campo
- **Efeito**: Efeito sunk cost — "já preenchi 5 campos, vou terminar"

### 3. Benefit-Driven Copy (Copy orientada a benefícios)
- **Por quê**: Pessoas não querem preencher formulários, querem resolver problemas
- **Como**: Cada etapa explica o benefício de fornecer aquela informação
- **Efeito**: Reduz resistência e aumenta perceived value

### 4. Partial Lead Capture (Captura parcial)
- **Por quê**: Mesmo leads que abandonam têm valor (podemos reengajar)
- **Como**: Webhook parcial disparado a cada campo crítico preenchido
- **Efeito**: Recuperamos 30-50% dos leads que abandonariam sem deixar nada

### 5. Social Proof & Urgency (Prova social e urgência)
- **Por quê**: Gatilhos psicológicos que aumentam conversão
- **Como**: Indicadores sutis de escassez/popularidade
- **Efeito**: FOMO (fear of missing out) aumenta taxa de conclusão

---

## Estrutura das 3 Etapas

### **ETAPA 1: Contato Inicial** (campos progressivos)

**Copy do cabeçalho:**
```
Vamos agendar sua reunião estratégica

Para preparar uma consultoria personalizada, precisamos conhecer
um pouco sobre você e sua empresa.
```

**Campos (aparecem progressivamente):**

1. **Nome** (obrigatório)
   - Label: "Como podemos te chamar?"
   - Placeholder: "Seu nome completo"
   - Helper text: *aparece após preenchimento*: "Ótimo, [Nome]! 👋"
   - **Webhook parcial**: `{name}`

2. **Telefone** (obrigatório - aparece após preencher nome)
   - Label: "Qual seu WhatsApp?"
   - Placeholder: "(00) 00000-0000"
   - Helper text: "Usaremos para confirmar a reunião"
   - **Webhook parcial**: `{name, phone}`

3. **Email** (obrigatório - aparece após preencher telefone)
   - Label: "E seu melhor e-mail?"
   - Placeholder: "voce@empresa.com.br"
   - Helper text: "Você receberá materiais exclusivos e o link da reunião"
   - **Webhook parcial**: `{name, phone, email}`

**Botão de ação** (aparece após preencher os 3):
```
→ Continuar para dados da empresa
```

**Indicador de progresso:**
```
Etapa 1 de 3 • Seus dados de contato ✓
```

---

### **ETAPA 2: Empresa & Localização** (campos progressivos)

**Copy do cabeçalho:**
```
Agora sobre sua empresa

Essas informações nos ajudam a direcionar você para o
especialista ideal da sua região.
```

**Campos (aparecem progressivamente):**

1. **Empresa** (obrigatório)
   - Label: "Qual o nome da empresa?"
   - Placeholder: "Razão social ou nome fantasia"
   - Helper text: "Não se preocupe, pode ser MEI ou CNPJ em andamento"
   - **Webhook parcial**: `{..., company}`

2. **UF** (obrigatório - aparece após empresa)
   - Label: "Em qual estado você atua?"
   - Select com lista de UFs
   - Helper text: "Temos consultores especializados em cada região"
   - **Auto-load**: Dispara busca IBGE de cidades

3. **Cidade** (obrigatório - aparece após UF)
   - Label: "E a cidade?"
   - Select populado via IBGE (+ loading state)
   - Helper text vazia
   - **Webhook parcial**: `{..., company, uf, city}`

**Botão de ação** (aparece após preencher os 3):
```
→ Última etapa: perfil de vendas
```

**Indicador de progresso:**
```
Etapa 2 de 3 • Dados da empresa ✓
```

---

### **ETAPA 3: Qualificação & Objetivo** (campos progressivos)

**Copy do cabeçalho:**
```
Última etapa! Vamos personalizar sua consultoria

Quanto mais soubermos sobre seu negócio, melhor será
a estratégia que vamos desenhar para você.
```

**Campos (aparecem progressivamente):**

1. **Faturamento mensal** (obrigatório)
   - Label: "Qual a faixa de faturamento mensal da empresa?"
   - Select:
     - Até R$ 50 mil
     - R$ 50–200 mil
     - R$ 200–500 mil
     - R$ 500 mil – 1 mi
     - Acima de R$ 1 mi
     - Prefiro não informar
   - Helper text: "Isso nos ajuda a dimensionar as oportunidades disponíveis para você"
   - **Webhook parcial**: `{..., billing}`

2. **Experiência com governo** (obrigatório - aparece após billing)
   - Label: "Sua empresa já vendeu para órgãos públicos?"
   - Radio buttons: Sim / Não
   - Helper text:
     - Se Sim: "Ótimo! Vamos te mostrar como escalar essas vendas"
     - Se Não: "Perfeito! Vamos te ensinar do zero, sem complicação"
   - **Webhook parcial**: `{..., soldToGov}`

3. **Sobre o negócio** (obrigatório - aparece após soldToGov)
   - Label: "Conte um pouco sobre o que sua empresa faz"
   - Textarea (3 linhas)
   - Placeholder: "Ex: Somos uma empresa de TI focada em desenvolvimento de sistemas..."
   - Helper text: "Não precisa escrever muito, só o suficiente para entendermos seu mercado"
   - Character counter: "0/500 caracteres"
   - **Não dispara webhook parcial** (aguarda submit final)

**Botão de ação** (aparece após preencher os 3):
```
✓ Agendar minha reunião estratégica
```

**Indicador de progresso:**
```
Etapa 3 de 3 • Quase lá! 🎯
```

---

## Especificações Técnicas

### Lógica de Reveal Progressivo de Campos

**Comportamento dentro de cada etapa:**

1. **Campos não somem após preenchimento** — ficam visíveis e editáveis
2. **Próximo campo aparece quando:**
   - Usuário clica no campo atual (onFocus), OU
   - Usuário para de digitar por 800ms (debounced onBlur), OU
   - Usuário sai do campo (onBlur direto)
3. **Botão "Continuar" aparece quando:**
   - Último campo da etapa recebe foco (onFocus) OU está preenchido
4. **Validação acontece:**
   - Ao clicar "Continuar" (valida todos os campos da etapa)
   - Inline em cada campo (onBlur) — visual feedback instantâneo

**Implementação React:**

```javascript
// Estado de controle
const [visibleFields, setVisibleFields] = useState(['name']); // começa com 1º campo
const [focusedField, setFocusedField] = useState(null);

// Definição da ordem dos campos por etapa
const fieldOrder = {
  1: ['name', 'phone', 'email'],
  2: ['company', 'uf', 'city'],
  3: ['billing', 'soldToGov', 'pain']
};

// Handler para revelar próximo campo
const handleFieldInteraction = (currentField, step) => {
  const fields = fieldOrder[step];
  const currentIndex = fields.indexOf(currentField);
  const nextField = fields[currentIndex + 1];

  if (nextField && !visibleFields.includes(nextField)) {
    setVisibleFields(prev => [...prev, nextField]);
  }
};

// Triggers:
// onFocus: revela imediatamente
// onChange + debounce 800ms: revela após parar de digitar
// onBlur: revela ao sair (fallback)
```

**Tecnologias necessárias:**

1. **React hooks**: `useState`, `useEffect`, `useCallback`
2. **Debounce utility**: `lodash.debounce` ou custom hook
3. **CSS transitions**: `transition: all 300ms ease-out`
4. **Framer Motion** (opcional): animações mais suaves e controladas
   - `<motion.div>` com `initial`, `animate`, `exit`
   - `AnimatePresence` para unmount suave

**Exemplo com Framer Motion:**

```jsx
import { motion, AnimatePresence } from 'framer-motion';

const fieldVariants = {
  hidden: { opacity: 0, y: 10, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto' }
};

{visibleFields.includes('phone') && (
  <motion.div
    variants={fieldVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    <Label>Telefone</Label>
    <Input
      onFocus={() => handleFieldInteraction('phone', 1)}
      onChange={debounce(() => handleFieldInteraction('phone', 1), 800)}
    />
  </motion.div>
)}
```

**Vantagens dessa abordagem:**

- ✅ Reduz ansiedade (um campo por vez)
- ✅ Mantém contexto (campos preenchidos ficam visíveis)
- ✅ Mobile-friendly (teclado abre naturalmente ao focar)
- ✅ Acessível (não quebra navegação por Tab)
- ✅ Performático (CSS-only animations como fallback)

### Animações

**Entrada de novo campo:**
```css
@keyframes fieldReveal {
  from {
    opacity: 0;
    transform: translateY(10px);
    height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    height: auto;
  }
}

duration: 300ms
easing: ease-out
```

**Transição entre etapas:**
```css
@keyframes slideOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-20px); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

duration: 400ms
easing: cubic-bezier(0.4, 0.0, 0.2, 1)
```

### Validação em tempo real

**Trigger**: `onBlur` (quando sai do campo)
**Visual feedback**:
- ✓ Verde sutil no border se válido
- ✗ Vermelho + mensagem de erro se inválido
- ○ Neutro enquanto não interagiu

**Regras**:
- Nome: mínimo 3 caracteres
- Telefone: regex `^\(\d{2}\) \d{5}-\d{4}$`
- Email: regex padrão + domínio válido
- Empresa: mínimo 2 caracteres
- UF: selecionado da lista
- Cidade: selecionado da lista (após UF)
- Billing: selecionado da lista
- soldToGov: selecionado
- pain: mínimo 10 caracteres

### Webhooks parciais

**Quando disparar:**
```javascript
// Após cada campo "crítico" preenchido e validado:
const criticalFields = ['phone', 'email', 'city', 'billing', 'soldToGov'];

// Dispara se:
1. Campo está validado
2. Campo não foi enviado anteriormente (tracked no localStorage)
3. Delay de 500ms após validação (debounce)
```

**Payload:**
```json
{
  "status": "partial",
  "step": "1-contact" | "2-company" | "3-qualification",
  "field_completed": "phone" | "email" | etc,
  "timestamp": "2025-12-28T10:30:00Z",
  "source": "lp-2",
  "data": {
    "name": "...",
    "phone": "...",
    // ... campos preenchidos até agora
  }
}
```

### Meta Pixel Custom Events

**Best Practices 2025** (baseado em [Meta Pixel Events Guide](https://madgicx.com/blog/facebook-pixel-events) e [Conversions API Setup](https://stape.io/blog/how-to-set-up-facebook-conversion-api)):

1. **Dual Tracking**: Pixel (client-side) + Conversions API (server-side) para máxima confiabilidade
2. **User Data**: Enviar máximo de parâmetros possível para Match Quality
3. **Standard Events**: Usar eventos padrão quando possível (Lead, CompleteRegistration)
4. **Custom Events**: Criar apenas quando necessário, com nomes case-sensitive e claros

**Eventos a disparar:**

#### **Modal Open**
```javascript
fbq('track', 'InitiateCheckout', {
  content_category: 'lead_form',
  content_name: 'lp-2_modal',
  source: 'lp-2'
});
```
- **Quando**: Modal abre
- **Por quê**: Rastreia intenção (usuário interessado)

#### **Etapa 1 Iniciada**
```javascript
fbq('trackCustom', 'LeadStepStart', {
  step_number: 1,
  step_name: 'contact',
  source: 'lp-2'
});
```
- **Quando**: Primeiro campo (nome) recebe foco
- **Por quê**: Marca início do funil de preenchimento

#### **Telefone Preenchido** (Evento crítico)
```javascript
fbq('track', 'Lead', {
  content_name: 'partial_lead_phone',
  status: 'partial',
  value: 50, // valor estimado de lead parcial
  currency: 'BRL'
}, {
  eventID: 'lead_phone_' + timestamp // deduplicação
});

// Conversions API (server-side via /api/meta-events)
fetch('/api/meta-events', {
  method: 'POST',
  body: JSON.stringify({
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: 'lead_phone_' + timestamp, // MESMO eventID do pixel
    event_source_url: window.location.href,
    action_source: 'website',
    user_data: {
      em: null, // ainda não tem
      ph: sha256(cleanPhone(phone)), // hash SHA256
      fn: sha256(firstName),
      client_user_agent: navigator.userAgent,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc')
    },
    custom_data: {
      content_name: 'partial_lead_phone',
      status: 'partial',
      value: 50,
      currency: 'BRL'
    }
  })
});
```
- **Quando**: Campo telefone validado + debounce 500ms
- **Por quê**: Lead parcial mais valioso (temos contato direto)
- **eventID**: Mesmo ID no Pixel e CAPI para deduplicação

#### **Email Preenchido** (Evento crítico)
```javascript
fbq('track', 'Lead', {
  content_name: 'partial_lead_email',
  status: 'partial',
  value: 100, // maior valor que só telefone
  currency: 'BRL'
}, {
  eventID: 'lead_email_' + timestamp
});

// CAPI com user_data completo (phone + email)
```
- **Quando**: Email validado
- **Por quê**: Lead qualificado (podemos reengajar por email)

#### **Etapa 1 Completa**
```javascript
fbq('trackCustom', 'LeadStepComplete', {
  step_number: 1,
  step_name: 'contact',
  source: 'lp-2'
});
```
- **Quando**: Clica "Continuar" na etapa 1
- **Por quê**: Marca progressão no funil

#### **Etapa 2 Completa** (com localização)
```javascript
fbq('trackCustom', 'LeadStepComplete', {
  step_number: 2,
  step_name: 'company',
  source: 'lp-2'
});

// CAPI adiciona custom_data
custom_data: {
  company: data.company,
  city: data.city,
  state: data.uf
}
```
- **Quando**: Clica "Continuar" na etapa 2
- **Por quê**: Lead qualificado com dados empresariais

#### **Lead Qualificado** (Etapa 3 completa)
```javascript
fbq('trackCustom', 'QualifiedLead', {
  step_number: 3,
  step_name: 'qualification',
  billing_range: data.billing,
  gov_experience: data.soldToGov,
  source: 'lp-2',
  value: 500, // lead completo vale mais
  currency: 'BRL'
}, {
  eventID: 'qualified_lead_' + timestamp
});

// CAPI com todos os dados
custom_data: {
  billing_range: data.billing,
  gov_experience: data.soldToGov,
  business_description: data.pain,
  lead_quality_score: calculateScore(data) // 1-10
}
```
- **Quando**: Clica "Continuar" na etapa 3 (antes do submit final)
- **Por quê**: Lead altamente qualificado, pronto para conversão

#### **Registro Completo** (Submit final)
```javascript
fbq('track', 'CompleteRegistration', {
  content_name: 'lp-2_full_lead',
  status: 'complete',
  value: 1000, // valor máximo
  currency: 'BRL'
}, {
  eventID: 'complete_registration_' + timestamp
});

// CAPI com TODOS os user_data e custom_data
```
- **Quando**: Submit final bem-sucedido
- **Por quê**: Evento de conversão principal

#### **Abandono de Etapa**
```javascript
fbq('trackCustom', 'LeadStepAbandoned', {
  step_number: currentStep,
  step_name: stepName,
  last_field_completed: lastField,
  time_spent: timeSpentSeconds,
  source: 'lp-2'
});
```
- **Quando**: Fecha modal no meio de uma etapa
- **Por quê**: Identifica pontos de fricção para otimização

**Parâmetros críticos para Match Quality:**

```javascript
// Hash SHA256 antes de enviar para CAPI
import { sha256 } from 'crypto-js';

user_data: {
  em: sha256(email.toLowerCase().trim()),
  ph: sha256(phone.replace(/\D/g, '')), // apenas dígitos
  fn: sha256(firstName.toLowerCase()),
  ln: sha256(lastName.toLowerCase()),
  ct: sha256(city.toLowerCase()),
  st: sha256(state.toLowerCase()),
  country: sha256('br'),

  // Browser data (não hashear)
  client_user_agent: navigator.userAgent,
  client_ip_address: userIP, // capturado no backend

  // Facebook cookies
  fbp: getCookie('_fbp'),
  fbc: getCookie('_fbc'),

  // External ID (unificação)
  external_id: sha256(email) // mesmo ID em todos os sistemas
}
```

**Implementação dual (Pixel + CAPI):**

```javascript
// Função helper para dual tracking
async function trackMetaEvent(eventName, eventData, userData) {
  const eventID = `${eventName}_${Date.now()}_${Math.random()}`;

  // 1. Client-side Pixel
  if (window.fbq) {
    fbq('track', eventName, eventData, { eventID });
  }

  // 2. Server-side CAPI
  await fetch('/api/meta-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventID, // MESMO ID para deduplicação
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      action_source: 'website',
      user_data: {
        ...userData,
        client_user_agent: navigator.userAgent,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
      },
      custom_data: eventData
    })
  });
}
```

**Testes & Validação:**

1. **Meta Pixel Helper** (Chrome Extension): Verificar eventos client-side
2. **Events Manager**: Test Events com código de teste
3. **Event Match Quality**: Objetivo > 8.0 (enviar máximo de user_data)
4. **Deduplicação**: Validar que Pixel + CAPI não geram eventos duplicados

**Fontes:**
- [Meta Pixel Events Best Practices](https://madgicx.com/blog/facebook-pixel-events)
- [Facebook Conversions API Guide](https://leadsbridge.com/blog/facebook-conversions-api/)
- [Meta Events Manager Setup 2025](https://www.bestever.ai/post/meta-events-manager)

### LocalStorage Schema

```javascript
{
  "lead_draft_v3": {
    "data": {
      "name": "...",
      "phone": "...",
      // ... todos os campos
    },
    "currentStep": 1 | 2 | 3,
    "currentFieldIndex": 0-8, // qual campo está visível
    "fieldsCompleted": ["name", "phone", "email"],
    "webhooksSent": {
      "phone": true,
      "email": true,
      "city": false,
      // ...
    },
    "lastUpdated": "2025-12-28T10:30:00Z"
  }
}
```

---

## Estratégias de Recuperação de Leads

### 1. Auto-save contínuo
- Salva no localStorage a cada campo preenchido
- Se usuário fechar e voltar: restaura exatamente onde parou
- Modal exibe: "Bem-vindo de volta! Continue de onde parou"

### 2. Email de recuperação (backend)
- Se recebemos email parcial mas não finalizou:
- Dispara email após 2h: "Faltou pouco! Complete seu agendamento"
- Link direto para /lp-2 com token que pré-preenche dados

### 3. WhatsApp de recuperação (backend)
- Se recebemos telefone mas não finalizou:
- Dispara mensagem após 4h: "Olá [Nome]! Vi que você iniciou seu agendamento..."
- CTA para completar

### 4. Tracking de abandono
- Clarity evento: `form_field_abandoned` com metadados:
  ```javascript
  {
    fieldName: "email",
    step: 1,
    timeSpent: 45, // segundos
    attempts: 2 // quantas vezes clicou no campo
  }
  ```

---

## Copy otimizada — Comparação

### ❌ ANTES (estimula incompletude):
```
"Primeiro gravamos seu contato para a equipe agir rápido.
Em seguida pedimos mais alguns dados opcionais."
```
**Problema**: Palavra "opcionais" sugere que não precisa preencher

### ✅ DEPOIS (estimula completude):
```
"Para preparar uma consultoria personalizada, precisamos
conhecer um pouco sobre você e sua empresa."
```
**Benefício**: Conecta preenchimento com valor (consultoria personalizada)

---

### ❌ ANTES (genérico):
```
"Somente com nome + WhatsApp nossa equipe já consegue te retornar."
```
**Problema**: Incentiva parar no primeiro step

### ✅ DEPOIS (orientado a benefício):
```
Etapa 1: "Você receberá materiais exclusivos e o link da reunião"
Etapa 2: "Atendemos com consultores especializados em todas as regiões"
Etapa 3: "Quanto mais soubermos, melhor será a estratégia que vamos desenhar"
```
**Benefício**: Cada campo tem uma razão clara e valiosa

---

## Métricas de Sucesso

### KPIs primários:
- **Taxa de conclusão**: % que chega ao step 3 e clica "Agendar"
  - Meta: > 60% (vs ~40% do form tradicional)

- **Taxa de captura parcial**: % que deixa ao menos email
  - Meta: > 80%

- **Tempo médio de preenchimento**: segundos do início ao submit
  - Meta: < 90s

### KPIs secundários:
- **Taxa de abandono por campo**: qual campo tem maior drop-off
- **Taxa de recuperação**: % de leads parciais que voltam e completam
- **Taxa de erro por campo**: quantas validações falham

### Testes A/B futuros:
- Copy dos helper texts
- Ordem dos campos na etapa 3
- Mostrar barra de progresso vs não mostrar
- Auto-advance após preencher vs botão "Continuar"

---

## Acessibilidade & Performance

### Acessibilidade:
- ✓ Labels associados com `htmlFor`
- ✓ `aria-live="polite"` para helper texts dinâmicos
- ✓ `aria-required="true"` em campos obrigatórios
- ✓ `role="progressbar"` no indicador de etapas
- ✓ Navegação completa por teclado (Tab, Enter, Esc)
- ✓ Focus trap dentro do modal
- ✓ Skip to submit button (shortcut)

### Performance:
- ✓ Lazy load de cidades via IBGE (só quando UF selecionado)
- ✓ Debounce de 500ms nos webhooks parciais
- ✓ LocalStorage batch update (não escreve a cada keystroke)
- ✓ Animações via CSS (GPU-accelerated)
- ✓ Bundle size: componente < 15KB gzipped

---

## Resumo Visual do Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│  MODAL ABRE → Meta Pixel: InitiateCheckout                 │
│  Copy: "Vamos agendar sua reunião estratégica"             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ETAPA 1: Contato Inicial                       [1 de 3]   │
├─────────────────────────────────────────────────────────────┤
│  [Nome] ← aparece primeiro                                  │
│    ↓ onFocus/onChange → revela próximo                      │
│  [Telefone] ← aparece após interagir com Nome               │
│    → Webhook parcial (phone) + Meta Pixel: Lead (value:50)  │
│    ↓ onFocus/onChange → revela próximo                      │
│  [Email] ← aparece após interagir com Telefone              │
│    → Webhook parcial (email) + Meta Pixel: Lead (value:100) │
│    ↓ onFocus → revela botão                                 │
│  [Continuar →] ← aparece ao focar no Email                  │
│    → Meta Pixel: LeadStepComplete (step:1)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ slide transition
┌─────────────────────────────────────────────────────────────┐
│  ETAPA 2: Empresa & Localização                 [2 de 3]   │
├─────────────────────────────────────────────────────────────┤
│  [← Voltar]                                                 │
│  [Empresa] ← aparece primeiro                               │
│    ↓ onFocus/onChange → revela próximo                      │
│  [UF] ← aparece após interagir com Empresa                  │
│    → Dispara IBGE API (loading cidades)                     │
│    ↓ onFocus/onChange → revela próximo                      │
│  [Cidade] ← aparece após interagir com UF                   │
│    → Webhook parcial (city) + Meta Pixel custom data        │
│    ↓ onFocus → revela botão                                 │
│  [Continuar →]                                              │
│    → Meta Pixel: LeadStepComplete (step:2)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ slide transition
┌─────────────────────────────────────────────────────────────┐
│  ETAPA 3: Qualificação                          [3 de 3]   │
├─────────────────────────────────────────────────────────────┤
│  [← Voltar]                                                 │
│  Copy: "Última etapa! Vamos personalizar sua consultoria"  │
│  [Faturamento] ← aparece primeiro                           │
│    → Webhook parcial (billing)                              │
│    ↓ onFocus/onChange → revela próximo                      │
│  [Já vendeu gov?] ← aparece após Faturamento                │
│    → Helper dinâmico baseado em resposta                    │
│    → Webhook parcial (soldToGov)                            │
│    ↓ onFocus/onChange → revela próximo                      │
│  [Sobre o negócio] ← aparece após soldToGov                 │
│    ↓ onFocus → revela botão                                 │
│  [✓ Agendar minha reunião estratégica]                      │
│    → Meta Pixel: QualifiedLead (value:500)                  │
│    → Webhook FINAL completo                                 │
│    → Meta Pixel: CompleteRegistration (value:1000)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  POPUP DE SUCESSO                                           │
├─────────────────────────────────────────────────────────────┤
│  ✓ Tudo certo!                                              │
│  "Sua solicitação foi enviada com sucesso..."               │
│                                                             │
│  [Agendar reunião agora] ← abre AGENDA_URL                  │
│  [Falar no WhatsApp] ← abre WHATSAPP_URL                    │
│  [Fechar]                                                   │
└─────────────────────────────────────────────────────────────┘
```

**Eventos de abandono:**
```
Modal fecha no meio de qualquer etapa
  ↓
Meta Pixel: LeadStepAbandoned
  → step_number, last_field_completed, time_spent
Clarity: form_field_abandoned
  → identifica ponto de fricção
```

---

## Próximos passos

1. ✅ **Review desta spec** — ajustes de copy, ordem de campos, etc
2. ⏳ **Implementação** — refatorar `lead-modal-wizard.tsx`
   - Adicionar lógica de reveal progressivo
   - Implementar Meta Pixel dual tracking
   - Configurar debounce nos triggers
   - Adicionar Framer Motion (opcional)
3. ⏳ **Testes internos** — validar fluxo e animações
   - Testar em desktop + mobile
   - Validar Meta Pixel Helper
   - Verificar webhooks parciais no n8n
4. ⏳ **Deploy em /lp-2** — manter versão atual em `/` para A/B test
5. ⏳ **Monitoramento** — acompanhar métricas por 2 semanas
   - Taxa de conclusão por etapa
   - Event Match Quality no Meta
   - Clarity heatmaps/session recordings
6. ⏳ **Iteração** — ajustar com base nos dados

---

## Dependências de Implementação

### NPM Packages necessários:
```bash
# Animações (opcional, mas recomendado)
npm install framer-motion

# Debounce (se não usar lodash)
npm install use-debounce

# Hashing para Meta CAPI
npm install crypto-js
npm install @types/crypto-js --save-dev
```

### Arquivos a criar/modificar:

**Criar:**
- `lib/meta-tracking.ts` — helpers para dual tracking Pixel + CAPI
- `lib/field-reveal.ts` — lógica de reveal progressivo
- `hooks/useFieldReveal.ts` — custom hook para controle de campos visíveis

**Modificar:**
- `components/lead-modal-wizard.tsx` — refatoração completa com reveal progressivo
- `lib/clarity-events.ts` — adicionar eventos de field interaction
- `app/api/meta-events/route.ts` — expandir para suportar custom events

### Variáveis de ambiente:
```bash
# Já existentes:
NEXT_PUBLIC_META_PIXEL_ID=
META_PIXEL_ACCESS_TOKEN=
META_PIXEL_TEST_EVENT_CODE=

# Novas (se necessário):
NEXT_PUBLIC_ENABLE_FRAMER_MOTION=true  # feature flag
```

---

## Questões Resolvidas ✅

1. ~~**Copy**: As mensagens de helper text estão convincentes ou muito "salesy"?~~
   - ✅ Copy aprovada, orientada a benefícios

2. ~~**Auto-advance**: Campo deve avançar automaticamente após validação ou esperar botão?~~
   - ✅ Campos aparecem progressivamente (auto), mas botão "Continuar" obrigatório entre etapas

3. ~~**Progress indicator**: Mostrar "X de 3 etapas" ou "X de 9 campos"?~~
   - ✅ Mostrar "Etapa X de 3"

4. ~~**Validação**: Quando validar?~~
   - ✅ Inline (onBlur) + ao clicar "Continuar"

## Questões Abertas

1. **Ordem dos campos na etapa 3**: Faturamento → soldToGov → pain (nessa ordem mesmo?)
2. **Obrigatoriedade**: Ter opção "Prefiro não informar" no faturamento? Ou deixar obrigatório?
3. **Timeout do webhook**: 500ms de debounce é suficiente ou aumentar para 800ms?
4. **Framer Motion**: Vale adicionar a dependência (~60KB) ou CSS puro é suficiente?
5. **Lead Score**: Calcular score de qualificação no client ou no backend?
6. **Valores de conversão Meta Pixel**: R$50 (phone), R$100 (email), R$500 (qualified), R$1000 (complete) — calibrar com histórico?
7. **Responsável pelas credenciais Meta**: Quem gerencia `META_PIXEL_ACCESS_TOKEN` e rotação?

---

## Pontos de Atenção para Implementação

### Crítico (fazer antes do deploy)

1. **Fallback para API IBGE**
   - Cache de cidades no localStorage (TTL: 7 dias)
   - Se IBGE falhar: permitir input manual de cidade
   - **Normalização de input manual**: trim + capitalize + limitar 100 chars
   - Timeout de 5s na requisição IBGE

2. **Retry/backoff para webhooks**
   - Tentar 3x com backoff exponencial (1s, 2s, 4s)
   - Salvar no localStorage se todas falharem
   - Retentar ao reabrir modal
   - **Idempotência**: usar `eventID` único para evitar duplicação no backend

3. **Estados de loading/erro**
   - Loading state no select de cidade (skeleton)
   - Toast de erro se webhook falhar
   - Permitir reenvio manual

4. **Acessibilidade**
   - `aria-live="polite"` nos helper texts
   - `prefers-reduced-motion` para desabilitar animações
   - ARIA labels em todos os campos

5. **Eventos Meta Pixel diferenciados**
   - Usar `trackCustom` para eventos parciais
   - Naming convention clara:
     ```
     LeadPartialPhone  (não "Lead")
     LeadPartialEmail  (não "Lead")
     LeadComplete      (evento final)
     ```

6. **Segurança de dados no localStorage**
   - **NÃO** salvar dados sensíveis em plain text
   - Salvar apenas: `{name, phone, email, company, uf, city, billing, soldToGov}`
   - **NÃO** salvar: tokens, IPs, dados de pagamento
   - Limpar localStorage após conversão bem-sucedida

7. **Microcopy de privacidade no modal**
   - Adicionar texto sutil no rodapé do modal:
     ```
     "Ao continuar, você concorda com nossa Política de Privacidade"
     ```
   - Link para /privacidade em texto pequeno
   - Não bloquear ação (sem checkbox)

### Importante (fazer pós-MVP)

1. **Feature flags**
   - `NEXT_PUBLIC_ENABLE_FRAMER_MOTION` para animações
   - Permite rollback rápido se algo quebrar

2. **Baseline de métricas**
   - Capturar taxa de conversão atual antes do deploy
   - Comparar com nova versão após 2 semanas

3. **Versionamento localStorage**
   - `lead_draft_v3` atual
   - Migration automática se schema mudar

4. **QA em dispositivos de baixo desempenho**
   - Testar em Android mid-range (Moto G, Galaxy A)
   - Network throttling: 3G slow
   - Validar animações não travam em devices fracos
   - Considerar desabilitar Framer Motion em devices lentos

### Opcional (nice to have)

1. **Componentes reutilizáveis**
   - Skeletons para loading states
   - Toast notifications
   - (Baixa prioridade, pode usar shadcn defaults)

2. **Monitoramento**
   - Clarity já cobre reveal progressivo
   - Adicionar alert no Sentry se webhook falha > 10%

### ❌ Over-engineering (ignorar)

- ~~Matriz RACI~~ — startup pequena, não precisa
- ~~Guided tour~~ — over-engineering para MVP
- ~~Toggle opt-out LGPD~~ — links no footer são suficientes
- ~~Monitoramento sintético~~ — Clarity + manual QA é suficiente
- ~~Diagrama de estados de race condition~~ — React já gerencia isso com useCallback
- ~~Testes offline~~ — edge case, baixa prioridade
