---
name: deploy-dev
description: Automates complete DEV deployment (commit, push, build, deploy, verify). Use when deploying to development environment, pushing to dev branch, or when user mentions deploy, staging, or development server.
allowed-tools: Bash, Read, Grep
---

# Deploy DEV - Automated Deployment

Automates the complete deployment workflow for the development environment.

## When to Use

- User asks to deploy to DEV/staging
- After making code changes that need testing on server
- When user mentions "deploy", "push to dev", or "update staging"
- Before merging to production (test on DEV first)

## Quick Start

```bash
npm run deploy:dev
```

**With custom commit message:**
```bash
npm run deploy:dev "feat: add new feature"
```

**With flags:**
```bash
npm run deploy:dev -- --fast           # Wait 2min instead of 3min
npm run deploy:dev -- --skip-build     # Skip build wait
npm run deploy:dev -- --no-verify      # Skip health check
```

## What It Does

1. ✅ Verifies on `dev` branch
2. 📝 Commits and pushes changes (if any)
3. ⏳ Waits for GitHub Actions build (~3min)
4. 🚀 Triggers Easypanel deployment
5. ⏳ Waits for container restart (~1min)
6. 🏥 Verifies site is online
7. 📊 Shows deployment summary

## Deployment Flow

Copy this checklist to track progress:

```
Deployment Progress:
- [ ] Step 1: Verify on dev branch
- [ ] Step 2: Check for uncommitted changes
- [ ] Step 3: Commit and push (if needed)
- [ ] Step 4: Wait for GitHub Actions build
- [ ] Step 5: Trigger Easypanel deployment
- [ ] Step 6: Wait for container restart
- [ ] Step 7: Verify site health
- [ ] Step 8: Review deployment summary
```

## Important: Always Verify Push

**Before running deploy script**, ensure all changes are pushed:

```bash
git status              # Check for uncommitted changes
git push origin dev     # Push if needed
```

The script will:
- ✅ Auto-commit and push if it detects changes
- ❌ **NOT push** if you already committed but didn't push

**Best practice:** Let the script handle commits, or manually push before running.

## Configuration

Edit `scripts/deploy-dev.js` to customize:

```javascript
const CONFIG = {
  branch: 'dev',
  easypanel: {
    webhook: 'http://37.60.247.149:3000/api/deploy/...',
    siteUrl: 'https://automatize-nla-portal-dev...',
  },
  timings: {
    buildWait: 180,      // 3 minutes
    deployWait: 60,      // 1 minute
    healthCheckRetries: 3,
  },
};
```

## Troubleshooting

**Common issues and solutions:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Commit message guidelines:** See [COMMIT-GUIDE.md](COMMIT-GUIDE.md)

**Detailed workflow explanation:** See [WORKFLOW.md](WORKFLOW.md)

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | ✅ Success - deployment complete |
| 1 | ❌ Error - check error message |

Health check failures show warning but don't fail deployment.

## Configuration URLs

**Dev Environment:**
- Site: https://automatize-nla-portal-dev.keoloh.easypanel.host/
- GitHub: https://github.com/NLA-Consultoria/nla-consultoria/tree/dev
- Actions: https://github.com/NLA-Consultoria/nla-consultoria/actions
- Easypanel: http://37.60.247.149:3000/

**Expected Timing:**
- GitHub Actions build: ~3 minutes
- Easypanel deployment: ~1 minute
- Total: ~4-5 minutes

## Advanced Usage

See [WORKFLOW.md](WORKFLOW.md) for:
- Manual deployment steps
- Customizing timings
- Using with CI/CD pipelines
- Rollback procedures
