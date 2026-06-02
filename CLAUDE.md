# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**DRIP** is a premium streetwear & footwear marketplace. Full-stack e-commerce with customer, brand owner, and admin roles.

## Commands

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY      # Public anon key
SUPABASE_SERVICE_ROLE_KEY          # Service role for server-side mutations
NEXT_PUBLIC_SITE_URL               # http://localhost:3000 in dev
```

## Architecture

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + Storage) · Zustand · React Hook Form + Zod

### Route Groups

- `app/(store)/` — Public storefront (homepage, shop, product detail, brand pages, cart, account)
- `app/(auth)/` — Login and register pages
- `app/admin/` — Protected admin dashboard (products, brands, orders, reviews)
- `app/api/` — API routes: `products`, `brands`, `orders`, `upload`, `auth/signup`, `auth/callback`

### Auth & Access Control

`middleware.ts` enforces route protection: `/admin/*` requires `profile.role === 'admin'`, `/account/*` requires any authenticated user. Uses Supabase SSR cookie pattern — `lib/supabase/client.ts` for browser, `lib/supabase/server.ts` for server components and API routes.

API routes that write data use the **service role client** (bypasses RLS). Read operations use the anon client with RLS.

### State Management

- **`lib/store/authStore.ts`** — Zustand store: user session, profile, `isAdmin` flag
- **`lib/store/cartStore.ts`** — Zustand cart persisted to `localStorage` as `drip-cart`

### Data Fetching Hooks

`lib/hooks/` contains `useProducts`, `useOrders`, `useBrands` — client-side hooks using the Supabase browser client with filter params passed via URL (managed with `nuqs`).

### Database Schema

Six tables, all RLS-protected:

| Table | Key fields |
|---|---|
| `profiles` | `role` (customer \| brand_owner \| admin) |
| `brands` | `owner_id`, `slug`, `featured`, `approved` |
| `products` | `brand_id`, `category` (Men/Women/Accessories), `sizes[]`, `colors[]`, `images[]`, `stock`, `featured` |
| `orders` | `items` (jsonb), `shipping_address` (jsonb), `status` (pending→delivered) |
| `reviews` | `product_id`, `rating` (1–5) |
| `wishlists` | `user_id` + `product_id` (unique) |

Migrations are in `supabase/migrations/` — run via Supabase SQL editor or CLI.

### Components

- `components/ui/` — Base primitives (button, input, modal, table, select, badge, card, skeleton)
- `components/store/` — Storefront components (Navbar, ProductCard, ProductGrid, FilterSidebar, CartDrawer, HeroBanner)
- `components/admin/` — Admin views (ProductTable, ProductModal, BrandTable, OrderTable, StatCard)

### Styling

Tailwind with custom theme: `navy` / `cream` / `gold` color tokens, Playfair Display (headings), DM Sans (body). `lib/utils.ts` exports `cn` (clsx + twMerge), `formatPrice`, and `slugify`.

### Images

Product images stored in Supabase Storage bucket `product-images`. `next.config.js` allows remote patterns from `*.supabase.co` and `images.unsplash.com`.
