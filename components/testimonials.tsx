import { content } from "../content/home";

export function Testimonials() {
  return (
    <section id="depoimentos" className="container py-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {content.depoimentos.title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {content.depoimentos.items.map((d, i) => (
          <blockquote key={i} className="rounded-md border bg-accent p-4 text-center text-base">
            <p className="text-muted-foreground">“{d.frase}”</p>
            <footer className="mt-2 text-sm font-medium">
              {d.nome}, <span className="text-muted-foreground">{d.cargo}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
