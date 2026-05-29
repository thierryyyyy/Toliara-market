/// <reference types="vite/client" />
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Client tenant - schema dynamique (2e paramètre générique = string, pas literal 'public'). */
type AppSupabaseClient = SupabaseClient<any, string, any>;

function readSupabaseConfig() {
  return {
    supabaseUrl:
      import.meta.env.VITE_SUPABASE_URL ||
      (typeof window !== "undefined" ? (window as { __SUPABASE_URL__?: string }).__SUPABASE_URL__ : "") ||
      '',
    supabaseAnonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      (typeof window !== "undefined" ? (window as { __SUPABASE_ANON_KEY__?: string }).__SUPABASE_ANON_KEY__ : "") ||
      '',
    projectId:
      import.meta.env.VITE_PROJECT_ID ||
      (typeof window !== "undefined" ? (window as { __PROJECT_ID__?: string }).__PROJECT_ID__ : "") ||
      'default',
    dbSchema:
      import.meta.env.VITE_DATABASE_SCHEMA ||
      (typeof window !== "undefined" ? (window as { __DATABASE_SCHEMA__?: string }).__DATABASE_SCHEMA__ : "") ||
      'public',
  };
}

let _supabaseClient: AppSupabaseClient | null = null;
let _supabaseConfigKey = "";

function getOrCreateSupabaseClient(): AppSupabaseClient {
  const cfg = readSupabaseConfig();
  const configKey = [cfg.supabaseUrl, cfg.supabaseAnonKey, cfg.projectId, cfg.dbSchema].join("|");
  if (_supabaseClient && _supabaseConfigKey === configKey) {
    return _supabaseClient;
  }
  _supabaseConfigKey = configKey;
  if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
    _supabaseClient = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      db: { schema: cfg.dbSchema },
      auth: { storageKey: `sb-auth-${cfg.projectId}` },
    });
  } else {
    _supabaseClient = createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: { storageKey: "sb-auth-placeholder" },
    });
  }
  return _supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  const cfg = readSupabaseConfig();
  const url = cfg.supabaseUrl || '';
  const key = cfg.supabaseAnonKey || '';
  if (!url || !key) return false;
  if (/placeholder/i.test(url) || /placeholder/i.test(key)) return false;
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co/i.test(url)) return false;
  if (key.length < 100 || !key.startsWith("eyJ")) return false;
  return true;
}

/** V1538 - Lazy: lit window.__SUPABASE_* injecté dans index.html au publish. */
export const supabase: AppSupabaseClient = new Proxy({} as AppSupabaseClient, {
  get(_target, prop) {
    const client = getOrCreateSupabaseClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});

// V1230: Auto-sign-in anonymously if no session exists.
// Tenant RLS policies require role=authenticated for INSERT/UPDATE/DELETE.
// Without a session the user is anon and writes are silently blocked.
// Anonymous users in Supabase have role=authenticated, satisfying RLS.
// P0 FIX: Establish session BEFORE exports (prevents timing race where useSupabaseData writes before auth ready)
//
// V1405: Anonymous sign-in is OPT-IN. Default Supabase tenants have it
// disabled in Auth Settings, which made every storefront return 422 from
// /auth/v1/signup at module init, polluting console and leaving `user`
// stuck at null. Enable explicitly via VITE_SUPABASE_ANON_AUTH=true (or
// window.__SUPABASE_ANON_AUTH__ = true) when the dashboard toggle is on.
const supabaseAnonAuthEnabled =
  String(import.meta.env.VITE_SUPABASE_ANON_AUTH || '').toLowerCase() === "true" ||
  (typeof window !== "undefined" && (window as { __SUPABASE_ANON_AUTH__?: boolean }).__SUPABASE_ANON_AUTH__ === true);

if (isSupabaseConfigured() && supabaseAnonAuthEnabled) {
  // Use synchronous-like approach: getSession + check, then sign in if needed
  // This promise chain ensures auth is established before the module is fully imported
  const establishSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return;
      const { error } = await supabase.auth.signInAnonymously();
      if (!error) return;
      const msg = (error.message || '').toLowerCase();
      const status = typeof (error as { status?: number }).status === "number"
        ? (error as { status?: number }).status
        : NaN;
      const quiet =
        status === 422 ||
        /422|unprocessable|anonymous|disabled|not allowed|feature/i.test(msg);
      if (!quiet) {
        console.warn("[Auth] Anonymous sign-in failed:", error.message);
      }
    } catch (err) {
      console.warn("[Auth] Anonymous sign-in failed:", err);
    }
  };
  // Fire and forget, but this runs early in module initialization
  establishSession();
}

export default supabase;
