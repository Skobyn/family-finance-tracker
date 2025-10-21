/**
 * Income Service
 * Handles all income-related operations
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
import { Income } from '@/types/financial';

import { calculateNextPaymentDate } from './utils/date-utils';

/**
 * Add a new income record
 */
export const addIncome = async (
  income: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Income> => {
  try {
    const now = new Date().toISOString();
    const newIncome: Omit<Income, 'id'> = {
      ...income,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    // Always use the user-specific path for new incomes
    const docRef = await addDoc(collection(db, `users/${userId}/incomes`), newIncome);
    return { id: docRef.id, ...newIncome };
  } catch (_error) {
    throw error;
  }
};

/**
 * Update an existing income record
 */
export const updateIncome = async (
  income: Partial<Income> & { id: string },
  userId: string
): Promise<void> => {
  try {
    const { id, ...data } = income;
    const incomeRef = doc(db, `users/${userId}/incomes`, id);

    // Verify existence
    const incomeSnap = await getDoc(incomeRef);
    if (!incomeSnap.exists()) {
      throw new Error('Income not found');
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(incomeRef, updatedData);
  } catch (_error) {
    throw error;
  }
};

/**
 * Delete an income record
 */
export const deleteIncome = async (id: string, userId: string): Promise<void> => {
  try {
    const incomeRef = doc(db, `users/${userId}/incomes`, id);

    // Verify existence
    const incomeSnap = await getDoc(incomeRef);
    if (!incomeSnap.exists()) {
      throw new Error('Income not found');
    }

    await deleteDoc(incomeRef);
  } catch (_error) {
    throw error;
  }
};

/**
 * Get all income records for a user
 */
export const getIncomes = async (userId: string): Promise<Income[]> => {
  try {

    // Try the user-specific path first
    try {
      const incomesQuery = query(
        collection(db, `users/${userId}/incomes`),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(incomesQuery);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income));
      return results;
    } catch (pathError) {

      // Try the global collection as fallback
      const fallbackQuery = query(
        collection(db, 'incomes'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackResults = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income));

      // If we found items in the global collection, migrate them to the user-specific path
      if (fallbackResults.length > 0) {

        for (const income of fallbackResults) {
          const { id, ...data } = income;
          await setDoc(doc(db, `users/${userId}/incomes`, id), data);
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
 * Add a new income record (alternative interface)
 */
export const addIncomeRecord = async (
  userId: string,
  incomeData: {
    name: string;
    amount: number;
    frequency: 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually'
  }
): Promise<Income> => {
  try {
    // Create the income data object
    const now = new Date().toISOString();
    const newIncome: Omit<Income, 'id'> = {
      userId,
      name: incomeData.name,
      amount: incomeData.amount,
      frequency: incomeData.frequency,
      date: now,
      category: 'Other', // Default category
      isRecurring: incomeData.frequency !== 'once',
      nextDate: incomeData.frequency !== 'once' ? calculateNextPaymentDate(now, incomeData.frequency) : undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Add to Firestore - using user-specific path
    const docRef = await addDoc(collection(db, `users/${userId}/incomes`), newIncome);

    // Return the complete income object with id
    return {
      id: docRef.id,
      ...newIncome
    };
  } catch (_error) {
    throw error;
  }
};
