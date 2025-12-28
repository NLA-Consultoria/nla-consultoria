"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { trackCtaClick } from "../lib/clarity-events";

export function Why() {
  const { open } = useLeadModal();

  const handleCtaClick = () => {
    trackCtaClick("why_section");
    open();
  };

  return (
    <section id="porque" className="container py-16 scroll-mt-24 text-center" data-animate="fade">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-center">
        {content.porque.title}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {content.porque.bullets.map((b, i) => (
          <li key={i} className="rounded-md border bg-accent p-4 text-center text-base text-foreground">
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Button onClick={handleCtaClick}>{content.porque.cta}</Button>
      </div>
    </section>
  );
}
