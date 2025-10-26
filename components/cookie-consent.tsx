"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("cookie-consent");
      if (!v) setVisible(true);
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem("cookie-consent", "accepted"); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem("cookie-consent", "declined"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="container mb-4 rounded-md border bg-background p-4 shadow">
        <p className="text-sm text-muted-foreground">
          Usamos cookies para melhorar sua experiência e, com seu consentimento, ativar analytics. Você pode aceitar ou recusar.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={accept}>Aceitar</Button>
          <Button size="sm" variant="outline" onClick={decline}>Recusar</Button>
        </div>
      </div>
    </div>
  );
}

