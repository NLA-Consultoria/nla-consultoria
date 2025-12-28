"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import { env } from "../lib/env";

export function ClarityTracker() {
  useEffect(() => {
    if (!env.CLARITY_ID) return;

    // Inicializa o Clarity com o Project ID
    Clarity.init(env.CLARITY_ID);
  }, []);

  return null;
}
