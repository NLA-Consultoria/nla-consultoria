"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { trackCtaClick } from "../lib/clarity-events";

export function Hero() {
  const { open } = useLeadModal();

  const handleCtaClick = () => {
    trackCtaClick("hero");
    open();
  };

  return (
    <section className="container py-16 sm:py-24" data-animate="fade">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl text-center">
          {content.hero.title}
        </h1>
        <p className="text-lg text-muted-foreground text-center">
          {content.hero.subtitle}
        </p>
        {content.hero.proofs?.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            {content.hero.proofs.map((p, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>{p}</span>
                {i < content.hero.proofs.length - 1 && <span className="opacity-50">|</span>}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 flex w-full justify-center gap-3">
          <Button size="lg" onClick={handleCtaClick}>{content.hero.cta}</Button>
        </div>
      </div>
    </section>
  );
}
