// "Este componente foi gerado a partir de um prompt de especificaÃ§Ã£o. A qualquer momento, os textos podem ser editados nas constantes LEFT_TITLE, LEFT_SUBTITLE, RIGHT_TITLE, RIGHT_SUBTITLE."
"use client";

import React from 'react';

// =====================
// ConfigurÃ¡veis (fÃ¡ceis de editar)
// =====================
// URLs dos subdomÃ­nios
const URL_LEFT = 'https://licitacoes.nlaconsultoria.com.br';
const URL_RIGHT = 'https://automacoes.nlaconsultoria.com.br';

// TÃ­tulos e subtÃ­tulos
export const LEFT_TITLE = 'Quero crescer minhas vendas';
export const LEFT_SUBTITLE = 'Te ajudamos a encontrar novos canais de vendas, com a estrutura que vocÃª jÃ¡ tem hoje.';

// Para alternar o tÃ­tulo da metade direita, troque esta constante:
// Ex.: 'Quero aumentar minha eficiÃªncia'
export const RIGHT_TITLE = 'Quero organizar minha empresa';
export const RIGHT_SUBTITLE = 'Te ajudamos a entender a verdadeira causa do seu problema, definir processos e ganhar eficiÃªncia.';

// Imagens de fundo (troque as URLs conforme necessÃ¡rio)
// Dica: em Next.js, vocÃª pode substituir estes <img> por <Image> de 'next/image'
// e marcar a imagem do lado esquerdo como priority para LCP.
export const LEFT_BG = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1920&auto=format&fit=crop'; // arquitetura institucional/corporativo
export const RIGHT_BG = 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1920&auto=format&fit=crop'; // time mapeando processos/dashboard

// Mobile: mostrar subtÃ­tulos por padrÃ£o? (fallback aceitÃ¡vel)
// true = subtÃ­tulos visÃ­veis por padrÃ£o em telas pequenas
// false = subtÃ­tulos apenas ao foco/toque (comportamento recomendado)
export const SUBTITLE_MOBILE_DEFAULT_VISIBLE = false;

// Opacidade do overlay (0â€“1). Para alterar, ajuste este valor.
export const OVERLAY_OPACITY = 0.65; // ~65%

// Paleta (referÃªncia)
const TEXT_COLOR = '#0F172A';

// =====================
// Util: SEO leve via efeito (sem libs)
// =====================
function useLightSEO() {
  React.useEffect(() => {
    const title = 'NLA Consultoria â€” Crescer Vendas e Organizar a Empresa';
    const desc = 'Portal da NLA: cresÃ§a as vendas via novos canais e organize sua empresa com processos e automaÃ§Ãµes sob medida.';

    const prevTitle = document.title;
    document.title = title;

    const ensureMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let meta = document.head.querySelector(`meta[${attr}="${name}"]`) as any;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
      return meta;
    };

    ensureMeta('description', desc);
    ensureMeta('og:title', title, 'property');
    ensureMeta('og:description', desc, 'property');
    ensureMeta('og:type', 'website', 'property');
    // Placeholder: imagem OG representando o split
    ensureMeta('og:image', 'https://dummyimage.com/1200x630/ffffff/1d4ed8&text=NLA+Portal', 'property');

    return () => {
      document.title = prevTitle;
    };
  }, []);
}

