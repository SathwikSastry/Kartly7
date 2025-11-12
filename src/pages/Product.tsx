import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ShoppingCart, Heart, Share2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import cozycupImage from "@/assets/cozycup-hero.jpg";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

/**
 * Product Page - Detailed view of CozyCup product
 * Features 3D product showcase, pricing, and detailed descriptions
 * Responsive design with scroll-triggered animations
 */
const Product = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const benefits = [
    "Keeps drinks hot for 6+ hours, cold for 12+ hours",
    "Premium 304 stainless steel construction",
    "Leak-proof lid with easy-pour spout",
    "Ergonomic design fits standard cup holders",
    "BPA-free and environmentally conscious",
    "Easy to clean, dishwasher safe",
  ];

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <CustomCursor />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-strong sticky top-0 z-50 border-b border-border/30"
      >
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <h2 className="text-2xl font-heading font-bold text-gradient-cosmic">
            KARTLY7
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Product Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard strong glow="cyan" className="relative aspect-square">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={cozycupImage}
                alt="CozyCup Premium Insulated Coffee Cup"
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Floating light ring effect */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-primary/30 blur-xl rounded-full animate-glow-pulse" />
            </GlassCard>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-3 text-gradient-cyan">
                CozyCup
              </h1>
              <p className="text-xl text-muted-foreground">
                Premium Insulated Coffee Cup
              </p>
            </div>

            {/* Price */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gradient-cosmic">₹599</span>
                <span className="text-xl text-muted-foreground line-through">₹899</span>
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                  33% OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes • Free shipping on orders above ₹499
              </p>
            </div>

            {/* Description */}
            <p className="text-foreground leading-relaxed">
              Elevate your beverage experience with CozyCup. Meticulously engineered with 
              premium double-wall vacuum insulation technology, this stunning companion 
              maintains your drink's ideal temperature throughout your day. From morning 
              coffee rituals to late-night tea sessions, CozyCup transforms every sip into 
              a moment of pure comfort.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="flex-1">
                <ShoppingCart className="mr-2" />
                Add to Cart
              </Button>
              <Button variant="neon" size="lg">
                <Heart className="mr-2" />
                Wishlist
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">6H+</div>
                <div className="text-xs text-muted-foreground">Hot Retention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">12H+</div>
                <div className="text-xs text-muted-foreground">Cold Retention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs text-muted-foreground">Leak-Proof</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How It Improves Your Life Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">
            How <span className="text-gradient-cosmic">CozyCup</span> Improves Your Life
          </h2>
          
          <GlassCard strong className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-foreground text-lg">{benefit}</p>
              </motion.div>
            ))}
          </GlassCard>
        </motion.section>

        {/* Specifications */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">
            Product Specifications
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard glow="purple">
              <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
                Dimensions & Materials
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="text-foreground font-medium">350ml / 12oz</span>
                </div>
                <div className="flex justify-between">
                  <span>Height:</span>
                  <span className="text-foreground font-medium">15.5 cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Diameter:</span>
                  <span className="text-foreground font-medium">7.5 cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="text-foreground font-medium">304 Stainless Steel</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow="magenta">
              <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
                Features & Care
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Insulation:</span>
                  <span className="text-foreground font-medium">Double-Wall Vacuum</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span className="text-foreground font-medium">285g (lightweight)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning:</span>
                  <span className="text-foreground font-medium">Dishwasher Safe</span>
                </div>
                <div className="flex justify-between">
                  <span>Warranty:</span>
                  <span className="text-foreground font-medium">1 Year</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
