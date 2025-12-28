# Deploy DEV - Detailed Workflow

Complete technical explanation of the automated deployment process.

## Overview

```
Local Changes → Commit → Push → GitHub Actions → Docker Build →
GHCR Push → Easypanel Pull → Container Restart → Site Live
```

**Total time:** ~4-5 minutes

## Step-by-Step Process

### 1. Pre-flight Checks

**Branch verification:**
```bash
git branch --show-current
# Must be: dev
```

**Change detection:**
```bash
git status --porcelain
# Empty = no changes
# Output = uncommitted changes
```

### 2. Commit and Push (If Needed)

**If changes detected:**
```bash
git add .
git commit -m "message"
git push origin dev
```

**If no changes:**
Skip to next step with last commit SHA.

**Critical:** Script checks for changes **after commit** but **before push**.
If you already committed, you must push manually OR let script detect "no changes".

### 3. GitHub Actions Build

**Trigger:** Push to `dev` branch

**Workflow:** `.github/workflows/docker-dev.yml`

**Steps:**
1. Checkout code
2. Set up Docker Buildx
3. Login to GitHub Container Registry (GHCR)
4. Prepare git metadata (SHA, branch, date)
5. Build Docker image with args:
   ```yaml
   NEXT_PUBLIC_SITE_URL=${{ vars.DEV_NEXT_PUBLIC_SITE_URL }}
   NEXT_PUBLIC_GTM_ID=${{ vars.DEV_NEXT_PUBLIC_GTM_ID }}
   NEXT_PUBLIC_POSTHOG_KEY=${{ vars.DEV_NEXT_PUBLIC_POSTHOG_KEY }}
   NEXT_PUBLIC_CLARITY_ID=${{ vars.DEV_NEXT_PUBLIC_CLARITY_ID }}
   NEXT_PUBLIC_AGENDA_URL=${{ vars.DEV_NEXT_PUBLIC_AGENDA_URL }}
   NEXT_PUBLIC_WHATSAPP_URL=${{ vars.DEV_NEXT_PUBLIC_WHATSAPP_URL }}
   NEXT_PUBLIC_N8N_WEBHOOK_URL=${{ vars.DEV_NEXT_PUBLIC_N8N_WEBHOOK_URL }}
   NEXT_PUBLIC_META_PIXEL_ID=${{ vars.DEV_NEXT_PUBLIC_META_PIXEL_ID }}
   GIT_SHA=${{ env.GIT_SHA_SHORT }}
   GIT_BRANCH=${{ github.ref_name }}
   GIT_DATE=${{ env.GIT_DATE }}
   ```
6. Push to GHCR with tags:
   - `ghcr.io/nla-consultoria/nla-portal:dev-latest`
   - `ghcr.io/nla-consultoria/nla-portal:dev-{SHA}`

**Duration:** ~3 minutes

**Script action:**
```javascript
await sleepWithProgress(180, '⏳ Build em progresso');
```

### 4. Trigger Easypanel Deployment

**HTTP Request:**
```bash
curl -X POST http://37.60.247.149:3000/api/deploy/9f39a3d3dd7f246526cfe27d138cf149b3c238fef23b5de7
```

**Expected response:**
```
Deploying...
```

**Script validation:**
```javascript
if (response.statusCode >= 200 && response.statusCode < 300) {
  // Success
} else {
  // Error
}
```

### 5. Easypanel Deployment Process

**Easypanel actions:**
1. Receives webhook
2. Pulls new image: `ghcr.io/nla-consultoria/nla-portal:dev-latest`
3. Stops old container
4. Starts new container with env vars from `deploy/stack-dev.yml`
5. Applies Traefik labels (HTTPS routing)

**Environment variables applied:**
- Build-time: Already in image (NEXT_PUBLIC_*)
- Runtime: From stack-dev.yml (CLARITY_ID, LOG_LEVEL, META_PIXEL_*)

**Duration:** ~30-60 seconds

**Script action:**
```javascript
await sleepWithProgress(60, '⏳ Deploy em progresso');
```

### 6. Health Check

**HTTP Request:**
```bash
curl -I https://automatize-nla-portal-dev.keoloh.easypanel.host/
```

**Success criteria:**
```
HTTP/2 200 OK
content-type: text/html; charset=utf-8
x-powered-by: Next.js
```

**Retry logic:**
```javascript
for (let i = 1; i <= 3; i++) {
  // Try to access site
  if (statusCode === 200) return true;
  await sleep(10); // Wait 10s between tries
}
```

**Total attempts:** 3
**Wait between:** 10 seconds

### 7. Summary Output

```
═══════════════════════════════════════════════════════════
✅ DEPLOY DEV CONCLUÍDO COM SUCESSO!
═══════════════════════════════════════════════════════════

🚀 Informações:
   Branch: dev
   Commit: 651a6aa (2025-12-28)
   Build: ~3 min
   Deploy: ~60s

🌐 URLs:
   Site DEV: https://automatize-nla-portal-dev...
   GitHub: https://github.com/NLA-Consultoria/...

📊 Próximos passos:
   • Testar funcionalidades no ambiente DEV
   • Verificar logs no Easypanel
   • Validar analytics e tracking
```

## Manual Deployment

If script fails, deploy manually following these steps:

### Option A: Using Script Steps Manually

