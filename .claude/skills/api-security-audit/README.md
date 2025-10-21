# API Security Audit Skill

Comprehensive security auditing and hardening for API routes.

## What This Skill Does

Provides security analysis and implementation:
- Vulnerability scanning of API routes
- Authentication middleware implementation
- Rate limiting integration
- Security best practices enforcement

## Available Tasks

### 1. Scan API Routes for Vulnerabilities
Performs automated security audit of all API endpoints.

**Use when:**
- Preparing for production
- After adding new API routes
- Conducting security reviews

**Output:**
- Comprehensive security audit report
- List of vulnerabilities found
- Prioritized remediation plan
- Code examples for fixes

### 2. Implement Authentication Middleware
Creates robust authentication layer for APIs.

**Use when:**
- Securing API endpoints
- Adding access control
- Implementing role-based permissions

**Output:**
- Authentication middleware
- JWT validation logic
- Role-based access control
- Usage documentation

### 3. Apply Rate Limiting to All Routes
Integrates rate limiting across the API.

**Use when:**
- Preventing API abuse
- Protecting against DoS attacks
- Enforcing usage limits

**Output:**
- Rate limiter integration
- Per-route limit configuration
- Testing and validation
- API documentation updates

## How to Use

```bash
# In Claude Code:
/skill api-security-audit
```

## Security Checklist

- [ ] All routes have authentication
- [ ] Input validation on all endpoints
- [ ] Rate limiting applied
- [ ] Error messages don't leak info
- [ ] CORS properly configured
- [ ] Sensitive data encrypted
- [ ] Security headers present

## Integration Points

- **API Routes**: `src/app/api/**`
- **Middleware**: `src/middleware/`
- **Auth**: Firebase Authentication
- **Rate Limiting**: `src/middleware/rate-limit.ts`
