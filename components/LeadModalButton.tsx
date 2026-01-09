"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useLeadModal } from "./lead-modal-wizard";
import { trackCtaClick } from "../lib/clarity-events";
import { cn } from "./ui/cn";

type LeadModalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  location?: string;
};

export function LeadModalButton({
  children,
  className,
  location = "lp",
  onClick,
  ...props
}: LeadModalButtonProps) {
  const { open } = useLeadModal();

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        trackCtaClick(location);
        open();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
