# Troubleshooting Deploy DEV

Common issues and solutions when deploying to development environment.

## Script Waits But Build Never Starts

**Symptom:**
```
⏳ Build em progresso 180s restantes...
⏳ Build em progresso 179s restantes...
(aguardando mas build não existe no GitHub Actions)
```

**Cause:**
Changes were committed locally but **not pushed** to GitHub.

**Solution:**
1. Kill the running script (Ctrl+C)
2. Push changes:
   ```bash
   git push origin dev
   ```
3. Run deploy again:
   ```bash
   npm run deploy:dev
   ```

**Prevention:**
Always check git status before running:
```bash
git status                    # Check state
git log origin/dev..dev      # Check unpushed commits
```

If you see unpushed commits, push first OR let the script commit+push for you.

---

## "Branch atual: main, Esperado: dev"

**Symptom:**
```
❌ Branch atual: main
   Esperado: dev
```

**Solution:**
Switch to dev branch:
```bash
git checkout dev
npm run deploy:dev
```

---

## GitHub Actions Build Fails

**Symptom:**
Script waits 3 minutes but deployment fails.

**Check:**
1. Visit Actions: https://github.com/NLA-Consultoria/nla-consultoria/actions
2. Click on latest "Build and Push Docker image (DEV)"
3. Review error logs

**Common causes:**
- Docker build error (syntax in Dockerfile)
- Missing environment variables (DEV_* vars)
- Network issues

**Solution:**
Fix the issue, commit, push, run deploy again.

---

## Easypanel Webhook Returns Error

**Symptom:**
```
❌ Webhook retornou status 500
   Response: Internal Server Error
```

**Solutions:**

### 1. Check webhook URL
Verify in `scripts/deploy-dev.js`:
```javascript
webhook: 'http://37.60.247.149:3000/api/deploy/...'
```

### 2. Test webhook manually
```bash
curl -X POST http://37.60.247.149:3000/api/deploy/9f39a3d3dd7f246526cfe27d138cf149b3c238fef23b5de7
```

Should return: `Deploying...` or similar

### 3. Check Easypanel logs
Access Easypanel dashboard and check service logs.

---

## Site Not Responding After Deploy

**Symptom:**
```
⚠️  Tentativa 1/3...
⚠️  Tentativa 2/3...
⚠️  Tentativa 3/3...
❌ Site não está respondendo
```

**Solutions:**

### 1. Check container status
In Easypanel:
- Go to automatize → nla-portal-dev
- Check "Logs" tab
- Look for startup errors

### 2. Check container health
```bash
# If you have SSH access
docker ps | grep nla-portal-dev
docker logs nla-portal-dev
```

### 3. Common issues:
- Port 3000 already in use
- Missing environment variable
- Build error causing crash on startup
- Next.js compilation error

### 4. Manual verification
Visit: https://automatize-nla-portal-dev.keoloh.easypanel.host/

If 502/503: Container not running
If 500: Application error
If timeout: Network/DNS issue

---

## Build Takes Longer Than 3 Minutes

**Symptom:**
Script times out before build finishes.

**Solution 1 (Temporary):**
Use `--skip-build` and wait manually:
```bash
npm run deploy:dev -- --skip-build
```

Watch GitHub Actions, then run again without flag.

**Solution 2 (Permanent):**
Increase timeout in `scripts/deploy-dev.js`:
```javascript
timings: {
  buildWait: 240,  // 4 minutes instead of 3
}
```

---

## "Command failed: git push"

**Symptom:**
```
Error: Command failed: git push origin dev
```

**Common causes:**

### 1. Merge conflict
```bash
git pull origin dev       # Pull latest
# Resolve conflicts if any
git push origin dev
```

### 2. No permission
Check GitHub auth:
```bash
git remote -v
# Should show HTTPS or SSH URL with correct permissions
```

### 3. Branch protection
Dev branch may have protection rules. Check GitHub settings.

---

## Clarity/Analytics Not Working After Deploy

**Symptom:**
```javascript
typeof window.clarity  // → undefined
```

**Cause:**
`CLARITY_ID` not configured in Easypanel.

**Solution:**
1. Access Easypanel → automatize/nla-portal-dev
2. Add environment variable:
   ```
   CLARITY_ID=uscdlda0qf
   ```
3. Restart container (or wait for next deploy)

**Note:** Clarity is now runtime (not build-time), so you can change without rebuild.

---

## Variables Not Updating After Deploy

**Issue:** Changed env var but site still shows old value.

**Build-time vs Runtime:**

**Build-time** (requires rebuild):
- All `NEXT_PUBLIC_*` variables
- Incorporated into JavaScript bundle
- Change requires: push → build → deploy

**Runtime** (immediate):
- `CLARITY_ID`
- `LOG_LEVEL`
- `META_PIXEL_ACCESS_TOKEN`
- Change in Easypanel → restart container

**Solution:**
- For `NEXT_PUBLIC_*`: Need new build (commit + push)
- For runtime vars: Just update in Easypanel

---

## Useful Commands

### Check deployment status
```bash
# Local changes
git status
git diff

# Unpushed commits
git log origin/dev..dev

# GitHub Actions status (CLI)
gh run list --branch dev --limit 5

# Test Easypanel webhook
curl -X POST http://37.60.247.149:3000/api/deploy/...

# Test site health
curl -I https://automatize-nla-portal-dev.keoloh.easypanel.host/
```

### Rollback deployment
```bash
# Find previous working commit
git log --oneline -10

# Reset to that commit
git reset --hard abc1234

# Force push (careful!)
git push origin dev --force

# Trigger deploy
npm run deploy:dev
```

### Emergency: Manual deployment
If script fails, deploy manually:

```bash
# 1. Ensure pushed
git push origin dev

# 2. Wait for GitHub Actions (~3min)
# Watch: https://github.com/NLA-Consultoria/nla-consultoria/actions

# 3. Trigger Easypanel
curl -X POST http://37.60.247.149:3000/api/deploy/...

# 4. Wait 1 minute

# 5. Verify
curl -I https://automatize-nla-portal-dev.keoloh.easypanel.host/
```

---

## Getting Help

1. **Check logs first:**
   - GitHub Actions: https://github.com/NLA-Consultoria/nla-consultoria/actions
   - Easypanel: Access service logs in dashboard

2. **Verify configuration:**
   - `scripts/deploy-dev.js` has correct URLs
   - Environment variables set in Easypanel

3. **Test components individually:**
   - GitHub Actions: Push and watch build
   - Easypanel webhook: Test with curl
   - Site: Access URL directly

4. **Common pattern:**
   - Issue in GitHub Actions → Check workflow YAML
   - Issue in deployment → Check Easypanel logs
   - Issue in application → Check container logs
