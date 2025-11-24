"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMetaEvent } from "../lib/trackMetaEvent";

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

function getFbp() {
  return getCookie("_fbp");
}

function getFbc() {
  // Para page view, o fbc pode não existir; tentamos ler se já foi setado
  return getCookie("_fbc");
}

export function MetaTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = window.location.href;
    const fbp = getFbp();
    const fbc = getFbc();
    trackMetaEvent({
      eventName: "PageView",
      eventSourceUrl: url,
      userData: { fbp, fbc },
      // Evita duplicar a PageView do snippet do pixel (deduplicação fica apenas com CAPI aqui)
      sendPixel: false,
    });
  }, [pathname, searchParams]);

  return null;
}
