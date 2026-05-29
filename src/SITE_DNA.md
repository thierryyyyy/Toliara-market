# SITE DNA — Toliara market
> Généré: 2026-05-29T11:14:12.463Z
> rawMode: true

## Routage VAVI (modification)
vaviSkill: vavi-vitrine
generationProfile: static-rich
> Skill figé à la génération — prioritaire sur la reclassification snapshot.

## Identité
- siteType: multi-page
- generationMode: website-generation

## Architecture navigation (standard)
- Menu: `src/data/custom-site-config.ts` → `navigation.headerNav`

## Charte graphique (V1372)
> Référence design pour **toutes** les pages et composants — cohérence globale.

### Variables CSS (tokens design)
> Classes Tailwind (`bg-primary`, `text-foreground`, …).
- `--background: 0 0% 97%`
- `--foreground: 210 15% 12%`
- `--card: 0 0% 100%`
- `--card-foreground: 210 15% 12%`
- `--popover: 0 0% 100%`
- `--popover-foreground: 210 15% 12%`
- `--primary: 174 62% 32%`
- `--primary-foreground: 0 0% 100%`
- `--secondary: 174 30% 90%`
- `--secondary-foreground: 174 62% 22%`

### Anti-patterns à éviter (V1372)
- ❌ Bento grid >3 cellules ayant toutes le même format et le même contenu (= grille déguisée, pas un vrai bento).
- ❌ Bento appliqué à une liste de témoignages, à une grille de produits e-commerce, ou à un tableau de prix — ces formats ont leurs propres patterns établis.
- ❌ Plus d'un bento sur la même page (les bento sont des points d'accent, pas un layout universel).
- ❌ Composants shadcn « nus » sans personnalisation : <Card><CardHeader><CardTitle> répétés à l'identique sur 4+ blocs sans variation visuelle (couleur, taille, accent, élévation).
- ❌ Variants de boutons par défaut (`Button` sans className personnalisé) sur les CTA primaires — toujours appliquer la palette du projet.

### Cohérence inter-pages
1. Réutiliser `src/components/custom/` avant de créer du neuf.
2. Palette + typo ci-dessus sur toute nouvelle page ou section — **mêmes** tokens que Home (pas de `bg-slate-900` sur une page et `bg-gray-950` sur une autre).
3. CTA primaires : `bg-primary text-primary-foreground` (ou équivalent projet).
4. Fonds de page : `bg-background` uniquement (défini dans `index.css` :root).

## Hero Contract
> Snapshot des patterns hero réels — descriptif, pas prescriptif.
> **Règle de cohérence** : mêmes tokens CSS (--primary, --background), même typographie, mêmes couleurs.
> Ne pas forcer un composant unique si les pages ont des formats différents établis.

- **Composant partagé** : aucun hero générique détecté dans src/components/custom/

**Pattern hero par page (réalité du snapshot) :**
- **Home** → hero 2 colonnes
- **Catalog** → pas de hero dédié
- **ProductDetail** → section hero inline
- **Sell** → section hero inline
- **HowItWorks** → section hero inline
- **Contact** → section hero inline
- **Admin** → pas de hero dédié
- **NotFound** → pas de hero dédié

