"use client";

import type { CSSProperties } from "react";
import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { FadeSection } from "./fade-section";

export function CtaFinal() {
  const { open } = useLeadModal();
  const revealDelay = (delayMs: number) =>
    ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties);

  return (
    <FadeSection as="section" className="section section--soft py-16">
      <div className="container">
        <div className="rounded-xl border bg-card p-8 text-center shadow-sm motion-safe:transition motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            data-animate="fade"
            style={revealDelay(0)}
          >
            {content.ctaFinal.title}
          </h2>
          <div className="mt-6" data-animate="fade" style={revealDelay(120)}>
            <Button size="xl" onClick={open} className="cta-pulse">{content.ctaFinal.cta}</Button>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
