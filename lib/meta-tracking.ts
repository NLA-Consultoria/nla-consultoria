/**
 * Meta Tracking - Dual Tracking (Pixel + Conversions API)
 *
 * Implementa tracking duplo para Meta (Facebook) Ads:
 * - Client-side: Meta Pixel (fbq)
 * - Server-side: Conversions API (CAPI via /api/meta-events)
 *
 * Usa eventID compartilhado para deduplicação automática.
 */

import CryptoJS from 'crypto-js';

declare global {
  interface Window {
    fbq?: (
      type: 'track' | 'trackCustom',
      eventName: string,
      data?: Record<string, unknown>,
      options?: { eventID: string }
    ) => void;
  }
}

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface MetaEventData {
  content_name?: string;
  content_category?: string;
  status?: 'partial' | 'complete';
  value?: number;
  currency?: string;
  step_number?: number;
  step_name?: string;
  billing_range?: string;
  gov_experience?: boolean;
  last_field_completed?: string;
  time_spent?: number;
  source?: string;
  [key: string]: unknown;
}

/**
 * Obtém cookie pelo nome
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Limpa número de telefone (remove caracteres não numéricos)
 */
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Hash SHA256 de uma string
 */
function hashSHA256(value: string): string {
  return CryptoJS.SHA256(value.toLowerCase().trim()).toString();
}

/**
 * Divide nome completo em firstName e lastName
 * Ex: "João da Silva Santos" → { firstName: "João", lastName: "da Silva Santos" }
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/); // Split por espaços

  if (parts.length === 1) {
    return { firstName: parts[0] || '', lastName: '' };
  }

  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');

  return { firstName, lastName };
}

/**
 * Prepara user_data para Meta Conversions API
 * Todos os campos são hasheados com SHA256
 */
function prepareUserData(userData: UserData): Record<string, string> {
  const result: Record<string, string> = {};

  if (userData.email) {
    result.em = hashSHA256(userData.email);
  }

  if (userData.phone) {
    result.ph = hashSHA256(cleanPhone(userData.phone));
  }

  if (userData.firstName) {
    // Normaliza: lowercase + remove acentos
    const normalized = userData.firstName
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    result.fn = hashSHA256(normalized);
  }

  if (userData.lastName) {
    const normalized = userData.lastName
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    result.ln = hashSHA256(normalized);
  }

  if (userData.city) {
    const normalized = userData.city
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    result.ct = hashSHA256(normalized);
  }

  if (userData.state) {
    // UF em lowercase (ex: "SP" → "sp")
    result.st = hashSHA256(userData.state.trim().toLowerCase());
  }

  // País fixo (Brasil) ou fornecido
  if (userData.country) {
    result.country = hashSHA256(userData.country.trim().toLowerCase());
  } else {
    result.country = hashSHA256('br');
  }

  // Browser data (não hashear)
  if (typeof navigator !== 'undefined') {
    result.client_user_agent = navigator.userAgent;
  }

  // Facebook cookies
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');

  if (fbp) result.fbp = fbp;
  if (fbc) result.fbc = fbc;

  // External ID (hash do email se disponível)
  if (userData.email) {
    result.external_id = hashSHA256(userData.email);
  }

  return result;
}

/**
 * Gera eventID único para deduplicação
 */
function generateEventID(eventName: string): string {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Track evento no Meta Pixel (client-side) e Conversions API (server-side)
 *
 * @param eventName - Nome do evento (Lead, CompleteRegistration, etc)
 * @param eventData - Dados do evento (custom_data)
 * @param userData - Dados do usuário para Match Quality
 * @param isStandardEvent - Se true, usa fbq('track'), se false usa fbq('trackCustom')
 */
export async function trackMetaEvent(
  eventName: string,
  eventData: MetaEventData = {},
  userData: UserData = {},
  isStandardEvent: boolean = false
): Promise<void> {
  const eventID = generateEventID(eventName);

  // 1. Client-side Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      const trackType = isStandardEvent ? 'track' : 'trackCustom';
      window.fbq(trackType, eventName, eventData, { eventID });
    } catch (error) {
      console.error('[Meta Pixel] Error tracking event:', error);
    }
  }

  // 2. Server-side Conversions API
  try {
    const response = await fetch('/api/meta-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventID, // MESMO eventID do Pixel para deduplicação
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        action_source: 'website',
        user_data: prepareUserData(userData),
        custom_data: eventData,
      }),
    });

    if (!response.ok) {
      console.error('[Meta CAPI] Failed to send event:', response.statusText);
    }
  } catch (error) {
    console.error('[Meta CAPI] Error sending event:', error);
  }
}

