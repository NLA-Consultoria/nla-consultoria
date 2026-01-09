import Image from "next/image";
import Script from "next/script";
import { Figtree, Newsreader } from "next/font/google";
import { LeadModalButton } from "../../components/LeadModalButton";
import { ScrollParallax } from "../../components/ScrollParallax";
import { content } from "../../content/home";
import { faqJsonLd } from "../../lib/seo";

const display = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-lp3-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lp3-body",
});

const reasonIcons = [
  (
    <svg key="doc" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M7 3h7l4 4v14H7V3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12h6M9 16h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="clock" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="chart" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M5 18V6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 18h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 14l3-3 3 2 4-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="shield" viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.5 12.5l1.8 1.8 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
];

export default function Page() {
  const faq = faqJsonLd(content.faq.items);
  const whatsapp = content.footer.whatsappDisplay.replace(/\D/g, "");

  return (
    <main className={`${display.variable} ${body.variable} bg-[#f7f2ea] text-[#1f2b25] font-[var(--font-lp3-body)]`}>
      <ScrollParallax />
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-[#d46a4c]/20 blur-3xl"
          style={{ transform: "translate3d(0, calc(var(--scroll-y) * 0.06px), 0)" }}
        />
        <div className="pointer-events-none absolute right-6 top-20 hidden h-48 w-48 rounded-full bg-[#1f2b25]/10 blur-3xl sm:block motion-safe:animate-float-y" />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e6d8c9] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5b49]">
                Nova frente de receita
              </span>
              <h1 className="font-[var(--font-lp3-display)] text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="max-w-xl text-lg text-[#3a473f]">
                {content.hero.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <LeadModalButton
                  location="lp-3-hero"
                  className="rounded-full bg-[#1f2b25] px-6 py-3 text-sm font-semibold text-[#f7f2ea] shadow-lg shadow-[#1f2b25]/20 transition hover:-translate-y-0.5"
                  aria-label={content.nav.cta}
                >
                  {content.hero.cta}
                </LeadModalButton>
                <a
                  href="#como-funciona"
                  className="text-sm font-semibold text-[#1f2b25] underline decoration-[#d46a4c] decoration-2 underline-offset-4 transition hover:text-[#d46a4c]"
                >
                  {content.comoFunciona.title}
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-3" data-animate="fade">
                {content.porque.bullets.slice(0, 3).map((item) => (
                  <div key={item} className="rounded-2xl border border-[#e5d8c9] bg-white/80 p-4 text-sm text-[#3a473f]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative" data-animate="fade">
              <div
                className="pointer-events-none absolute -right-6 -top-8 hidden h-24 w-24 rounded-full border border-[#d9c8b8] bg-white/70 sm:block"
                style={{ transform: "translate3d(0, calc(var(--scroll-y) * -0.04px), 0)" }}
              />
              <div className="rounded-3xl border border-[#e5d8c9] bg-white/80 p-6 shadow-[0_30px_80px_-50px_rgba(31,43,37,0.45)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#e5d8c9] bg-[#fdfbf7]">
                  <Image
                    src="/lp3-dossier.svg"
                    alt="Documentos e planejamento de oportunidades"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 rounded-full bg-[#1f2b25]/90 px-4 py-2 text-xs font-semibold text-[#f7f2ea]">
                    Dossie de oportunidades
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#e5d8c9] bg-[#f7f2ea] p-4 text-xs text-[#3a473f]">
                    Checklist de prazos e documentos
                  </div>
                  <div className="rounded-2xl border border-[#e5d8c9] bg-[#f7f2ea] p-4 text-xs text-[#3a473f]">
                    Resumo das oportunidades por regiao
                  </div>
                </div>
              </div>
              <div
                className="absolute -bottom-6 -left-4 hidden w-44 rounded-2xl border border-[#e5d8c9] bg-white px-4 py-3 text-xs text-[#3a473f] shadow-lg sm:block"
                style={{ transform: "translate3d(0, calc(var(--scroll-y) * 0.08px), 0)" }}
              >
                Processo sem juridiques, com foco em execucao.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="porque" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-[var(--font-lp3-display)] text-3xl sm:text-4xl">
              {content.porque.title}
            </h2>
            <div className="h-px w-full bg-[#e5d8c9] lg:h-1 lg:w-40" />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {content.porque.bullets.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-[#e5d8c9] bg-white/80 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2b25] text-[#f7f2ea]">
                  {reasonIcons[index]}
                </span>
                <div>
                  <p className="text-sm text-[#3a473f]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="relative py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <h2 className="font-[var(--font-lp3-display)] text-3xl sm:text-4xl">
            {content.comoFunciona.title}
          </h2>
          <div className="relative mt-10 grid gap-6">
            <div className="absolute left-4 top-4 hidden h-[calc(100%-32px)] w-px bg-[#dbcab9] sm:block" />
            {content.comoFunciona.steps.map((step, index) => (
              <div key={step.title} className="relative sm:pl-12">
                <span className="absolute left-0 top-6 hidden h-9 w-9 items-center justify-center rounded-full bg-[#d46a4c] text-xs font-semibold text-white sm:flex">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="rounded-2xl border border-[#e5d8c9] bg-white/80 p-6 shadow-sm">
                  <h3 className="font-[var(--font-lp3-display)] text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#3a473f]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recebe" className="py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-[var(--font-lp3-display)] text-3xl sm:text-4xl">
              {content.recebe.title}
            </h2>
            <p className="mt-4 text-sm text-[#3a473f]">
              Estruturamos o que precisa acontecer em cada etapa para acelerar sua entrada no setor publico.
            </p>
            <div className="mt-8 grid gap-4">
              {content.recebe.bullets.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#e5d8c9] bg-white/80 p-4">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1f2b25] text-white">
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3 w-3">
                      <path d="M5 10l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p className="text-sm text-[#3a473f]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[#e5d8c9] bg-white/80 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5b49]">Mapa de execucao</p>
              <span className="rounded-full bg-[#d46a4c]/10 px-3 py-1 text-xs text-[#d46a4c]">Prioridade</span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-[#3a473f]">
              {content.comoFunciona.steps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-[#e5d8c9] bg-[#fdfbf7] p-4">
                  <p className="font-semibold text-[#1f2b25]">{step.title}</p>
                  <p className="mt-2 text-xs">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="para-quem" className="relative py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-[#e5d8c9] bg-[#1f2b25] p-8 text-[#f7f2ea]">
            <h2 className="font-[var(--font-lp3-display)] text-3xl">
              {content.publico.title}
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-[#f4e9de]">
              {content.publico.isFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#d46a4c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#e5d8c9] bg-white/80 p-8">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5b49]">
              Pronto para acelerar
            </div>
            <p className="mt-4 text-base text-[#3a473f]">
              {content.ctaFinal.title}
            </p>
            <LeadModalButton
              location="lp-3-mid"
              className="mt-6 inline-flex rounded-full border border-[#1f2b25] px-6 py-3 text-sm font-semibold text-[#1f2b25] transition hover:bg-[#1f2b25] hover:text-[#f7f2ea]"
              aria-label={content.ctaFinal.cta}
            >
              {content.ctaFinal.cta}
            </LeadModalButton>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <h2 className="font-[var(--font-lp3-display)] text-3xl sm:text-4xl">
            {content.faq.title}
          </h2>
          <div className="mt-10 grid gap-4">
            {content.faq.items.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#e5d8c9] bg-white/80 p-6">
                <summary className="cursor-pointer list-none font-semibold text-[#1f2b25]">
                  <span className="flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-[#d46a4c] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#3a473f]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-[#e5d8c9] py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-[var(--font-lp3-display)] text-3xl sm:text-4xl">
              {content.ctaFinal.title}
            </h2>
            <LeadModalButton
              location="lp-3-final"
              className="mt-6 inline-flex rounded-full bg-[#d46a4c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d46a4c]/30 transition hover:-translate-y-0.5"
              aria-label={content.ctaFinal.cta}
            >
              {content.ctaFinal.cta}
            </LeadModalButton>
          </div>
          <div className="rounded-2xl border border-[#e5d8c9] bg-white/80 p-6 text-sm text-[#3a473f]">
            <div className="space-y-3">
              <a className="block font-semibold text-[#1f2b25]" href={`mailto:${content.footer.email}`}>
                {content.footer.email}
              </a>
              <a className="block font-semibold text-[#1f2b25]" href={`https://wa.me/${whatsapp}`}>
                {content.footer.whatsappDisplay}
              </a>
              <p>{content.footer.cidadeUf}</p>
              <p>{content.footer.cnpj}</p>
              <div className="flex gap-4 text-xs">
                <a className="underline" href={content.footer.privacyUrl}>
                  Privacidade
                </a>
                <a className="underline" href={content.footer.termsUrl}>
                  Termos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Script id="faq-jsonld-lp-3" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faq)}
      </Script>
    </main>
  );
}
