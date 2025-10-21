/**
 * Balance and Financial Profile Service
 * Handles user financial profile and balance operations
 */

import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';

import { db } from '@/lib/firebase-client';
import { FinancialProfile, BalanceAdjustment } from '@/types/financial';

/**
 * Get a user's financial profile
 */
export const getFinancialProfile = async (userId: string): Promise<FinancialProfile | null> => {
  try {
    const docRef = doc(db, 'financialProfiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as FinancialProfile;
    }

    // Create a default profile if not exists
    const defaultProfile: FinancialProfile = {
      userId,
      currentBalance: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD',
      hasCompletedSetup: false
    };

    await setDoc(docRef, defaultProfile);
    return defaultProfile;
  } catch (error) {
    // Return a default profile rather than throwing
    return {
      userId,
      currentBalance: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD',
      hasCompletedSetup: false
    };
  }
};

/**
 * Update a user's current balance
 */
export const updateBalance = async (
  userId: string,
  newBalance: number,
  reason: string
): Promise<FinancialProfile> => {
  try {
    const profileRef = doc(db, 'financialProfiles', userId);
    const profileSnap = await getDoc(profileRef);

    let profile: FinancialProfile;
    let previousBalance = 0;

    if (profileSnap.exists()) {
      profile = profileSnap.data() as FinancialProfile;
      previousBalance = profile.currentBalance;
    } else {
      // Create a default profile if it doesn't exist
      profile = {
        userId,
        currentBalance: 0,
        lastUpdated: new Date().toISOString(),
        currency: 'USD',
        hasCompletedSetup: false
      };
    }

    // Update the profile
    const updatedProfile: FinancialProfile = {
      ...profile,
      currentBalance: newBalance,
      lastUpdated: new Date().toISOString(),
      hasCompletedSetup: true // Mark that setup has begun
    };

    // Use setDoc with merge to handle both create and update
    await setDoc(profileRef, updatedProfile, { merge: true });

    // Create a balance adjustment record
    const adjustmentData: Omit<BalanceAdjustment, 'id'> = {
      userId,
      name: 'Balance Adjustment',
      amount: newBalance - previousBalance,
      previousBalance,
      newBalance,
      reason,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store balance adjustment in user-specific collection
    await addDoc(collection(db, `users/${userId}/balanceAdjustments`), adjustmentData);

    return updatedProfile;
  } catch (error) {
    throw error;
  }
};
