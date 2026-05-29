/**
 * V1650 - Données métier pour /admin (site déployé).
 * Lecture : API Constructor runtime-admin (GET public).
 * Écriture : RPC Supabase upsert_app_data (utilisateur authentifié).
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type RuntimeFieldDef = {
  type?: string;
  label?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};

export type RuntimeSchemaMeta = {
  name: string;
  description?: string;
  icon?: string;
  fields: Record<string, RuntimeFieldDef>;
  fieldOrder?: string[];
  titleField?: string;
};

export type RuntimeCollectionItem = Record<string, unknown> & { id: string };

function getProjectId(): string {
  const fromEnv = import.meta.env.VITE_PROJECT_ID as string | undefined;
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") {
    const w = (window as { __PROJECT_ID__?: string }).__PROJECT_ID__;
    if (w) return w;
  }
  return '';
}

function getRuntimeApiBase(): string {
  const explicit =
    (import.meta.env.VITE_RUNTIME_API_URL as string | undefined) ||
    (import.meta.env.VITE_CONSTRUCTOR_API_URL as string | undefined);
  if (explicit) return explicit.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    const w =
      (window as { __RUNTIME_API_URL__?: string }).__RUNTIME_API_URL__ ||
      (window as { __CONSTRUCTOR_API_URL__?: string }).__CONSTRUCTOR_API_URL__;
    if (w) return String(w).replace(/\/+$/, "");
  }
  return '';
}

export function useSiteOwnerRuntime() {
  const [schemas, setSchemas] = useState<Record<string, RuntimeSchemaMeta>>({});
  const [data, setData] = useState<Record<string, RuntimeCollectionItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const projectId = getProjectId();
  const apiBase = getRuntimeApiBase();

  const reload = useCallback(async () => {
    if (!projectId) {
      setError("Identifiant projet manquant (VITE_PROJECT_ID).");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `${apiBase}/api/runtime-admin/${encodeURIComponent(projectId)}/data`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Chargement impossible (HTTP ${res.status})`);
      const json = (await res.json()) as {
        schemas?: Record<string, RuntimeSchemaMeta>;
        data?: Record<string, { items?: RuntimeCollectionItem[] }>;
      };
      setSchemas(json.schemas || {});
      const next: Record<string, RuntimeCollectionItem[]> = {};
      for (const [sid, block] of Object.entries(json.data || {})) {
        next[sid] = Array.isArray(block?.items) ? block.items : [];
      }
      setData(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [projectId, apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveCollection = useCallback(
    async (schemaId: string, items: RuntimeCollectionItem[]) => {
      if (!projectId) throw new Error("Projet non configuré");
      setSaving(true);
      setError(null);
      try {
        const rows = items.map((item) => {
          const { id, createdAt, updatedAt, ...rest } = item as RuntimeCollectionItem & {
            createdAt?: string;
            updatedAt?: string;
          };
          return { id, ...rest };
        });
        const { error: rpcError } = await supabase.rpc("upsert_app_data", {
          p_project_id: projectId,
          p_table_name: schemaId,
          p_rows: rows,
        });
        if (rpcError) throw new Error(rpcError.message);
        setData((prev) => ({ ...prev, [schemaId]: items }));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Erreur de sauvegarde";
        setError(msg);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [projectId],
  );

  return {
    projectId,
    schemas,
    data,
    loading,
    error,
    saving,
    reload,
    saveCollection,
    manageUrl:
      typeof window !== "undefined" && projectId
        ? `${apiBase || window.location.origin}/projects/${projectId}/manage`
        : "",
  };
}
