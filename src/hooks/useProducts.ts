/// <reference types="vite/client" />
import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// V1395 - storefront client scoped to schema 'public'. The project-wide
// supabaseClient targets app_<projectId>, which would shadow ecommerce_*.
// V1429 - Rejette les credentials placeholder (longueur < 100, pas un JWT)
// pour éviter les 401 massifs en preview quand l'env n'est pas configurée.
function isPlausibleAnonKey(key: string): boolean {
  if (!key || key.length < 100) return false;
  if (!key.startsWith("eyJ")) return false;
  if (/placeholder/i.test(key)) return false;
  return true;
}
function isPlausibleSupabaseUrl(url: string): boolean {
  if (!url) return false;
  if (/placeholder/i.test(url)) return false;
  return /^https:\/\/[a-z0-9-]+\.supabase\.co/i.test(url);
}
function getStorefrontClient(): SupabaseClient | null {
  const url =
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (typeof window !== "undefined" ? (window as { __SUPABASE_URL__?: string }).__SUPABASE_URL__ : undefined) ||
    '';
  const key =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (typeof window !== "undefined" ? (window as { __SUPABASE_ANON_KEY__?: string }).__SUPABASE_ANON_KEY__ : undefined) ||
    '';
  if (!isPlausibleSupabaseUrl(url) || !isPlausibleAnonKey(key)) return null;
  return createClient(url, key, { db: { schema: "public" }, auth: { persistSession: false } });
}

function getProjectId(): string {
  return (
    (import.meta.env.VITE_PROJECT_ID as string | undefined) ||
    (typeof window !== "undefined" ? (window as { __PROJECT_ID__?: string }).__PROJECT_ID__ : "") ||
    ''
  );
}


// 🧬 Product - type canonique (V1406)
// Les fichiers consommateurs (useProducts, Products.tsx, Cart.tsx, ...)
// DOIVENT respecter cette shape. Les champs optionnels (`?`) peuvent
// être absents - toujours utiliser optional chaining côté UI.
export interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  /** Prix de vente en unités majeures (ex: 19.99 pour 19,99 €). */
  price: number;
  /** Prix de référence pour l'affichage barré (unités majeures). Optionnel. */
  compare_at_price?: number;
  /** Alias historique de `compare_at_price` - toujours dérivé du même champ. */
  originalPrice?: number;
  image?: string;
  images?: string[];
  /** Nom de catégorie normalisé en string (jamais un objet). */
  category?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  sku?: string;
  features?: string[];
}
export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: "price_asc" | 'price_desc' | 'newest' | 'name';''
}

const productStore: Product[] = [];
export function registerProducts(products: Product[]) {
  for (const p of products) {
    const idx = productStore.findIndex(e => e.id === p.id);
    if (idx >= 0) productStore[idx] = p; else productStore.push(p);
  }
}

function normPrice(p: unknown): number {
  const n = Number(p); if (!n || isNaN(n) || n < 0) return 0;
  return n !== Math.floor(n) ? Math.round(n * 100) : Math.round(n);
}

function normalizeCategoryForUi(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    const o = raw as Record<string, unknown>;
    if (typeof o.name === "string" && o.name) return o.name;
    if (typeof o.slug === "string" && o.slug) return o.slug;
  }
  return undefined;
}

function mapProduct(p: Record<string, unknown>): Product {
  const imagesArr = Array.isArray(p.images) ? (p.images as unknown[]) : [];
  const firstImage = imagesArr.length > 0
    ? (typeof imagesArr[0] === "string"
      ? String(imagesArr[0])
      : String((imagesArr[0] as Record<string, unknown>)?.url || ''))
    : "";
  return {
    id: String(p.id || ''),
    name: String(p.name || ''),
    slug: String(p.slug || ''),
    description: String(p.description || ''),
    price: normPrice(p.price_cents || p.priceCents || p.price || 0),
    originalPrice: (p.compare_at_price_cents || p.compareAtPriceCents) ? normPrice(p.compare_at_price_cents || p.compareAtPriceCents) : undefined,
    compare_at_price: (() => {
      const c = p.compare_at_price_cents ?? p.compareAtPriceCents;
      if (c == null || c === "") return undefined;
      const n = Number(c);
      if (!n || isNaN(n) || n <= 0) return undefined;
      return n / 100;
    })(),
    image: firstImage || String(p.image || ''),
    images: imagesArr.map((img) => typeof img === "string" ? img : String((img as Record<string, unknown>)?.url || '')).filter(Boolean),
    category: normalizeCategoryForUi(p.category),
    inStock: p.is_active !== false && p.isActive !== false,
    isFeatured: Boolean(p.is_featured || p.isFeatured),
    isNew: Boolean(p.is_new || p.isNew),
    sku: typeof p.sku === "string" ? String(p.sku) : undefined,
  };
}

export function useProducts(initialProducts?: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});

  const fetchProducts = useCallback(async () => {
    const pid = getProjectId();
    if (!pid) {
      console.warn("[useProducts] V1395 - VITE_PROJECT_ID / __PROJECT_ID__ manquant");
      setIsLoading(false); setError("Configuration manquante"); return;
    }
    const client = getStorefrontClient();
    if (!client) {
      // V1429 - credentials manquants ou placeholder (clé < 100 chars,
      // pas un JWT, ou URL placeholder.supabase.co). UI dégradée propre.
      console.warn("[useProducts] V1429 - Supabase credentials invalides ou placeholder. Catalogue indisponible.");
      setIsLoading(false); setError("Configuration Supabase manquante"); return;
    }
    setIsLoading(true);
    try {
      const { data, error: qErr } = await client
        .from("ecommerce_products")
        .select("id, name, slug, description, price_cents, compare_at_price_cents, images, sku, is_active, is_featured, project_id, category:ecommerce_categories(id, name, slug)")
        .eq("project_id", pid)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (qErr) {
        // V1429 - diagnostic explicite des 401 / 403 (apikey rejet ou RLS).
        const code = (qErr as { code?: string; status?: number }).code || (qErr as { status?: number }).status;
        if (code === 401 || code === "401") {
          console.error("[useProducts] V1429 - 401 Unauthorized: vérifier VITE_SUPABASE_ANON_KEY et migration V1395 (RLS anon SELECT).");
        } else if (code === 403 || code === "403") {
          console.error("[useProducts] V1429 - 403 Forbidden: RLS bloque la lecture, appliquer migration 20260512_v1395_ecommerce_public_storefront_read.sql.");
        }
        throw qErr;
      }
      const items: Product[] = (data || []).map((p) => mapProduct(p as Record<string, unknown>));
      if (items.length > 0) { setProducts(items); registerProducts(items); setError(null); }
      else if (productStore.length > 0) { setProducts([...productStore]); }
      else { setError("Aucun produit disponible pour le moment."); }
    } catch (err: unknown) {
      console.error("[useProducts] Supabase error:", err);
      setError("Erreur de chargement des produits.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialProducts?.length) registerProducts(initialProducts);
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "ECOMMERCE_DATA_UPDATED") fetchProducts();
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (filters.search) result = result.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, filters]);

  const categories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean) as string[])], [products]);
  return { products: filtered, total: filtered.length, isLoading, error, filters, setFilters, categories, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const { products, isLoading, error } = useProducts();
  const product = products.find(p => p.id === id || p.slug === id) || null;
  const relatedProducts = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);
  return { product, isLoading, error, relatedProducts };
}