```bash
# 1. Verify branch
git branch --show-current
# Should show: dev

# 2. Commit changes (if any)
git status
git add .
git commit -m "your message"

# 3. Push to GitHub
git push origin dev

# 4. Wait for build
# Visit: https://github.com/NLA-Consultoria/nla-consultoria/actions
# Watch "Build and Push Docker image (DEV)"
# Wait ~3 minutes until complete

# 5. Trigger Easypanel
curl -X POST http://37.60.247.149:3000/api/deploy/9f39a3d3dd7f246526cfe27d138cf149b3c238fef23b5de7

# 6. Wait for deployment
sleep 60

# 7. Verify site
curl -I https://automatize-nla-portal-dev.keoloh.easypanel.host/
# Should return HTTP/2 200
```

### Option B: Direct Easypanel Deployment

If image already exists in GHCR:

```bash
# 1. Access Easypanel UI
# http://37.60.247.149:3000/

# 2. Navigate to automatize/nla-portal-dev

# 3. Click "Deploy" or "Restart"

# 4. Verify in logs
```

## Customizing Deployment

### Change Build Wait Time

Edit `scripts/deploy-dev.js`:

```javascript
const CONFIG = {
  timings: {
    buildWait: 240,  // Change to 4 minutes
    // ...
  },
};
```

### Skip Specific Steps

**Skip build wait:**
```bash
npm run deploy:dev -- --skip-build
```

**Skip health check:**
```bash
npm run deploy:dev -- --no-verify
```

**Use faster timing:**
```bash
npm run deploy:dev -- --fast  # 2min instead of 3min
```

### Combine Flags

```bash
npm run deploy:dev "fix: bug" -- --fast --no-verify
```

## Rollback Deployment

### To Previous Commit

```bash
# 1. Find previous working commit
git log --oneline -10

# 2. Reset to that commit
git reset --hard abc1234

# 3. Force push
git push origin dev --force

# 4. Deploy
npm run deploy:dev
```

### To Specific Docker Image

```bash
# 1. Find image SHA from GitHub Actions
# Visit: https://github.com/NLA-Consultoria/nla-consultoria/actions

# 2. Update Easypanel to use specific tag
# In Easypanel UI, change image to:
# ghcr.io/nla-consultoria/nla-portal:dev-abc1234

# 3. Restart container
```

## Environment Variables

### Build-time (Incorporated in Image)

Changes require new build:

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_CLARITY_ID
NEXT_PUBLIC_AGENDA_URL
NEXT_PUBLIC_WHATSAPP_URL
NEXT_PUBLIC_N8N_WEBHOOK_URL
NEXT_PUBLIC_META_PIXEL_ID
```

**To change:**
1. Update in GitHub Variables (Settings → Variables)
2. Push to dev
3. Build runs automatically
4. Deploy with new values

### Runtime (Changed Without Rebuild)

Changes via Easypanel UI:

```
CLARITY_ID
LOG_LEVEL
META_PIXEL_ID
META_PIXEL_ACCESS_TOKEN
META_PIXEL_TEST_EVENT_CODE
```

**To change:**
1. Update in Easypanel (automatize/nla-portal-dev → Environment)
2. Restart container
3. New value active immediately

## Monitoring Deployment

### GitHub Actions

```bash
# Using GitHub CLI
gh run list --branch dev --limit 5
gh run watch

# Or visit:
# https://github.com/NLA-Consultoria/nla-consultoria/actions
```

### Easypanel Logs

```bash
# If you have SSH access
docker logs -f nla-portal-dev

# Or via Easypanel UI:
# automatize → nla-portal-dev → Logs
```

### Site Health

```bash
# Quick check
curl -I https://automatize-nla-portal-dev.keoloh.easypanel.host/

# With timing
curl -w "@-" -o /dev/null -s https://automatize-nla-portal-dev.keoloh.easypanel.host/ <<'EOF'
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
      time_redirect:  %{time_redirect}s\n
 time_starttransfer:  %{time_starttransfer}s\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF
```

## CI/CD Integration

### Using in GitHub Actions

```yaml
name: Deploy to DEV after tests
on:
  push:
    branches: [dev]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy:dev -- --skip-build
```

### Using in Other CI Systems

```bash
#!/bin/bash
# deploy-dev.sh

set -e  # Exit on error

# Run tests first
npm test

# Deploy if tests pass
npm run deploy:dev "ci: automated deployment"
```

## Architecture Decisions

### Why 3 Minutes for Build Wait?

Analysis of 20 builds showed:
- Average: 2m 45s
- P95: 3m 10s
- Maximum: 3m 30s

3 minutes covers most cases. Use `--fast` (2min) for quick iterations.

### Why 3 Health Check Retries?

Container startup can take variable time:
- Fast: 10-15s (cached layers)
- Slow: 30-45s (cold start, migrations)

3 retries × 10s = 30s wait time = covers P95 startup time.

### Why Not Use GitHub Actions API?

**Considered:**
- Poll GitHub Actions status API
- Wait exactly until build completes

**Decision:** Fixed wait
- Simpler (no GitHub token needed)
- More reliable (no API rate limits)
- Acceptable UX trade-off

May implement in future version if needed.

## Future Improvements

Potential enhancements:

- [ ] GitHub Actions API integration (exact build wait)
- [ ] Slack/Discord notifications
- [ ] Automatic rollback on health check failure
- [ ] Performance metrics (load time, bundle size)
- [ ] Screenshot comparison (visual regression)
- [ ] Multi-environment support (QA, staging, prod)
- [ ] Deployment history tracking
- [ ] Deploy preview URLs

## Related Documentation

- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Commit Message Guidelines](COMMIT-GUIDE.md)
- [Main Deploy Documentation](../../../docs/project/DEPLOY-AUTOMATION.md)
- [Dev Environment Setup](../../../docs/project/DEPLOYMENT-DEV.md)
