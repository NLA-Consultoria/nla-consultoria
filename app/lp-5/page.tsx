import Image from "next/image";
import Script from "next/script";
import { Azeret_Mono, Bricolage_Grotesque } from "next/font/google";
import { LeadModalButton } from "../../components/LeadModalButton";
import { ScrollParallax } from "../../components/ScrollParallax";
import { content } from "../../content/home";
import { faqJsonLd } from "../../lib/seo";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-lp5-display",
});

const mono = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lp5-mono",
});

export default function Page() {
  const faq = faqJsonLd(content.faq.items);
  const whatsapp = content.footer.whatsappDisplay.replace(/\D/g, "");

  return (
    <main className={`${display.variable} ${mono.variable} relative bg-[#f1f7ff] text-[#0b1220] font-[var(--font-lp5-display)]`}>
      <ScrollParallax />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11, 18, 32, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(11, 18, 32, 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-12 top-8 h-48 w-48 rounded-full border border-[#60a5fa]/40"
          style={{ transform: "translate3d(0, calc(var(--scroll-y) * 0.08px), 0)" }}
        />
        <div className="pointer-events-none absolute left-10 top-12 hidden h-40 w-40 rounded-full border border-[#38bdf8]/40 sm:block motion-safe:animate-spin motion-safe:[animation-duration:14000ms]" />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <p className="font-[var(--font-lp5-mono)] text-xs uppercase tracking-[0.3em] text-[#1e3a8a]">
                {content.nav.cta}
              </p>
              <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="max-w-xl text-lg text-[#1f2937]">
                {content.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <LeadModalButton
                  location="lp-5-hero"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#a3e635] px-6 py-3 text-sm font-semibold text-[#0b1220] shadow-lg shadow-[#38bdf8]/30 transition hover:-translate-y-0.5 motion-safe:animate-sheen"
                  style={{ backgroundSize: "200% 200%" }}
                  aria-label={content.nav.cta}
                >
                  {content.hero.cta}
                </LeadModalButton>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#c7dbff] bg-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1e3a8a]">
                  Plano operacional
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2" data-animate="fade">
                {content.recebe.bullets.slice(0, 2).map((item) => (
                  <div key={item} className="rounded-2xl border border-[#c7dbff] bg-white/80 p-4 text-sm text-[#1f2937]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[#c7dbff] bg-white/80 p-6" data-animate="fade">
              <div className="flex items-center justify-between">
                <p className="font-[var(--font-lp5-mono)] text-xs uppercase tracking-[0.2em] text-[#1e3a8a]">Blueprint</p>
                <span className="rounded-full bg-[#38bdf8]/10 px-3 py-1 text-xs font-semibold text-[#2563eb]">Mapa vivo</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#c7dbff] bg-[#0b1220]">
                <Image
                  src="/lp5-blueprint.svg"
                  alt="Plano visual de oportunidades"
                  width={860}
                  height={640}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#c7dbff] bg-white/80 p-4 text-xs text-[#1f2937]">
                  Calendario e checklist integrados.
                </div>
                <div className="rounded-2xl border border-[#c7dbff] bg-white/80 p-4 text-xs text-[#1f2937]">
                  Resumo das melhores oportunidades.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="porque" className="relative py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <h2 className="text-3xl sm:text-4xl">{content.porque.title}</h2>
          <div className="space-y-5 border-l-2 border-[#c7dbff] pl-6">
            {content.porque.bullets.map((item) => (
              <p key={item} className="text-base text-[#1f2937]">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl">{content.comoFunciona.title}</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {content.comoFunciona.steps.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-[#c7dbff] bg-white/80 p-6">
                <div className="font-[var(--font-lp5-mono)] text-xs uppercase tracking-[0.3em] text-[#2563eb]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm text-[#1f2937]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recebe" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-3xl sm:text-4xl">{content.recebe.title}</h2>
            <div className="font-[var(--font-lp5-mono)] text-xs uppercase tracking-[0.2em] text-[#1e3a8a]">
              {content.nav.cta}
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {content.recebe.bullets.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#c7dbff] bg-white/80 p-5">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#38bdf8]" />
                <p className="text-sm text-[#1f2937]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="para-quem" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <div className="rounded-3xl border border-[#c7dbff] bg-[#0b1220] p-8 text-white">
            <h2 className="text-3xl sm:text-4xl">{content.publico.title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {content.publico.isFor.map((item) => (
                <div key={item} className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20" data-animate="fade">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl">{content.faq.title}</h2>
          <div className="mt-8 grid gap-4">
            {content.faq.items.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#c7dbff] bg-white/80 p-6">
                <summary className="cursor-pointer list-none text-base font-semibold">
                  <span className="flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="font-[var(--font-lp5-mono)] text-[#2563eb] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#1f2937]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-[#c7dbff] py-16 sm:py-20" data-animate="fade">
        <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl sm:text-4xl">{content.ctaFinal.title}</h2>
            <LeadModalButton
              location="lp-5-final"
              className="mt-6 inline-flex items-center rounded-full bg-[#38bdf8] px-6 py-3 text-sm font-semibold text-[#0b1220] shadow-lg shadow-[#38bdf8]/30 transition hover:-translate-y-0.5"
              aria-label={content.ctaFinal.cta}
            >
              {content.ctaFinal.cta}
            </LeadModalButton>
          </div>
          <div className="rounded-2xl border border-[#c7dbff] bg-white/80 p-6 text-sm text-[#1f2937]">
            <div className="space-y-3">
              <a className="block font-semibold text-[#0b1220]" href={`mailto:${content.footer.email}`}>
                {content.footer.email}
              </a>
              <a className="block font-semibold text-[#0b1220]" href={`https://wa.me/${whatsapp}`}>
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
      <Script id="faq-jsonld-lp-5" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faq)}
      </Script>
    </main>
  );
}
