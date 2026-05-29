import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { siteContent } from '@/content/site-content';
import ProductGrid from "@/components/ProductGrid";

export const pageMeta = {
  label: "Catalogue",
  path: "/catalog",
  nav: true,
  order: 2,
};

const sortOptions = [
  { value: "recent", label: "Les plus recents" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix decroissant" },
  { value: "popular", label: "Les plus aimes" },
];

const conditionOptions = [
  "Neuf avec etiquette",
  "Neuf sans etiquette",
  "Tres bon etat",
  "Bon etat",
  "Satisfaisant",
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("recent");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");

  const category = searchParams.get("category") || undefined;
  const { products, loading } = useProducts(category, 40);

  useEffect(() => {
    setLocalSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond],
    );
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      params.set("q", localSearch.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const activeCategory = siteContent.categories.find(
    (c) => c.slug === category,
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Top filter bar */}
      <div className="border-b border-border bg-card py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 flex-wrap">
          {/* Search inline */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 flex-1 min-w-48"
          >
            <div className="relative flex-1 max-w-xs">
              <Search
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-1.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </form>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Filter strokeWidth={1.5} className="h-4 w-4" />
            Filtres
            {selectedConditions.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {selectedConditions.length}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 border border-border rounded-lg text-sm font-medium text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              strokeWidth={1.5}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Category tags */}
          <div className="flex gap-2 flex-wrap">
            {siteContent.categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalog?category=${cat.slug}`}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  category === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Filter drawer */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-border bg-muted/30 py-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Etat
                </p>
                <div className="flex gap-2 flex-wrap">
                  {conditionOptions.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => toggleCondition(cond)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        selectedConditions.includes(cond)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
              {selectedConditions.length > 0 && (
                <button
                  onClick={() => setSelectedConditions([])}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X strokeWidth={1.5} className="h-3 w-3" />
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCategory && (
          <h1
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {activeCategory.label}
          </h1>
        )}
        {!activeCategory && searchParams.get("q") && (
          <h1
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Resultats pour "{searchParams.get("q")}"
          </h1>
        )}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
