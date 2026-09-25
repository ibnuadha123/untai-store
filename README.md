# Untai — Phone Strap Store

A single-page e-commerce site for a small phone-strap brand. Built with
Next.js (App Router), TypeScript, Tailwind CSS, and Motion.

## Current status: Phase 1–3 complete

This build covers **project setup, design system, and the visual landing
page**, using mock product data. It does **not** yet include:

- Supabase (database or storage)
- Real checkout / order creation
- QRIS / DANA payment display
- Payment proof upload
- Order status lookup

Those are the next phases (see `PHASE ROADMAP` below), matching the original
development plan.

## What's here

- **Design system** — color, type, and spacing tokens in
  `tailwind.config.ts` and `app/globals.css`.
- **Sections** — `Navbar`, `Hero`, `ProductSection` (featured products),
  `PromoSection`, `CollectionSection` (full catalog), `AboutSection`,
  `FAQSection`, `Footer`, all composed in `app/page.tsx`.
- **Cart** — `lib/cart.tsx` is a working cart (add/remove/quantity/subtotal)
  built on React state, wired into `CartDrawer.tsx` and the navbar's cart
  icon. It's in-memory only for now — no `localStorage` persistence and no
  checkout button yet, since those are scoped to a later phase.
- **Mock data** — `lib/mock-products.ts`, typed against `types/product.ts`.
  Product images are on-brand SVG placeholders in `public/images/` (real
  photography can replace these later without any code changes, as long as
  the file names in `mock-products.ts` — or later, the `image_url` column
  in Supabase — point at the new files).

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

No environment variables are required yet. `.env.example` documents the
variables that Phase 4 (Supabase) will need.

## Phase roadmap

Matches the original development plan:

1. ✅ Project preparation
2. ✅ Brand + design system
3. ✅ Landing page (mock data)
4. ⬜ Supabase setup (database, storage, RLS)
5. ⬜ Product system connected to Supabase
6. ⬜ Cart persistence (localStorage)
7. ⬜ Checkout (server-side order creation)
8. ⬜ QRIS / DANA payment display
9. ⬜ Payment proof upload
10. ⬜ Order status lookup
11. ⬜ Security review
12. ⬜ Polish
13. ⬜ Testing
14. ⬜ Deployment (Vercel)

## Notes on the design

- Brand palette avoids the common AI-generated defaults (warm cream +
  terracotta, near-black + acid green, generic SaaS card grids). Tokens are
  named `ink`, `cloud`, `raspberry`, `gold`, `forest`, and `paper` in
  `tailwind.config.ts`.
- Display type is Fraunces (serif, expressive); body type is Archivo
  (grotesque sans). Loaded via a Google Fonts `<link>` in `app/layout.tsx`
  rather than `next/font/google`, which works in any build environment
  without requiring network access to Google's font CDN at build time.
- The featured-products grid offsets every third card vertically, and the
  collection section uses mixed tile sizes (a "scrapbook" layout) rather
  than a uniform grid.
