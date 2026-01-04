import React, { useEffect, useRef, useState } from "react";
import { cn } from "./ui/cn";

type FadeSectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  delayMs?: number;
};

/**
 * Aplica um efeito de surgimento suave ao entrar na viewport.
 */
export function FadeSection({
  as: Comp = "div",
  className,
  delayMs = 0,
  children,
  ...rest
}: FadeSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Comp
      ref={ref as React.RefObject<any>}
      className={cn(
        "fade-section",
        visible && "fade-section--show",
        className
      )}
      style={visible && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}

