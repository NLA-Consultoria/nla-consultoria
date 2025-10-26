export const env = {
  N8N_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "",
  AGENDA_URL: process.env.NEXT_PUBLIC_AGENDA_URL || "",
  WHATSAPP_URL: process.env.NEXT_PUBLIC_WHATSAPP_URL || "",
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",
  POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
};

export const hasAnalytics = () => Boolean(env.GTM_ID || env.POSTHOG_KEY);

