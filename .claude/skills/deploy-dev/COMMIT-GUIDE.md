# Commit Message Guidelines

Best practices for writing clear, useful commit messages.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

**Simple:**
```
fix(clarity): resolve script loading issue
```

**With body:**
```
feat(deploy): add automated deployment script

Automates commit, push, build wait, and deployment trigger.
Includes health checks and detailed progress reporting.
```

**With footer:**
```
fix(docker): correct git SHA in logs

Git commit was showing as "undefin" due to substring
on undefined value from GitHub Actions.

Fixes #123
```

## Type

Must be one of:

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add JWT authentication` |
| `fix` | Bug fix | `fix(form): validate email format` |
| `docs` | Documentation | `docs(readme): update installation steps` |
| `style` | Code style (formatting, no logic change) | `style(css): fix indentation` |
| `refactor` | Code refactor (no feat/fix) | `refactor(api): simplify error handling` |
| `perf` | Performance improvement | `perf(images): lazy load thumbnails` |
| `test` | Add/update tests | `test(login): add unit tests` |
| `build` | Build system/dependencies | `build(deps): upgrade next to 14.2.5` |
| `ci` | CI/CD changes | `ci(actions): add dev environment workflow` |
| `chore` | Maintenance tasks | `chore(deps): update lock file` |
| `revert` | Revert previous commit | `revert: revert "feat: add feature X"` |

## Scope (Optional)

Component affected by change:

- `auth` - Authentication
- `api` - API endpoints
- `ui` - User interface
- `forms` - Form components
- `deploy` - Deployment system
- `docker` - Docker configuration
- `clarity` - Analytics (Clarity)
- `logs` - Logging system

## Subject

- Use **imperative mood**: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at end
- Max 50 characters
- Clear and specific

**Good:**
```
fix(clarity): resolve script loading issue
feat(deploy): add automated deployment
refactor(logs): use environment variables
```

**Bad:**
```
Fixed bug                          (vague)
Added new feature.                 (period, not imperative)
Updated the deployment script      (not imperative)
```

## Body (Optional but Recommended)

- Explain **what** and **why**, not **how**
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

**Example:**
```
feat(deploy): add automated deployment script

Automates the complete deployment workflow:
- Commits and pushes changes
- Waits for GitHub Actions build
- Triggers Easypanel deployment
- Verifies site health

Reduces manual steps from 7 to 1 command.
```

## Footer (Optional)

### Breaking Changes

```
feat(api): change auth token format

BREAKING CHANGE: Auth tokens now use JWT format.
Old token format no longer supported.
```

### Issue References

```
fix(forms): validate phone number format

Fixes #42
Closes #38
See also #40
```

### Co-authorship

Used by deploy script:
```
feat(deploy): add health check

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Real Project Examples

### Feature Addition
```
feat(clarity): implement event tracking system

Add comprehensive Clarity analytics:
- CTA click tracking by location
- Form funnel (open, steps, abandonment)
- Lead qualification tags
- User identification

Enables conversion optimization and UX analysis.
```

### Bug Fix
```
fix(docker): correct git SHA display in logs

Git commit showed as "undefin" instead of SHA.

Issue: GitHub Actions passed undefined value,
script did substring(0,7) on "undefined" string.

Solution: Prepare GIT_SHA_SHORT in workflow before
passing to build args.
```

### Refactor
```
refactor(clarity): change to runtime script injection

Replace npm package with inline script to enable
runtime configuration without rebuild.

Benefits:
- Configure CLARITY_ID in Easypanel (no rebuild)
- Consistent with Meta Pixel approach
- Reduces bundle size (-17KB)
```

### Documentation
```
docs(deploy): add troubleshooting guide

Create comprehensive troubleshooting documentation
covering common deployment issues and solutions.

Includes:
- Build timing issues
- Webhook failures
- Health check problems
- Rollback procedures
```

## Commit Frequency

### Do Commit:
- ✅ Logical units of work
- ✅ Working state (tests pass)
- ✅ One concern per commit
- ✅ Before switching tasks

### Don't Commit:
- ❌ Half-finished features (unless WIP)
- ❌ Broken code
- ❌ Multiple unrelated changes
- ❌ Just to save work (use stash)

## Commit Message Templates

### Feature Template
```
feat(<scope>): <what you added>

<Why you added it>
<What it enables>

<Optional: technical details>
```

### Fix Template
```
fix(<scope>): <what was broken>

<How it was broken>
<How you fixed it>

Fixes #<issue-number>
```

### Refactor Template
```
refactor(<scope>): <what you changed>

<Why you changed it>
<Benefits of the change>
```

## Tools

### Check commit message
```bash
# See last commit
git log -1

# Amend last commit message (if not pushed)
git commit --amend
```

### Conventional Commits Checker
```bash
# Install
npm install -g @commitlint/cli @commitlint/config-conventional

# Check last commit
echo "feat: new feature" | commitlint
```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Semantic Versioning](https://semver.org/)

## Quick Reference

```bash
# Feature
feat(scope): add new capability

# Fix
fix(scope): resolve specific issue

# Docs
docs(scope): update documentation

# Refactor
refactor(scope): improve code structure

# Performance
perf(scope): optimize specific operation

# Tests
test(scope): add/update tests
```
