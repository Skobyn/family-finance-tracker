/**
 * Financial Service - Main Entry Point
 *
 * This file re-exports all financial service modules for backward compatibility.
 * Import from specific service modules for better tree-shaking and code organization.
 *
 * Service modules:
 * - balance-service: Financial profile and balance operations
 * - income-service: Income management
 * - bill-service: Bill tracking and payments
 * - transaction-service: Expense/transaction operations
 * - budget-service: Budget management
 * - goal-service: Financial goal tracking
 * - utils/date-utils: Date calculation utilities
 */

// Re-export all balance/profile operations
export {
  getFinancialProfile,
  updateBalance,
} from './balance-service';

// Re-export all income operations
export {
  addIncome,
  updateIncome,
  deleteIncome,
  getIncomes,
  addIncomeRecord,
} from './income-service';

// Re-export all bill operations
export {
  addBill,
  updateBill,
  deleteBill,
  getBills,
  markBillAsPaid,
} from './bill-service';

// Re-export all expense/transaction operations
export {
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  addExpenseRecord,
} from './transaction-service';

// Re-export all budget operations
export {
  addBudget,
  updateBudget,
  deleteBudget,
  getBudgets,
} from './budget-service';

// Re-export all goal operations
export {
  addGoal,
  updateGoal,
  deleteGoal,
  getGoals,
} from './goal-service';

// Re-export utility functions
export {
  toISOString,
  calculateNextPaymentDate,
} from './utils/date-utils';
