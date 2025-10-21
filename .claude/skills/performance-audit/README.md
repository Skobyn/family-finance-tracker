# Performance Audit Skill

Comprehensive performance analysis and optimization for production applications.

## What This Skill Does

Performance optimization toolkit:
- Lighthouse performance audits
- Bundle size optimization
- Database query optimization
- Performance monitoring

## Available Tasks

### 1. Run Lighthouse Performance Audit
Analyzes Core Web Vitals and performance metrics.

**Use when:**
- Before production deployment
- After major changes
- Regular performance reviews

**Output:**
- Lighthouse scores
- Core Web Vitals analysis
- Performance recommendations
- Performance budgets
- Detailed audit report

### 2. Optimize Bundle Size
Reduces JavaScript bundle size for faster loading.

**Use when:**
- Bundle size exceeds budgets
- Adding heavy dependencies
- Optimizing load times

**Output:**
- Bundle analysis report
- Size reduction strategies
- Code splitting implementation
- Bundle size budgets
- CI integration

### 3. Optimize Database Performance
Improves Firestore query efficiency.

**Use when:**
- Experiencing slow queries
- Scaling user base
- Adding complex features

**Output:**
- Query optimization
- Index configuration
- Caching strategy
- Performance benchmarks
- Best practices guide

## How to Use

```bash
# In Claude Code:
/skill performance-audit
```

## Performance Targets

### Lighthouse Scores
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >90

### Core Web Vitals
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

### Bundle Size
- Initial JS: <200KB gzipped
- Total page weight: <500KB
- Number of requests: <50

## Tools

- **Lighthouse**: Performance auditing
- **Bundle Analyzer**: Size analysis
- **React DevTools**: Component profiling
- **Chrome DevTools**: Network analysis

## Integration Points

- **Build**: `next.config.mjs`
- **Bundle**: `@next/bundle-analyzer`
- **Database**: Firestore indexes
- **Monitoring**: Web Vitals
