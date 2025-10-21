# Deployment Checklist Skill

Comprehensive production deployment validation and monitoring setup.

## What This Skill Does

Ensures production readiness:
- Pre-deployment validation
- Deployment documentation
- Monitoring and alerting setup
- Incident response procedures

## Available Tasks

### 1. Run Pre-Deployment Audit
Validates application is ready for production.

**Use when:**
- Before first deployment
- Before major releases
- After significant changes

**Output:**
- Security audit results
- Code quality metrics
- Environment validation
- Build verification
- Comprehensive audit report

### 2. Create Deployment Guide
Documents the deployment process.

**Use when:**
- Setting up deployment pipeline
- Onboarding new team members
- Documenting procedures

**Output:**
- Step-by-step deployment guide
- Environment setup instructions
- Rollback procedures
- Troubleshooting guide

### 3. Set Up Production Monitoring
Configures error and performance tracking.

**Use when:**
- Preparing for production
- Adding observability
- Setting up alerts

**Output:**
- Sentry integration
- Performance monitoring
- Alert configuration
- Monitoring dashboard

## How to Use

```bash
# In Claude Code:
/skill deployment-checklist
```

## Pre-Deployment Checklist

### Security
- [ ] Firestore rules in production mode
- [ ] All API routes authenticated
- [ ] Rate limiting applied
- [ ] No secrets in code
- [ ] CSP headers configured

### Code Quality
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Tests pass (80%+ coverage)
- [ ] No console statements
- [ ] Build succeeds

### Environment
- [ ] All env vars documented
- [ ] Production env vars set
- [ ] Firebase configured
- [ ] Third-party integrations tested

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading configured

## Integration Points

- **Deployment**: Netlify
- **Monitoring**: Sentry (recommended)
- **Analytics**: Web Vitals
- **Logs**: Firebase/Netlify logs
