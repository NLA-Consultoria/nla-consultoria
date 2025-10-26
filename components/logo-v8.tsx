"use client";

/**
 * Logo V8 — NLA | Consultoria (tipográfico, sem ícones)
 * - “NLA” em Libre Baskerville 700
 * - “Consultoria” em Inter 700 (uppercase/spacing)
 * - Separador vertical azul (#2A27C6)
 *
 * Props:
 *  - size: altura do “NLA” em px (default 56)
 *  - theme: "primary" | "white" | "mono"
 *  - className: classes extras (opcional)
 */

import React from "react";

type Props = {
  size?: number;
  theme?: "primary" | "white" | "mono";
  className?: string;
};

export default function LogoV8({
  size = 56,
  theme = "primary",
  className = "",
}: Props) {
  const INK = theme === "white" ? "#FFFFFF" : "#0F172A";
  const BLUE = theme === "white" ? "#FFFFFF" : theme === "mono" ? "#0F172A" : "#2A27C6";

  const pipeWidth = Math.max(2, Math.round(size * 0.05));
  const pipeHeight = Math.round(size * 0.64);
  const subSize = Math.round(size * 0.55);
  const subLetterSpacing = Math.max(0.12, +(subSize * 0.02).toFixed(2));
  const gap = Math.round(size * 0.18);
  const opticalNudge = Math.round(size * 0.03);

  return (
    <div
      className={`flex items-baseline gap-3 ${className}`}
      style={{ lineHeight: 1 }}
      aria-label="NLA Consultoria"
    >
      <span
        className="font-bold tracking-tight"
        style={{
          fontFamily: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
          fontSize: size,
          color: INK,
        }}
      >
        NLA
      </span>

      <span
        aria-hidden
        className="inline-block rounded"
        style={{
          width: pipeWidth,
          height: pipeHeight,
          background: BLUE,
          marginLeft: gap,
          marginRight: gap,
          transform: `translateY(${opticalNudge}px)`,
        }}
      />

      <span
        className="font-semibold uppercase"
        style={{
          fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
          fontSize: subSize,
          letterSpacing: `${subLetterSpacing}em`,
          color: BLUE,
        }}
      >
        Consultoria
      </span>
    </div>
  );
}

