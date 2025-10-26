// "Este componente foi gerado a partir de um prompt de especificação. A qualquer momento, os textos podem ser editados nas constantes LEFT_TITLE, LEFT_SUBTITLE, RIGHT_TITLE, RIGHT_SUBTITLE."
"use client";

import React from 'react';
import Image from 'next/image';

// =====================
// Configuráveis (fáceis de editar)
// =====================
// URLs dos subdomínios
const URL_LEFT = 'https://licitacoes.nlaconsultoria.com.br';
const URL_RIGHT = 'https://automacoes.nlaconsultoria.com.br';

// Títulos e subtítulos
export const LEFT_TITLE = 'Quero crescer minhas vendas';
export const LEFT_SUBTITLE = 'Te ajudamos a encontrar novos canais de vendas, com a estrutura que você já tem hoje.';

// Para alternar o título da metade direita, troque esta constante:
// Ex.: 'Quero aumentar minha eficiência'
export const RIGHT_TITLE = 'Quero organizar minha empresa';
export const RIGHT_SUBTITLE = 'Te ajudamos a entender a verdadeira causa do seu problema, definir processos e ganhar eficiência.';

// Imagens de fundo (troque as URLs conforme necessário)
// Dica: use <Image> de 'next/image'; a esquerda com priority para LCP.
export const LEFT_BG = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1920&auto=format&fit=crop'; // arquitetura institucional/corporativo
export const RIGHT_BG = 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1920&auto=format&fit=crop'; // time mapeando processos/dashboard

// Mobile: mostrar subtítulos por padrão? (fallback aceitável)
// true = subtítulos visíveis por padrão em telas pequenas
// false = subtítulos apenas ao foco/toque (comportamento recomendado)
export const SUBTITLE_MOBILE_DEFAULT_VISIBLE = false;

// Opacidade do overlay (0–1). Para alterar, ajuste este valor.
export const OVERLAY_OPACITY = 0.65; // ~65%

// Paleta (referência)
const TEXT_COLOR = '#0F172A';

// =====================
// Componente
// =====================
export default function SplitPortal() {
  const [revealed, setRevealed] = React.useState(null as 'left' | 'right' | null);

  // Handler para Space ativar âncoras
  const onAnchorKeyDown = (e: any) => {
    if (e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  };

  // Classes comuns para título/subtítulo com transições acessíveis
  const revealBase = `transition-all duration-200 motion-reduce:transition-none will-change-[transform,opacity] transform-gpu`;

  // No mobile, podemos inverter a lógica conforme SUBTITLE_MOBILE_DEFAULT_VISIBLE
  const subtitleVisibility = SUBTITLE_MOBILE_DEFAULT_VISIBLE
    ? `opacity-100 translate-y-0 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 [@media(hover:none)]:opacity-100`
    : `opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 [@media(hover:none)]:group-[.revealed]:opacity-100 [@media(hover:none)]:group-[.revealed]:translate-y-0`;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900 font-sans"
      style={{ color: TEXT_COLOR }}
    >
      {/* Gradiente sutil central (substitui a linha) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 -translate-x-1/2 w-10 md:w-16 transform-gpu"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, rgba(29,78,216,0) 0%, rgba(29,78,216,0.12) 50%, rgba(29,78,216,0) 100%)',
        }}
      />

      {/* Grid das metades */}
      <div className="relative z-0 flex min-h-screen w-full select-none">
        {/* Metade ESQUERDA — Vendas */}
        <a
          role="link"
          aria-label="Portal de Vendas. Ir para Licitações NLA."
          aria-describedby="left-subtitle-sr"
          href={URL_LEFT}
          className={[
            'group relative block h-screen w-1/2 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]',
            revealed === 'left' ? 'revealed' : '',
          ].join(' ')}
          onKeyDown={onAnchorKeyDown}
          onTouchStart={() => setRevealed('left')}
        >
          {/* Imagem de fundo (Next Image) - priority para LCP */}
          <Image
            src={LEFT_BG}
            alt="Ambiente corporativo moderno sugerindo expansão de canais de vendas"
            fill
            priority
            sizes="50vw"
            className="object-cover object-[center_left] scale-100 brightness-100 transition duration-200 motion-reduce:transition-none will-change-transform transform-gpu group-hover:scale-[1.03] group-hover:brightness-105 group-focus-within:scale-[1.03] group-focus-within:brightness-105"
          />

          {/* Overlay para legibilidade (gradiente linear) */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(rgba(10,20,60,${OVERLAY_OPACITY}), rgba(10,20,60,${OVERLAY_OPACITY}))`,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Conteúdo */}
          <div className="relative z-20 flex h-full w-full items-center justify-center px-6">
            <div className="max-w-xl text-center text-white">
              <h1 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold ${revealBase}`}>{LEFT_TITLE}</h1>

              {/* Subtítulo visível apenas em hover/focus/ touch-revealed. Também fornecido como sr-only abaixo. */}
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

              {/* Microtexto “Entrar →” */}
              <span
                className={[
                  'absolute bottom-4 right-5 text-white/90 text-sm',
                  revealBase,
                  'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0',
                  '[@media(hover:none)]:group-[.revealed]:opacity-100 [@media(hover:none)]:group-[.revealed]:translate-y-0',
                ].join(' ')}
                aria-hidden="true"
              >
                Entrar →
              </span>

              {/* Acessibilidade: subtítulo em sr-only, sempre presente para leitores de tela */}
              <span id="left-subtitle-sr" className="sr-only">
                {LEFT_SUBTITLE}
              </span>
            </div>
          </div>
        </a>

        {/* Metade DIREITA — Organização & Eficiência */}
        <a
          role="link"
          aria-label="Portal de Organização e Eficiência. Ir para Automações NLA."
          aria-describedby="right-subtitle-sr"
          href={URL_RIGHT}
          className={[
            'group relative block h-screen w-1/2 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]',
            revealed === 'right' ? 'revealed' : '',
          ].join(' ')}
          onKeyDown={onAnchorKeyDown}
          onTouchStart={() => setRevealed('right')}
        >
          {/* Imagem de fundo (Next Image) - lazy */}
          <Image
            src={RIGHT_BG}
            alt="Equipe mapeando processos e dashboards para ganho de eficiência"
            fill
            loading="lazy"
            sizes="50vw"
            className="object-cover object-[center_right] scale-100 brightness-100 transition duration-200 motion-reduce:transition-none will-change-transform transform-gpu group-hover:scale-[1.03] group-hover:brightness-105 group-focus-within:scale-[1.03] group-focus-within:brightness-105"
          />

          {/* Overlay para legibilidade */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(rgba(10,20,60,${OVERLAY_OPACITY}), rgba(10,20,60,${OVERLAY_OPACITY}))`,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Conteúdo */}
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

              {/* Microtexto “Entrar →” */}
              <span
                className={[
                  'absolute bottom-4 right-5 text-white/90 text-sm',
                  revealBase,
                  'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0',
                  '[@media(hover:none)]:group-[.revealed]:opacity-100 [@media(hover:none)]:group-[.revealed]:translate-y-0',
                ].join(' ')}
                aria-hidden="true"
              >
                Entrar →
              </span>

              {/* Acessibilidade: subtítulo em sr-only */}
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
