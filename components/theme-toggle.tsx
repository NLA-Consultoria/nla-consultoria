"use client";

import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type ThemeOption = "green" | "blue";

function applyTheme(theme: ThemeOption) {
  const root = document.documentElement;
  if (theme === "blue") {
    root.classList.add("theme-blue");
  } else {
    root.classList.remove("theme-blue");
  }
  localStorage.setItem("theme-color", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>("green");

  useEffect(() => {
    const saved = (localStorage.getItem("theme-color") as ThemeOption | null) ?? "green";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const isBlue = theme === "blue";

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Label htmlFor="theme-toggle">Verde</Label>
      <Switch
        id="theme-toggle"
        checked={isBlue}
        onCheckedChange={(checked) => {
          const nextTheme: ThemeOption = checked ? "blue" : "green";
          setTheme(nextTheme);
          applyTheme(nextTheme);
        }}
        aria-label="Alternar tema entre verde e azul"
      />
      <span>Azul</span>
    </div>
  );
}
