# 🛍️ Adding Products to Kartly7

## Overview
Kartly7 uses a flexible product management system that allows you to add products in two ways:
1. **Static Method** (Quick & Easy) - Update `products.ts` file via Lovable
2. **Dynamic Method** (Scalable) - Manage products via Supabase database

Both methods work seamlessly with the existing product page template (`/product/:slug`).

**✅ Automatic Display**: All products added to `products.ts` automatically appear on:
- **Home page product grid** (responsive 1-3 column layout)
- **Individual product detail pages** (`/product/:slug`)
- **Featured product section** (first product in array)

---

## 📋 Product Data Structure

Every product must include these fields:

```typescript
{
  id: string;              // Unique identifier (e.g., "cozycup-premium")
  slug: string;            // URL-friendly name (e.g., "cozycup-premium")
  name: string;            // Display name (e.g., "CozyCup Premium")
  price: number;           // Price in paise (e.g., 2499 = ₹24.99)
  image: string;           // Main product image URL or import
  images?: string[];       // Optional: Multiple product images for gallery
  shortDescription: string; // Brief description (80-120 chars)
  fullDescription: string;  // Detailed description (200-500 chars)
  features: ProductFeature[]; // Array of feature objects
  specifications: ProductSpecification[]; // Technical specs
  colors?: string[];       // Optional: Available color variants
  inStock: boolean;        // Availability status
  category: string;        // Product category (e.g., "Drinkware")
}
```

### Feature Structure
```typescript
{
  icon: string;        // Lucide icon name (e.g., "Thermometer")
  title: string;       // Feature headline
  description: string; // Feature explanation
}
```

### Specification Structure
```typescript
{
  label: string;  // Spec name (e.g., "Capacity")
  value: string;  // Spec value (e.g., "450ml / 15.2oz")
}
```

---

## Method 1: 📝 Static Products via Lovable (Recommended for Small Catalogs)

### Step-by-Step Guide

#### 1️⃣ Open the Products Data File
- In Lovable, navigate to `src/data/products.ts`
- This file contains the central product array

#### 2️⃣ Add Product Images
- Upload product images to `src/assets/` using Lovable's file upload
- Recommended naming: `product-name-main.jpg`, `product-name-angle1.jpg`, etc.
- Supported formats: JPG, PNG, WEBP
- Recommended size: 800x800px minimum, square aspect ratio

Example:
```
src/assets/smartwatch-hero.jpg
src/assets/smartwatch-side.jpg
src/assets/smartwatch-display.jpg
```

#### 3️⃣ Import Images in products.ts
At the top of `products.ts`, add import statements:

```typescript
import smartwatchHero from "@/assets/smartwatch-hero.jpg";
import smartwatchSide from "@/assets/smartwatch-side.jpg";
import smartwatchDisplay from "@/assets/smartwatch-display.jpg";
```

#### 4️⃣ Add Product Object to Array
Duplicate an existing product object and modify it:

```typescript
export const products: Product[] = [
  {
    id: "cozycup-premium",
    slug: "cozycup-premium",
    name: "CozyCup Premium",
    price: 2499,
    image: cozycupHero,
    images: [
      cozycupHero,
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
  
  {
    id: "smartwatch-pro",
    slug: "smartwatch-pro",
    name: "SmartWatch Pro",
    price: 4999,
    image: smartwatchHero,
    images: [
      smartwatchHero,
      smartwatchSide,
      smartwatchDisplay,
    ],
    shortDescription: "Advanced fitness tracker with heart rate monitoring and 7-day battery life.",
    fullDescription: "Experience next-level health tracking with SmartWatch Pro. Features include real-time heart rate monitoring, sleep analysis, step counter, and water resistance up to 50m. Stay connected with smart notifications.",
    features: [
      {
        icon: "Heart",
        title: "Heart Rate Monitor",
        description: "Continuous heart rate tracking with zone alerts"
      },
      {
        icon: "Activity",
        title: "Fitness Tracking",
        description: "20+ sport modes with GPS tracking"
      },
      {
        icon: "Battery",
        title: "7-Day Battery",
        description: "Long-lasting battery with fast charging"
      },
      {
        icon: "Droplets",
        title: "Water Resistant",
        description: "50m water resistance for swimming and showers"
      }
    ],
    specifications: [
      { label: "Display", value: "1.4\" AMOLED Touchscreen" },
      { label: "Battery Life", value: "7 days typical use" },
      { label: "Water Resistance", value: "5ATM (50m)" },
      { label: "Connectivity", value: "Bluetooth 5.0" },
      { label: "Weight", value: "45g" },
      { label: "Compatibility", value: "iOS & Android" }
    ],
    colors: ["Midnight Black", "Ocean Blue", "Rose Gold"],
    inStock: true,
    category: "Wearables"
  }
];
```

