# Bolatemi Global and Sons — Frontend

Vite + React + TypeScript storefront and admin dashboard for Bolatemi Global
and Sons Enterprises. Talks to the companion `bolatemi-backend` API.

## What's built

**Storefront** — Home, Shop (search/filter/pagination), Product Detail
(gallery, specs table, quantity picker, fixed-price or "Request Quote"
handling), Cart, Checkout → Paystack redirect, Payment Callback
(success/failure), Request a Quote, Bulk Orders, About, Contact, Testimonials,
FAQ, four legal pages (Privacy/Terms/Refund/Delivery), floating WhatsApp
button on every page, 404.

**Admin dashboard** — Login (JWT), analytics dashboard (sales, orders, best
sellers), Products (list + create), Orders (list + status), Quotes/Bulk
Orders (pipeline with status updates), Testimonials (approve/unpublish/
delete), Contact Messages (inbox).

**Design system** — carries the industrial "spec-plate" visual language from
the approved homepage concept: steel-blue base, safety-yellow/orange accents,
hazard-stripe dividers, mono-font SKU/spec labeling. One shared stylesheet
(`src/styles/global.css`) drives both the storefront and the admin dashboard.

## Not yet built

- Product edit (admin can create and delete products; editing an existing one isn't wired up yet — follow the pattern in `pages/admin/Products.tsx`)
- Multi-image upload UI in the admin product form (the backend supports it via `/api/uploads/bulk`; the form currently takes one image URL — wire a file `<input type="file">` to that endpoint next)
- Customer-facing accounts/login (checkout is guest-style — matches a customer to an order by phone/email — there's no "my orders" page)
- Blog (listed in the original spec's page list; no CMS/editor exists yet on either side)

## Setup

```bash
npm install
cp .env.example .env       # point VITE_API_URL at your running backend
npm run dev                 # http://localhost:5173
```

Requires the backend running (see `bolatemi-backend/README.md`) — the
frontend calls it directly, there's no mock data layer.

## Verified

- `npx tsc -b` — clean typecheck across the entire app
- `npm run build` — clean production build (68 modules, ~81 KB gzipped JS)

## Project structure

```
src/
  components/   SiteHeader, SiteFooter, WhatsAppFloat, PublicLayout,
                AdminLayout, ProductCard, QuoteForm
  context/      CartContext (localStorage-backed), AdminAuthContext (JWT)
  lib/          api.ts (fetch wrapper), types.ts
  pages/        public storefront pages
  pages/admin/  admin dashboard pages
  styles/       global.css — the whole design system in one file
```

## Deployment

Static build — deploys anywhere that serves static files: Vercel, Netlify,
Render static sites, or behind nginx on a VPS alongside the backend.

```bash
npm run build     # outputs to dist/
```

Set `VITE_API_URL` (and `VITE_WHATSAPP_NUMBER`) as build-time environment
variables on your host — Vite inlines them at build time, so they must be set
*before* `npm run build` runs, not just at runtime.

Make sure the backend's `CLIENT_URL` env var matches wherever this ends up
deployed — CORS and the Paystack callback URL both depend on it.
