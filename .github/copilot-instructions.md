## Purpose

This file gives focused, actionable guidance to AI coding agents working in the Kartly7 repository so they can be productive immediately.

## Big-picture architecture (inferred / planned)

- Frontend: React + TypeScript. UI composed of components under `components/` (e.g. `Hero.tsx`, `Header.tsx`, `ProductCard.tsx`).
- 3D viewer: `react-three-fiber` for product models, with a fallback static image. Expect a component at `components/ProductViewer.tsx` or `components/Viewer/`.
- State: a Cart context persisted to `localStorage` (see `contexts/CartContext.tsx` or `store/cart.ts`). The cart should expose add/remove/update and emit events for the fly-to-cart animation.
- Data: static JSON files (e.g. `data/products.json`, `data/footer-links.json`) are the canonical product & footer data sources during development.

## What to look for first

- Top-level files: `README.md` (project intent). If a `package.json` appears, use it to infer scripts. Currently this repo is minimal — check with the user before large refactors.
- Look for `components/`, `pages/` or `src/` to identify where UI is implemented. If missing, follow the component names below when adding files.

## Project-specific conventions and patterns

- Filenames: Prefer PascalCase for React components (e.g. `ProductCard.tsx`, `Hero.tsx`).
- Styling: Global styles live in `styles/globals.css`. Use BEM-like utility classes sparingly; the project uses glassmorphism for overlays (Header, Cart drawer).
- 3D viewer: Use `react-three-fiber` + `drei` helpers. Keep a light fallback (JPEG/PNG) next to models: `public/models/<sku>.glb` and `public/images/<sku>.jpg`.
- Cart persistence: Save a minimal cart shape to `localStorage` under `kartly_cart_v1` (id, qty, variant). Use a single source of truth: CartContext.

## Files & examples (explicit guidance)

- components/Hero.tsx — parallax hero, small indoor parallax using `framer-motion` for subtle movement.
- components/ProductCard.tsx — shows product image, name, price, variant selector; emits `addToCart(product, variant)`.
- components/ProductGrid.tsx — maps `data/products.json` -> `ProductCard`.
- components/ProductDetail.tsx or pages/product/[id].tsx — includes `ProductViewer`, tabs (Description, Specs, Reviews), and variant selection.
- components/CartDrawer.tsx — animated drawer; use `framer-motion` and respect reduced-motion preferences.
- contexts/CartContext.tsx — expose: `items`, `add(item)`, `remove(itemId)`, `updateQty(itemId, qty)`, `clear()`; handles `localStorage` sync.

## Environment & run commands (Windows PowerShell)

If a Node project is added, prefer these PowerShell-friendly commands:

```
# install
npm ci ;# or npm install

# dev server (typical Next.js or Vite):
npm run dev

# build
npm run build

# tests (Jest / Vitest)
npm test
```

If you add environment variables, create `.env.example` with keys used in code (e.g. NEXT_PUBLIC_API_URL, STRIPE_KEY). Never store secrets here.

## Unit tests and expectations

- Write unit tests for `ProductCard`, cart logic in `contexts/CartContext.tsx`, and tracking/order flow.
- Keep tests small and deterministic; mock localStorage and three-fiber renderer for viewer tests.

## CI notes (GitHub Actions)

- Simple CI should run: install -> lint -> test -> build. Place workflow under `.github/workflows/ci.yml`. Use matrix only when needed.

## When to modify or extend files

- Add `data/products.json` when creating seed data. Format:

```json
[{"id":"sku-123","name":"Example","price":129.99,"images":["/images/sku-123.jpg"],"variants":[{"id":"v1","name":"Black"}]}]
```

- Create `.env.example` with non-sensitive keys that the app reads using `process.env`.

## Typical small tasks and how to approach them

- Implement a new component: Find similar component (e.g. `ProductCard`) to copy patterns (props, CSS, tests). Keep prop shapes explicit with TypeScript interfaces.
- Add a 3D model: put `*.glb` into `public/models`, update `Product` entry to reference it, and ensure `ProductViewer` falls back to `images[0]` if model missing.
- Fly-to-cart animation: trigger from `ProductCard` by emitting a DOM image clone that animates to the `#cart-icon` position; keep business logic in CartContext and animation purely presentational.

## What I couldn't infer (ask the user)

- Package manager and scripts (no `package.json` present).
- Exact state shape for cart and product model schema.
- Preferred testing framework (Jest vs Vitest) and linting rules.

If any of the above is missing, ask: "Which package manager and test runner should I use?" or provide defaults (npm + Vitest + ESLint) and request approval.

## Feedback

If this file looks correct, I can: create sample `data/products.json`, add `.env.example`, scaffold `contexts/CartContext.tsx`, or start implementing `components/ProductCard.tsx`. Tell me which next step you prefer or provide missing details (package.json, test framework preference).
