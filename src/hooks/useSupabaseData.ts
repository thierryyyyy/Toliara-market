import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * 🗄️ useSupabaseData - Hook universel LOCAL-FIRST + Supabase (V711 Dedup Polling)
 * ============================================================================
 * 
 * ⚠️ V1314: ce fichier importe le client via: import { supabase } from '@/lib/supabaseClient'.
 * Le fichier src/lib/supabaseClient.ts est injecté par le pipeline (tu n'as
 * pas besoin de le régénérer dans la sortie LLM).
 * 
 * Architecture LOCAL-FIRST + DEDUPLICATED POLLING:
 * 1. localStorage = couche de persistance immédiate (survit page reload)
 * 2. API Constructor (/api/data) = sync via cookies propriétaire (preview vavi.dev)
 * 3. RPC Supabase = sync quand session auth disponible
 * 4. V711: Une seule requête de polling par table (shared across all components)
 * 5. V1710: mount charge localStorage + GET /api/data SANS attendre session Supabase
 * 6. Mutations: optimistic + API Constructor en priorité, puis RPC
 * 
 * Performance: 3 composants useSupabaseData('products')
 *   Before V711: 3 polling intervals = 3 RPC calls every pollingInterval ms
 *   After V711:  1 polling interval = 1 RPC call, emitted to all 3 components
 * ============================================================================
 */


function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Erreur";
}

// V711: Cache coordinator with event bus (lazy load to avoid circular imports)
type CacheSubscriber<T = any> = (data: T[], version: number) => void;

class DataCacheManager {
  private cache: Map<string, { data: any[]; version: number; inFlight: Promise<void> | null }> = new Map();
  private subscribers: Map<string, Set<CacheSubscriber>> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  subscribe(table: string, callback: CacheSubscriber): () => void {
    if (!this.subscribers.has(table)) this.subscribers.set(table, new Set());
    this.subscribers.get(table)!.add(callback);
    return () => this.subscribers.get(table)?.delete(callback);
  }

  private emit(table: string, data: any[], version: number) {
    const subs = this.subscribers.get(table);
    if (!subs) return;
    for (const cb of subs) {
      try { cb(data, version); } catch (err) { console.warn("Subscriber error:", err); }
    }
  }

  async initTable(table: string, schema: string | undefined, pollInterval?: number, seed?: any[]): Promise<any[]> {
    if (!this.cache.has(table)) {
      this.cache.set(table, { data: seed || [], version: 0, inFlight: null });
    }

    // V1340: ALWAYS fetch once at mount (even without polling). Before V1340,
    // a call site like `useSupabaseData('orders')` (no options) would never
    // trigger any fetch - the hook would stay on `data: []` forever. This
    // is exactly why generated dashboards (e.g. rapprochement bancaire)
    // displayed "Aucune session" / "Aucune transaction" indefinitely.
    if (!this.cache.get(table)!.inFlight) {
      await this.fetchAndEmit(table, schema).catch(() => {});
    }

    if (pollInterval && pollInterval > 0 && !this.pollingIntervals.has(table)) {
      console.log("[V711] Start deduplicated polling for", table);
      const id = setInterval(() => this.fetchAndEmit(table, schema).catch(() => {}), pollInterval);
      this.pollingIntervals.set(table, id);
    }

    return this.cache.get(table)!.data;
  }

  private async fetchAndEmit(table: string, schema: string | undefined): Promise<void> {
    if (!schema) return;
    const entry = this.cache.get(table);
    if (!entry || entry.inFlight) {
      if (entry?.inFlight) await entry.inFlight;
      return;
    }

    const fetch = (async () => {
      try {
        const { data: raw, error } = await supabase.rpc("select_app_data", {
          p_project_id: schema,
          p_table_name: table
        });
        if (error) throw new Error(error.message);

        const result = typeof raw === "object" && raw?.data ? raw.data : raw;
        if (Array.isArray(result)) {
          entry!.data = result;
          entry!.version++;
          this.emit(table, result, entry!.version);
        }
      } catch (err: unknown) {
        console.warn("[V711] Fetch error:", errorMessage(err));
      } finally {
        entry!.inFlight = null;
      }
    })();

    entry.inFlight = fetch;
    await fetch;
  }

  async refresh(table: string, schema: string | undefined): Promise<void> {
    const entry = this.cache.get(table);
    if (!entry) return;
    this.emit(table, entry.data, entry.version);
    if (schema) await this.fetchAndEmit(table, schema).catch(() => {});
  }

  updateLocal(table: string, data: any[]): void {
    const entry = this.cache.get(table) || { data: [], version: 0, inFlight: null };
    entry.data = data;
    entry.version++;
    if (!this.cache.has(table)) this.cache.set(table, entry);
    this.emit(table, data, entry.version);
  }

