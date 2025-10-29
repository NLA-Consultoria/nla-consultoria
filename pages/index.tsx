// pages/index.tsx
export default function Home() {
  const agenda = process.env.NEXT_PUBLIC_AGENDA_URL;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL;
  const ctaHref = agenda || whatsapp || '#';

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 36, lineHeight: 1.2, margin: 0 }}>
            Aumente suas vendas — agora com o maior comprador do Brasil.
          </h1>
          <p style={{ fontSize: 18, marginTop: 16, color: '#444' }}>
            Se você já pensou em vender para prefeituras e governo, mas nunca tirou do papel, nós abrimos esse
            canal de receita para você: oportunidades certas, documentos no ponto e acompanhamento até a assinatura — sem caos interno.
          </p>
          <p style={{ marginTop: 8, fontWeight: 500 }}>
            Curadoria de oportunidades sob medida • Acompanhamento ponta a ponta
          </p>
        </header>

        <a
          href={ctaHref}
          target={ctaHref && ctaHref !== '#' ? '_blank' : undefined}
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            border: '1px solid #111',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          Agendar minha reunião
        </a>

        <hr style={{ margin: '32px auto', width: '60%', opacity: 0.2 }} />

        <section style={{ textAlign: 'left' }}>
          <h2>Por que vender para o maior comprador do país</h2>
          <ul>
            <li>Demanda constante: compras públicas acontecem o ano todo.</li>
            <li>Ticket previsível: contratos com prazo e escopo definidos.</li>
            <li>Escala real: múltiplos órgãos, cidades e estados — com o mesmo produto.</li>
            <li>Barreiras de entrada: quem organiza a casa primeiro sai na frente.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