// =====================
// Componente
// =====================
export default function SplitPortal() {
  useLightSEO();

  const [revealed, setRevealed] = React.useState(null as 'left' | 'right' | null);

  // Handler para Space ativar Ã¢ncoras
  const onAnchorKeyDown = (e: any) => {
    if (e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  };

  // Classes comuns para tÃ­tulo/subtÃ­tulo com transiÃ§Ãµes acessÃ­veis
  const revealBase = `transition-all duration-200 motion-reduce:transition-none will-change-[transform,opacity] transform-gpu`;

  // No mobile, podemos inverter a lÃ³gica conforme SUBTITLE_MOBILE_DEFAULT_VISIBLE
  const subtitleVisibility = SUBTITLE_MOBILE_DEFAULT_VISIBLE
    ? `opacity-100 translate-y-0 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 [@media(hover:none)]:opacity-100`
    : `opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 [@media(hover:none)]:group-[.revealed]:opacity-100 [@media(hover:none)]:group-[.revealed]:translate-y-0`;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900 font-sans"
      style={{ color: TEXT_COLOR }}
    >
      {/* Logo fixo no topo, centralizado */}
      <div className="pointer-events-none absolute inset-x-0 top-6 z-30 flex justify-center">
        <img
          src="/logo-nla.svg"
          width={120}
          height={48}
          alt="Logotipo NLA Consultoria"
          className="h-12 w-auto select-none"
        />
      </div>

      {/* Linha diagonal (pseudo via before:) no centro com leve rotaÃ§Ã£o */}
      <div
        className="pointer-events-none absolute inset-0 z-10 before:content-[''] before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-[#1D4ED8] before:opacity-90 before:origin-center before:rotate-[1.5deg] before:transform-gpu"
        aria-hidden="true"
      />

      {/* Grid das metades */}
      <div className="relative z-0 flex min-h-screen w-full select-none">
        {/* Metade ESQUERDA â€” Vendas */}
        <a
          role="link"
          aria-label="Portal de Vendas. Ir para LicitaÃ§Ãµes NLA."
          aria-describedby="left-subtitle-sr"
          href={URL_LEFT}
          className={[
            'group relative block h-screen w-1/2 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]',
            revealed === 'left' ? 'revealed' : '',
          ].join(' ')}
          onKeyDown={onAnchorKeyDown}
          onTouchStart={() => setRevealed('left')}
        >
          {/* Imagem de fundo */}
          <img
            src={LEFT_BG}
            alt="Ambiente corporativo moderno sugerindo expansÃ£o de canais de vendas"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover object-[center_left] scale-100 brightness-100 transition duration-200 motion-reduce:transition-none will-change-transform transform-gpu group-hover:scale-[1.03] group-hover:brightness-105 group-focus-within:scale-[1.03] group-focus-within:brightness-105"
          />

          {/* Overlay para legibilidade (gradiente linear) */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(rgba(10,20,60,${OVERLAY_OPACITY}), rgba(10,20,60,${OVERLAY_OPACITY}))`,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* ConteÃºdo */}
          <div className="relative z-20 flex h-full w-full items-center justify-center px-6">
            <div className="max-w-xl text-center text-white">
              <h1 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold ${revealBase}`}>{LEFT_TITLE}</h1>

              {/* SubtÃ­tulo visÃ­vel apenas em hover/focus/ touch-revealed. TambÃ©m fornecido como sr-only abaixo. */}
              <p
                className={[
                  'mt-4 text-base md:text-lg lg:text-xl',
                  'text-white/95',
                  revealBase,
                  subtitleVisibility,
                ].join(' ')}
              >
                {LEFT_SUBTITLE}
              </p>

              {/* Microtexto â€œEntrar â†’â€ */}
              <span
                className={[
                  'absolute bottom-4 right-5 text-white/90 text-sm',
                  revealBase,
                  'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0',
                  '[@media(hover:none)]:group-[.revealed]:opacity-100 [@media(hover:none)]:group-[.revealed]:translate-y-0',
                ].join(' ')}
                aria-hidden="true"
              >
                Entrar â†’
              </span>

              {/* Acessibilidade: subtÃ­tulo em sr-only, sempre presente para leitores de tela */}
              <span id="left-subtitle-sr" className="sr-only">
                {LEFT_SUBTITLE}
              </span>
            </div>
          </div>
        </a>

        {/* Metade DIREITA â€” OrganizaÃ§Ã£o & EficiÃªncia */}
        <a
          role="link"
          aria-label="Portal de OrganizaÃ§Ã£o e EficiÃªncia. Ir para AutomaÃ§Ãµes NLA."
          aria-describedby="right-subtitle-sr"
          href={URL_RIGHT}
          className={[
            'group relative block h-screen w-1/2 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]',
            revealed === 'right' ? 'revealed' : '',
          ].join(' ')}
          onKeyDown={onAnchorKeyDown}
          onTouchStart={() => setRevealed('right')}
        >
          {/* Imagem de fundo */}
          <img
            src={RIGHT_BG}
            alt="Equipe mapeando processos e dashboards para ganho de eficiÃªncia"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_right] scale-100 brightness-100 transition duration-200 motion-reduce:transition-none will-change-transform transform-gpu group-hover:scale-[1.03] group-hover:brightness-105 group-focus-within:scale-[1.03] group-focus-within:brightness-105"
          />

          {/* Overlay para legibilidade */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(rgba(10,20,60,${OVERLAY_OPACITY}), rgba(10,20,60,${OVERLAY_OPACITY}))`,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* ConteÃºdo */}
          <div className="relative z-20 flex h-full w-full items-center justify-center px-6">
            <div className="max-w-xl text-center text-white">
              <h1 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold ${revealBase}`}>{RIGHT_TITLE}</h1>

              <p
                className={[
                  'mt-4 text-base md:text-lg lg:text-xl',
                  'text-white/95',
                  revealBase,
                  subtitleVisibility,
                ].join(' ')}
              >
                {RIGHT_SUBTITLE}
              </p>

              {/* Microtexto â€œEntrar â†’â€ */}
              <span
                className={[
                  'absolute bottom-4 right-5 text-white/90 text-sm',
                  revealBase,
                  'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0',
                  '[@media(hover:none)]:group-[.revealed]:opacity-100 [@media(hover:none)]:group-[.revealed]:translate-y-0',
                ].join(' ')}
                aria-hidden="true"
              >
                Entrar â†’
              </span>

              {/* Acessibilidade: subtÃ­tulo em sr-only */}
              <span id="right-subtitle-sr" className="sr-only">
                {RIGHT_SUBTITLE}
              </span>
            </div>
          </div>
        </a>
      </div>

      {/* Dica de antialiasing geral */}
      <div className="absolute inset-0 -z-10 transform-gpu" aria-hidden="true" />
    </div>
  );
}


