import { content } from "../content/home";
import { FadeSection } from "./fade-section";

export function FAQ() {
  return (
    <FadeSection as="section" id="faq" className="section section--plain py-16">
      <div className="container text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {content.faq.title}
        </h2>
        <div className="mt-6 grid gap-4">
          {content.faq.items.map((f, i) => (
            <details key={i} className="rounded-md border bg-accent p-4 text-center text-base">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-base text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}
