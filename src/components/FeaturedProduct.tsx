import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { GlassCard } from "./ui/glass-card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";

// Get the first product as featured (can be customized)
const featuredProduct = products[0];

/**
 * FeaturedProduct - Showcase section for the hero product
 * Features 3D rotation effect and scroll-triggered reveal animation
 */
export const FeaturedProduct = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Featured Product
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the perfect blend of style and functionality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard strong glow="cyan" className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Product Image with 3D effect */}
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/60 to-transparent" />
              </motion.div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-heading font-bold mb-2 text-gradient-cyan"
                  >
                    {featuredProduct.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-muted-foreground"
                  >
                    {featuredProduct.category}
                  </motion.p>
                </div>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-foreground leading-relaxed"
                >
                  {featuredProduct.fullDescription}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  <span className="px-3 py-1 glass rounded-full text-sm">
                    Double-Wall Insulation
                  </span>
                  <span className="px-3 py-1 glass rounded-full text-sm">
                    Premium Stainless Steel
                  </span>
                  <span className="px-3 py-1 glass rounded-full text-sm">
                    Leak-Proof Design
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to={`/product/${featuredProduct.slug}`}>
                    <Button variant="hero" size="lg">
                      View Full Details
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
