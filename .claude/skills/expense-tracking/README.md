# Expense Tracking Skill

Advanced expense tracking with smart categorization and receipt management.

## What This Skill Does

Provides intelligent expense tracking features:
- Smart automatic categorization
- Receipt scanning and OCR
- Recurring expense detection
- Subscription tracking

## Available Tasks

### 1. Smart Expense Categorization
Automatically categorizes expenses using pattern matching.

**Use when:**
- Improving transaction import
- Building auto-categorization
- Reducing manual data entry

**Output:**
- Categorization engine
- Pattern matching rules
- Learning system for user preferences

### 2. Receipt Scanner & OCR
Extract transaction data from receipt photos.

**Use when:**
- Implementing receipt upload
- Adding OCR functionality
- Linking receipts to transactions

**Output:**
- OCR integration
- Receipt processing service
- Storage and retrieval system

### 3. Detect Recurring Expenses
Identify subscription and recurring charges.

**Use when:**
- Building subscription manager
- Creating spending alerts
- Identifying cost-saving opportunities

**Output:**
- Pattern detection algorithm
- Recurring expense manager
- Alert system

## How to Use

```bash
# In Claude Code:
/skill expense-tracking
```

## Integration Points

- **Services**: `src/services/transaction-service.ts`
- **Components**: `src/components/transactions/`
- **Storage**: Firebase Storage for receipts
- **Database**: Firestore `expenses` collection

## Technical Requirements

- OCR library (Tesseract.js or Cloud Vision API)
- Firebase Storage for receipt images
- Pattern matching algorithms
- Image processing capabilities
