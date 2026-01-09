"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { leadSchema, PHONE_MASK, type LeadData } from "../lib/validators";
import {
  trackFormOpen,
  trackFormStepComplete,
  trackFormStepBack,
  trackFormAbandonment,
  trackFormSubmitSuccess,
  trackFormSubmitError,
  trackLeadQualification,
  identifyUser,
  trackLeadPartial,
  trackFieldFocus,
  trackFieldRevealed,
  trackFieldCompleted,
} from "../lib/clarity-events";
import { env } from "../lib/env";
import { useFieldReveal } from "../hooks/useFieldReveal";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import {
  type FieldName,
  type StepNumber,
  getNextField,
  isLastFieldInStep,
  isCriticalField,
  getFieldLabel,
  getStepName,
} from "../lib/field-reveal";
import {
  trackModalOpen,
  trackStepStart,
  trackStepComplete,
  trackPartialLead,
  trackQualifiedLead,
  trackCompleteRegistration,
  trackLeadComplete,
  trackStepAbandoned,
  splitFullName, // ADD THIS
} from "../lib/meta-tracking";
import { sendWebhookWithRetry, saveFailedWebhook, retryFailedWebhooks } from "../lib/webhook-retry";
import { fetchCities, normalizeCityInput } from "../lib/ibge-cities";

type LeadModalContextType = { open: () => void };
const LeadModalContext = createContext<LeadModalContextType | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal deve ser usado dentro de LeadModalProvider");
  return ctx;
}

type ProviderProps = { children: React.ReactNode };

const DEFAULT_WEBHOOK_URL = "https://n8n.nlaconsultoria.com.br/webhook/3761388d-abd3-489c-9800-eb843058f504";

const DRAFT_STORAGE_KEY = "lead_draft_v2";

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

type Draft = {
  name: string;
  phone: string;
  email: string;
  company: string;
  uf: string;
  city: string;
  billing: string;
  soldToGov: "sim" | "nao" | "";
  pain: string;
};

type ExpressStep = 1 | 2 | 3 | 4;

