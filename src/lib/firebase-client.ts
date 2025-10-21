import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { validateFirebaseEnvironment } from './env-validation';

// Validate Firebase environment variables before initialization
// This will throw descriptive errors if any required variables are missing
let firebaseConfig;
try {
  const validatedConfig = validateFirebaseEnvironment();
  firebaseConfig = validatedConfig;
} catch (_error) {
  // Re-throw to prevent initialization with invalid config
  throw error;
}

// Initialize Firebase in a way that's safe for both client and server
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

// Initialize Firebase
if (typeof window !== 'undefined') {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    // Initialize Firestore
    db = getFirestore(app);

    // Initialize Authentication with local persistence
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // TODO: Implement proper error handling for persistence
    });

    // Initialize Analytics when possible
    isSupported()
      .then(supported => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })
      .catch(() => {
        // Analytics initialization failed silently
      });
  } catch (_error) {
    throw error;
  }
} else {
  // Dummy implementations for SSR
  //@ts-ignore - these are placeholders for SSR
  app = {} as FirebaseApp;
  //@ts-ignore - these are placeholders for SSR
  db = {} as Firestore;
  //@ts-ignore - these are placeholders for SSR
  auth = {} as Auth;
}

export { db, auth, analytics };

// Helper functions for common database operations
export const getCurrentUser = async (): Promise<User | null> => {
  if (!auth) return null;
  
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const getUserProfile = async (userId: string) => {
  if (!db) return null;

  try {
    // Import dynamically to prevent SSR issues
    const { getDoc, doc } = await import('firebase/firestore');
    const userDoc = await getDoc(doc(db, 'profiles', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (_error) {
    throw error;
  }
};

// Helper for maintaining a persistent auth cookie that can be read by middleware
export const updateAuthCookie = (user: User | null) => {
  if (typeof window === 'undefined') return;

  if (user) {
    // User is signed in, create/update the cookie with a 7-day expiration
    user.getIdToken().then(token => {
      document.cookie = `firebase-auth-token=${token}; path=/; max-age=604800; SameSite=Strict`;
    });
  } else {
    // User is signed out, clear the cookie
    document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}; 