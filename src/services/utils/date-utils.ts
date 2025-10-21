/**
 * Date utility functions for financial calculations
 */

/**
 * Convert a date to ISO string format
 */
export const toISOString = (date: Date | string): string => {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
};

/**
 * Calculate the next payment date based on frequency
 */
export function calculateNextPaymentDate(
  fromDate: string,
  frequency: 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually'
): string {
  const date = new Date(fromDate);

  switch (frequency.toLowerCase()) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'annually':
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      // For 'once' or any other value, don't set a next date
      return '';
  }

  return date.toISOString();
}
