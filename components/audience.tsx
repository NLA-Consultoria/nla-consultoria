import { content } from "../content/home";
import { FadeSection } from "./fade-section";

export function Audience() {
  return (
    <FadeSection as="section" id="para-quem" className="section section--muted py-16">
      <div className="container text-center">
        <div className="rounded-xl border-2 border-border bg-background p-6 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-6 text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {content.publico.title}
            </h3>
            <ul className="grid gap-3">
              {content.publico.isFor.map((b, i) => (
                <li
                  key={i}
                  className="min-h-20 flex items-center justify-center rounded-md bg-accent p-4 text-center text-base text-foreground"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
