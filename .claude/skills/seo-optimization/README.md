# SEO Optimization Skill

Comprehensive SEO, metadata, and accessibility optimization.

## What This Skill Does

Improves discoverability and accessibility:
- SEO auditing and optimization
- Metadata implementation
- Accessibility compliance (WCAG)
- Social media optimization

## Available Tasks

### 1. Run SEO Audit
Analyzes SEO status and provides recommendations.

**Use when:**
- Before launching publicly
- Regular SEO reviews
- After major content changes

**Output:**
- SEO audit report
- Technical SEO analysis
- Content recommendations
- Improvement checklist

### 2. Implement Metadata System
Adds comprehensive metadata to all pages.

**Use when:**
- Setting up new pages
- Improving social sharing
- Optimizing for search engines

**Output:**
- Metadata utility functions
- Page-specific metadata
- Open Graph/Twitter Cards
- Structured data (JSON-LD)
- Sitemap generation

### 3. Accessibility Audit & Fixes
Ensures WCAG 2.1 Level AA compliance.

**Use when:**
- Before public launch
- Compliance requirements
- Improving user experience

**Output:**
- Accessibility audit report
- ARIA implementation
- Keyboard navigation fixes
- Screen reader compatibility
- WCAG compliance certification

## How to Use

```bash
# In Claude Code:
/skill seo-optimization
```

## SEO Checklist

### Technical SEO
- [ ] Meta tags on all pages
- [ ] Open Graph implemented
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Canonical URLs set
- [ ] Mobile responsive
- [ ] Fast page loads (<3s)

### Content SEO
- [ ] Proper heading hierarchy
- [ ] Descriptive page titles
- [ ] Unique meta descriptions
- [ ] Alt text on images
- [ ] Internal linking structure

### Accessibility
- [ ] WCAG 2.1 Level AA compliant
- [ ] ARIA labels present
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Focus indicators visible

## Tools

- **Lighthouse**: SEO & Accessibility scores
- **axe DevTools**: Accessibility testing
- **WAVE**: Web accessibility evaluation
- **Google Search Console**: SEO monitoring

## Integration Points

- **Metadata**: Next.js `metadata` API
- **Sitemap**: `sitemap.xml` generation
- **Robots**: `robots.txt` configuration
- **Structured Data**: JSON-LD scripts