#### 5️⃣ Test the Product
- Save the file
- Navigate to `http://yoursite.com/product/smartwatch-pro`
- The product should appear automatically on the landing page in the featured section

---

## Method 2: 🗄️ Dynamic Products via Supabase (Recommended for Large Catalogs)

### Benefits
- Manage products without code changes
- Update prices and stock in real-time
- Easy bulk imports via CSV
- Admin dashboard integration possible

### Setup Instructions

#### 1️⃣ Verify Products Table
The `products` table is already created in Supabase with these columns:
- `id` (text, primary key)
- `name` (text)
- `description` (text)
- `price` (numeric)
- `image_url` (text)
- `stock_quantity` (integer)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 2️⃣ Add Products via Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/navpaaalobnyssvvhctk)
2. Navigate to **Table Editor** → `products`
3. Click **Insert Row**
4. Fill in the product details:
   - `id`: "smartwatch-pro"
   - `name`: "SmartWatch Pro"
   - `price`: 4999
   - `description`: "Advanced fitness tracker..."
   - `image_url`: "https://your-cdn.com/smartwatch.jpg"
   - `stock_quantity`: 50
   - `is_active`: true

#### 3️⃣ Upload Product Images to Supabase Storage
1. Go to **Storage** → Create bucket `product-images` (public)
2. Upload images: `smartwatch-pro-main.jpg`, etc.
3. Get public URL and paste into `image_url` field

#### 4️⃣ Fetch Products Dynamically
Update `src/data/products.ts` to fetch from Supabase:

```typescript
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import cozycupHero from "@/assets/cozycup-hero.jpg";

const staticProducts: Product[] = [
  {
    id: "cozycup-premium",
    slug: "cozycup-premium",
    name: "CozyCup Premium",
    price: 2499,
    image: cozycupHero,
    images: [
      cozycupHero,
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
];

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return staticProducts;
  }

  return data.map(p => ({
    id: p.id,
    slug: p.id,
    name: p.name,
    price: p.price,
    image: p.image_url,
    shortDescription: p.description?.substring(0, 120) || '',
    fullDescription: p.description || '',
    features: [],
    specifications: [],
    inStock: p.stock_quantity > 0,
    category: "General"
  }));
};

export const products = staticProducts;

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.inStock);
};
```

#### 5️⃣ Update Product Pages to Use Dynamic Data
Modify `src/pages/Product.tsx` and `src/components/FeaturedProduct.tsx` to call `fetchProducts()` on mount.

---

## 🎨 Design Guidelines

### Product Images
- **Resolution**: 800x800px minimum (1200x1200px recommended)
- **Format**: JPG (photos), PNG (graphics with transparency), WEBP (modern browsers)
- **Aspect Ratio**: 1:1 (square) for consistency
- **File Size**: < 500KB per image (optimize with TinyPNG or ImageOptim)
- **Background**: Clean white or transparent background preferred

### Naming Conventions
- **IDs/Slugs**: Use kebab-case (e.g., "wireless-earbuds-pro")
- **Image Files**: product-slug-variant.jpg (e.g., "earbuds-pro-black.jpg")
- **Categories**: Use title case (e.g., "Electronics", "Drinkware", "Accessories")

### Writing Product Descriptions
- **Short Description**: 80-120 characters, highlight key benefit
- **Full Description**: 200-500 characters, explain value and use case
- **Features**: Focus on benefits, not just specs (e.g., "12-hour battery" → "All-day power without charging")
- **Specifications**: Include measurable data (dimensions, weight, capacity, materials)

---

## 📦 Sample Products for Testing

Here are 10 ready-to-use product templates you can add:

