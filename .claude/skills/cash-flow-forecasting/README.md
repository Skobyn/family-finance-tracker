# Cash Flow Forecasting Skill

Predictive analytics and financial planning tools for cash flow management.

## What This Skill Does

Advanced forecasting and planning features:
- ML-based cash flow predictions
- Scenario planning and what-if analysis
- Financial health scoring
- Long-term projections

## Available Tasks

### 1. Build Predictive Cash Flow Model
Creates intelligent cash flow forecasts using historical data.

**Use when:**
- Enhancing forecasting features
- Building predictive analytics
- Improving financial planning tools

**Output:**
- Prediction algorithms
- 30/60/90 day forecasts
- Confidence interval calculations
- Visualization components

### 2. Scenario Planning Tool
Enables what-if financial scenario modeling.

**Use when:**
- Adding planning features
- Building goal simulators
- Creating comparison tools

**Output:**
- Scenario engine
- Interactive builder UI
- Comparison visualizations
- Saved scenario management

### 3. Financial Health Scoring
Calculates comprehensive financial wellness scores.

**Use when:**
- Building health dashboard
- Creating progress tracking
- Providing financial insights

**Output:**
- Scoring algorithm
- Health metrics dashboard
- Improvement recommendations
- Historical tracking

## How to Use

```bash
# In Claude Code:
/skill cash-flow-forecasting
```

## Integration Points

- **Components**: `src/components/dashboard/cash-flow-chart.tsx`
- **Services**: `src/services/analytics-service.ts`
- **Pages**: `src/app/forecasting/page.tsx`
- **Database**: Firestore collections for historical data

## Technical Details

- Uses existing forecasting logic as foundation
- Extends with ML predictions
- Integrates with goal and budget systems
- Requires historical transaction data
