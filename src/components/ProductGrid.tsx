import { motion } from 'framer-motion';
import ProductCard from "./ProductCard";
import type { Product } from "@/hooks/useProducts";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const skeletonItems = Array.from({ length: 12 }, (_, i) => i);

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {skeletonItems.map((i) => (
          <div
            key={i}
            className="bg-card rounded-xl overflow-hidden border border-border animate-pulse"
          >
            <div className="aspect-[3/4] bg-muted" />
            <div className="p-2.5 space-y-1.5">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    >
      {products.map((product, idx) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03, duration: 0.3 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