/**
 * Helper: Track InitiateCheckout (modal open)
 */
export function trackModalOpen(): Promise<void> {
  return trackMetaEvent(
    'InitiateCheckout',
    {
      content_category: 'lead_form',
      content_name: 'lp-2_modal',
      source: 'lp-2',
    },
    {},
    true // standard event
  );
}

/**
 * Helper: Track LeadStepStart (específico por step)
 */
export function trackStepStart(stepNumber: number, stepName: string): Promise<void> {
  return trackMetaEvent(`LeadStep${stepNumber}Start`, {
    step_number: stepNumber,
    step_name: stepName,
    source: 'lp-2',
  });
}

/**
 * Helper: Track LeadStepComplete (específico por step)
 */
export function trackStepComplete(stepNumber: number, stepName: string): Promise<void> {
  return trackMetaEvent(`LeadStep${stepNumber}Complete`, {
    step_number: stepNumber,
    step_name: stepName,
    source: 'lp-2',
  });
}

/**
 * Helper: Track PartialSubmit (NÃO usa evento "Lead" padrão)
 *
 * O evento "Lead" é reservado apenas para formulário completo.
 * Este evento rastreia submissões parciais de campos importantes.
 */
export function trackPartialLead(
  fieldName: string,
  value: number,
  userData: UserData
): Promise<void> {
  return trackMetaEvent(
    'PartialSubmit', // MUDADO: não usa "Lead" padrão
    {
      content_name: `partial_lead_${fieldName}`,
      status: 'partial',
      field_name: fieldName,
      value,
      currency: 'BRL',
    },
    userData
    // NÃO é standard event
  );
}

/**
 * Helper: Track QualifiedLead
 *
 * @param userData - Deve incluir: email, phone, firstName, lastName, city, state
 */
export function trackQualifiedLead(
  billingRange: string,
  govExperience: boolean,
  userData: UserData
): Promise<void> {
  return trackMetaEvent('QualifiedLead', {
    step_number: 3,
    step_name: 'qualification',
    billing_range: billingRange,
    gov_experience: govExperience,
    source: 'lp-2',
    value: 500,
    currency: 'BRL',
  }, userData);
}

/**
 * Helper: Track CompleteRegistration
 *
 * @param userData - Deve incluir: email, phone, firstName, lastName, city, state
 */
export function trackCompleteRegistration(userData: UserData): Promise<void> {
  return trackMetaEvent(
    'CompleteRegistration',
    {
      content_name: 'lp-2_full_lead',
      status: 'complete',
      value: 1000,
      currency: 'BRL',
    },
    userData,
    true // standard event
  );
}

/**
 * Helper: Track Lead (APENAS formulário completo)
 *
 * ⚠️ IMPORTANTE: Este evento "Lead" padrão só deve ser disparado
 * quando o formulário estiver 100% completo e enviado.
 * Para leads parciais, use trackPartialLead() que dispara "PartialSubmit".
 *
 * @param userData - Deve incluir: email, phone, firstName, lastName, city, state
 */
export function trackLeadComplete(userData: UserData): Promise<void> {
  return trackMetaEvent(
    'Lead', // Evento padrão Meta
    {
      content_name: 'lp-2_complete_lead',
      status: 'complete',
      value: 1500,
      currency: 'BRL',
    },
    userData,
    true // standard event
  );
}

/**
 * Helper: Track LeadStepAbandoned (específico por step)
 */
export function trackStepAbandoned(
  stepNumber: number,
  stepName: string,
  lastField: string,
  timeSpent: number
): Promise<void> {
  return trackMetaEvent(`LeadStep${stepNumber}Abandoned`, {
    step_number: stepNumber,
    step_name: stepName,
    last_field_completed: lastField,
    time_spent: timeSpent,
    source: 'lp-2',
  });
}