function getWebhookUrl() {
  return env.N8N_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function LeadModalProvider({ children }: ProviderProps) {
  const pathname = usePathname();
  const isExpressVariant = pathname?.startsWith("/lp-2");

  if (isExpressVariant) {
    return <LeadModalExpressProvider>{children}</LeadModalExpressProvider>;
  }

  return <LeadModalWizardProvider>{children}</LeadModalWizardProvider>;
}

// Gera um ID único de sessão para tracking
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function LeadModalExpressProvider({ children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState(false);
  const [manualCityInput, setManualCityInput] = useState(false);
  const [step, setStep] = useState<StepNumber>(1);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [lastPartialStep, setLastPartialStep] = useState(0);
  const [webhooksSent, setWebhooksSent] = useState<Set<FieldName>>(new Set());
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [sessionId, setSessionId] = useState<string>(() => generateSessionId());

  const { visibleFields, revealNextField, resetFieldsForStep, isFieldVisible } = useFieldReveal(1);

  const [data, setData] = useState<Draft>({
    name: "",
    phone: "",
    email: "",
    company: "",
    uf: "",
    city: "",
    billing: "",
    soldToGov: "",
    pain: "",
  });

  // Debounced values para triggers de reveal
  const [debouncedName] = useDebounce(data.name, 800);
  const [debouncedPhone] = useDebounce(data.phone, 800);
  const [debouncedEmail] = useDebounce(data.email, 800);
  const [debouncedCompany] = useDebounce(data.company, 800);
  const [debouncedUf] = useDebounce(data.uf, 800);
  const [debouncedCity] = useDebounce(data.city, 800);
  const [debouncedBilling] = useDebounce(data.billing, 800);
  const [debouncedSoldToGov] = useDebounce(data.soldToGov, 800);
  const [debouncedPain] = useDebounce(data.pain, 800);

  const open = useCallback(() => {
    setError(null);
    setIsOpen(true);
    setStepStartTime(Date.now());

    // Determina step inicial baseado em dados já preenchidos
    const initialStep: StepNumber =
      data.name && data.phone && data.email && data.company && data.uf && data.city ? 3
      : data.name && data.phone && data.email ? 2
      : 1;

    setStep(initialStep);
    resetFieldsForStep(initialStep);

    // Track modal open
    trackFormOpen();
    trackModalOpen();
    trackStepStart(initialStep, getStepName(initialStep));

    // Retenta webhooks falhados anteriormente
    retryFailedWebhooks().catch(console.error);
  }, [data, resetFieldsForStep]);

  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    if (typeof window === "undefined" || draftLoaded) return;
    try {
      const payload = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (payload) {
        const parsed = JSON.parse(payload) as {
          data?: Draft;
          lastPartialStep?: number;
          sessionId?: string;
          webhooksSent?: string[]; // Array de strings dos campos já enviados
        };
        if (parsed?.data) {
          setData((prev) => ({ ...prev, ...parsed.data! }));
        }
        if (parsed?.lastPartialStep) {
          setLastPartialStep(parsed.lastPartialStep);
        }
        if (parsed?.sessionId) {
          setSessionId(parsed.sessionId);
        }
        if (parsed?.webhooksSent && Array.isArray(parsed.webhooksSent)) {
          // Restaura os webhooks que já foram enviados
          setWebhooksSent(new Set(parsed.webhooksSent as any));
          console.log('[Draft Recovery] ✅ Webhooks já enviados recuperados:', parsed.webhooksSent);
        }
      }
    } catch {
      // ignora drafts inválidos
    } finally {
      setDraftLoaded(true);
    }
  }, [draftLoaded]);

  useEffect(() => {
    if (!draftLoaded || typeof window === "undefined") return;

    // Converte Set para Array para salvar no localStorage
    const webhooksSentArray = Array.from(webhooksSent);

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        data,
        lastPartialStep,
        sessionId,
        webhooksSent: webhooksSentArray, // Salva quais webhooks já foram enviados
      }),
    );
  }, [data, lastPartialStep, sessionId, webhooksSent, draftLoaded]);

  // Carrega cidades do IBGE (com cache e fallback)
  useEffect(() => {
    async function loadCities(state: string) {
      if (!state) {
        setCities([]);
        setCitiesError(false);
        return;
      }

      setCitiesLoading(true);
      setCitiesError(false);

      try {
        const cities = await fetchCities(state);

        if (cities.length === 0) {
          // API falhou, permite input manual
          setCitiesError(true);
          setManualCityInput(true);
        } else {
          setCities(cities);
          setManualCityInput(false);
        }
      } catch (error) {
        console.error('[Cities] Failed to load:', error);
        setCitiesError(true);
        setManualCityInput(true);
      } finally {
        setCitiesLoading(false);
      }
    }

    loadCities(data.uf);
  }, [data.uf]);

  // Valida que os dados não estejam vazios antes de enviar
  const validatePayload = useCallback((payload: Partial<LeadData>, fieldName: FieldName): boolean => {
    // Lista de campos que devem estar preenchidos para cada tipo de webhook
    const requiredFields: Record<string, string[]> = {
      phone: ['name', 'phone'],
      email: ['name', 'phone', 'email'],
      city: ['name', 'phone', 'email', 'company', 'uf', 'city'],
      billing: ['name', 'phone', 'email', 'company', 'uf', 'city', 'billing'],
      soldToGov: ['name', 'phone', 'email', 'company', 'uf', 'city', 'billing', 'soldToGov'],
    };

    const required = requiredFields[fieldName] || [];

    for (const field of required) {
      const value = payload[field as keyof LeadData];
      if (!value || value.toString().trim() === '') {
        console.error(`[Validação] ❌ Campo "${field}" está vazio! Abortando envio de webhook.`);
        return false;
      }
    }

    console.log('[Validação] ✅ Todos os campos obrigatórios estão preenchidos:', required);
    return true;
  }, []);

  // Função para enviar webhooks parciais (declarada antes dos useEffects)
  const sendPartialWebhook = useCallback(async (fieldName: FieldName, payload: Partial<LeadData>) => {
    const webhookUrl = getWebhookUrl();

    console.log('[Partial Webhook] Tentando enviar...', {
      fieldName,
      url: webhookUrl,
      sessionId,
      payload
    });

    // VALIDAÇÃO CRÍTICA: Nunca enviar dados vazios
    if (!validatePayload(payload, fieldName)) {
      console.error('[Partial Webhook] ❌ ABORTADO: Dados inválidos ou vazios detectados!');
      return;
    }

    const eventID = `partial_${sessionId}_${fieldName}_${Date.now()}`;

    try {
      console.log('[Partial Webhook] ✅ Validação OK. Enviando para:', webhookUrl);
      await sendWebhookWithRetry(
        webhookUrl,
        {
          ...payload,
          session_id: sessionId,
          event_type: 'partial_lead',
          status: 'partial',
          field_completed: fieldName,
          step: getStepName(step),
          source: 'lp-2',
          timestamp: new Date().toISOString(),
        },
        eventID
      );
      console.log('[Partial Webhook] ✅ Enviado com sucesso!', fieldName, payload);
      trackLeadPartial(step);
    } catch (error) {
      console.error('[Partial Webhook] ❌ Falhou após retries:', error);
      // Salva para tentar novamente depois
      saveFailedWebhook(webhookUrl, {
        ...payload,
        session_id: sessionId,
        event_type: 'partial_lead',
        status: 'partial',
        field_completed: fieldName,
      }, eventID);
    }
  }, [step, sessionId, validatePayload]);

  // Progressive reveal: Nome -> Phone
  useEffect(() => {
    if (step === 1 && debouncedName && debouncedName.length >= 3) {
      revealNextField('name', 1);
      trackFieldCompleted('name', 1);
      trackFieldRevealed('phone', 1);

      // Scroll suave para o novo campo em mobile
      setTimeout(() => {
        const phoneField = document.getElementById('express-phone');
        if (phoneField) {
          phoneField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [debouncedName, step, revealNextField]);

  // Progressive reveal: Phone -> Email
  useEffect(() => {
    if (step === 1 && debouncedPhone && debouncedPhone.length >= 14) {
      console.log('[Phone Field] ✅ Telefone preenchido:', debouncedPhone, 'Nome:', debouncedName);
      revealNextField('phone', 1);
      trackFieldCompleted('phone', 1);
      trackFieldRevealed('email', 1);

      // Scroll suave para email em mobile
      setTimeout(() => {
        const emailField = document.getElementById('express-email');
        if (emailField) {
          emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // 🔥 CRÍTICO: Envia webhook parcial IMEDIATAMENTE com nome + telefone
      // Este é o webhook mais importante para remarketing!
      if (!webhooksSent.has('phone') && debouncedName && debouncedName.trim() !== '') {
        console.log('[Phone Field] 🚀 ENVIANDO WEBHOOK CRÍTICO: Nome + Telefone (dados mais importantes!)');
        setWebhooksSent(prev => new Set(prev).add('phone'));
        sendPartialWebhook('phone', {
          name: debouncedName,
          phone: debouncedPhone,
        }).catch(err => {
          console.error('[Phone Field] ❌ ERRO CRÍTICO ao enviar webhook:', err);
        });
        const { firstName, lastName } = splitFullName(debouncedName);
        trackPartialLead('phone', 50, {
          email: debouncedEmail,
          phone: debouncedPhone,
          firstName,
          lastName,
        });
      } else if (webhooksSent.has('phone')) {
        console.log('[Phone Field] Webhook já foi enviado anteriormente, pulando...');
      } else {
        console.warn('[Phone Field] ⚠️ Nome não preenchido ainda, aguardando...');
      }
    }
  }, [debouncedPhone, debouncedName, step, revealNextField, webhooksSent, sendPartialWebhook]);

  // Progressive reveal: Email -> Continuar (step 1)
  useEffect(() => {
    if (step === 1 && debouncedEmail && debouncedEmail.includes('@')) {
      console.log('[Email Field] ✅ Email preenchido:', debouncedEmail);
      trackFieldCompleted('email', 1);

      // Envia webhook parcial para email (se ainda não enviou)
      if (!webhooksSent.has('email') && debouncedName && debouncedPhone) {
        console.log('[Email Field] 📧 Enviando webhook: Nome + Telefone + Email');
        setWebhooksSent(prev => new Set(prev).add('email'));
        sendPartialWebhook('email', {
          name: debouncedName,
          phone: debouncedPhone,
          email: debouncedEmail,
        }).catch(err => {
          console.error('[Email Field] ❌ Erro ao enviar webhook:', err);
        });
        const { firstName, lastName } = splitFullName(debouncedName);
        trackPartialLead('email', 100, {
          email: debouncedEmail,
          phone: debouncedPhone,
          firstName,
          lastName,
        });
      } else if (webhooksSent.has('email')) {
        console.log('[Email Field] Webhook já foi enviado anteriormente, pulando...');
      } else {
        console.warn('[Email Field] ⚠️ Nome ou telefone não preenchidos ainda, aguardando...');
      }
    }
  }, [debouncedEmail, debouncedName, debouncedPhone, step, webhooksSent, sendPartialWebhook]);

  // Progressive reveal: Company -> UF
  useEffect(() => {
    if (step === 2 && debouncedCompany && debouncedCompany.length >= 2) {
      revealNextField('company', 2);
      trackFieldCompleted('company', 2);
      trackFieldRevealed('uf', 2);

      // Scroll suave para UF em mobile
      setTimeout(() => {
        const ufField = document.getElementById('express-uf');
        if (ufField) {
          ufField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [debouncedCompany, step, revealNextField]);

  // Progressive reveal: UF -> City
  useEffect(() => {
    if (step === 2 && debouncedUf) {
      revealNextField('uf', 2);
      trackFieldCompleted('uf', 2);
      trackFieldRevealed('city', 2);

      // Scroll suave para City em mobile
      setTimeout(() => {
        const cityField = document.getElementById('express-city') || document.getElementById('express-city-manual');
        if (cityField) {
          cityField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [debouncedUf, step, revealNextField]);

  // Progressive reveal: City -> Continuar (step 2)
  useEffect(() => {
    if (step === 2 && debouncedCity) {
      console.log('[City Field] ✅ Cidade preenchida:', debouncedCity);
      trackFieldCompleted('city', 2);

      // Envia webhook parcial para city (se ainda não enviou)
      const hasAllRequiredData = debouncedName && debouncedPhone && debouncedEmail && debouncedCompany && debouncedUf;

      if (!webhooksSent.has('city') && hasAllRequiredData) {
        console.log('[City Field] 🏢 Enviando webhook: Etapa 2 completa (empresa + localização)');
        setWebhooksSent(prev => new Set(prev).add('city'));
        sendPartialWebhook('city', {
          name: debouncedName,
          phone: debouncedPhone,
          email: debouncedEmail,
          company: debouncedCompany,
          uf: debouncedUf,
          city: debouncedCity,
        }).catch(err => {
          console.error('[City Field] ❌ Erro ao enviar webhook:', err);
        });
      } else if (webhooksSent.has('city')) {
        console.log('[City Field] Webhook já foi enviado anteriormente, pulando...');
      } else {
        console.warn('[City Field] ⚠️ Dados anteriores incompletos:', {
          hasName: !!debouncedName,
          hasPhone: !!debouncedPhone,
          hasEmail: !!debouncedEmail,
          hasCompany: !!debouncedCompany,
          hasUf: !!debouncedUf,
        });
      }
    }
  }, [debouncedCity, debouncedName, debouncedPhone, debouncedEmail, debouncedCompany, debouncedUf, step, webhooksSent, sendPartialWebhook]);

  // Progressive reveal: Billing -> soldToGov
  useEffect(() => {
    if (step === 3 && debouncedBilling) {
      console.log('[Billing Field] ✅ Faturamento preenchido:', debouncedBilling);
      revealNextField('billing', 3);
      trackFieldCompleted('billing', 3);
      trackFieldRevealed('soldToGov', 3);

      // Scroll suave para soldToGov em mobile
      setTimeout(() => {
        const soldToGovField = document.querySelector('input[name="soldToGov"]');
        if (soldToGovField) {
          soldToGovField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // Envia webhook parcial para billing (se ainda não enviou)
      const hasAllRequiredData = debouncedName && debouncedPhone && debouncedEmail && debouncedCompany && debouncedUf && debouncedCity;

      if (!webhooksSent.has('billing') && hasAllRequiredData) {
        console.log('[Billing Field] 💰 Enviando webhook: Qualificação financeira');
        setWebhooksSent(prev => new Set(prev).add('billing'));
        sendPartialWebhook('billing', {
          name: debouncedName,
          phone: debouncedPhone,
          email: debouncedEmail,
          company: debouncedCompany,
          uf: debouncedUf,
          city: debouncedCity,
          billing: debouncedBilling,
        }).catch(err => {
          console.error('[Billing Field] ❌ Erro ao enviar webhook:', err);
        });
      } else if (webhooksSent.has('billing')) {
        console.log('[Billing Field] Webhook já foi enviado anteriormente, pulando...');
      } else {
        console.warn('[Billing Field] ⚠️ Dados anteriores incompletos');
      }
    }
  }, [debouncedBilling, debouncedName, debouncedPhone, debouncedEmail, debouncedCompany, debouncedUf, debouncedCity, step, revealNextField, webhooksSent, sendPartialWebhook]);

  // Progressive reveal: soldToGov -> pain
  useEffect(() => {
    if (step === 3 && debouncedSoldToGov) {
      console.log('[SoldToGov Field] ✅ Resposta preenchida:', debouncedSoldToGov);
      revealNextField('soldToGov', 3);
      trackFieldCompleted('soldToGov', 3);
      trackFieldRevealed('pain', 3);

      // Scroll suave para pain em mobile
      setTimeout(() => {
        const painField = document.getElementById('express-pain');
        if (painField) {
          painField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // Envia webhook parcial para soldToGov (se ainda não enviou)
      const hasAllRequiredData = debouncedName && debouncedPhone && debouncedEmail && debouncedCompany && debouncedUf && debouncedCity && debouncedBilling;

      if (!webhooksSent.has('soldToGov') && hasAllRequiredData) {
        console.log('[SoldToGov Field] 🎯 Enviando webhook: Lead QUALIFICADO!');
        setWebhooksSent(prev => new Set(prev).add('soldToGov'));
        sendPartialWebhook('soldToGov', {
          name: debouncedName,
          phone: debouncedPhone,
          email: debouncedEmail,
          company: debouncedCompany,
          uf: debouncedUf,
          city: debouncedCity,
          billing: debouncedBilling,
          soldToGov: debouncedSoldToGov,
        }).catch(err => {
          console.error('[SoldToGov Field] ❌ Erro ao enviar webhook:', err);
        });

        // Track QualifiedLead na Meta
        const { firstName, lastName } = splitFullName(debouncedName);
        trackQualifiedLead(debouncedBilling, debouncedSoldToGov === 'sim', {
          email: debouncedEmail,
          phone: debouncedPhone,
          firstName,
          lastName,
          city: debouncedCity,
          state: debouncedUf,
        });
      } else if (webhooksSent.has('soldToGov')) {
        console.log('[SoldToGov Field] Webhook já foi enviado anteriormente, pulando...');
      } else {
        console.warn('[SoldToGov Field] ⚠️ Dados anteriores incompletos');
      }
    }
  }, [debouncedSoldToGov, debouncedName, debouncedPhone, debouncedEmail, debouncedCompany, debouncedUf, debouncedCity, debouncedBilling, step, revealNextField, webhooksSent, sendPartialWebhook]);

  const stepSchemas = {
    1: leadSchema.pick({ name: true, phone: true, email: true }),
    2: leadSchema.pick({ company: true, uf: true, city: true }),
    3: leadSchema.pick({ billing: true, soldToGov: true, pain: true }),
  };

  function validateStep(currentStep: StepNumber): string | null {
    const schema = stepSchemas[currentStep];
    if (!schema) return null;

    const payload =
      currentStep === 1
        ? { name: data.name, phone: data.phone, email: data.email }
        : currentStep === 2
        ? { company: data.company, uf: (data.uf || "").toUpperCase(), city: manualCityInput ? normalizeCityInput(data.city) : data.city }
        : { billing: data.billing, soldToGov: data.soldToGov, pain: data.pain };

    const parsed = schema.safeParse(payload as any);
    if (!parsed.success) {
      return parsed.error.issues[0]?.message || "Verifique os campos";
    }
    return null;
  }

  async function handleNext() {
    const validation = validateStep(step);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);

    // Track step complete
    trackFormStepComplete(step);
    trackStepComplete(step, getStepName(step));

    // Avança para próximo step
    const nextStep = Math.min(3, step + 1) as StepNumber;
    setStep(nextStep);
    setStepStartTime(Date.now());
    resetFieldsForStep(nextStep);

    // Track novo step
    if (nextStep <= 3) {
      trackStepStart(nextStep, getStepName(nextStep));
    }
  }

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const payload: LeadData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        uf: (data.uf || "").toUpperCase(),
        city: manualCityInput ? normalizeCityInput(data.city) : data.city,
        billing: data.billing,
        soldToGov: data.soldToGov as "sim" | "nao",
        pain: data.pain,
      };

      const parsed = leadSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Verifique os campos");
      }

      // Envia webhook final com retry
      const eventID = `final_submit_${sessionId}_${Date.now()}`;
      await sendWebhookWithRetry(
        getWebhookUrl(),
        {
          ...payload,
          session_id: sessionId,
          event_type: 'complete_lead',
          status: "complete",
          source: "lp-2",
          step: "final",
          stepCount: 3,
          timestamp: new Date().toISOString(),
        },
        eventID
      );

      // Track CompleteRegistration na Meta
      const { firstName, lastName } = splitFullName(payload.name);
      trackCompleteRegistration(
        {
          email: payload.email,
          phone: payload.phone,
          firstName,
          lastName,
          city: payload.city,
          state: payload.uf,
        },
        payload.billing, // billing range
        payload.soldToGov === "sim", // gov experience
        payload.pain // pain description
      );

      // Track Lead (APENAS para formulário completo)
      trackLeadComplete(
        {
          email: payload.email,
          phone: payload.phone,
          firstName,
          lastName,
          city: payload.city,
          state: payload.uf,
        },
        payload.billing,
        payload.soldToGov === "sim",
        payload.pain
      );

      // Track sucesso
      trackFormSubmitSuccess();
      trackLeadQualification({
        billing: payload.billing,
        soldToGov: payload.soldToGov,
        uf: payload.uf,
      });
      identifyUser(payload.email, {
        name: payload.name,
        company: payload.company,
      });

      // Reset e mostra sucesso
      resetState();
      setShowSuccessPopup(true);
    } catch (e: any) {
      const message = e?.message || "Erro ao enviar. Tente novamente.";
      setError(message);
      trackFormSubmitError(message);
    } finally {
      setLoading(false);
    }
  }

  function resetState() {
    setIsOpen(false);
    setData({
      name: "",
      phone: "",
      email: "",
      company: "",
      uf: "",
      city: "",
      billing: "",
      soldToGov: "",
      pain: "",
    });
    setStep(1);
    setLastPartialStep(0);
    setWebhooksSent(new Set());
    setManualCityInput(false);
    setCitiesError(false);
    setSessionId(generateSessionId());
    resetFieldsForStep(1);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }

  function handleBack() {
    const prevStep = Math.max(1, step - 1) as StepNumber;
    trackFormStepBack(step);
    setStep(prevStep);
    setStepStartTime(Date.now());
    resetFieldsForStep(prevStep);
  }

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && step > 0 && step < 3) {
            // Track abandono
            const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000);
            const lastField = visibleFields[visibleFields.length - 1] || 'name';
            trackFormAbandonment(step);
            trackStepAbandoned(step, getStepName(step), lastField, timeSpent);
          }
          setIsOpen(open);
        }}
      >
        <DialogContent aria-describedby="lead-express-desc">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Vamos agendar sua reunião estratégica"}
              {step === 2 && "Agora sobre sua empresa"}
              {step === 3 && "Última etapa! Vamos personalizar sua consultoria"}
            </DialogTitle>
            <DialogDescription id="lead-express-desc">
              {step === 1 && "Para preparar uma consultoria personalizada, precisamos conhecer um pouco sobre você e sua empresa."}
              {step === 2 && "Essas informações nos ajudam a direcionar você para o especialista ideal da sua região."}
              {step === 3 && "Quanto mais soubermos sobre seu negócio, melhor será a estratégia que vamos desenhar para você."}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm font-medium text-muted-foreground">
            Etapa {step} de 3 • {step === 1 ? "Seus dados de contato" : step === 2 ? "Dados da empresa ✓" : "Quase lá! 🎯"}
          </div>
          <form className="grid gap-5 sm:gap-4" onSubmit={(e) => { e.preventDefault(); step === 3 ? onSubmit() : handleNext(); }}>
            {step === 1 && (
              <>
                {/* Nome - sempre visível */}
                {isFieldVisible('name') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-name">Qual é o seu nome completo?</Label>
                    <Input
                      id="express-name"
                      name="name"
                      required
                      placeholder="Ex: João da Silva Santos"
                      value={data.name}
                      onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                      onFocus={() => {
                        trackFieldFocus('name', 1);
                        revealNextField('name', 1);
                      }}
                      onBlur={() => {
                        if (data.name.length >= 3) revealNextField('name', 1);
                      }}
                    />
                    {data.name.length >= 3 && (
                      <p className="text-xs text-muted-foreground">Ótimo, {data.name.split(' ')[0]}! 👋</p>
                    )}
                  </div>
                )}

                {/* Telefone - aparece após interagir com nome */}
                {isFieldVisible('phone') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-phone">Qual seu WhatsApp?</Label>
                    <Input
                      id="express-phone"
                      name="phone"
                      required
                      inputMode="numeric"
                      placeholder="(00) 00000-0000"
                      value={data.phone}
                      onChange={(e) => setData((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      onFocus={() => {
                        trackFieldFocus('phone', 1);
                        revealNextField('phone', 1);
                      }}
                      onBlur={() => {
                        if (data.phone.length >= 14) revealNextField('phone', 1);
                      }}
                      pattern={PHONE_MASK.source}
                      title="Formato: (00) 00000-0000"
                    />
                    <p className="text-xs text-muted-foreground">Usaremos para confirmar a reunião</p>
                  </div>
                )}

                {/* Email - aparece após interagir com telefone */}
                {isFieldVisible('email') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-email">E seu melhor e-mail?</Label>
                    <Input
                      id="express-email"
                      name="email"
                      required
                      type="email"
                      placeholder="voce@empresa.com.br"
                      value={data.email}
                      onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                      onFocus={() => trackFieldFocus('email', 1)}
                    />
                    <p className="text-xs text-muted-foreground">Você receberá materiais exclusivos e o link da reunião</p>
                  </div>
                )}
              </>
            )}
            {step === 2 && (
              <>
                {/* Empresa - sempre visível */}
                {isFieldVisible('company') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-company">Qual o nome da empresa?</Label>
                    <Input
                      id="express-company"
                      name="company"
                      required
                      placeholder="Razão social ou nome fantasia"
                      value={data.company}
                      onChange={(e) => setData((prev) => ({ ...prev, company: e.target.value }))}
                      onFocus={() => {
                        trackFieldFocus('company', 2);
                        revealNextField('company', 2);
                      }}
                      onBlur={() => {
                        if (data.company.length >= 2) revealNextField('company', 2);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Não se preocupe, pode ser MEI ou CNPJ em andamento</p>
                  </div>
                )}

                {/* UF - aparece após interagir com empresa */}
                {isFieldVisible('uf') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-uf">Em qual estado você atua?</Label>
                    <select
                      id="express-uf"
                      name="uf"
                      required
                      value={data.uf}
                      onChange={(e) => setData((prev) => ({ ...prev, uf: e.target.value, city: "" }))}
                      onFocus={() => {
                        trackFieldFocus('uf', 2);
                        revealNextField('uf', 2);
                      }}
                      className="h-12 sm:h-10 w-full rounded-md border border-input bg-background px-3 text-base sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
                    >
                      <option value="" disabled>Selecione o UF</option>
                      {UF_LIST.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">Temos consultores especializados em cada região</p>
                  </div>
                )}

                {/* Cidade - aparece após selecionar UF */}
                {isFieldVisible('city') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-city">E a cidade?</Label>
                    {!manualCityInput ? (
                      <>
                        <select
                          id="express-city"
                          name="city"
                          required
                          disabled={!data.uf || citiesLoading}
                          className="h-12 sm:h-10 w-full rounded-md border border-input bg-background px-3 text-base sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 touch-manipulation"
                          value={data.city}
                          onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))}
                          onFocus={() => trackFieldFocus('city', 2)}
                        >
                          <option value="" disabled>
                            {citiesLoading ? "Carregando cidades..." : "Selecione a cidade"}
                          </option>
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {citiesError && (
                          <button
                            type="button"
                            className="text-xs text-primary underline"
                            onClick={() => setManualCityInput(true)}
                          >
                            Erro ao carregar cidades. Clique para digitar manualmente.
                          </button>
                        )}
                      </>
                    ) : (
                      <Input
                        id="express-city-manual"
                        name="city"
                        required
                        placeholder="Digite o nome da cidade"
                        value={data.city}
                        onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))}
                        onFocus={() => trackFieldFocus('city', 2)}
                        maxLength={100}
                      />
                    )}
                  </div>
                )}
              </>
            )}
            {step === 3 && (
              <>
                {/* Faturamento - sempre visível */}
                {isFieldVisible('billing') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-billing">Qual a faixa de faturamento mensal da empresa?</Label>
                    <select
                      id="express-billing"
                      name="billing"
                      required
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={data.billing}
                      onChange={(e) => setData((prev) => ({ ...prev, billing: e.target.value }))}
                      onFocus={() => {
                        trackFieldFocus('billing', 3);
                        revealNextField('billing', 3);
                      }}
                    >
                      <option value="" disabled>Selecione</option>
                      <option>Até R$ 50 mil</option>
                      <option>R$ 50–200 mil</option>
                      <option>R$ 200–500 mil</option>
                      <option>R$ 500 mil – 1 mi</option>
                      <option>Acima de R$ 1 mi</option>
                      <option>Prefiro não informar</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Isso nos ajuda a dimensionar as oportunidades disponíveis para você</p>
                  </div>
                )}

                {/* Já vendeu gov - aparece após selecionar billing */}
                {isFieldVisible('soldToGov') && (
                  <div className="grid gap-2">
                    <Label>Sua empresa já vendeu para órgãos públicos?</Label>
                    <div className="flex items-center gap-6 sm:gap-4">
                      <label className="flex items-center gap-2 text-base sm:text-sm cursor-pointer touch-manipulation py-2">
                        <input
                          type="radio"
                          name="soldToGov"
                          value="sim"
                          className="h-5 w-5 sm:h-4 sm:w-4 cursor-pointer"
                          required
                          checked={data.soldToGov === "sim"}
                          onChange={() => setData((prev) => ({ ...prev, soldToGov: "sim" }))}
                          onFocus={() => {
                            trackFieldFocus('soldToGov', 3);
                            revealNextField('soldToGov', 3);
                          }}
                        />
                        Sim
                      </label>
                      <label className="flex items-center gap-2 text-base sm:text-sm cursor-pointer touch-manipulation py-2">
                        <input
                          type="radio"
                          name="soldToGov"
                          value="nao"
                          className="h-5 w-5 sm:h-4 sm:w-4 cursor-pointer"
                          checked={data.soldToGov === "nao"}
                          onChange={() => setData((prev) => ({ ...prev, soldToGov: "nao" }))}
                        />
                        Não
                      </label>
                    </div>
                    {data.soldToGov === "sim" && (
                      <p className="text-xs text-muted-foreground">Ótimo! Vamos te mostrar como escalar essas vendas</p>
                    )}
                    {data.soldToGov === "nao" && (
                      <p className="text-xs text-muted-foreground">Perfeito! Vamos te ensinar do zero, sem complicação</p>
                    )}
                  </div>
                )}

                {/* Sobre o negócio - aparece após responder soldToGov */}
                {isFieldVisible('pain') && (
                  <div className="grid gap-2">
                    <Label htmlFor="express-pain">Conte um pouco sobre o que sua empresa faz</Label>
                    <Textarea
                      id="express-pain"
                      name="pain"
                      required
                      placeholder="Ex: Somos uma empresa de TI focada em desenvolvimento de sistemas..."
                      value={data.pain}
                      onChange={(e) => setData((prev) => ({ ...prev, pain: e.target.value }))}
                      onFocus={() => trackFieldFocus('pain', 3)}
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      Não precisa escrever muito, só o suficiente para entendermos seu mercado • {data.pain.length}/500 caracteres
                    </p>
                  </div>
                )}
              </>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

            {/* Microcopy de privacidade */}
            <p className="text-xs text-muted-foreground text-center">
              Ao continuar, você concorda com nossa{" "}
              <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground touch-manipulation">
                Política de Privacidade
              </a>
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  ← Voltar
                </Button>
              )}
              {step < 3 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className={step > 1 ? "w-full sm:w-auto order-1 sm:order-2" : "w-full"}
                >
                  Continuar →
                </Button>
              )}
              {step === 3 && (
                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {loading ? "Enviando…" : "✓ Agendar reunião"}
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent aria-describedby="success-desc">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Tudo certo!</DialogTitle>
            <DialogDescription id="success-desc">
              Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato em breve!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {env.AGENDA_URL && (
              <Button
                onClick={() => {
                  window.open(env.AGENDA_URL, "_blank");
                  setShowSuccessPopup(false);
                }}
              >
                Agendar reunião agora
              </Button>
            )}
            {env.WHATSAPP_URL && (
              <Button
                variant="outline"
                onClick={() => {
                  window.open(env.WHATSAPP_URL, "_blank");
                  setShowSuccessPopup(false);
                }}
              >
                Falar no WhatsApp
              </Button>
            )}
            <Button variant="ghost" onClick={() => setShowSuccessPopup(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LeadModalContext.Provider>
  );
}

function LeadModalWizardProvider({ children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const [data, setData] = useState<Draft>({
    name: "",
    phone: "",
    email: "",
    company: "",
    uf: "",
    city: "",
    billing: "",
    soldToGov: "",
    pain: "",
  });

  const open = useCallback(() => {
    setError(null);
    setIsOpen(true);
    setStep(1);
    trackFormOpen();
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  function getCookie(name: string) {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  }

  function getFbp() {
    return getCookie("_fbp");
  }

  function getFbc() {
    return getCookie("_fbc");
  }

  useEffect(() => {
    async function fetchCities(state: string) {
      if (!state) { setCities([]); return; }
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        if (!res.ok) throw new Error("Falha ao carregar cidades");
        const d = await res.json();
        const list = (d || []).map((c: any) => c.nome).sort();
        setCities(list);
      } catch {
        setCities([]);
      }
    }
    fetchCities(data.uf);
  }, [data.uf]);

  const step1 = leadSchema.pick({ name: true, phone: true, email: true });
  const step2 = leadSchema.pick({ company: true, uf: true, city: true });

  function nextStep() {
    const partial =
      step === 1
        ? { name: data.name, phone: data.phone, email: data.email }
        : { company: data.company, uf: (data.uf || "").toUpperCase(), city: data.city };
    const schema = step === 1 ? step1 : step2;
    const parsed = schema.safeParse(partial as any);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Verifique os campos");
      return;
    }
    setError(null);

    trackFormStepComplete(step);

    setStep((s) => Math.min(3, s + 1));
  }

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const payload: LeadData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        uf: (data.uf || "").toUpperCase(),
        city: data.city,
        billing: data.billing,
        soldToGov: data.soldToGov as "sim" | "nao",
        pain: data.pain,
      };
      const parsed = leadSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Verifique os campos");
      }

      const { firstName, lastName } = splitFullName(payload.name);

      await fetch(getWebhookUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "nla-site", step: "final", stepCount: 3 }),
      });

      // Track Lead (APENAS para formulário completo)
      trackLeadComplete(
        {
          email: payload.email,
          phone: payload.phone,
          firstName,
          lastName,
          city: payload.city,
          state: payload.uf,
        },
        payload.billing,
        payload.soldToGov === "sim",
        payload.pain
      );

      trackFormSubmitSuccess();
      trackLeadQualification({
        billing: payload.billing,
        soldToGov: payload.soldToGov,
        uf: payload.uf,
      });
      identifyUser(payload.email, {
        name: payload.name,
        company: payload.company,
      });

      setIsOpen(false);
      setShowSuccessPopup(true);
    } catch (e: any) {
      const errorMsg = e?.message || "Erro ao enviar. Tente novamente.";
      setError(errorMsg);
      trackFormSubmitError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && step > 0 && step < 3) {
            trackFormAbandonment(step);
          }
          setIsOpen(open);
        }}
      >
        <DialogContent aria-describedby="lead-desc">
          <DialogHeader>
            <DialogTitle>Agendar minha reunião</DialogTitle>
            <DialogDescription id="lead-desc">
              Preencha os dados em 3 passos rápidos. Seus dados serão usados apenas para contato e agendamento.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            {step === 1 && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" required placeholder="Seu nome" value={data.name} onChange={(e)=>setData({...data, name: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                  <Input id="phone" name="phone" required inputMode="numeric" placeholder="(00) 00000-0000" value={data.phone} onChange={(e)=>setData({...data, phone: formatPhone(e.target.value)})} pattern={PHONE_MASK.source} title="Formato: (00) 00000-0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" required type="email" placeholder="voce@empresa.com" value={data.email} onChange={(e)=>setData({...data, email: e.target.value})} />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" name="company" required placeholder="Nome da empresa" value={data.company} onChange={(e)=>setData({...data, company: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="uf">UF</Label>
                    <select id="uf" name="uf" required value={data.uf} onChange={(e)=>setData({...data, uf: e.target.value, city: ''})} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="" disabled>Selecione o UF</option>
                      {UF_LIST.map((u)=>(<option key={u} value={u}>{u}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <select id="city" name="city" required disabled={!data.uf || cities.length===0} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.city} onChange={(e)=>setData({...data, city: e.target.value})}>
                    <option value="" disabled>Selecione a cidade</option>
                    {cities.map((c)=>(<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="billing">Fatura mensal (faixa)</Label>
                    <select id="billing" name="billing" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.billing} onChange={(e)=>setData({...data, billing: e.target.value})}>
                      <option value="" disabled>Selecione</option>
                      <option>Até R$ 50 mil</option>
                      <option>R$ 50–200 mil</option>
                      <option>R$ 200–500 mil</option>
                      <option>R$ 500 mil – 1 mi</option>
                      <option>Acima de R$ 1 mi</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Já vendeu para governo?</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="soldToGov" value="sim" className="h-4 w-4" required checked={data.soldToGov==='sim'} onChange={()=>setData({...data, soldToGov:'sim'})} />Sim</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="soldToGov" value="nao" className="h-4 w-4" checked={data.soldToGov==='nao'} onChange={()=>setData({...data, soldToGov:'nao'})} />Não</label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pain">Qual é o seu negócio?</Label>
                  <Textarea id="pain" name="pain" required placeholder="Conte-nos um pouco sobre o seu negócio" value={data.pain} onChange={(e)=>setData({...data, pain: e.target.value})} />
                </div>
              </>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex items-center justify-end">
              <div className="flex gap-2">
                {step > 1 && (<Button type="button" variant="outline" onClick={()=>{trackFormStepBack(step); setStep((s)=>Math.max(1,s-1));}}>Voltar</Button>)}
                {step < 3 && (<Button type="button" onClick={nextStep}>Próximo</Button>)}
                {step === 3 && (<Button type="submit" disabled={loading} aria-busy={loading}>{loading?"Enviando…":"Enviar"}</Button>)}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent aria-describedby="success-desc">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Tudo certo!</DialogTitle>
            <DialogDescription id="success-desc">
              Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato em breve!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {env.AGENDA_URL && (
              <Button
                onClick={() => {
                  window.open(env.AGENDA_URL, "_blank");
                  setShowSuccessPopup(false);
                }}
              >
                Agendar reunião agora
              </Button>
            )}
            {env.WHATSAPP_URL && (
              <Button
                variant="outline"
                onClick={() => {
                  window.open(env.WHATSAPP_URL, "_blank");
                  setShowSuccessPopup(false);
                }}
              >
                Falar no WhatsApp
              </Button>
            )}
            <Button variant="ghost" onClick={() => setShowSuccessPopup(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LeadModalContext.Provider>
  );
}
