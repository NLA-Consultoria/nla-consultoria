import type { Metadata } from "next";
import "./globals.css";
import { defaultSEO, organizationJsonLd } from "../lib/seo";
import { env } from "../lib/env";
import Script from "next/script";
import { LeadModalProvider } from "../components/lead-modal-wizard";
import { CookieConsent } from "../components/cookie-consent";
import { Header } from "../components/header";

export const metadata: Metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
  metadataBase: env.SITE_URL ? new URL(env.SITE_URL) : undefined,
  alternates: {
    canonical: env.SITE_URL || undefined,
  },
  openGraph: {
    title: defaultSEO.title,
    description: defaultSEO.description,
    url: env.SITE_URL || undefined,
    siteName: "NLA Consultoria",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSEO.title,
    description: defaultSEO.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonOrg = organizationJsonLd();
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Define tema inicial baseado no localStorage */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            var ls = localStorage.getItem('theme');
            var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = ls ? ls : (prefersDark ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', theme === 'dark');
          } catch {}
        `}</Script>
        {/* Fontes para a logo: Libre Baskerville e Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&family=Libre+Baskerville:wght@700&display=swap" rel="stylesheet" />
        {env.GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">{`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${env.GTM_ID}');
            `}</Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${env.GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        {!env.GTM_ID && env.POSTHOG_KEY && (
          <Script id="posthog" strategy="afterInteractive">{`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled on".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${env.POSTHOG_KEY}',{api_host:'https://app.posthog.com'});
          `}</Script>
        )}
        {/* Meta Pixel Code */}
        <script
          id="meta-pixel"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1910664499856303');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1910664499856303&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(jsonOrg)}
        </Script>
      </head>
      <body>
        <LeadModalProvider>
          <Header />
          {children}
        </LeadModalProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
