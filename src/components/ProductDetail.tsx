/**
 * ProductDetail Component
 * 
 * Comprehensive product detail display component.
 * This is a reusable component that renders the full product information
 * including images, specifications, features, and purchase options.
 * 
 * Features:
 * - Image gallery with multiple views
 * - Feature highlights with icons
 * - Technical specifications table
 * - Add to cart functionality
 * - Glassmorphic design
 * - Fully responsive
 * 
 * Usage:
 * <ProductDetail product={productData} />
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Share2, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { GoldenStarAnimation } from "@/components/GoldenStarAnimation";

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [starPositions, setStarPositions] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const { addToCart, updateQuantity } = useCart();
  const { toast } = useToast();

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    // Check if product is in stock
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    // Get button position for star animation
    if (addToCartButtonRef.current) {
      const buttonRect = addToCartButtonRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('[data-cart-icon]');
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        setStarPositions({
          start: {
            x: buttonRect.left + buttonRect.width / 2,
            y: buttonRect.top + buttonRect.height / 2,
          },
          end: {
            x: cartRect.left + cartRect.width / 2,
            y: cartRect.top + cartRect.height / 2,
          },
        });
        setShowStarAnimation(true);
      }
    }

    // Add the item first
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    // If quantity is more than 1, update it
    if (quantity > 1) {
      // Use a small timeout to ensure the item is added first
      setTimeout(() => {
        updateQuantity(product.id, quantity);
      }, 10);
    }

    toast({
      title: "Added to Cart! ✨",
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  return (
    <>
      {showStarAnimation && (
        <GoldenStarAnimation
          startPosition={starPositions.start}
          endPosition={starPositions.end}
          onComplete={() => setShowStarAnimation(false)}
        />
      )}
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-4" strong>
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]}
                alt={`${product.name} - View ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg aspect-square border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary glow-cyan"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Product Information Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Title and Price */}
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gradient-cyan">
              {product.name}
            </h1>
            <p className="text-muted-foreground mb-4">{product.category}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                ₹{(product.price / 100).toFixed(0)}
              </span>
              <span className="text-lg text-muted-foreground">/-</span>
            </div>
          </div>

          {/* Description */}
          <GlassCard>
            <p className="text-foreground/90 leading-relaxed">
              {product.fullDescription}
            </p>
          </GlassCard>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <GlassCard>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                Available Colors
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="px-3 py-1 rounded-full glass-strong text-sm"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Quantity and Actions */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-muted-foreground">
                Quantity:
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                ref={addToCartButtonRef}
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </GlassCard>

          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gradient-purple">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature, index) => {
                const IconComponent = (LucideIcons as any)[feature.icon] || Check;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gradient-purple">
              Specifications
            </h2>
            <GlassCard>
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
};
