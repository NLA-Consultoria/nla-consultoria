"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { trackCtaClick } from "../lib/clarity-events";

export function How() {
  const { open } = useLeadModal();

  const handleCtaClick = () => {
    trackCtaClick("how_section");
    open();
  };

  return (
    <section id="como-funciona" className="container py-16 scroll-mt-24 text-center" data-animate="fade">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-center">
        {content.comoFunciona.title}
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {content.comoFunciona.steps.map((s, i) => (
          <li key={i} className="rounded-md border bg-accent p-4 text-center text-base">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex justify-center">
        <Button onClick={handleCtaClick}>{content.comoFunciona.cta}</Button>
      </div>
    </section>
  );
}
