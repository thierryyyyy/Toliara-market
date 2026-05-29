import { type ReactNode } from 'react';
import { AppContext } from '@/contexts/AppContext';

export default function AppProvider({ children }: { children: ReactNode }) {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}
