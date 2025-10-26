import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NLA Consultoria — Crescer Vendas e Organizar a Empresa",
  description:
    "Portal da NLA: cresça as vendas via novos canais e organize sua empresa com processos e automações sob medida.",
  openGraph: {
    title: "NLA Consultoria — Crescer Vendas e Organizar a Empresa",
    description:
      "Portal da NLA: cresça as vendas via novos canais e organize sua empresa com processos e automações sob medida.",
    type: "website",
    images: [
      {
        url: "/og-split.png",
        width: 1200,
        height: 630,
        alt: "NLA Consultoria — Portal dividido",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${merriweather.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
