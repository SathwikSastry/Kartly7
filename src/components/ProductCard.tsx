/**
 * ProductCard Component
 * 
 * Reusable card component for displaying product previews in grids and featured sections.
 * Features:
 * - Glassmorphic design with hover effects
 * - Smooth animations using Framer Motion
 * - Magnetic hover tilt effect
 * - Responsive layout for all screen sizes
 * - Links to product detail page via slug
 * 
 * Usage:
 * <ProductCard product={productData} />
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/product/${product.slug}`} className="block h-full">
        <GlassCard 
          className={`overflow-hidden h-full flex flex-col hover:glow-cyan transition-all duration-300 ${
            featured ? 'border-2 border-primary/30' : ''
          }`}
          tilt={true}
          strong={featured}
        >
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              loading="lazy"
            />
            
            {/* Badge for featured products */}
            {featured && !product.isComingSoon && (
              <div className="absolute top-4 right-4 glass-strong px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                <span className="text-xs font-semibold text-neon-gold">Featured</span>
              </div>
            )}
            
            {/* Coming Soon Badge */}
            {product.isComingSoon && (
              <div className="absolute top-4 right-4 glass-strong px-3 py-1 rounded-full flex items-center gap-1 bg-neon-gold/20 border border-neon-gold/30">
                <Star className="w-4 h-4 text-neon-gold" />
                <span className="text-xs font-semibold text-neon-gold">Launching Soon</span>
              </div>
            )}
            
            {/* Stock indicator */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg font-semibold text-muted-foreground">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-2 text-gradient-cyan">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {product.shortDescription}
            </p>

            {/* Price and CTA */}
            <div className="flex items-center justify-between gap-4 mt-auto">
              <div>
                <span className="text-2xl font-bold text-foreground">
                  ₹{(product.price / 100).toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">/-</span>
              </div>
              
              <Button 
                variant="hero" 
                size="sm"
                className="group"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.preventDefault();
                  // This will be handled by the Link wrapper
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                View
              </Button>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};
