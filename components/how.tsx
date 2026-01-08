"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import { FadeSection } from "./fade-section";
import { ClipboardList, FileCheck2, Target } from "lucide-react";

export function How() {
  const { open } = useLeadModal();
  const icons = [ClipboardList, Target, FileCheck2];

  return (
    <FadeSection as="section" id="como-funciona" className="section section--plain py-16">
      <div className="container text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{content.comoFunciona.title}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {content.comoFunciona.steps.map((s, i) => (
            <li
              key={i}
              className="rounded-md border bg-accent p-5 text-center text-base transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold">
                  {i + 1}
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = icons[i] || ClipboardList;
                    return <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />;
                  })()}
                  <h3 className="text-lg font-semibold">{s.title.replace(/^\d+\)\s*/, "")}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center">
          <Button size="xl" onClick={open}>
            {content.comoFunciona.cta}
          </Button>
        </div>
      </div>
    </FadeSection>
  );
}
