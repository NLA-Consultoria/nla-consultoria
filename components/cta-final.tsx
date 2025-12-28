"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { trackCtaClick } from "../lib/clarity-events";

export function CtaFinal() {
  const { open } = useLeadModal();

  const handleCtaClick = () => {
    trackCtaClick("final_cta");
    open();
  };

  return (
    <section className="container py-16" data-animate="fade">
      <div className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {content.ctaFinal.title}
        </h2>
        <div className="mt-6">
          <Button size="lg" onClick={handleCtaClick}>{content.ctaFinal.cta}</Button>
        </div>
      </div>
    </section>
  );
}
