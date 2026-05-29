import { type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from '@/providers/AuthProvider';
import AppProvider from '@/providers/AppProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
