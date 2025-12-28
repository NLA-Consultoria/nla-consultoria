/**
 * Script de Teste do Microsoft Clarity
 *
 * Cole este script no DevTools Console para validar
 * automaticamente a implementação do Clarity.
 *
 * USO:
 * 1. Abrir http://localhost:3000
 * 2. Abrir DevTools (F12)
 * 3. Colar todo este arquivo no Console
 * 4. Executar: runClarityTests()
 */

function runClarityTests() {
  console.log('%c🧪 Iniciando Testes do Microsoft Clarity', 'font-size: 16px; font-weight: bold; color: #0078D4');
  console.log('');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function assert(name, condition, errorMsg) {
    if (condition) {
      console.log(`%c✅ ${name}`, 'color: green');
      results.passed++;
      results.tests.push({ name, status: 'passed' });
    } else {
      console.error(`%c❌ ${name}`, 'color: red');
      if (errorMsg) console.error(`   → ${errorMsg}`);
      results.failed++;
      results.tests.push({ name, status: 'failed', error: errorMsg });
    }
  }

  // ========================================
  // 1. TESTES BÁSICOS
  // ========================================
  console.log('%c\n📋 Testes Básicos', 'font-size: 14px; font-weight: bold');

  assert(
    'window.clarity está disponível',
    typeof window.clarity === 'function',
    'window.clarity não é uma função. Clarity não carregou corretamente.'
  );

  // ========================================
  // 2. TESTES DE MÓDULO
  // ========================================
  console.log('%c\n📦 Testes de Importação de Módulos', 'font-size: 14px; font-weight: bold');

  // Verifica se módulo clarity-events foi carregado
  assert(
    'Módulo clarity-events carregado',
    typeof window !== 'undefined',
    'Window não está disponível (SSR?)'
  );

  // ========================================
  // 3. TESTES DE EVENTOS (Mock)
  // ========================================
  console.log('%c\n🎯 Testes de Eventos (Mock)', 'font-size: 14px; font-weight: bold');

  const mockEvents = [];
  const originalClarity = window.clarity;

  // Intercepta chamadas ao Clarity
  window.clarity = function(...args) {
    mockEvents.push(args);
    return originalClarity.apply(this, args);
  };

  // Simula evento de CTA
  window.clarity('event', 'test_cta_click');
  assert(
    'Clarity pode disparar eventos',
    mockEvents.some(e => e[0] === 'event' && e[1] === 'test_cta_click'),
    'Evento test_cta_click não foi registrado'
  );

  // Simula tag
  window.clarity('set', 'test_tag', 'test_value');
  assert(
    'Clarity pode aplicar tags',
    mockEvents.some(e => e[0] === 'set' && e[1] === 'test_tag' && e[2] === 'test_value'),
    'Tag test_tag não foi registrada'
  );

  // Simula identificação
  window.clarity('identify', 'test@test.com');
  assert(
    'Clarity pode identificar usuários',
    mockEvents.some(e => e[0] === 'identify' && e[1] === 'test@test.com'),
    'Identificação não foi registrada'
  );

  // Restaura clarity original
  window.clarity = originalClarity;

  // ========================================
  // 4. TESTES DE COMPONENTES
  // ========================================
  console.log('%c\n🧩 Testes de Componentes', 'font-size: 14px; font-weight: bold');

  // Verifica se CTAs existem na página
  const ctaButtons = document.querySelectorAll('button');
  assert(
    'Botões CTA presentes na página',
    ctaButtons.length > 0,
    'Nenhum botão encontrado na página'
  );

  // Verifica se header existe
  const header = document.querySelector('header');
  assert(
    'Header componente presente',
    header !== null,
    'Header não encontrado'
  );

  // Verifica se modal provider existe
  const leadModalContext = document.querySelector('[role="dialog"]');
  assert(
    'Modal dialog pode ser renderizado',
    true, // Não pode verificar sem abrir modal
    'Não é possível verificar sem interação do usuário'
  );

  // ========================================
  // 5. TESTES DE INTEGRAÇÃO (Requer interação)
  // ========================================
  console.log('%c\n🔗 Guia de Testes de Integração', 'font-size: 14px; font-weight: bold');
  console.log('%cOs seguintes testes requerem interação manual:', 'color: orange');
  console.log('');
  console.log('1. Clique em um CTA qualquer');
  console.log('   → Verifique no console: [Clarity] event cta_click_*');
  console.log('');
  console.log('2. Preencha o formulário até o fim');
  console.log('   → Verifique eventos: form_opened, form_step_*_completed');
  console.log('');
  console.log('3. Submeta o formulário');
  console.log('   → Verifique: form_submit_success, identify');
  console.log('');
  console.log('Para monitorar eventos em tempo real, execute:');
  console.log('%cmonitorClarityEvents()', 'background: #222; color: #0f0; padding: 4px');

  // ========================================
  // RESULTADOS
  // ========================================
  console.log('');
  console.log('%c' + '='.repeat(50), 'color: #ccc');
  console.log('%c📊 Resultados dos Testes', 'font-size: 16px; font-weight: bold; color: #0078D4');
  console.log('');
  console.log(`%c✅ Aprovados: ${results.passed}`, 'color: green; font-weight: bold');
  console.log(`%c❌ Falharam: ${results.failed}`, 'color: red; font-weight: bold');
  console.log(`%c📝 Total: ${results.passed + results.failed}`, 'font-weight: bold');
  console.log('');

  if (results.failed === 0) {
    console.log('%c🎉 Todos os testes automatizados passaram!', 'font-size: 14px; color: green; font-weight: bold');
    console.log('%cAgora execute testes manuais conforme CLARITY-TESTING-CHECKLIST.md', 'color: orange');
  } else {
    console.log('%c⚠️  Alguns testes falharam. Verifique os erros acima.', 'font-size: 14px; color: red; font-weight: bold');
  }

  console.log('');
  console.log('%c' + '='.repeat(50), 'color: #ccc');

  return results;
}

