"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";

export function CtaFinal() {
  const { open } = useLeadModal();
  return (
    <section className="container py-16">
      <div className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {content.ctaFinal.title}
        </h2>
        <div className="mt-6">
          <Button size="lg" onClick={open}>{content.ctaFinal.cta}</Button>
        </div>
      </div>
    </section>
  );
}
