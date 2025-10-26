"use client";

import { Hero } from "../components/hero";
import { Why } from "../components/why";
import { How } from "../components/how";
import { Benefits } from "../components/benefits";
import { Audience } from "../components/audience";
import { Testimonials } from "../components/testimonials";
import { FAQ } from "../components/faq";
import { CtaFinal } from "../components/cta-final";
import { Footer } from "../components/footer";
import { content } from "../content/home";
import Script from "next/script";
import { faqJsonLd } from "../lib/seo";

export default function Page() {
  const faq = faqJsonLd(content.faq.items);
  return (
    <main>
      <Hero />
      <Why />
      <How />
      <Benefits />
      <Audience />
      <Testimonials />
      <FAQ />
      <CtaFinal />
      <Footer />
      <Script id="faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faq)}
      </Script>
    </main>
  );
}
