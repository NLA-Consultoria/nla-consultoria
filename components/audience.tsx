import { content } from \"../content/home\";

export function Audience() {
  return (
    <section id=\"para-quem\" className=\"container py-16 scroll-mt-24\">
      <div className=\"rounded-xl border-2 border-primary/60 p-6 sm:p-8 dark:border-white\">
        <div className=\"grid gap-6 sm:grid-cols-2\">
          <div>
            <h3 className=\"mb-4 text-center text-2xl font-semibold text-primary dark:text-white\">
              <span>Para</span>
              <br />
              <span>quem é</span>
            </h3>
            <ul className=\"grid gap-2\">
              {content.publico.isFor.map((b, i) => (
                <li
                  key={i}
                  className=\"rounded-md bg-accent p-4 text-center text-base text-foreground min-h-20 flex items-center justify-center\"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className=\"mb-4 text-center text-2xl font-semibold text-primary dark:text-white\">
              <span>Para</span>
              <br />
              <span>quem não é</span>
            </h3>
            <ul className=\"grid gap-2\">
              {content.publico.notFor.map((b, i) => (
                <li
                  key={i}
                  className=\"rounded-md bg-accent p-4 text-center text-base text-foreground min-h-20 flex items-center justify-center\"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
