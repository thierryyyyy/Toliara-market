/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase (injecté au runtime par Constructor)
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_DATABASE_SCHEMA?: string;

  // Multi-tenant (filtre project_id côté façade api.ts)
  readonly VITE_PROJECT_ID?: string;

  // API Runtime Admin (collections génériques : blog, témoignages, équipe)
  readonly VITE_RUNTIME_API_URL?: string;

  // SEO (hydratation sitemap.xml + robots.txt - V1423)
  readonly VITE_SITE_URL?: string;

  // Analytics (optionnel)
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;

  // Le LLM peut ajouter d'autres VITE_* projet-spécifiques ; TS les
  // accepte via la signature d'index, autocomplete sur les standards.
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
