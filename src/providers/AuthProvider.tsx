/**
 * AuthProvider — Authentification Supabase + session Constructor (preview)
 * V317: Fallback auto-injecté car le LLM a omis ou simulé l'auth.
 * V1553: Pont Constructor même si Supabase est configuré ; signIn met à jour user.
 */
import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { AuthContext, type AuthContextType, type AuthUser } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
    avatar: user.user_metadata?.avatar_url || undefined,
    role: user.role || 'authenticated',
  };
}

function mapConstructorUser(payload: any): AuthUser | null {
  const user = payload?.user;
  if (!user?.id) return null;
  return {
    id: String(user.id),
    email: user.email || '',
    name: user.full_name || user.name || user.email?.split('@')[0] || '',
    avatar: user.avatar_url || undefined,
    role: 'authenticated',
  };
}

async function fetchConstructorSession(): Promise<AuthUser | null> {
  const bases: string[] = [''];
  if (typeof window !== 'undefined') {
    const api = (window as { __CONSTRUCTOR_API_URL__?: string }).__CONSTRUCTOR_API_URL__;
    if (api && !bases.includes(api.replace(/\/$/, ''))) {
      bases.push(api.replace(/\/$/, ''));
    }
  }
  for (const base of bases) {
    try {
      const res = await fetch(`${base}/api/user/profile`, { credentials: 'include' });
      if (!res.ok) continue;
      const json = await res.json();
      const mapped = mapConstructorUser(json);
      if (mapped) return mapped;
    } catch {
      /* try next base */
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            if (!cancelled) {
              setUser(mapSupabaseUser(session.user));
              setError(null);
            }
            return;
          }
        }

        const ctorUser = await fetchConstructorSession();
        if (!cancelled) {
          setUser(ctorUser);
          setError(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrapAuth();

    if (!isSupabaseConfigured()) {
      return () => { cancelled = true; };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        setUser(mapSupabaseUser(session?.user ?? null));
        setIsLoading(false);
        setError(null);
      },
    );
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured()) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        const mapped = mapSupabaseUser(data.session?.user ?? null);
        if (mapped) {
          setUser(mapped);
          return;
        }
      }

      const ctorUser = await fetchConstructorSession();
      if (ctorUser) {
        setUser(ctorUser);
        return;
      }

      throw new Error('Connexion impossible — vérifiez email/mot de passe ou créez un compte.');
    } catch (err: any) {
      setError(err?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase non configuré: inscription indisponible');
      }
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: name ? { data: { full_name: name } } : undefined,
      });
      if (authError) throw authError;
      const mapped = mapSupabaseUser(data.session?.user ?? data.user ?? null);
      if (mapped) setUser(mapped);
    } catch (err: any) {
      setError(err?.message || "Erreur d'inscription");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured()) {
        const { error: authError } = await supabase.auth.signOut();
        if (authError) throw authError;
      }
      setUser(null);
    } catch (err: any) {
      setError(err?.message || 'Erreur de déconnexion');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user, isLoading, isAuthenticated: !!user, error,
    signIn, signUp, signOut,
    login: signIn, register: signUp, logout: signOut,
  }), [user, isLoading, error, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
