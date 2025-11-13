/**
 * ProductNotFound Component
 * 
 * Displayed when a user navigates to a product page that doesn't exist.
 * Features a styled 404 message with a link back to home and suggested products.
 * 
 * Usage:
 * <ProductNotFound />
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";

export const ProductNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <GlassCard className="text-center" strong glow="purple">
          <div className="mb-6">
            <div className="text-8xl font-bold text-gradient-cosmic mb-4">404</div>
            <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, the product you're looking for doesn't exist or has been removed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="hero" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
