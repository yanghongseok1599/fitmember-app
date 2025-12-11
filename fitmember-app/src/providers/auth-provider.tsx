'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '@/lib/auth-store';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; needsRegistration?: boolean; error?: string }>;
  loginWithKakao: () => Promise<{ success: boolean; needsRegistration?: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      setUser(authStore.getUser());
      setIsLoggedIn(authStore.isLoggedIn());
      setIsLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const unsubscribe = authStore.subscribe(() => {
      setUser(authStore.getUser());
      setIsLoggedIn(authStore.isLoggedIn());
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = authStore.loginWithEmail(email, password);
    return result;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return authStore.loginWithGoogle();
  }, []);

  const loginWithKakao = useCallback(async () => {
    return authStore.loginWithKakao();
  }, []);

  const logout = useCallback(() => {
    authStore.logout();
    router.push('/');
  }, [router]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    authStore.updateProfile(updates);
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    loginWithGoogle,
    loginWithKakao,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
