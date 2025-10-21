import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Helper to setup user-event with default configuration
 */
export const setupUser = () => {
  return userEvent.setup()
}

/**
 * Helper to wait for an element to be removed
 */
export const waitForElementToBeRemoved = async (
  callback: () => HTMLElement | null,
  options?: Parameters<typeof waitFor>[1]
) => {
  return waitFor(() => {
    const element = callback()
    if (element) {
      throw new Error('Element is still in the document')
    }
  }, options)
}

/**
 * Helper to wait for loading to complete
 */
export const waitForLoadingToFinish = async () => {
  await waitForElementToBeRemoved(
    () => screen.queryByRole('status', { name: /loading/i }),
    { timeout: 3000 }
  )
}

/**
 * Helper to simulate async delay
 */
export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Helper to create mock data
 */
export const createMockTransaction = (overrides = {}) => ({
  id: 'mock-transaction-id',
  userId: 'mock-user-id',
  amount: 100,
  category: 'Food',
  description: 'Test transaction',
  date: new Date().toISOString(),
  type: 'expense' as const,
  ...overrides,
})

export const createMockBill = (overrides = {}) => ({
  id: 'mock-bill-id',
  userId: 'mock-user-id',
  name: 'Test Bill',
  amount: 50,
  dueDate: new Date().toISOString(),
  category: 'Utilities',
  recurring: true,
  frequency: 'monthly' as const,
  ...overrides,
})

export const createMockGoal = (overrides = {}) => ({
  id: 'mock-goal-id',
  userId: 'mock-user-id',
  name: 'Test Goal',
  targetAmount: 1000,
  currentAmount: 250,
  deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Savings',
  ...overrides,
})

/**
 * Helper to assert element accessibility
 */
export const assertAccessibility = (element: HTMLElement) => {
  // Check for ARIA attributes
  const role = element.getAttribute('role')
  const ariaLabel = element.getAttribute('aria-label')
  const ariaLabelledBy = element.getAttribute('aria-labelledby')

  if (!role && !ariaLabel && !ariaLabelledBy) {
    console.warn('Element may have accessibility issues - no role or aria-label found')
  }

  return {
    role,
    ariaLabel,
    ariaLabelledBy,
  }
}

/**
 * Helper to test keyboard navigation
 */
export const testKeyboardNavigation = async (
  element: HTMLElement,
  key: string,
  expectedAction: () => void | Promise<void>
) => {
  const user = setupUser()
  element.focus()
  await user.keyboard(`{${key}}`)
  await expectedAction()
}