  getData(table: string): any[] {
    return this.cache.get(table)?.data || [];
  }
}

const globalCache = new DataCacheManager();

// ============================================================================
// HOOK
// ============================================================================

export interface UseSupabaseDataReturn<T extends Record<string, any>> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (item: Omit<T, "id" | 'created_at' | 'updated_at'>) => Promise<T | null>;
  update: (id: string, changes: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  count: number;
  isPolling: boolean;
}

interface UseSupabaseDataOptions<T> {
  pollingInterval?: number;
  skipInit?: boolean;
  seedData?: T[];
  query?: string;
}

export function useSupabaseData<T extends Record<string, any>>(
  tableName: string,
  options: UseSupabaseDataOptions<T> = {}
): UseSupabaseDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(!options.skipInit);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const isMounted = useRef(true);
  const unsubRef = useRef<(() => void) | null>(null);
  const verRef = useRef(0);

  const schema: string | undefined =
    (typeof window !== "undefined" && (window as any).__PROJECT_ID__)
      ? String((window as any).__PROJECT_ID__)
      : (import.meta.env.VITE_DATABASE_SCHEMA || undefined);
  const projectId: string | undefined =
    (typeof window !== "undefined" && (window as any).__PROJECT_ID__)
      ? String((window as any).__PROJECT_ID__)
      : undefined;
  const constructorApiBase: string =
    (typeof window !== "undefined" && (window as any).__CONSTRUCTOR_API_URL__)
      ? String((window as any).__CONSTRUCTOR_API_URL__)
      : "";
  const storageKey = "V13_" + (schema || 'local') + '_' + tableName;

  const buildDataApiUrl = useCallback((id?: string) => {
    if (!projectId || !constructorApiBase) return null;
    const normalizedBase = constructorApiBase.replace(/\/$/, "");
    const suffix = id ? "?id=" + encodeURIComponent(id) : "";
    return normalizedBase + '/api/data/' + projectId + '/' + tableName + suffix;
  }, [constructorApiBase, projectId, tableName]);

  const fetchViaDataApi = useCallback(async (method: "GET" | 'POST' | 'PUT' | 'DELETE', payload?: any, id?: string) => {
    const url = buildDataApiUrl(id);
    if (!url) return null;
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(payload || {})
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || ("API data " + method + ' failed (" + res.status + ")'));
    }
    const json = await res.json().catch(() => ({}));
    return json?.data ?? null;
  }, [buildDataApiUrl]);

  const loadLocal = useCallback(() => {
    try {
      const c = localStorage.getItem(storageKey);
      if (c) {
        const p = JSON.parse(c);
        if (Array.isArray(p) && p.length > 0) {
          setData(p);
          return true;
        }
      }
    } catch (err) {}
    return false;
  }, [storageKey]);

  const safeSetData = useCallback((rows: T[]) => {
    if (!isMounted.current) return;
    setData(rows);
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch (err: unknown) {
      console.warn("[useSupabaseData] localStorage quota exceeded");
    }
  }, [storageKey]);

  const loadFromRemote = useCallback(async (): Promise<void> => {
    // V1710: API Constructor (cookies session propriétaire sur preview) - ne pas bloquer sur Supabase auth
    if (projectId && constructorApiBase) {
      try {
        const rows = await fetchViaDataApi("GET");
        if (Array.isArray(rows)) {
          globalCache.updateLocal(tableName, rows);
          safeSetData(rows as T[]);
          if (isMounted.current) setError(null);
          return;
        }
      } catch (err: unknown) {
        console.warn("[V1710] GET /api/data failed:", errorMessage(err));
      }
    }

    if (!schema) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const coordData = await globalCache.initTable(
        tableName,
        schema,
        options.pollingInterval,
        options.seedData
      );
      safeSetData(coordData as T[]);
      if (isMounted.current) {
        setIsPolling(!!options.pollingInterval && options.pollingInterval > 0);
      }
    } catch (err: unknown) {
      if (isMounted.current) setError(errorMessage(err));
    }
  }, [
    projectId,
    constructorApiBase,
    schema,
    tableName,
    options.pollingInterval,
    options.seedData,
    fetchViaDataApi,
    safeSetData,
  ]);

  const refresh = useCallback(async () => {
    await loadFromRemote();
  }, [loadFromRemote]);

  const create = useCallback(async (item: Omit<T, "id" | 'created_at' | 'updated_at'>) => {
    const optId = `temp_${Date.now()}`;
    const optItem = { ...item, id: optId, created_at: new Date().toISOString() } as unknown as T;
    const optimistic = [...data, optItem];
    globalCache.updateLocal(tableName, optimistic);
    safeSetData(optimistic);

    if (projectId && constructorApiBase) {
      try {
        const created = await fetchViaDataApi("POST", item);
        await loadFromRemote();
        return (created || optItem) as T;
      } catch (err: unknown) {
        console.warn("[V1710] POST /api/data failed:", errorMessage(err));
      }
    }

    if (!schema) {
      return optItem;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return optItem;

      const { data: res, error } = await supabase.rpc("upsert_app_data", {
        p_project_id: schema,
        p_table_name: tableName,
        p_rows: [item]
      });
      if (error) throw error;
      await loadFromRemote();
      return (res?.[0] || optItem) as T;
    } catch (err: unknown) {
      if (isMounted.current) setError(errorMessage(err));
      return optItem;
    }
  }, [data, schema, tableName, projectId, constructorApiBase, loadFromRemote, fetchViaDataApi, safeSetData]);

  const update = useCallback(async (id: string, changes: Partial<T>) => {
    const prev = [...data];
    const upd = (data ?? []).map((d) => ((d as any).id === id ? { ...d, ...changes } : d));
    globalCache.updateLocal(tableName, upd);
    safeSetData(upd);

    if (projectId && constructorApiBase && !id.startsWith("temp_")) {
      try {
        const updated = await fetchViaDataApi("PUT", changes, id);
        await loadFromRemote();
        return (updated || null) as T | null;
      } catch (err: unknown) {
        // fallback RPC ci-dessous
      }
    }

    if (!schema || id.startsWith("temp_")) {
      try {
        const updated = await fetchViaDataApi("PUT", changes, id);
        await loadFromRemote();
        return (updated || null) as T | null;
      } catch (err: unknown) {
        return null;
      }
    }
    try {
      const { data: res, error } = await supabase.rpc("upsert_app_data", {
        p_project_id: schema,
        p_table_name: tableName,
        p_rows: [{ id, ...changes }]
      });
      if (error) throw error;
      return res?.[0] as T;
    } catch (err: unknown) {
      try {
        const updated = await fetchViaDataApi("PUT", changes, id);
        await loadFromRemote();
        return (updated || null) as T | null;
      } catch (err: unknown) {
        if (isMounted.current) setError(errorMessage(err));
        globalCache.updateLocal(tableName, prev);
        return null;
      }
    }
  }, [data, schema, tableName, projectId, constructorApiBase, fetchViaDataApi, loadFromRemote, safeSetData]);

  const remove = useCallback(async (id: string) => {
    const prev = [...data];
    const filt = data.filter((d) => (d as any).id !== id);
    globalCache.updateLocal(tableName, filt);
    safeSetData(filt);

    if (projectId && constructorApiBase && !id.startsWith("temp_")) {
      try {
        await fetchViaDataApi("DELETE", undefined, id);
        await loadFromRemote();
        return true;
      } catch (err: unknown) {
        // fallback RPC ci-dessous
      }
    }

    if (!schema || id.startsWith("temp_")) {
      try {
        await fetchViaDataApi("DELETE", undefined, id);
        await loadFromRemote();
        return true;
      } catch (err: unknown) {
        return true;
      }
    }
    try {
      const { error } = await supabase.rpc("delete_app_data", {
        p_project_id: schema,
        p_table_name: tableName,
        p_row_id: id
      });
      if (error) throw error;
      return true;
    } catch (err: unknown) {
      try {
        await fetchViaDataApi("DELETE", undefined, id);
        await loadFromRemote();
        return true;
      } catch (err: unknown) {
        if (isMounted.current) setError(errorMessage(err));
        globalCache.updateLocal(tableName, prev);
        return false;
      }
    }
  }, [data, schema, tableName, projectId, constructorApiBase, fetchViaDataApi, loadFromRemote, safeSetData]);

  // Mount: local-first + remote (V1710: pas de gate session Supabase)
  useEffect(() => {
    isMounted.current = true;
    let authUnsub: (() => void) | null = null;

    const run = async () => {
      const hasLocal = loadLocal();
      if (!hasLocal && options.seedData?.length) safeSetData(options.seedData as T[]);

      const unsub = globalCache.subscribe(tableName, (newData, ver) => {
        if (isMounted.current && ver !== verRef.current) {
          safeSetData(newData as T[]);
          verRef.current = ver;
        }
      });
      unsubRef.current = unsub;

      if (!options.skipInit) {
        await loadFromRemote();
      }

      if (isMounted.current) setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
        if (s && isMounted.current && !options.skipInit) void loadFromRemote();
      });
      authUnsub = () => subscription.unsubscribe();
    };

    void run();

    return () => {
      isMounted.current = false;
      if (unsubRef.current) unsubRef.current();
      if (authUnsub) authUnsub();
    };
  }, [
    tableName,
    schema,
    options.pollingInterval,
    options.seedData,
    options.skipInit,
    loadLocal,
    loadFromRemote,
    safeSetData,
  ]);

  return { data, loading, error, refresh, create, update, remove, count: data.length, isPolling };
}
