# Family Finance Tracker - Skills Library

Comprehensive collection of reusable workflows and automation for the family-finance-tracker project.

## 📚 Skills Overview

This project includes **9 specialized skills** across 3 categories to accelerate development, ensure quality, and optimize production readiness.

---

## 💰 Financial Dashboard Skills

### 1. [financial-budgeting](./financial-budgeting/)
Budget templates, analysis, and AI-powered recommendations.

**Use Cases:**
- Creating budget templates (50/30/20, Zero-Based, Envelope)
- Analyzing spending patterns
- Generating personalized budget recommendations

**Key Tasks:**
- Create budget templates
- Analyze spending patterns
- Generate budget recommendations

---

### 2. [expense-tracking](./expense-tracking/)
Smart expense categorization and receipt management.

**Use Cases:**
- Automatic expense categorization
- Receipt scanning with OCR
- Recurring expense detection

**Key Tasks:**
- Smart categorization engine
- Receipt scanner & OCR
- Recurring expense detection

---

### 3. [cash-flow-forecasting](./cash-flow-forecasting/)
Predictive analytics and financial planning tools.

**Use Cases:**
- ML-based cash flow predictions
- Scenario planning and what-if analysis
- Financial health scoring

**Key Tasks:**
- Build predictive models
- Create scenario planning tools
- Generate financial health scores

---

## 🔧 Development Workflow Skills

### 4. [api-security-audit](./api-security-audit/)
Comprehensive API security auditing and hardening.

**Use Cases:**
- Security vulnerability scanning
- Authentication middleware implementation
- Rate limiting integration

**Key Tasks:**
- Scan API routes for vulnerabilities
- Implement auth middleware
- Apply rate limiting

---

### 5. [component-testing](./component-testing/)
Automated testing with Jest and React Testing Library.

**Use Cases:**
- Setting up testing infrastructure
- Writing component tests
- Unit testing services

**Key Tasks:**
- Set up Jest framework
- Test critical components
- Unit test service modules

---

### 6. [database-schema-review](./database-schema-review/)
Firestore schema validation and optimization.

**Use Cases:**
- Schema validation and consistency
- Query optimization
- Security rules auditing

**Key Tasks:**
- Validate Firestore schema
- Optimize database queries
- Audit security rules

---

## 🚀 Production Readiness Skills

### 7. [deployment-checklist](./deployment-checklist/)
Pre-deployment validation and monitoring setup.

**Use Cases:**
- Pre-deployment audits
- Creating deployment guides
- Setting up monitoring

**Key Tasks:**
- Run pre-deployment audit
- Create deployment guide
- Set up production monitoring

---

### 8. [performance-audit](./performance-audit/)
Performance analysis and optimization.

**Use Cases:**
- Lighthouse audits
- Bundle size optimization
- Database performance tuning

**Key Tasks:**
- Run Lighthouse audit
- Optimize bundle size
- Improve database performance

---

### 9. [seo-optimization](./seo-optimization/)
SEO, metadata, and accessibility optimization.

**Use Cases:**
- SEO auditing
- Metadata implementation
- WCAG accessibility compliance

**Key Tasks:**
- Run SEO audit
- Implement metadata system
- Accessibility audit & fixes

---

## 🎯 Quick Start Guide

### Using Skills

**Option 1: Via Skill Tool (Recommended)**
```typescript
// In Claude Code, invoke a skill:
Skill("financial-budgeting")
Skill("api-security-audit")
Skill("deployment-checklist")
```

**Option 2: Direct Task Execution**
```typescript
// Execute specific task from a skill:
Task({
  subagent_type: "general-purpose",
  description: "Create budget template",
  prompt: // Load from skill.json task prompt
})
```

### Skill Structure

Each skill contains:
- `skill.json` - Skill metadata and task definitions
- `README.md` - Documentation and usage guide

### Task Format

Each task includes:
- **ID**: Unique task identifier
- **Name**: Human-readable task name
- **Description**: Brief task summary
- **Prompt**: Detailed instructions for execution
- **Agent Type**: Recommended agent type

---

## 📊 Skills by Category

### Financial (3 skills)
1. financial-budgeting
2. expense-tracking
3. cash-flow-forecasting

### Development (3 skills)
4. api-security-audit
5. component-testing
6. database-schema-review

### Production (3 skills)
7. deployment-checklist
8. performance-audit
9. seo-optimization

---

## 🛠️ Development Workflow Examples

### Pre-Production Checklist
```bash
1. /skill api-security-audit        # Security review
2. /skill component-testing          # Ensure tests pass
3. /skill performance-audit          # Optimize performance
4. /skill seo-optimization           # SEO compliance
5. /skill deployment-checklist       # Final validation
```

### Feature Development
```bash
1. /skill database-schema-review     # Validate schema
2. /skill component-testing          # Write tests
3. /skill api-security-audit         # Secure endpoints
```

### Financial Features
```bash
1. /skill financial-budgeting        # Budget templates
2. /skill expense-tracking           # Smart categorization
3. /skill cash-flow-forecasting      # Predictions
```

---

## 📝 Creating New Skills

To add a new skill:

1. Create directory in `.claude/skills/[skill-name]/`
2. Add `skill.json`:
```json
{
  "name": "skill-name",
  "version": "1.0.0",
  "description": "Skill description",
  "category": "financial|development|production",
  "tags": ["tag1", "tag2"],
  "author": "Your Name",
  "tasks": [
    {
      "id": "task-id",
      "name": "Task Name",
      "description": "Task description",
      "prompt": "Detailed task instructions",
      "agentType": "general-purpose"
    }
  ]
}
```
3. Add `README.md` with usage documentation
4. Update this master README

---

## 🔗 Integration with Project

### Service Layer
Skills integrate with:
- `src/services/` - Business logic modules
- `src/lib/` - Utility functions
- `src/middleware/` - API middleware

### Database
- Firestore collections and schema
- `firestore.rules` security rules
- `firestore.indexes.json` query optimization

### Testing
- Jest configuration
- Test utilities in `src/test-utils/`
- Coverage reporting

### Deployment
- Netlify configuration
- Environment variables
- Monitoring setup

---

## 📚 Documentation

Each skill includes:
- **README.md**: Usage guide and examples
- **skill.json**: Formal task definitions
- **Integration points**: Where skill connects to project
- **Best practices**: Recommended patterns

---

## 🎉 Getting Started

**Most Common Workflows:**

1. **Starting a new feature?**
   → Use `database-schema-review` + `component-testing`

2. **Building financial tools?**
   → Use `financial-budgeting` + `expense-tracking` + `cash-flow-forecasting`

3. **Preparing for production?**
   → Use `deployment-checklist` + `performance-audit` + `seo-optimization`

4. **Security concerns?**
   → Use `api-security-audit` + `database-schema-review`

---

## 🆘 Support

For issues or questions about skills:
1. Check the skill's README.md
2. Review task prompts in skill.json
3. Consult project documentation in `/docs`

---

**Skills Version**: 1.0.0
**Last Updated**: 2025-10-21
**Total Skills**: 9
**Total Tasks**: 27
