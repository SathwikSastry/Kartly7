/**
 * Product Page - Dynamic Product Template
 * 
 * This page serves as the universal template for all product detail pages.
 * It uses React Router's dynamic routing to display different products based on the URL slug.
 * 
 * Route: /product/:slug
 * 
 * How it works:
 * 1. Extracts the product slug from the URL using useParams
 * 2. Looks up the product data from the products array
 * 3. Renders ProductDetail component if found, or ProductNotFound if not
 * 
 * Future: Product data will be fetched from Supabase based on slug
 */

import { useParams, Navigate } from "react-router-dom";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductNotFound } from "@/components/ProductNotFound";
import { getProductBySlug } from "@/data/products";

const Product = () => {
  // Get the product slug from the URL
  const { slug } = useParams<{ slug: string }>();
  
  // Handle missing slug (shouldn't happen with proper routing)
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  // Look up the product by slug
  const product = getProductBySlug(slug);

  // Show 404 if product not found
  if (!product) {
    return <ProductNotFound />;
  }

  // Render the product detail component
  return <ProductDetail product={product} />;
};

export default Product;
