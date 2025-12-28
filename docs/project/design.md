Design System — NLA Consultoria (Site)

1) Identidade Visual
- Marca: NLA Consultoria — consultoria para vendas ao setor público (licitações).
- Tom: confiável, direto, didático; foco em previsibilidade e processo.
- Voz: clara, sem jargões jurídicos; orientada a resultados e próximos passos.

2) Tipografia
- Primária: Inter (Google Fonts) — utilizada para todo o texto da interface e copy principal. Peso médio por padrão (`font-medium`) e ênfase em headings conforme necessidade.
- Secundária (logotipo/acentos): Libre Baskerville (Google Fonts) — usada na marca/assinatura visual (LogoV8) e, se necessário, em títulos hero para contraste clássico.
- Acessibilidade: tamanhos responsivos via Tailwind, contraste garantido pelas variáveis de cor; foco visível com `ring`.

3) Paleta de Cores (HSL via CSS variables)
- Base (claro):
  - background: 0 0% 100%
  - foreground: 222.2 47.4% 10%
  - border/input: 214.3 31.8% 91.4%
  - muted: 210 40% 96.1% / muted-foreground: 215.4 16.3% 46.9%
  - card: 0 0% 100% / card-foreground: 222.2 47.4% 11.2%
  - primary: 241 67% 46% (hex aproximado: #2A27C6)
  - primary-foreground: 0 0% 100%
  - secondary/accent: 210 40% 96.1% / foreground 222.2 47.4% 11.2%
  - destructive: 0 84.2% 60.2% / foreground 210 40% 98%
  - ring: 241 67% 46%
- Base (escuro):
  - background: 222.2 84% 4.9%
  - foreground: 210 40% 98%
  - muted/accent/secondary: 217.2 32.6% 17.5% / foreground 210 40% 98%
  - border/input: 217.2 32.6% 17.5%
  - primary e ring mantêm 241 67% 46%
  - destructive: 0 62.8% 30.6% / foreground 210 40% 98%

Notas de cor
- Primária (#2A27C6) é o fio condutor (CTA, links, foco). Utilize variações `hover` ±10% de luminosidade.
- Texto em `foreground` sobre superfícies `background` ou `card` para excelente contraste AA/AAA.

4) Espaçamento, grid e raio
- Container: `.container { max-width: 72rem; padding-inline: 1rem; }` (aprox. `max-w-6xl`)
- Grid: Tailwind Utility-First; espaçamentos com escala padrão (`gap-2`, `gap-4`, etc.)
- Raio padrão: `--radius: 0.5rem` (tailwind: `rounded-md`).

5) Estados e feedback
- Foco: `:focus-visible` com `box-shadow: 0 0 0 3px hsl(var(--ring))` (atende acessibilidade).
- Loading: botões com `aria-busy` e desabilitados; modais tratam estados de envio.
- Erros de validação: texto `text-destructive` em mensagens de formulário.

6) Componentes de UI (Radix + Tailwind)
- Button: variantes `default`, `secondary`, `outline`, `ghost`, `link`; tamanhos `sm`, `default`, `lg`, `icon`. CTA principal usa `variant=default` (primário).
- Dialog: overlay semitransparente, conteúdo centralizado com `max-w-lg`/`sm:max-w-xl`/`md:max-w-2xl`, borda e sombra suaves.
- Input/Label/Textarea: bordas com `--input`, foco com `ring` primário; tamanhos consistentes (altura ~40px).
- Switch/ThemeToggle: alternância de tema `light/dark` persistida em `localStorage` (`theme`), com ícones `Moon/Sun`.

7) Layout e seções
- Header sticky com brand à esquerda, navegação central (anchor links) e ações à direita (CTA + ThemeToggle).
- Hero: título forte, subtítulo explicativo, CTA destacado em primário.
- Seções: “Por que vender”, “Como funciona”, “O que você recebe”, “Para quem”, “Depoimentos”, “FAQ”, “CTA final”.
- Footer: informações de contato, cidade/UF, CNPJ, links de termos e privacidade.

8) Ilustrações e ícones
- Ícones: `lucide-react` (linha consistente, legíveis em ambos os temas).
- Logo: `public/logo.svg` + componente `LogoV8` com variação de cor por tema.

9) Acessibilidade
- Contraste AA nas combinações principais.
- Elementos interativos com `aria-label`, `aria-describedby`, e foco visível.
- Tamanhos e espaçamentos adequados para touch.

10) Diretrizes de uso
- Use `primary` somente para ações de alto valor (CTAs, links principais, foco).
- Prefira `secondary`/`accent` para planos de fundo neutros, cards e hover states.
- Mantenha hierarquia tipográfica simples (H1 Hero, H2 seções, H3 subtítulos se necessário).

