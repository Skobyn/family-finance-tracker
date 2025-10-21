/**
 * Goal Service
 * Handles all financial goal-related operations
 */

import { db } from '@/lib/firebase-client';
import { Goal } from '@/types/financial';
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

/**
 * Add a new goal
 */
export const addGoal = async (
  goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Goal> => {
  try {
    const now = new Date().toISOString();
    const newGoal: Omit<Goal, 'id'> = {
      ...goal,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    // Use user-specific path
    const docRef = await addDoc(collection(db, `users/${userId}/goals`), newGoal);
    return { id: docRef.id, ...newGoal };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing goal
 */
export const updateGoal = async (
  goal: Partial<Goal> & { id: string },
  userId: string
): Promise<void> => {
  try {
    const { id, ...data } = goal;
    const goalRef = doc(db, `users/${userId}/goals`, id);

    // Verify existence
    const goalSnap = await getDoc(goalRef);
    if (!goalSnap.exists()) {
      throw new Error('Goal not found');
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(goalRef, updatedData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a goal
 */
export const deleteGoal = async (id: string, userId: string): Promise<void> => {
  try {
    const goalRef = doc(db, `users/${userId}/goals`, id);

    // Verify existence
    const goalSnap = await getDoc(goalRef);
    if (!goalSnap.exists()) {
      throw new Error('Goal not found');
    }

    await deleteDoc(goalRef);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all goals for a user
 */
export const getGoals = async (userId: string): Promise<Goal[]> => {
  try {

    // Try the user-specific path first
    try {
      const goalsQuery = query(
        collection(db, `users/${userId}/goals`),
        orderBy('targetDate', 'asc')
      );

      const querySnapshot = await getDocs(goalsQuery);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      return results;
    } catch (pathError) {

      // Try the global collection as fallback
      const fallbackQuery = query(
        collection(db, 'goals'),
        where('userId', '==', userId),
        orderBy('targetDate', 'asc')
      );

      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackResults = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));

      // If we found items in the global collection, migrate them to the user-specific path
      if (fallbackResults.length > 0) {

        for (const goal of fallbackResults) {
          const { id, ...data } = goal;
          await setDoc(doc(db, `users/${userId}/goals`, id), data);
        }
      }

      return fallbackResults;
    }
  } catch (error) {

    // Return empty array rather than throwing
    return [];
  }
};
