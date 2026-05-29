/**
 * AuthContext — types et contexte (pipeline-owned, V1780).
 */
import { createContext } from 'react';

// 🧬 AuthUser — type canonique (V1406)
// Retourné par useAuth().user. Toujours `null` quand non connecté.
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  [key: string]: unknown;
}

// 🧬 AuthContextType — type canonique (V1406)
// Forme exacte retournée par useAuth(). Les alias `login`/`register`/`logout`
// sont là pour rétro-compat — `signIn`/`signUp`/`signOut` sont canoniques.
export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuth: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: async () => { console.warn('[Auth] signIn appelé sans AuthProvider'); },
  signUp: async () => { console.warn('[Auth] signUp appelé sans AuthProvider'); },
  signOut: async () => { console.warn('[Auth] signOut appelé sans AuthProvider'); },
  error: null,
  login: async () => { console.warn('[Auth] login appelé sans AuthProvider'); },
  register: async () => { console.warn('[Auth] register appelé sans AuthProvider'); },
  logout: async () => { console.warn('[Auth] logout appelé sans AuthProvider'); },
};

export const AuthContext = createContext<AuthContextType>(defaultAuth);