> Si tu modifies une page, conserve exactement son pattern hero existant sauf demande explicite de changement.
## DataContracts (V727)
> Noms de propriétés EXACTS — ne jamais en inventer d'autres.
ProductFilters: { search?: string; category?: string; sort?: "price_asc" | 'price_desc' | 'newest' | 'name' }
AppContextType: { siteName?: string }
RuntimeFieldDef: { type?: string; label?: string; required?: boolean; options?: Array<{ value: string; label: string }
RuntimeSchemaMeta: { name: string; description?: string; icon?: string; fields: Record<string, RuntimeFieldDef>; fieldOrder?: string[]; titleField?: string }
AuthUser: { id: string; email: string; name?: string; avatar?: string; role?: string; [key: string]: unknown }
AuthContextType: { user: AuthUser | null; isLoading: boolean; isAuthenticated: boolean; error: string | null; signIn: (email: string, password: string) => Promise<void>; signUp: (email: string, password: string, name?: string) => Promise<void>; signOut: () => Promise<void>; login: (email: string, password: string) => Promise<void> }
UseSupabaseDataReturn: { data: T[]; loading: boolean; error: string | null; refresh: () => Promise<void>; create: (item: Omit<T, "id" | 'created_at' | 'updated_at'>) => Promise<T | null>; update: (id: string, changes: Partial<T>) => Promise<T | null>; remove: (id: string) => Promise<boolean>; count: number }
LightboxImage: { src: string; alt?: string; caption?: string; thumbnail?: string }

## Décisions
> Historique structurel (8 dernières) — ne garder que les choix durables.
- (génération initiale — aucune décision structurelle enregistrée)

## Routes
> Source: pageMeta (App.tsx sans <Route>)
| Route | Composant | Fichier |
|-------|-----------|---------|
| / | Home | src/pages/Home.tsx |
| /catalog | Catalog | src/pages/Catalog.tsx |
| /product/:id | ProductDetail | src/pages/ProductDetail.tsx |
| /sell | Sell | src/pages/Sell.tsx |
| /how-it-works | HowItWorks | src/pages/HowItWorks.tsx |
| /contact | Contact | src/pages/Contact.tsx |
| /admin | Admin | src/pages/Admin.tsx |
| /notfound | NotFound | src/pages/NotFound.tsx |

## Stores & Contexts
- src/contexts/AppContext.tsx → exports: AppContext, useApp
- src/contexts/AuthContext.tsx → exports: AuthContext

## Hooks
- src/hooks/useProducts.ts
- src/hooks/useAuth.ts
- src/hooks/useSiteOwnerRuntime.ts
- src/hooks/use-mobile.tsx
- src/hooks/use-toast.ts
- src/hooks/useSupabaseData.ts

## Configuration
- chromeMode: full
- header variant: custom
- footer variant: custom
- Capabilities: Standards Tailwind, Radix UI, Lucide
- Deps installées (package.json) — n'importer que depuis cette liste:
  @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @hookform/resolvers, @radix-ui/react-accordion, @radix-ui/react-alert-dialog, @radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-hover-card, @radix-ui/react-label, @radix-ui/react-menubar, @radix-ui/react-navigation-menu, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-select, @radix-ui/react-separator, @radix-ui/react-slider, @radix-ui/react-slot, @radix-ui/react-switch, @radix-ui/react-tabs, @radix-ui/react-toast, @radix-ui/react-toggle, @radix-ui/react-toggle-group, @radix-ui/react-tooltip, @react-pdf/renderer, @stripe/react-stripe-js, @stripe/stripe-js, @supabase/supabase-js, @tailwindcss/typography, @tailwindcss/vite, @tanstack/react-query, @tanstack/react-table, @tiptap/extension-placeholder, @tiptap/react, @tiptap/starter-kit, @vitejs/plugin-react, apexcharts, axios, browser-image-compression, chart.js, class-variance-authority, clsx, cmdk, d3, date-fns, dayjs, docx, embla-carousel-react, file-saver, framer-motion, i18next, input-otp, jspdf, jspdf-autotable, jszip, leaflet, lodash, lucide-react, motion, nanoid, papaparse, qrcode.react, react, react-apexcharts, react-beautiful-dnd, react-chartjs-2, react-day-picker, react-dom, react-dropzone, react-helmet-async, react-hook-form, react-hot-toast, react-i18next, react-image-crop, react-leaflet, react-markdown, react-resizable-panels, react-router-dom, react-signature-canvas, react-to-print, recharts, remark-gfm, socket.io-client, sonner, tailwind-merge, tw-animate-css, uuid, vaul, xlsx, yup, zod, zustand

## Navigation (ordre menu)
> Source: `custom-site-config` headerNav — respecter cet ordre sauf demande explicite.
1. Accueil → `/`
2. Catalogue → `/catalog`
3. Vendre → `/sell`
4. Comment ca marche → `/how-it-works`
5. Contact → `/contact`
6. Admin → `/admin`
