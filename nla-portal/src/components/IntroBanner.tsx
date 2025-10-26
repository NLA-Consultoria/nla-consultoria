"use client";

import React from "react";

// Configuráveis
const INTRO_TEXT = "Qual a maior dor da sua empresa?";
const FADE_IN_MS = 600;
const HOLD_MS = 2800; // tempo de exposição do texto
const FADE_OUT_MS = 600;

export default function IntroBanner() {
  const [stage, setStage] = React.useState<"in" | "hold" | "out">("in");
  const [mounted, setMounted] = React.useState(true);

  React.useEffect(() => {
    const toHold = setTimeout(() => setStage("hold"), FADE_IN_MS);
    const toOut = setTimeout(() => setStage("out"), FADE_IN_MS + HOLD_MS);
    const toUnmount = setTimeout(() => setMounted(false), FADE_IN_MS + HOLD_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(toHold);
      clearTimeout(toOut);
      clearTimeout(toUnmount);
    };
  }, []);

  if (!mounted) return null;

  const overlayOpacity = stage === "out" ? "opacity-0" : "opacity-100";
  const textPhase =
    stage === "in"
      ? "opacity-0 translate-y-1 blur-[2px] tracking-[0.25em]"
      : stage === "hold"
      ? "opacity-100 translate-y-0 blur-0 tracking-[0.08em]"
      : "opacity-0 -translate-y-1 blur-[2px] tracking-[0.2em]"; // saída: sobe levemente e desvanece

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex items-center justify-center bg-black text-white",
        "transition-opacity duration-600 motion-reduce:transition-none",
        overlayOpacity,
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <p
        className={[
          "font-serif text-center text-2xl md:text-4xl",
          "transition-all duration-700 ease-out motion-reduce:transition-none",
          textPhase,
        ].join(" ")}
      >
        {INTRO_TEXT}
      </p>
    </div>
  );
}
