import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-colors"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={
              product.image_url ||
              "https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=800&h=600&fit=crop&auto=format&q=80"
            }
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.favorites_count > 0 && (
            <span className="absolute top-2 right-2 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm rounded-full px-1.5 py-0.5">
              {product.favorites_count}
            </span>
          )}
        </div>
        <div className="p-2.5">
          {product.brand && (
            <p className="text-xs font-semibold text-foreground truncate">
              {product.brand}
            </p>
          )}
          {(product.size || product.condition) && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {[product.size, product.condition].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-sm font-bold text-foreground">
              {(product.price ?? 0).toFixed(2).replace(".", ",")} Ar
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {(product.price_with_protection ?? 0).toFixed(2).replace(".", ",")} Ar
            incl.
          </p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
        }}
        className="absolute top-2 left-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm
                   opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart
          strokeWidth={1.5}
          className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-foreground"}`}
        />
      </button>
    </motion.div>
  );
}
