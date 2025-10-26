import { env } from "./env";

type FAQ = { q: string; a: string }[];

export const defaultSEO = {
  title: "NLA Consultoria — Licitações que viram vendas",
  description:
    "Abrimos seu canal de vendas com o maior comprador do Brasil: oportunidades certas, documentos em dia e acompanhamento até a assinatura.",
};

export function canonicalUrl(path = "/") {
  const base = env.SITE_URL?.replace(/\/$/, "") || "";
  return base ? `${base}${path}` : undefined;
}

export function organizationJsonLd() {
  const url = canonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NLA Consultoria",
    url: url,
    logo: url ? `${url}logo.svg` : undefined,
    sameAs: [],
  };
}

export function faqJsonLd(faq: FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

