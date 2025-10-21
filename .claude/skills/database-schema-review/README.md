# Database Schema Review Skill

Comprehensive Firestore schema validation, optimization, and security auditing.

## What This Skill Does

Database review and optimization:
- Schema validation and consistency
- Query optimization and indexing
- Security rules auditing
- Performance analysis

## Available Tasks

### 1. Validate Firestore Schema
Reviews database schema for best practices.

**Use when:**
- Adding new collections
- Refactoring data models
- Preparing for scale

**Output:**
- Schema validation report
- Consistency findings
- Improvement recommendations
- Updated schema documentation

### 2. Optimize Database Queries
Improves query performance and efficiency.

**Use when:**
- Experiencing slow queries
- Adding complex features
- Scaling the application

**Output:**
- Index configuration
- Query optimization
- Pagination implementation
- Performance benchmarks

### 3. Audit Firestore Security Rules
Reviews security rules for vulnerabilities.

**Use when:**
- Before production deployment
- After schema changes
- Security compliance reviews

**Output:**
- Security audit report
- Rule test suite
- Vulnerability findings
- Hardening recommendations

## How to Use

```bash
# In Claude Code:
/skill database-schema-review
```

## Review Checklist

- [ ] Schema is normalized appropriately
- [ ] Indexes are properly defined
- [ ] Security rules enforce isolation
- [ ] Queries are optimized
- [ ] Data validation in rules
- [ ] No data leakage possible

## Integration Points

- **Schema**: `firestore/schema.md`
- **Rules**: `firestore.rules`
- **Indexes**: `firestore.indexes.json`
- **Services**: `src/services/**`

## Firebase Emulator

Test rules locally:
```bash
firebase emulators:start
```
