/**
 * Microsoft Clarity Event Tracking
 *
 * Centraliza todos os eventos customizados do Clarity para análise de conversão.
 * Cada evento rastreado permite identificar pontos de fricção no funil e otimizar a conversão.
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

/**
 * Verifica se o Clarity está disponível no window
 */
function isClarityAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.clarity === "function";
}

/**
 * EVENTOS DE CTA - Rastreiam interações com Call-to-Actions
 * Objetivo: Identificar quais CTAs geram mais engajamento
 */

export function trackCtaClick(location: string) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `cta_click_${location}`);

  // Tag para segmentar sessões com interesse
  window.clarity!("set", "has_cta_click", "true");
  window.clarity!("set", "cta_location", location);
}

/**
 * EVENTOS DE FORMULÁRIO - Rastreiam o funil do lead capture
 * Objetivo: Identificar em qual step os usuários abandonam
 */

export function trackFormOpen() {
  if (!isClarityAvailable()) return;

  window.clarity!("event", "form_opened");
  window.clarity!("set", "form_opened", "true");
}

export function trackFormStepComplete(step: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `form_step_${step}_completed`);
  window.clarity!("set", "form_highest_step", String(step));
}

export function trackFormStepBack(fromStep: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `form_step_back_from_${fromStep}`);
}

export function trackFormAbandonment(step: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `form_abandoned_step_${step}`);
  window.clarity!("set", "form_abandoned", "true");
  window.clarity!("set", "abandoned_at_step", String(step));
}

export function trackFormSubmitSuccess() {
  if (!isClarityAvailable()) return;

  window.clarity!("event", "form_submit_success");
  window.clarity!("set", "converted", "true");
}

export function trackFormSubmitError(error: string) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", "form_submit_error");
  window.clarity!("set", "form_error", error);
}

export function trackLeadPartial(step: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `lead_partial_step_${step}`);
  window.clarity!("set", "has_partial_lead", "true");
  window.clarity!("set", "partial_lead_last_step", String(step));
}

/**
 * EVENTOS DE QUALIFICAÇÃO - Rastreiam dados de qualificação do lead
 * Objetivo: Segmentar sessões por perfil de lead (tamanho, localização, experiência)
 */

export function trackLeadQualification(data: {
  billing?: string;
  soldToGov?: "sim" | "nao";
  uf?: string;
}) {
  if (!isClarityAvailable()) return;

  if (data.billing) {
    window.clarity!("set", "lead_billing_range", data.billing);
  }

  if (data.soldToGov) {
    window.clarity!("set", "sold_to_gov_before", data.soldToGov);
  }

  if (data.uf) {
    window.clarity!("set", "lead_state", data.uf);
  }
}

/**
 * EVENTOS DE ENGAJAMENTO - Rastreiam interações com conteúdo
 * Objetivo: Entender quais seções geram mais interesse
 */

export function trackSectionView(sectionName: string) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `section_viewed_${sectionName}`);
}

export function trackFaqExpand(question: string) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", "faq_expanded");
  window.clarity!("set", "engaged_with_faq", "true");
}

export function trackScrollDepth(percentage: 25 | 50 | 75 | 100) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `scroll_depth_${percentage}`);
  window.clarity!("set", "max_scroll_depth", String(percentage));
}

/**
 * EVENTOS DE INTENÇÃO DE SAÍDA - Rastreiam sinais de abandono
 * Objetivo: Identificar padrões de abandono para estratégias de retenção
 */

export function trackExitIntent() {
  if (!isClarityAvailable()) return;

  window.clarity!("event", "exit_intent_detected");
  window.clarity!("set", "showed_exit_intent", "true");
}

/**
 * IDENTIFICAÇÃO DE USUÁRIO - Associa sessão a um lead convertido
 * Objetivo: Conectar sessões de visualização com leads no CRM
 */

export function identifyUser(email: string, customData?: {
  name?: string;
  company?: string;
}) {
  if (!isClarityAvailable()) return;

  // Usa email como ID único (hashed no backend se necessário)
  window.clarity!("identify", email);

  if (customData?.name) {
    window.clarity!("set", "user_name", customData.name);
  }

  if (customData?.company) {
    window.clarity!("set", "user_company", customData.company);
  }
}

/**
 * EVENTOS DE INTERAÇÃO COM CAMPOS - Rastreiam interações individuais
 * Objetivo: Identificar em qual campo específico os usuários travam ou abandonam
 */

export function trackFieldFocus(fieldName: string, step: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `field_focus_${fieldName}`);
  window.clarity!("set", "last_field_focused", fieldName);
  window.clarity!("set", "last_field_step", String(step));
}

export function trackFieldRevealed(fieldName: string, step: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `field_revealed_${fieldName}`);
}

export function trackFieldCompleted(fieldName: string, step: number) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `field_completed_${fieldName}`);
  window.clarity!("set", "last_field_completed", fieldName);
}

export function trackFieldAbandoned(
  fieldName: string,
  step: number,
  timeSpent: number,
  attempts: number
) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", "form_field_abandoned");
  window.clarity!("set", "abandoned_field", fieldName);
  window.clarity!("set", "abandoned_field_step", String(step));
  window.clarity!("set", "abandoned_field_time", String(timeSpent));
  window.clarity!("set", "abandoned_field_attempts", String(attempts));
}

/**
 * EVENTOS DE ERRO - Rastreiam problemas técnicos
 * Objetivo: Identificar bugs que afetam conversão
 */

export function trackError(errorType: string, errorMessage?: string) {
  if (!isClarityAvailable()) return;

  window.clarity!("event", `error_${errorType}`);

  if (errorMessage) {
    window.clarity!("set", "last_error", errorMessage);
  }
}
