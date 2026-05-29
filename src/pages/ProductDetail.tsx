import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, Shield, Truck, Star, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from "@/components/ProductCard";

export const pageMeta = {
  label: "Article",
  path: "/product/:id",
  nav: false,
  order: 99
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [liked, setLiked] = useState(false);
  const { products: related, loading: relatedLoading } = useProducts(
    undefined,
    6,
  );

  // Find product from related list as fallback demo
  const product = related.find((p) => p.id === id) || related?.[0];

  if (!product && !relatedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Article introuvable</p>
          <Link to="/catalog" className="text-primary hover:underline">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/catalog"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
            Retour
          </Link>
        </div>

        <div className="grid md:grid-cols-[3fr_2fr] gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted"
          >
            <img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1600247354058-a55b0f6fb720?w=800&h=600&fit=crop&auto=format&q=80"
              }
              alt={(product?.title ?? "")}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            {product.brand && (
              <Link
                to={`/catalog?brand=${encodeURIComponent(product.brand)}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {product.brand}
              </Link>
            )}

            <h1
              className="text-2xl font-bold text-foreground leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {(product?.title ?? "")}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              {product.size && (
                <span className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                  {product.size}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                {product.condition}
              </span>
            </div>

            {/* Price */}
            <div className="bg-muted/50 rounded-2xl p-5 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {(product.price ?? 0).toFixed(2).replace(".", ",")} Ar
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {(product.price_with_protection ?? 0).toFixed(2).replace(".", ",")} Ar
                Protection acheteurs incluse
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <button className="w-full py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
                Acheter maintenant
              </button>
              <button className="w-full py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-muted transition-colors">
                Faire une offre
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Heart
                  strokeWidth={1.5}
                  className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`}
                />
                {liked ? "Ajoute aux favoris" : "Ajouter aux favoris"}
              </button>
              <button className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors">
                <Share2 strokeWidth={1.5} className="h-4 w-4" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield
                  strokeWidth={1.5}
                  className="h-5 w-5 text-primary shrink-0"
                />
                <span>Paiement securise - Protection acheteurs incluse</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck
                  strokeWidth={1.5}
                  className="h-5 w-5 text-primary shrink-0"
                />
                <span>Livraison calculee lors du paiement</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Star
                  strokeWidth={1.5}
                  className="h-5 w-5 text-primary shrink-0"
                />
                <span>Vendeur evalue par la communaute</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        <section className="py-16 md:py-20">
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Articles similaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {related.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
