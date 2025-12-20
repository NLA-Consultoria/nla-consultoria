"use client";

import Link from "next/link";
import { content } from "../content/home";
import { Button } from "./ui/button";
import { useLeadModal } from "./lead-modal-wizard";
import LogoV8 from "./logo-v8";

export function Header() {
  const { open } = useLeadModal();
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="#" className="flex items-center gap-2" aria-label="NLA Consultoria">
          <LogoV8 size={28} theme="primary" />
        </Link>
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
          {content.nav.anchors.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="text-sm text-muted-foreground hover:text-foreground text-center"
            >
              {a.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button className="hidden md:inline-flex" onClick={open}>{content.nav.cta}</Button>
        </div>
      </div>
    </header>
  );
}
