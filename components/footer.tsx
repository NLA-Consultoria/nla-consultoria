import type { CSSProperties } from "react";
import Link from "next/link";
import { content } from "../content/home";
import { env } from "../lib/env";

export function Footer() {
  const revealDelay = (delayMs: number) =>
    ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties);

  return (
    <footer id="contato" className="border-t py-10">
      <div className="container grid gap-6 text-center sm:grid-cols-2">
        <div className="flex flex-col items-center" data-animate="fade" style={revealDelay(0)}>
          <p className="font-semibold">Contato</p>
          <ul className="mt-2 text-sm text-muted-foreground">
            <li>
              E-mail:{" "}
              <a href={`mailto:${content.footer.email}`} className="underline">
                {content.footer.email}
              </a>
            </li>
            {env.WHATSAPP_URL ? (
              <li>
                WhatsApp:{" "}
                <a href={env.WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline">
                  {content.footer.whatsappDisplay}
                </a>
              </li>
            ) : (
              <li>WhatsApp: {content.footer.whatsappDisplay}</li>
            )}
            <li>{content.footer.cidadeUf}</li>
            <li>{content.footer.cnpj}</li>
          </ul>
        </div>
        <div className="flex flex-col items-center" data-animate="fade" style={revealDelay(120)}>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NLA Consultoria
          </p>
          <div className="mt-2 flex gap-4">
            <Link href={content.footer.privacyUrl} className="text-sm underline">
              Privacidade
            </Link>
            <Link href={content.footer.termsUrl} className="text-sm underline">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
