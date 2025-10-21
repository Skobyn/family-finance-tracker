import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

import { useAuth } from '@/providers/firebase-auth-provider';

import { auth } from './firebase-client';

export {
  auth,
  useAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return auth?.currentUser !== null;
};

// Helper function to get current user
export const getCurrentUser = () => {
  return auth?.currentUser;
}; 