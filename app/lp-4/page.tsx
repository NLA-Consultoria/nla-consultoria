import Image from "next/image";
import Script from "next/script";
import { IBM_Plex_Sans, Teko } from "next/font/google";
import { LeadModalButton } from "../../components/LeadModalButton";
import { ScrollParallax } from "../../components/ScrollParallax";
import { content } from "../../content/home";
import { faqJsonLd } from "../../lib/seo";

const display = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lp4-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lp4-body",
});

export default function Page() {
  const faq = faqJsonLd(content.faq.items);
  const whatsapp = content.footer.whatsappDisplay.replace(/\D/g, "");

  return (
    <main className={`${display.variable} ${body.variable} bg-[#f5f5f0] text-[#111827] font-[var(--font-lp4-body)]`}>
      <ScrollParallax />
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -left-10 top-16 h-36 w-[420px] origin-left bg-[#111827] opacity-5"
          style={{ transform: "translate3d(0, calc(var(--scroll-y) * 0.05px), 0) skewY(-6deg)" }}
        />
        <div className="pointer-events-none absolute right-0 top-10 hidden h-32 w-32 bg-[#ff5a1f]/40 blur-2xl sm:block motion-safe:animate-float-x" />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 border border-[#111827] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                Estrategia operacional
              </span>
              <h1 className="font-[var(--font-lp4-display)] text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
                {content.hero.title}
              </h1>
              <p className="max-w-xl text-lg text-[#374151]">
                {content.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <LeadModalButton
                  location="lp-4-hero"
                  className="inline-flex items-center gap-2 bg-[#111827] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#111827]/30 transition hover:-translate-y-0.5"
                  aria-label={content.nav.cta}
                >
                  {content.hero.cta}
                </LeadModalButton>
                <div className="inline-flex items-center gap-2 border border-[#d1d5db] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#111827]">
                  Processo guiado
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2" data-animate="fade">
                {content.porque.bullets.map((item) => (
                  <div key={item} className="border border-[#d1d5db] bg-white px-4 py-3 text-sm text-[#374151]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#d1d5db] bg-white/90 p-6 shadow-[0_30px_80px_-50px_rgba(17,24,39,0.45)]" data-animate="fade">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Radar de oportunidades</p>
                <span className="rounded-full bg-[#ff5a1f]/10 px-3 py-1 text-xs font-semibold text-[#ff5a1f]">Ativo</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f5f5f0]">
                <Image
                  src="/lp4-grid.svg"
                  alt="Mapa operacional de oportunidades"
                  width={860}
                  height={640}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#e5e7eb] bg-white px-4 py-3 text-xs text-[#374151]">
                  Regioes priorizadas e monitoramento continuo.
                </div>
                <div className="border border-[#e5e7eb] bg-white px-4 py-3 text-xs text-[#374151]">
                  Checklist pronto para competir sem risco.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d1d5db] bg-[#111827] py-3 text-white">
        <div className="overflow-hidden">
          <div className="flex w-[200%] motion-safe:animate-marquee">
            <div className="flex w-1/2 items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em]">
              <span>Demandas constantes</span>
              <span>Execucao rapida</span>
              <span>Documentos em dia</span>
              <span>Acompanhamento ate assinatura</span>
            </div>
            <div className="flex w-1/2 items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em]">
              <span>Demandas constantes</span>
              <span>Execucao rapida</span>
              <span>Documentos em dia</span>
              <span>Acompanhamento ate assinatura</span>
            </div>
          </div>
        </div>
      </section>

      <section id="porque" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <h2 className="font-[var(--font-lp4-display)] text-4xl uppercase">
            {content.porque.title}
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {content.porque.bullets.map((item, index) => (
              <div key={item} className="flex items-start gap-6 border border-[#d1d5db] bg-white p-6">
                <span className="font-[var(--font-lp4-display)] text-4xl text-[#ff5a1f]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
                    Prioridade
                  </div>
                  <p className="mt-2 text-base text-[#374151]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-[var(--font-lp4-display)] text-4xl uppercase">
              {content.comoFunciona.title}
            </h2>
            <div className="h-1 w-full bg-[#111827] lg:w-40" />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {content.comoFunciona.steps.map((step, index) => (
              <div key={step.title} className="relative border border-[#d1d5db] bg-white p-6 shadow-sm">
                <div className="absolute -top-3 left-4 bg-[#111827] px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-semibold uppercase tracking-wide text-[#111827]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-[#374151]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recebe" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-[var(--font-lp4-display)] text-4xl uppercase">
              {content.recebe.title}
            </h2>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Entrega direta</div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {content.recebe.bullets.map((item) => (
              <div key={item} className="border-l-4 border-[#ff5a1f] bg-white px-5 py-4 text-sm text-[#374151] shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="para-quem" className="py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1fr]">
          <h2 className="font-[var(--font-lp4-display)] text-4xl uppercase">
            {content.publico.title}
          </h2>
          <div className="grid gap-4">
            {content.publico.isFor.map((item) => (
              <div key={item} className="border border-[#d1d5db] bg-white p-5 text-sm text-[#374151]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <h2 className="font-[var(--font-lp4-display)] text-4xl uppercase">
            {content.faq.title}
          </h2>
          <div className="mt-8 grid gap-4">
            {content.faq.items.map((item) => (
              <details key={item.q} className="group border border-[#d1d5db] bg-white p-6">
                <summary className="cursor-pointer list-none font-semibold uppercase tracking-wide text-[#111827]">
                  <span className="flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-[#ff5a1f] transition group-open:-rotate-90">&#10095;</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#374151]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-[#d1d5db] py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-[var(--font-lp4-display)] text-4xl uppercase">
              {content.ctaFinal.title}
            </h2>
            <LeadModalButton
              location="lp-4-final"
              className="mt-6 inline-flex items-center gap-2 bg-[#ff5a1f] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#ff5a1f]/30 transition hover:-translate-y-0.5"
              aria-label={content.ctaFinal.cta}
            >
              {content.ctaFinal.cta}
            </LeadModalButton>
          </div>
          <div className="border border-[#d1d5db] bg-white p-6 text-sm text-[#374151]">
            <div className="space-y-3">
              <a className="block font-semibold text-[#111827]" href={`mailto:${content.footer.email}`}>
                {content.footer.email}
              </a>
              <a className="block font-semibold text-[#111827]" href={`https://wa.me/${whatsapp}`}>
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
      <Script id="faq-jsonld-lp-4" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faq)}
      </Script>
    </main>
  );
}
