import { content } from "../content/home";

export function FAQ() {
  return (
    <section id="faq" className="container py-16 scroll-mt-24 text-center" data-animate="fade">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-center">
        {content.faq.title}
      </h2>
      <div className="mt-6 grid gap-4">
        {content.faq.items.map((f, i) => (
          <details key={i} className="rounded-md border bg-accent p-4 text-left text-base">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-base text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
