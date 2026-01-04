"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { FadeSection } from "./fade-section";

export function Hero() {
  const { open } = useLeadModal();
  return (
    <FadeSection as="section" className="section section--soft py-16 sm:py-24">
      <div className="container text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{content.hero.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{content.hero.subtitle}</p>
          {content.hero.proofs?.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              {content.hero.proofs.map((p, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>{p}</span>
                  {i < content.hero.proofs.length - 1 && <span className="opacity-50">-</span>}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center gap-3">
            <Button size="xl" onClick={open}>
              {content.hero.cta}
            </Button>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
