/**
 * Transaction Service (Expenses)
 * Handles all expense/transaction-related operations
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { db } from '@/lib/firebase-client';
import { Expense } from '@/types/financial';

/**
 * Add a new expense
 */
export const addExpense = async (
  expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Expense> => {
  try {
    const now = new Date().toISOString();
    const newExpense: Omit<Expense, 'id'> = {
      ...expense,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    // Use user-specific path
    const docRef = await addDoc(collection(db, `users/${userId}/expenses`), newExpense);
    return { id: docRef.id, ...newExpense };
  } catch (_error) {
    throw error;
  }
};

/**
 * Update an existing expense
 */
export const updateExpense = async (
  expense: Partial<Expense> & { id: string },
  userId: string
): Promise<void> => {
  try {
    const { id, ...data } = expense;
    const expenseRef = doc(db, `users/${userId}/expenses`, id);

    // Verify existence
    const expenseSnap = await getDoc(expenseRef);
    if (!expenseSnap.exists()) {
      throw new Error('Expense not found');
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(expenseRef, updatedData);
  } catch (_error) {
    throw error;
  }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (id: string, userId: string): Promise<void> => {
  try {
    const expenseRef = doc(db, `users/${userId}/expenses`, id);

    // Verify existence
    const expenseSnap = await getDoc(expenseRef);
    if (!expenseSnap.exists()) {
      throw new Error('Expense not found');
    }

    await deleteDoc(expenseRef);
  } catch (_error) {
    throw error;
  }
};

/**
 * Get all expenses for a user
 */
export const getExpenses = async (userId: string): Promise<Expense[]> => {
  try {

    // Try the user-specific path first
    try {
      const expensesQuery = query(
        collection(db, `users/${userId}/expenses`),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(expensesQuery);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      return results;
    } catch (pathError) {

      // Try the global collection as fallback
      const fallbackQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackResults = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));

      // If we found items in the global collection, migrate them to the user-specific path
      if (fallbackResults.length > 0) {

        for (const expense of fallbackResults) {
          const { id, ...data } = expense;
          await setDoc(doc(db, `users/${userId}/expenses`, id), data);
        }
      }

      return fallbackResults;
    }
  } catch (_error) {

    // Return empty array rather than throwing
    return [];
  }
};

/**
 * Add a new expense record (alternative interface)
 */
export const addExpenseRecord = async (
  userId: string,
  expenseData: { name: string; amount: number; category: string; frequency: string }
): Promise<Expense> => {
  try {
    // Create the expense data object
    const now = new Date().toISOString();
    const newExpense: Omit<Expense, 'id'> = {
      userId,
      name: expenseData.name,
      amount: expenseData.amount,
      category: expenseData.category,
      date: now,
      isPlanned: true,
      createdAt: now,
      updatedAt: now,
    };

    // Add to Firestore - using user-specific path
    const docRef = await addDoc(collection(db, `users/${userId}/expenses`), newExpense);

    // Return the complete expense object with id
    return {
      id: docRef.id,
      ...newExpense
    };
  } catch (_error) {
    throw error;
  }
};