```typescript
// 1. Wireless Earbuds
{
  id: "wireless-earbuds-pro",
  slug: "wireless-earbuds-pro",
  name: "AirFlow Pro Earbuds",
  price: 2999,
  shortDescription: "Premium wireless earbuds with active noise cancellation and 24-hour playtime.",
  category: "Audio",
  inStock: true
}

// 2. Portable Charger
{
  id: "power-bank-ultra",
  slug: "power-bank-ultra",
  name: "PowerBank Ultra 20000mAh",
  price: 1999,
  shortDescription: "High-capacity portable charger with fast charging and dual USB ports.",
  category: "Electronics",
  inStock: true
}

// 3. Smart Water Bottle
{
  id: "hydro-smart-bottle",
  slug: "hydro-smart-bottle",
  name: "HydroTrack Smart Bottle",
  price: 1499,
  shortDescription: "Intelligent water bottle that tracks hydration and reminds you to drink.",
  category: "Drinkware",
  inStock: true
}

// 4. Bluetooth Speaker
{
  id: "sonic-wave-speaker",
  slug: "sonic-wave-speaker",
  name: "SonicWave Mini Speaker",
  price: 3499,
  shortDescription: "Compact waterproof speaker with 360° surround sound and 12-hour battery.",
  category: "Audio",
  inStock: true
}

// 5. Fitness Tracker
{
  id: "fitband-active",
  slug: "fitband-active",
  name: "FitBand Active",
  price: 2499,
  shortDescription: "Slim fitness band with step tracking, sleep monitoring, and 10-day battery.",
  category: "Wearables",
  inStock: true
}

// 6. LED Desk Lamp
{
  id: "smart-desk-lamp",
  slug: "smart-desk-lamp",
  name: "LumiDesk Smart Lamp",
  price: 1899,
  shortDescription: "Adjustable LED desk lamp with wireless charging base and touch controls.",
  category: "Home & Office",
  inStock: true
}

// 7. Phone Stand
{
  id: "magnetic-phone-stand",
  slug: "magnetic-phone-stand",
  name: "MagStand Pro",
  price: 799,
  shortDescription: "Magnetic phone holder with 360° rotation and adjustable viewing angles.",
  category: "Accessories",
  inStock: true
}

// 8. Laptop Sleeve
{
  id: "premium-laptop-sleeve",
  slug: "premium-laptop-sleeve",
  name: "TechShield Laptop Sleeve 15\"",
  price: 1299,
  shortDescription: "Waterproof laptop sleeve with shock-absorbing padding and accessory pocket.",
  category: "Accessories",
  inStock: true
}

// 9. USB-C Hub
{
  id: "multi-port-hub",
  slug: "multi-port-hub",
  name: "ConnectHub 7-in-1",
  price: 2199,
  shortDescription: "Versatile USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.",
  category: "Electronics",
  inStock: true
}

// 10. Wireless Charger
{
  id: "qi-wireless-charger",
  slug: "qi-wireless-charger",
  name: "ChargePad Wireless",
  price: 999,
  shortDescription: "Fast wireless charging pad compatible with all Qi-enabled devices.",
  category: "Electronics",
  inStock: true
}
```

---

## 🔄 How It All Works

### Automatic URL Generation
When you add a product with `slug: "smartwatch-pro"`, it automatically gets a dedicated page at:
```
https://kartly7.com/product/smartwatch-pro
```

### Featured Products Grid
The landing page (`src/pages/Landing.tsx`) automatically displays all products from the `products` array or Supabase query. No additional configuration needed.

### Cart & Checkout Integration
All products automatically work with the existing cart, checkout, and payment flow. The loyalty points system also applies to all products.

---

## 🚀 Best Practices

### ✅ Do's
- Use high-quality, well-lit product photos
- Write clear, benefit-focused descriptions
- Keep slugs URL-friendly (lowercase, hyphens only)
- Test products in both light and dark mode
- Verify mobile responsiveness after adding images

### ❌ Don'ts
- Don't use spaces or special characters in slugs
- Don't upload images larger than 2MB (optimize first)
- Don't leave `inStock: false` for too long (remove product instead)
- Don't duplicate product IDs or slugs (causes routing conflicts)
- Don't skip the `shortDescription` (used in product cards)

---

## 🛠️ Troubleshooting

### Product Not Showing on Landing Page
- Verify `inStock: true` in product data
- Check that the product is added to the `products` array
- Clear browser cache and refresh

### Product Page Shows 404
- Ensure the slug matches the URL exactly (case-sensitive)
- Check for typos in the slug field
- Verify the product exists in `products.ts` or Supabase

### Images Not Loading
- Confirm images are imported correctly: `import image from "@/assets/image.jpg"`
- Check file path spelling
- Verify image file extension matches import statement

### Payment/Checkout Issues
- The checkout system is product-agnostic and should work automatically
- If issues persist, check `src/contexts/CartContext.tsx` for errors

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors (F12 → Console)
2. Review this guide's examples
3. Test with a sample product first
4. Verify Supabase connection if using dynamic products

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Maintained by**: Kartly7 Development Team
