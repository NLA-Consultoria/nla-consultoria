"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { FadeSection } from "./fade-section";

export function CtaFinal() {
  const { open } = useLeadModal();
  return (
    <FadeSection as="section" className="section section--soft py-16">
      <div className="container">
        <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {content.ctaFinal.title}
          </h2>
          <div className="mt-6">
            <Button size="xl" onClick={open}>{content.ctaFinal.cta}</Button>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
