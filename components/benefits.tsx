import React from "react";
import { content } from "../content/home";
import { FadeSection } from "./fade-section";
import { Target, ClipboardCheck, Map, Handshake } from "lucide-react";

export function Benefits() {
  const order = ["Oportunidades", "Checklist", "Roteiro", "Acompanhamento"];
  const flow = order
    .map((key) => content.recebe.bullets.find((b) => b.toLowerCase().startsWith(key.toLowerCase())))
    .filter(Boolean) as string[];

  const icons = [Target, ClipboardCheck, Map, Handshake];

  const splitText = (text: string) => {
    const idx = text.indexOf(":");
    if (idx === -1) return { title: "", description: text.trim() };
    return {
      title: text.slice(0, idx).trim(),
      description: text.slice(idx + 1).trim(),
    };
  };

  return (
    <FadeSection as="section" id="recebe" className="section section--soft py-16">
      <div className="container text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {content.recebe.title}
        </h2>

        <div className="relative mx-auto mt-10 max-w-3xl text-left">
          <div className="space-y-6">
            {flow.map((step, i) => {
              const { title, description } = splitText(step);
              const Icon = icons[i] || Target;
              return (
                <div key={i} className="relative flex items-center gap-4 sm:gap-6">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-2 ring-blue-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="flex-1 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
                    {title && <div className="text-lg font-semibold">{title}</div>}
                    <p className="mt-1 text-base text-muted-foreground">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
