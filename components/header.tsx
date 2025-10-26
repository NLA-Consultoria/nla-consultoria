"use client";

import Link from "next/link";
import { content } from "../content/home";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useLeadModal } from "./lead-modal";
import LogoV8 from "./logo-v8";
import { useEffect, useState } from "react";

export function Header() {
  const { open } = useLeadModal();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="#" className="flex items-center gap-2" aria-label="NLA Consultoria">
          <LogoV8 size={28} theme={dark ? "white" : "primary"} />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {content.nav.anchors.map((a) => (
            <Link key={a.href} href={a.href} className="text-sm text-muted-foreground hover:text-foreground">
              {a.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button className="hidden md:inline-flex" onClick={open}>{content.nav.cta}</Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
