'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './auth-provider';
import { GlobalBottomNavigation } from '@/components/layout';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <GlobalBottomNavigation />
      </AuthProvider>
    </SessionProvider>
  );
}
