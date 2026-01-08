"use client";

import Link from "next/link";
import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import LogoV8 from "./logo-v8";
import { trackCtaClick } from "../lib/clarity-events";

export function Header() {
  const { open } = useLeadModal();

  const handleCtaClick = () => {
    trackCtaClick("header");
    open();
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <Link href="#" className="flex items-center gap-2 whitespace-nowrap" aria-label="NLA Consultoria">
          <LogoV8 size={28} theme="mono" />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 whitespace-nowrap md:flex">
          {content.nav.anchors.map((a) => (
            <Link key={a.href} href={a.href} className="text-sm text-muted-foreground hover:text-foreground">
              {a.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-shrink-0 items-center justify-end gap-3">
          <Button size="lg" className="hidden md:inline-flex" onClick={handleCtaClick}>
            {content.nav.cta}
          </Button>
        </div>
      </div>
    </header>
  );
}
