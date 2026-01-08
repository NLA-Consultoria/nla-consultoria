"use client";

import type { CSSProperties } from "react";
import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { FadeSection } from "./fade-section";
import { RefreshCw, Receipt, Globe2, ShieldCheck } from "lucide-react";

export function Why() {
  const { open } = useLeadModal();
  const icons = [RefreshCw, Receipt, Globe2, ShieldCheck];
  const revealDelay = (delayMs: number) =>
    ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties);

  function splitBullet(text: string) {
    const idx = text.indexOf(":");
    if (idx === -1) return { title: "", description: text.trim() };
    return {
      title: text.slice(0, idx).trim(),
      description: text.slice(idx + 1).trim(),
    };
  }

  return (
    <FadeSection as="section" id="porque" className="section section--muted py-16">
      <div className="container text-center">
        <h2
          className="text-4xl font-bold tracking-tight sm:text-5xl"
          data-animate="fade"
          style={revealDelay(0)}
        >
          {content.porque.title}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {content.porque.bullets.map((b, i) => {
            const { title, description } = splitBullet(b);
            const Icon = icons[i] || RefreshCw;
            return (
              <li
                key={i}
                className="flex flex-col items-center gap-3 rounded-md border bg-accent p-5 text-center text-foreground motion-safe:transition motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg"
                data-animate="fade"
                style={revealDelay(80 + i * 90)}
              >
                <Icon className="h-7 w-7 text-blue-600" aria-hidden="true" />
                {title && <h3 className="text-lg font-semibold leading-tight">{title}</h3>}
                <p className="text-base text-muted-foreground">{description}</p>
              </li>
            );
          })}
        </ul>
        <div
          className="mt-8 flex justify-center"
          data-animate="fade"
          style={revealDelay(80 + content.porque.bullets.length * 90)}
        >
          <Button size="xl" onClick={open} className="cta-pulse">
            {content.porque.cta}
          </Button>
        </div>
      </div>
    </FadeSection>
  );
}
