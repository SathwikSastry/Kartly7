/**
 * ProductGrid Component
 * 
 * Displays all products from the products array in a responsive grid layout.
 * Features:
 * - Responsive grid (1 col mobile, 2 tablet, 3+ desktop)
 * - Glassmorphic design with cosmic theme
 * - Hover animations and effects
 * - Out-of-stock product states
 * - Dynamic routing to product detail pages
 * - Loading and error states
 * 
 * Usage:
 * <ProductGrid />
 */

import { motion } from "framer-motion";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ProductGrid = () => {
  // Validate for duplicate slugs
  const slugs = products.map(p => p.slug);
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  
  if (duplicates.length > 0) {
    console.error("Duplicate product slugs detected:", duplicates);
  }

  // Handle empty products array
  if (products.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No products available at this time. Please check back soon.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-cyan">
            Our Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Duplicate slug warning for developers */}
        {duplicates.length > 0 && (
          <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Warning: Duplicate product slugs detected: {duplicates.join(", ")}. 
              This may cause routing conflicts.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
};
