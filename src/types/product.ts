/**
 * Product Type Definitions
 * 
 * Defines the TypeScript interfaces for product data throughout the application.
 * This ensures type safety and makes it easy to integrate with databases later.
 */

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  images?: string[]; // Additional product images for gallery
  shortDescription: string;
  fullDescription: string;
  features: ProductFeature[];
  specifications: ProductSpecification[];
  colors?: string[];
  inStock: boolean;
  category: string;
}
