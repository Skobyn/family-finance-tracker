# Financial Budgeting Skill

Comprehensive budgeting workflows for the family-finance-tracker application.

## What This Skill Does

Provides end-to-end budgeting functionality including:
- Popular budget template generation (50/30/20, Zero-Based, Envelope System)
- Spending pattern analysis
- AI-powered budget recommendations
- Visual analytics and insights

## Available Tasks

### 1. Create Budget Template
Generates budget templates based on proven methodologies.

**Use when:**
- Adding new budget creation features
- Implementing budget templates
- Helping users start budgeting

**Output:**
- Budget template TypeScript types
- Template data structures
- UI components for template selection

### 2. Analyze Spending Patterns
Creates analytics for user spending behavior.

**Use when:**
- Building analytics features
- Creating insights dashboard
- Implementing trend analysis

**Output:**
- Analytics service module
- Visualization components
- Trend analysis algorithms

### 3. Generate Budget Recommendations
AI-powered recommendations based on user data.

**Use when:**
- Adding smart features
- Helping users optimize budgets
- Creating personalized insights

**Output:**
- Recommendation engine
- Alert system for overspending
- Actionable improvement suggestions

## How to Use

Invoke this skill when working on budgeting features:

```bash
# In Claude Code, use:
/skill financial-budgeting
```

Or invoke specific tasks programmatically.

## Integration Points

- **Services**: `src/services/budget-service.ts`
- **Components**: `src/components/budgets/`
- **Pages**: `src/app/budgets/page.tsx`
- **Database**: Firestore `budgets` collection

## Dependencies

- Existing budget service
- Firestore database
- Chart components (recharts)
- TypeScript types
