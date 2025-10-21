import React, { createContext, useContext, useState } from 'react'

// Mock Firebase User
export const mockFirebaseUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: null,
  phoneNumber: null,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
}

// Mock Auth Context
interface MockAuthContextType {
  user: typeof mockFirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const MockAuthContext = createContext<MockAuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
})

export const useMockAuth = () => useContext(MockAuthContext)

// Mock Firebase Auth Provider
export const MockFirebaseAuthProvider = ({
  children,
  initialUser = null,
}: {
  children: React.ReactNode
  initialUser?: typeof mockFirebaseUser | null
}) => {
  const [user, setUser] = useState(initialUser)
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    setUser(mockFirebaseUser)
    setLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 100))
    setUser(mockFirebaseUser)
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 100))
    setUser(null)
    setLoading(false)
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 100))
    setLoading(false)
  }

  return (
    <MockAuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  )
}

// Mock Firebase methods
export const mockFirebaseAuth = {
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  onAuthStateChanged: jest.fn(),
}

// Mock Firestore methods
export const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  addDoc: jest.fn(),
}
