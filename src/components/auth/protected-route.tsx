'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/providers/firebase-auth-provider';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  fallback = <LoadingSpinner message="Checking authentication..." />
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only handle redirection after loading is complete
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return <>{fallback}</>;
  }

  // If authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // Fallback while redirecting
  return <>{fallback}</>;
} 