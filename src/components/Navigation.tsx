import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

/**
 * Navigation - Floating glassmorphic navigation bar
 * Features cart icon with item count badge
 */
export const Navigation = () => {
  const { totalItems } = useCart();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="glass-card flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-2xl font-heading font-bold text-gradient-cosmic">
              KARTLY7
            </h1>
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-neon-gold text-background text-xs font-bold rounded-full flex items-center justify-center shadow-neon-gold"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
