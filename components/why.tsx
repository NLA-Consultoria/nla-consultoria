"use client";

import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal";

export function Why() {
  const { open } = useLeadModal();
  return (
    <section id="porque" className="container py-16">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {content.porque.title}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {content.porque.bullets.map((b, i) => (
          <li key={i} className="rounded-md border bg-accent p-4 text-center text-base text-foreground">
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button onClick={open}>{content.porque.cta}</Button>
      </div>
    </section>
  );
}
