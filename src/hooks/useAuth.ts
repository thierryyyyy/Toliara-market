/**
 * useAuth — hook d'authentification (pipeline-owned, V1780).
 */
import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

export type { AuthContextType, AuthUser } from '@/contexts/AuthContext';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  return { ...ctx, login: ctx.signIn, register: ctx.signUp, logout: ctx.signOut };
}

export default useAuth;
