#!/usr/bin/env node

/**
 * Script de inicialização customizado para o NLA Portal
 * Mostra informações do ambiente antes de iniciar o Next.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

const logLevel = process.env.LOG_LEVEL || 'info'; // debug | info | warn | error
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

function shouldLog(level) {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  return levels[level] >= levels[logLevel];
}

function log(message, level = 'info') {
  if (shouldLog(level)) {
    console.log(message);
  }
}

function getGitInfo() {
  try {
    const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const date = execSync('git log -1 --format=%cd --date=short', { encoding: 'utf8' }).trim();
    return { sha, branch, date };
  } catch (error) {
    // Fallback para variáveis de ambiente (Docker build args)
    const sha = process.env.GIT_SHA ? process.env.GIT_SHA.substring(0, 7) : 'unknown';
    const branch = process.env.GIT_BRANCH || 'unknown';
    const date = process.env.GIT_DATE ? process.env.GIT_DATE.split('T')[0] : 'unknown';
    return { sha, branch, date };
  }
}

function getPackageVersion() {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );
    return packageJson.version || '0.0.0';
  } catch (error) {
    return '0.0.0';
  }
}

function getEnvSummary() {
  const envVars = {
    'Site URL': process.env.NEXT_PUBLIC_SITE_URL || 'not set',
    'N8N Webhook': process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ? 'configured ✓' : 'not set ✗',
    'GTM ID': process.env.NEXT_PUBLIC_GTM_ID || 'not set',
    'PostHog': process.env.NEXT_PUBLIC_POSTHOG_KEY ? 'configured ✓' : 'not set',
    'Clarity': process.env.NEXT_PUBLIC_CLARITY_ID ? 'configured ✓' : 'not set',
    'Meta Pixel': process.env.NEXT_PUBLIC_META_PIXEL_ID ? 'configured ✓' : 'not set',
  };
  return envVars;
}

function printBanner() {
  const git = getGitInfo();
  const version = getPackageVersion();
  const env = isProduction ? 'PRODUCTION' : 'DEVELOPMENT';
  const envColor = isProduction ? colors.green : colors.cyan;

  console.log('\n' + colors.bright + colors.blue + '━'.repeat(60) + colors.reset);
  console.log(colors.bright + '🚀 NLA Portal - Landing Page' + colors.reset);
  console.log(colors.bright + colors.blue + '━'.repeat(60) + colors.reset + '\n');

  log(`${colors.bright}Environment:${colors.reset}    ${envColor}${env}${colors.reset}`);
  log(`${colors.bright}Version:${colors.reset}        ${colors.magenta}v${version}${colors.reset}`);
  log(`${colors.bright}Git Branch:${colors.reset}     ${colors.yellow}${git.branch}${colors.reset}`);
  log(`${colors.bright}Git Commit:${colors.reset}     ${colors.dim}${git.sha}${colors.reset} (${git.date})`);
  log(`${colors.bright}Node Version:${colors.reset}   ${process.version}`);
  log(`${colors.bright}Log Level:${colors.reset}      ${logLevel.toUpperCase()}`);

  console.log('');
}

function printEnvConfig() {
  if (!shouldLog('debug')) return;

  const envSummary = getEnvSummary();

  console.log(colors.bright + '⚙️  Environment Configuration:' + colors.reset);
  console.log(colors.dim + '─'.repeat(60) + colors.reset);

  Object.entries(envSummary).forEach(([key, value]) => {
    const formattedKey = key.padEnd(15);
    const hasCheck = value.includes('✓');
    const hasX = value.includes('✗');
    const color = hasCheck ? colors.green : hasX ? colors.yellow : colors.reset;
    console.log(`  ${formattedKey} ${color}${value}${colors.reset}`);
  });

  console.log('');
}

function printStartupMessage() {
  const port = process.env.PORT || 3000;
  console.log(colors.bright + colors.green + '✓ Starting Next.js server...' + colors.reset);
  console.log(colors.dim + `  Port: ${port}` + colors.reset);
  console.log(colors.bright + colors.blue + '━'.repeat(60) + colors.reset + '\n');
}

// Main execution
printBanner();
printEnvConfig();
printStartupMessage();

// Iniciar Next.js
const { spawn } = require('child_process');
const nextArgs = process.argv.slice(2); // Pega argumentos passados ao script

let nextProcess;

if (isProduction && fs.existsSync('server.js')) {
  // Modo standalone (Docker): executa server.js diretamente
  nextProcess = spawn('node', ['server.js', ...nextArgs], {
    stdio: 'inherit',
  });
} else {
  // Modo desenvolvimento ou produção sem standalone: usa next CLI
  const nextCommand = isProduction ? 'start' : 'dev';
  nextProcess = spawn('npx', ['next', nextCommand, ...nextArgs], {
    stdio: 'inherit',
  });
}

nextProcess.on('error', (error) => {
  console.error(colors.bright + colors.red + '✗ Failed to start Next.js:' + colors.reset, error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  process.exit(code || 0);
});
