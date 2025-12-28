#!/usr/bin/env node

/**
 * Deploy DEV - Script de automação completa
 *
 * Automatiza o fluxo completo de deploy no ambiente DEV:
 * 1. Commit e push (se necessário)
 * 2. Aguarda GitHub Actions buildar imagem (~3min)
 * 3. Trigger deploy no Easypanel
 * 4. Aguarda deploy completar
 * 5. Verifica se site está online
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

// Configuração
const CONFIG = {
  branch: 'dev',
  easypanel: {
    webhook: 'http://37.60.247.149:3000/api/deploy/9f39a3d3dd7f246526cfe27d138cf149b3c238fef23b5de7',
    siteUrl: 'https://automatize-nla-portal-dev.keoloh.easypanel.host/',
  },
  timings: {
    buildWait: 180, // 3 minutos para build
    deployWait: 60, // 1 minuto para deploy
    healthCheckRetries: 3,
    healthCheckInterval: 10, // 10 segundos entre tentativas
  },
};

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

// Flags de linha de comando
const args = process.argv.slice(2);
const flags = {
  skipBuild: args.includes('--skip-build'),
  noVerify: args.includes('--no-verify'),
  fast: args.includes('--fast'),
};

// Ajusta timings se --fast
if (flags.fast) {
  CONFIG.timings.buildWait = 120; // 2 minutos
}

// Mensagem de commit (se fornecida)
const commitMessage = args.find(arg => !arg.startsWith('--'));

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (!silent) {
      return output.trim();
    }
    return output;
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function sleepWithProgress(seconds, message) {
  const startTime = Date.now();
  const endTime = startTime + (seconds * 1000);

  process.stdout.write(colors.cyan + message + colors.reset);

  while (Date.now() < endTime) {
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    process.stdout.write(`\r${colors.cyan}${message} ${remaining}s restantes...${colors.reset}`);
    await sleep(1);
  }

  process.stdout.write(`\r${colors.green}✓ ${message} concluído!${colors.reset}\n`);
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    }).on('error', reject);
  });
}

function httpPost(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function checkBranch() {
  log('\n🔍 Verificando branch...', 'cyan');

  const currentBranch = exec('git branch --show-current');

  if (currentBranch !== CONFIG.branch) {
    log(`❌ Branch atual: ${currentBranch}`, 'red');
    log(`   Esperado: ${CONFIG.branch}`, 'yellow');
    throw new Error(`Troque para a branch ${CONFIG.branch} antes de deployar`);
  }

  log(`✓ Branch correta: ${CONFIG.branch}`, 'green');
  return currentBranch;
}

async function checkChanges() {
  log('\n🔍 Verificando mudanças...', 'cyan');

  const status = exec('git status --porcelain');

  if (!status) {
    log('✓ Nenhuma mudança pendente', 'green');

    // Check for unpushed commits
    const unpushed = exec('git log origin/dev..dev --oneline', true);
    if (unpushed) {
      const count = unpushed.trim().split('\n').length;
      log(`⚠️  ${count} commit(s) não enviado(s) para origin/dev`, 'yellow');
      log('   Você precisa fazer push antes do deploy!', 'yellow');
      return 'unpushed';
    }

    return false;
  }

  const lines = status.split('\n').length;
  log(`📝 ${lines} arquivo(s) modificado(s)`, 'yellow');
  return true;
}

async function commitAndPush(message) {
  log('\n📦 Fazendo commit e push...', 'cyan');

  // Stage all changes
  exec('git add .');
  log('✓ Arquivos staged', 'green');

  // Commit
  const msg = message || `deploy: atualização DEV ${new Date().toISOString().split('T')[0]}`;
  exec(`git commit -m "${msg}"`);
  log(`✓ Commit: ${msg}`, 'green');

  // Push
  const pushOutput = exec('git push origin dev');
  log('✓ Push concluído', 'green');

  // Pega SHA do commit
  const sha = exec('git rev-parse --short HEAD');
  log(`   SHA: ${sha}`, 'magenta');

  return sha;
}

async function waitForBuild() {
  if (flags.skipBuild) {
    log('\n⏭️  Pulando aguardar build (--skip-build)', 'yellow');
    return;
  }

  log('\n⏳ Aguardando GitHub Actions buildar imagem...', 'cyan');
  log(`   Tempo estimado: ${CONFIG.timings.buildWait}s (~${Math.ceil(CONFIG.timings.buildWait / 60)} min)`, 'blue');

  await sleepWithProgress(CONFIG.timings.buildWait, '⏳ Build em progresso');
}

async function triggerDeploy() {
  log('\n🚀 Triggering deploy no Easypanel...', 'cyan');

  try {
    const response = await httpPost(CONFIG.easypanel.webhook);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      log('✓ Deploy triggered com sucesso!', 'green');
      log(`   Status: ${response.statusCode}`, 'blue');
      return true;
    } else {
      log(`❌ Webhook retornou status ${response.statusCode}`, 'red');
      log(`   Response: ${response.body}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erro ao chamar webhook: ${error.message}`, 'red');
    return false;
  }
}

async function waitForDeploy() {
  log('\n⏳ Aguardando container reiniciar...', 'cyan');
  log(`   Tempo estimado: ${CONFIG.timings.deployWait}s`, 'blue');

  await sleepWithProgress(CONFIG.timings.deployWait, '⏳ Deploy em progresso');
}

async function healthCheck() {
  if (flags.noVerify) {
    log('\n⏭️  Pulando health check (--no-verify)', 'yellow');
    return true;
  }

  log('\n🏥 Verificando se site está online...', 'cyan');
  log(`   URL: ${CONFIG.easypanel.siteUrl}`, 'blue');

  for (let i = 1; i <= CONFIG.timings.healthCheckRetries; i++) {
    try {
      log(`   Tentativa ${i}/${CONFIG.timings.healthCheckRetries}...`, 'cyan');

      const response = await httpGet(CONFIG.easypanel.siteUrl);

      if (response.statusCode === 200) {
        log('✓ Site está online e respondendo!', 'green');
        log(`   Status: ${response.statusCode}`, 'blue');
        return true;
      } else {
        log(`⚠️  Status: ${response.statusCode}`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erro: ${error.message}`, 'yellow');
    }

    if (i < CONFIG.timings.healthCheckRetries) {
      await sleep(CONFIG.timings.healthCheckInterval);
    }
  }

  log('❌ Site não está respondendo após 3 tentativas', 'red');
  return false;
}

async function showSummary(sha, success) {
  const date = new Date().toISOString().split('T')[0];

  console.log('\n' + colors.bright + '═'.repeat(60) + colors.reset);

  if (success) {
    log('✅ DEPLOY DEV CONCLUÍDO COM SUCESSO!', 'green');
  } else {
    log('⚠️  DEPLOY COMPLETADO COM AVISOS', 'yellow');
  }

  console.log(colors.bright + '═'.repeat(60) + colors.reset);

  log('\n🚀 Informações:', 'cyan');
  log(`   Branch: ${CONFIG.branch}`, 'blue');
  log(`   Commit: ${sha || 'N/A'} (${date})`, 'blue');
  log(`   Build: ~${Math.ceil(CONFIG.timings.buildWait / 60)} min`, 'blue');
  log(`   Deploy: ~${CONFIG.timings.deployWait}s`, 'blue');

  log('\n🌐 URLs:', 'cyan');
  log(`   Site DEV: ${CONFIG.easypanel.siteUrl}`, 'blue');
  log(`   GitHub: https://github.com/NLA-Consultoria/nla-consultoria/tree/${CONFIG.branch}`, 'blue');

  log('\n📊 Próximos passos:', 'cyan');
  log('   • Testar funcionalidades no ambiente DEV', 'blue');
  log('   • Verificar logs no Easypanel (automatize/nla-portal-dev)', 'blue');
  log('   • Validar analytics e tracking de eventos', 'blue');

  console.log('\n');
}

async function main() {
  try {
    log(colors.bright + colors.blue + '\n╔═══════════════════════════════════════════════════════════╗');
    log('║        🚀 Deploy Automático - Ambiente DEV               ║');
    log('╚═══════════════════════════════════════════════════════════╝' + colors.reset);

    const startTime = Date.now();

    // 1. Verificar branch
    await checkBranch();

    // 2. Verificar mudanças
    const hasChanges = await checkChanges();

    let sha = null;

    // 3. Commit e push (se necessário)
    if (hasChanges === 'unpushed') {
      // Tem commits não pushed
      log('\n📤 Fazendo push dos commits pendentes...', 'cyan');
      exec('git push origin dev');
      log('✓ Push concluído', 'green');
      sha = exec('git rev-parse --short HEAD');
      log(`   SHA: ${sha}`, 'magenta');
    } else if (hasChanges) {
      // Tem mudanças não commitadas
      sha = await commitAndPush(commitMessage);
    } else {
      // Nada pendente
      sha = exec('git rev-parse --short HEAD');
      log(`✓ Último commit: ${sha}`, 'green');
    }

    // 4. Aguardar build
    await waitForBuild();

    // 5. Trigger deploy
    const deploySuccess = await triggerDeploy();

    if (!deploySuccess) {
      throw new Error('Falha ao trigger deploy no Easypanel');
    }

    // 6. Aguardar deploy
    await waitForDeploy();

    // 7. Health check
    const healthSuccess = await healthCheck();

    // 8. Mostrar resumo
    const elapsed = Math.ceil((Date.now() - startTime) / 1000);
    log(`\n⏱️  Tempo total: ${elapsed}s (~${Math.ceil(elapsed / 60)} min)`, 'magenta');

    await showSummary(sha, healthSuccess);

    process.exit(healthSuccess ? 0 : 1);

  } catch (error) {
    log(`\n❌ ERRO: ${error.message}`, 'red');
    log('\n🔍 Troubleshooting:', 'yellow');
    log('   • Verificar logs do GitHub Actions', 'blue');
    log('   • Verificar logs do Easypanel', 'blue');
    log('   • Verificar se tem mudanças não commitadas', 'blue');
    process.exit(1);
  }
}

// Executa
main();
