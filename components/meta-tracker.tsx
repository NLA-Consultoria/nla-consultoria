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
  return getCookie("_fbc");
}

export function MetaTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Deduplica PageView: garante apenas uma ativação do pixel por sessão/navegação
    if (typeof window !== "undefined" && (window as any).__META_PAGEVIEW_TRACKED) {
      return;
    }
    if (typeof window !== "undefined") {
      (window as any).__META_PAGEVIEW_TRACKED = true;
    }

    const url = window.location.href;
    const fbp = getFbp();
    const fbc = getFbc();
    trackMetaEvent({
      eventName: "PageView",
      eventSourceUrl: url,
      userData: { fbp, fbc },
      sendPixel: true,
    });
  }, [pathname, searchParams]);

  return null;
}
