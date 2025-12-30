/**
 * Webhook Retry Logic with Exponential Backoff
 *
 * Implements retry mechanism for failed webhooks with:
 * - 3 attempts total
 * - Exponential backoff: 1s, 2s, 4s
 * - Idempotency using eventID
 */

interface WebhookPayload {
  [key: string]: unknown;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY = 1000; // 1 segundo

/**
 * Faz retry de uma requisição com backoff exponencial
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelay = options.baseDelay ?? DEFAULT_BASE_DELAY;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Não fazer retry na última tentativa
      if (attempt === maxRetries - 1) {
        break;
      }

      // Backoff exponencial: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Webhook failed after retries');
}

/**
 * Envia webhook com retry automático e idempotência
 */
export async function sendWebhookWithRetry(
  url: string,
  payload: WebhookPayload,
  eventID?: string
): Promise<void> {
  const body: WebhookPayload = {
    ...payload,
  };

  // Adiciona eventID se fornecido (para idempotência no backend)
  if (eventID) {
    body.event_id = eventID;
  }

  console.log('[Webhook Retry] Iniciando envio...', { url, eventID, payload: body });

  await retryWithBackoff(async () => {
    console.log('[Webhook Retry] Fazendo requisição POST...');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('[Webhook Retry] Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    return response;
  });

  console.log('[Webhook Retry] ✅ Webhook enviado com sucesso!');
}

/**
 * Storage key para webhooks que falharam completamente
 */
const FAILED_WEBHOOKS_KEY = 'failed_webhooks_v1';

interface FailedWebhook {
  url: string;
  payload: WebhookPayload;
  timestamp: number;
  eventID?: string;
}

/**
 * Salva webhook que falhou após todas as tentativas
 */
export function saveFailedWebhook(
  url: string,
  payload: WebhookPayload,
  eventID?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = window.localStorage.getItem(FAILED_WEBHOOKS_KEY);
    const failed: FailedWebhook[] = existing ? JSON.parse(existing) : [];

    failed.push({
      url,
      payload,
      timestamp: Date.now(),
      eventID,
    });

    window.localStorage.setItem(FAILED_WEBHOOKS_KEY, JSON.stringify(failed));
  } catch (error) {
    console.error('[Webhook Retry] Failed to save failed webhook:', error);
  }
}

/**
 * Retenta todos os webhooks que falharam anteriormente
 */
export async function retryFailedWebhooks(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const existing = window.localStorage.getItem(FAILED_WEBHOOKS_KEY);
    if (!existing) return;

    const failed: FailedWebhook[] = JSON.parse(existing);
    if (failed.length === 0) return;

    const stillFailed: FailedWebhook[] = [];

    for (const item of failed) {
      try {
        await sendWebhookWithRetry(item.url, item.payload, item.eventID);
        // Sucesso: não adiciona de volta
      } catch (error) {
        // Ainda falhou: mantém na lista
        stillFailed.push(item);
      }
    }

    // Atualiza localStorage com os que ainda falharam
    if (stillFailed.length > 0) {
      window.localStorage.setItem(FAILED_WEBHOOKS_KEY, JSON.stringify(stillFailed));
    } else {
      window.localStorage.removeItem(FAILED_WEBHOOKS_KEY);
    }
  } catch (error) {
    console.error('[Webhook Retry] Failed to retry webhooks:', error);
  }
}

/**
 * Limpa webhooks falhados do localStorage
 */
export function clearFailedWebhooks(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(FAILED_WEBHOOKS_KEY);
}
