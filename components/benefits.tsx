import { content } from "../content/home";
import React from "react";

export function Benefits() {
  const highlightWords = ["processo", "critérios", "prazos", "segurança"];
  function renderHighlighted(text: string) {
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b(${highlightWords.map(esc).join("|")})\\b`, "giu");
    const parts: React.ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const w = m[0];
      parts.push(
        <span key={`${m.index}-${w}`} className="font-bold text-[1.06em]">{w}</span>
      );
      last = re.lastIndex;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }
  // Seleciona 4 itens na ordem desejada e ignora "Linha do tempo"
  const order = [
    "Oportunidades",
    "Checklist",
    "Roteiro",
    "Acompanhamento",
  ];
  const flow = order
    .map((key) => content.recebe.bullets.find((b) => b.toLowerCase().startsWith(key.toLowerCase())))
    .filter(Boolean) as string[];

  return (
    <section id="recebe" className="container py-16 scroll-mt-24 text-center" data-animate="fade">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-center">
        {content.recebe.title}
      </h2>
      <div className="mx-auto mt-8 grid max-w-xl justify-center">
        {flow.map((step, i) => (
          <React.Fragment key={i}>
            <div className="rounded-md border-2 border-dashed border-primary p-4 text-center text-base text-foreground">
              {step}
            </div>
            {i < flow.length - 1 && (
              <div className="my-3 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 4v16m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="2" className="text-primary" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8 rounded-md border-2 border-primary/70 p-4 text-center font-semibold text-primary dark:text-white dark:border-white">
        {renderHighlighted(content.recebe.note)}
      </div>
    </section>
  );
}
