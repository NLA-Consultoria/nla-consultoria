import type { CSSProperties } from "react";
import { content } from "../content/home";
import { FadeSection } from "./fade-section";

export function FAQ() {
  const revealDelay = (delayMs: number) =>
    ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties);

  return (
    <FadeSection as="section" id="faq" className="section section--plain py-16">
      <div className="container text-center">
        <h2
          className="text-4xl font-bold tracking-tight sm:text-5xl"
          data-animate="fade"
          style={revealDelay(0)}
        >
          {content.faq.title}
        </h2>
        <div className="mt-6 grid gap-4">
          {content.faq.items.map((f, i) => (
            <details
              key={i}
              className="rounded-md border bg-accent p-4 text-center text-base shadow-sm motion-safe:transition motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-md open:shadow-md"
              data-animate="fade"
              style={revealDelay(80 + i * 90)}
            >
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-base text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}
