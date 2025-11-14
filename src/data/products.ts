/**
 * Product Data Store
 * 
 * Central location for all product information.
 * This file serves as a temporary data source until database integration.
 * 
 * To add a new product:
 * 1. Import the product image(s)
 * 2. Add a new Product object to the products array
 * 3. The product will automatically appear in listings and have its own detail page
 * 
 * Future: This data will be fetched from Supabase using the products table
 */

import { Product } from "@/types/product";
import cozycupHero from "@/assets/cozycup-hero.jpg";

export const products: Product[] = [
  {
    id: "cozycup-premium",
    slug: "cozycup-premium",
    name: "CozyCup Premium",
    price: 2499,
    image: cozycupHero,
    images: [
      cozycupHero,
      cozycupHero, // Add more unique images here when available
      cozycupHero, // Different angle
      cozycupHero, // Close-up shot
      cozycupHero, // Product in use
    ],
    shortDescription: "Premium 450ml insulated smart mug with digital temperature display and 360° leak-proof technology.",
    fullDescription: "Experience the perfect temperature every time with CozyCup Premium. Featuring advanced 316 stainless steel construction, intelligent temperature monitoring, and industry-leading insulation that keeps your beverages hot for up to 12 hours or cold for 24 hours.",
    features: [
      {
        icon: "Thermometer",
        title: "Digital Temperature Display",
        description: "Real-time temperature monitoring on the integrated LED display"
      },
      {
        icon: "Lock",
        title: "360° Leak-Proof",
        description: "Advanced sealing technology prevents spills from any angle"
      },
      {
        icon: "Shield",
        title: "316 Stainless Steel",
        description: "Premium food-grade material that's durable and corrosion-resistant"
      },
      {
        icon: "Timer",
        title: "12-Hour Insulation",
        description: "Keeps beverages hot for 12 hours, cold for 24 hours"
      }
    ],
    specifications: [
      { label: "Capacity", value: "450ml / 15.2oz" },
      { label: "Material", value: "316 Stainless Steel" },
      { label: "Insulation", value: "6-12 hours hot, 24 hours cold" },
      { label: "Weight", value: "320g" },
      { label: "Dimensions", value: "17cm × 7.5cm" },
      { label: "Display", value: "LED Temperature Monitor" }
    ],
    colors: ["Fog White Coffee", "Fog White Black", "Fog White Blue", "Archaism Silver", "Elegant White"],
    inStock: true,
    category: "Drinkware"
  },
  // Add more products here following the same structure
  // Example:
  // {
  //   id: "product-2",
  //   slug: "product-2-slug",
  //   name: "Product Name",
  //   price: 1999,
  //   image: productImage,
  //   shortDescription: "Brief description",
  //   fullDescription: "Detailed description",
  //   features: [...],
  //   specifications: [...],
  //   inStock: true,
  //   category: "Category Name"
  // }
];

/**
 * Validate product data for duplicate slugs/ids
 */
const validateProducts = () => {
  const slugs = products.map(p => p.slug);
  const ids = products.map(p => p.id);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  
  if (duplicateSlugs.length > 0) {
    console.error("❌ Duplicate product slugs detected:", [...new Set(duplicateSlugs)]);
  }
  if (duplicateIds.length > 0) {
    console.error("❌ Duplicate product IDs detected:", [...new Set(duplicateIds)]);
  }
  
  return duplicateSlugs.length === 0 && duplicateIds.length === 0;
};

// Run validation in development
if (import.meta.env.DEV) {
  validateProducts();
}

/**
 * Helper function to get a product by slug
 * Returns undefined if product not found
 */
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

/**
 * Helper function to get all products in a category
 */
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

/**
 * Helper function to get featured/recommended products
 * Currently returns all products, but can be customized later
 */
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.inStock);
};

// Coming Soon Product
const comingSoonProduct: Product = {
  id: "coming-soon",
  name: "New Products",
  slug: "coming-soon",
  image: "/placeholder.svg",
  shortDescription: "Exciting new products launching soon. Stay tuned!",
  fullDescription: "We're working on something special. New innovative products will be available soon. Check back regularly for updates!",
  price: 0,
  features: [
    {
      icon: "Sparkles",
      title: "Coming Soon",
      description: "New products launching soon"
    }
  ],
  specifications: [
    {
      label: "Status",
      value: "Coming Soon"
    }
  ],
  category: "upcoming",
  inStock: false,
  isComingSoon: true
};

// Add coming soon product to the products array
products.push(comingSoonProduct);
