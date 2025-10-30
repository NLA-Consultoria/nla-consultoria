"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";

export function Hero() {
  const { open } = useLeadModal();
  return (
    <section className="container py-16 sm:py-24">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {content.hero.subtitle}
          </p>
          {content.hero.proofs?.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {content.hero.proofs.map((p, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>{p}</span>
                  {i < content.hero.proofs.length - 1 && <span className="opacity-50">•</span>}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex gap-3">
            <Button size="lg" onClick={open}>{content.hero.cta}</Button>
          </div>
        </div>
        <div className="relative h-56 w-full sm:h-72 md:h-80">
          {/* Ilustração leve (SVG) */}
          <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="300" fill="url(#g)" rx="12" />
            <g fill="none" stroke="currentColor" strokeOpacity="0.2">
              <path d="M30 240 C120 200 180 260 260 220 S360 200 380 210" />
              <path d="M30 200 C120 160 180 220 260 180 S360 160 380 170" />
              <path d="M30 160 C120 120 180 180 260 140 S360 120 380 130" />
            </g>
            <g>
              <circle cx="80" cy="210" r="8" fill="hsl(var(--primary))" />
              <circle cx="200" cy="170" r="8" fill="hsl(var(--primary))" />
              <circle cx="320" cy="130" r="8" fill="hsl(var(--primary))" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