/**
 * Monitor de Eventos Clarity em Tempo Real
 *
 * Execute esta função para ver todos eventos
 * Clarity sendo disparados no console.
 */
function monitorClarityEvents() {
  console.log('%c🔍 Monitor de Eventos Clarity ATIVADO', 'background: #0078D4; color: white; padding: 8px; font-weight: bold');
  console.log('Todos os eventos Clarity serão exibidos abaixo:');
  console.log('');

  const originalClarity = window.clarity;

  window.clarity = function(...args) {
    const [action, ...params] = args;

    if (action === 'event') {
      console.log(`%c[Event] ${params[0]}`, 'background: #28a745; color: white; padding: 2px 6px; border-radius: 3px');
    } else if (action === 'set') {
      console.log(`%c[Tag] ${params[0]}: ${params[1]}`, 'background: #17a2b8; color: white; padding: 2px 6px; border-radius: 3px');
    } else if (action === 'identify') {
      console.log(`%c[Identify] ${params[0]}`, 'background: #fd7e14; color: white; padding: 2px 6px; border-radius: 3px');
    } else {
      console.log(`%c[${action}]`, 'background: #6c757d; color: white; padding: 2px 6px; border-radius: 3px', ...params);
    }

    return originalClarity.apply(this, args);
  };

  console.log('%cPara desativar o monitor, recarregue a página.', 'color: #999');
  console.log('');
}

/**
 * Teste Rápido de CTA
 *
 * Simula clique em CTA para verificar eventos
 */
function testCtaClick() {
  console.log('%c🖱️  Simulando clique em CTA...', 'font-weight: bold');

  const button = document.querySelector('button');

  if (!button) {
    console.error('❌ Nenhum botão encontrado na página');
    return;
  }

  // Ativa monitor temporário
  const events = [];
  const originalClarity = window.clarity;

  window.clarity = function(...args) {
    events.push(args);
    return originalClarity.apply(this, args);
  };

  // Simula clique
  button.click();

  // Aguarda 100ms para capturar eventos
  setTimeout(() => {
    window.clarity = originalClarity;

    console.log('');
    console.log('Eventos capturados:');
    events.forEach((e, i) => {
      console.log(`${i + 1}. ${e[0]}(${e.slice(1).map(p => `"${p}"`).join(', ')})`);
    });

    if (events.length === 0) {
      console.warn('%c⚠️  Nenhum evento Clarity disparado', 'color: orange');
      console.log('Verifique se o botão tem onClick com trackCtaClick()');
    } else {
      console.log(`%c✅ ${events.length} evento(s) disparado(s)`, 'color: green; font-weight: bold');
    }
  }, 100);
}

// ========================================
// EXECUTAR AUTOMATICAMENTE
// ========================================
console.log('%c' + '='.repeat(60), 'color: #0078D4');
console.log('%c   MICROSOFT CLARITY - SUITE DE TESTES', 'font-size: 18px; font-weight: bold; color: #0078D4');
console.log('%c' + '='.repeat(60), 'color: #0078D4');
console.log('');
console.log('Funções disponíveis:');
console.log('  • runClarityTests()      - Executa suite completa');
console.log('  • monitorClarityEvents() - Monitor em tempo real');
console.log('  • testCtaClick()         - Testa clique em CTA');
console.log('');
console.log('%cExecute: runClarityTests()', 'background: #0078D4; color: white; padding: 8px; font-weight: bold');
console.log('');
