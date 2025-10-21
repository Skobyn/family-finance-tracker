/**
 * Bill Service
 * Handles all bill-related operations
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
import { Bill } from '@/types/financial';

/**
 * Add a new bill
 */
export const addBill = async (
  bill: Omit<Bill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Bill> => {
  try {
    const now = new Date().toISOString();
    const newBill: Omit<Bill, 'id'> = {
      ...bill,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    // Use user-specific path
    const docRef = await addDoc(collection(db, `users/${userId}/bills`), newBill);
    return { id: docRef.id, ...newBill };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing bill
 */
export const updateBill = async (
  bill: Partial<Bill> & { id: string },
  userId: string
): Promise<void> => {
  try {
    const { id, ...data } = bill;
    const billRef = doc(db, `users/${userId}/bills`, id);

    // Verify existence
    const billSnap = await getDoc(billRef);
    if (!billSnap.exists()) {
      throw new Error('Bill not found');
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(billRef, updatedData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a bill
 */
export const deleteBill = async (id: string, userId: string): Promise<void> => {
  try {
    const billRef = doc(db, `users/${userId}/bills`, id);

    // Verify existence
    const billSnap = await getDoc(billRef);
    if (!billSnap.exists()) {
      throw new Error('Bill not found');
    }

    await deleteDoc(billRef);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all bills for a user
 */
export const getBills = async (userId: string): Promise<Bill[]> => {
  try {

    // Try the user-specific path first
    try {
      const billsQuery = query(
        collection(db, `users/${userId}/bills`),
        orderBy('dueDate', 'asc')
      );

      const querySnapshot = await getDocs(billsQuery);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
      return results;
    } catch (pathError) {

      // Try the global collection as fallback
      const fallbackQuery = query(
        collection(db, 'bills'),
        where('userId', '==', userId),
        orderBy('dueDate', 'asc')
      );

      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackResults = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));

      // If we found items in the global collection, migrate them to the user-specific path
      if (fallbackResults.length > 0) {

        for (const bill of fallbackResults) {
          const { id, ...data } = bill;
          await setDoc(doc(db, `users/${userId}/bills`, id), data);
        }
      }

      return fallbackResults;
    }
  } catch (error) {

    // Return empty array rather than throwing
    return [];
  }
};

/**
 * Mark a bill as paid
 */
export const markBillAsPaid = async (
  id: string,
  userId: string,
  paidDate?: string
): Promise<void> => {
  try {
    const billRef = doc(db, `users/${userId}/bills`, id);

    // Verify existence
    const billSnap = await getDoc(billRef);
    if (!billSnap.exists()) {
      throw new Error('Bill not found');
    }

    const updateData = {
      isPaid: true,
      paidDate: paidDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await updateDoc(billRef, updateData);

    // If this is a recurring bill, create the next instance
    const billData = billSnap.data() as Bill;
    if (billData.isRecurring && billData.frequency !== 'once') {
      // Calculate next due date based on frequency
      const nextDate = new Date(billData.dueDate);

      switch (billData.frequency) {
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'biweekly':
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'annually':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      // Update next due date
      await updateDoc(billRef, {
        nextDueDate: nextDate.toISOString()
      });
    }
  } catch (error) {
    throw error;
  }
};
