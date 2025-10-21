/**
 * Budget Service
 * Handles all budget-related operations
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from '@/lib/firebase-client';
import { Budget } from '@/types/financial';

/**
 * Add a new budget
 */
export const addBudget = async (budget: any, userId: string): Promise<any> => {
  try {
    const now = new Date().toISOString();
    const newBudget = {
      ...budget,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, `users/${userId}/budgets`), newBudget);
    return { id: docRef.id, ...newBudget };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing budget
 */
export const updateBudget = async (budget: any & { id: string }, userId: string): Promise<void> => {
  try {
    const { id, ...data } = budget;
    const budgetRef = doc(db, `users/${userId}/budgets`, id);

    // Verify ownership
    const budgetSnap = await getDoc(budgetRef);
    if (!budgetSnap.exists()) {
      throw new Error('Budget not found');
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(budgetRef, updatedData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a budget
 */
export const deleteBudget = async (id: string, userId: string): Promise<void> => {
  try {
    const budgetRef = doc(db, `users/${userId}/budgets`, id);

    // Verify existence
    const budgetSnap = await getDoc(budgetRef);
    if (!budgetSnap.exists()) {
      throw new Error('Budget not found');
    }

    await deleteDoc(budgetRef);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all budgets for a user
 */
export const getBudgets = async (userId: string): Promise<any[]> => {
  try {
    const budgetsQuery = query(
      collection(db, `users/${userId}/budgets`),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(budgetsQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Return empty array if collection doesn't exist yet
    if ((error as any)?.code === 'resource-exhausted') {
      return [];
    }

    throw error;
  }
};
