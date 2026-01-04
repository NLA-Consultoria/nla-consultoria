// Conteúdo principal da Landing Page
// Atualize os textos conforme necessidade

export const content = {
  nav: {
    anchors: [
      { href: "#porque", label: "Por que vender" },
      { href: "#como-funciona", label: "Como funciona" },
      { href: "#recebe", label: "O que você recebe" },
      { href: "#para-quem", label: "Para quem é" },
      { href: "#faq", label: "FAQ" },
      { href: "#contato", label: "Contato" },
    ],
    cta: "Agendar minha reunião",
  },
  hero: {
    title: "Aumente suas vendas agora com o maior comprador do Brasil.",
    subtitle:
      "Se você já pensou em vender para prefeituras e governo, mas nunca tirou do papel, nós abrimos esse canal de receita para você: oportunidades certas, documentos no ponto e acompanhamento até a assinatura - sem caos interno.",
    proofs: [],
    cta: "Agendar minha reunião",
  },
  porque: {
    title: "Por que vender para o maior comprador do país",
    bullets: [
      "Demanda constante: compras públicas acontecem o ano todo.",
      "Ticket previsível: contratos com prazo e escopo definidos.",
      "Escala real: múltiplos órgãos, cidades e estados - com o mesmo produto.",
      "Barreiras de entrada: quem organiza a casa primeiro sai na frente.",
    ],
    cta: "Quero abrir esse canal de vendas",
  },
  comoFunciona: {
    title: "Como funciona",
    steps: [
      {
        title: "1) Reunião de alinhamento",
        text: "Mapeamos seu segmento, região e capacidade de entrega. Você sai com um plano inicial definido, com as primeiras oportunidades e o que precisa estar em dia para iniciar as vendas.",
      },
      {
        title: "2) Preparar para competir",
        text: "Organizamos documentos e prazos, traduzimos os requisitos do que é realmente relevante e alinhamos a estratégia de participação - sem juridiquês.",
      },
      {
        title: "3) Executar e acompanhar",
        text: "Apresentamos as melhores oportunidades, apoiamos na hora de competir e acompanhamos até a assinatura. Revisamos o que funcionou e priorizamos os próximos alvos.",
      },
    ],
    cta: "Agendar minha reunião",
  },
  recebe: {
    title: "O que você recebe",
    bullets: [
      "Oportunidades certas (por segmento/UF) com resumo em linguagem simples.",
      "Checklist de documentos e calendário de prazos - sem correrias.",
      "Roteiro de competição (o que fazer, quando e por que).",
      "Acompanhamento após a vitória até assinatura/homologação.",
    ],
  },
  publico: {
    title: "Para quem é",
    isFor: [
      "Empresas que já vendem para o privado e querem abrir uma frente estável com o setor público.",
      "Quem quer aumentar vendas sem improviso e sem 'apertar preço' no escuro.",
      "Quem valoriza processo claro e comunicação rápida.",
    ],
  },
  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        q: "Como funcionam planos e valores?",
        a: "São definidos na reunião, após entendermos seu cenário (segmento, regiões, volume e necessidade de acompanhamento). Mantemos escopo claro e limites operacionais para dar previsibilidade.",
      },
      {
        q: "Preciso entender de licitações?",
        a: "Não. Você precisa entender do seu negócio; nós traduzimos o que importa e guiamos cada etapa.",
      },
      {
        q: "Nunca participei. Dá para começar do zero?",
        a: "Sim. Começamos pela reunião de alinhamento, organizamos a casa e já começamos a participar das primeiras oportunidades.",
      },
      {
        q: "As licitações são para fornecimento de produtos ou serviços?",
        a: "Há uma alta demanda de todos os órgãos governamentais, tanto para produtos quanto para serviços.",
      },
    ],
  },
  ctaFinal: {
    title: "Abra uma nova frente de vendas com o maior e mais rico comprador do Brasil.",
    cta: "Agendar minha reunião",
  },
  footer: {
    email: "licitacoes@nlaconsultoria.com.br",
    whatsappDisplay: "(62) 98405-9504",
    cidadeUf: "Goiânia/GO",
    cnpj: "CNPJ 55.733.490/0001-27",
    privacyUrl: "#",
    termsUrl: "#",
  },
};

export type SiteContent = typeof content;
