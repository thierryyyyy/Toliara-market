import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { siteContent } from '@/content/site-content';
import ProductGrid from "@/components/ProductGrid";

export const pageMeta = {
  label: "Accueil",
  path: "/",
  nav: true,
  order: 1,
};

export default function Home() {
  const [notice, setNotice] = useState(true);
  const { products, loading } = useProducts(undefined, 20);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative min-h-[65vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=1400&h=600&fit=crop&auto=format&q=80"
          alt="Hero Toliara market"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Hero card */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 max-w-sm shadow-xl"
          >
            <h1
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {siteContent.hero.title}
            </h1>
            <Link
              to="/sell"
              className="block text-center w-full px-6 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors mb-3"
            >
              {siteContent.hero.cta_primary}
            </Link>
            <Link
              to="/how-it-works"
              className="block text-center w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {siteContent.hero.cta_secondary}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Notice banner */}
      {notice && (
        <div className="bg-secondary/50 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <p className="text-sm text-secondary-foreground">
            {siteContent.hero.notice}
          </p>
          <button
            onClick={() => setNotice(false)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors ml-4"
          >
            <X strokeWidth={1.5} className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Product feed */}
      <section className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={products} loading={loading} />

          {products.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Voir plus
                <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular categories */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Categories les plus prisees
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {siteContent.popularCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalog?category=${cat.slug}`}
                className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors truncate"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top brands */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Marques les plus vendues
          </h2>
          <div className="flex flex-wrap gap-2">
            {siteContent.topBrands.map((brand) => (
              <Link
                key={brand}
                to={`/catalog?brand=${encodeURIComponent(brand)}`}
                className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {siteContent.howItWorks.title}
          </h2>
          <div className="max-w-3xl mx-auto space-y-0">
            {siteContent.howItWorks.steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex gap-6 py-10 border-b border-border last:border-0"
              >
                <span
                  className="text-7xl font-bold leading-none shrink-0 select-none"
                  style={{
                    color: "hsl(var(--primary) / 0.15)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.number}
                </span>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {(step?.title ?? "")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              {siteContent.hero.cta_primary}
              <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
