# Bolatemi Global and Sons — Backend API

TypeScript + Express + PostgreSQL (Prisma) API for the Bolatemi Global and Sons
Enterprises e-commerce platform.

## What's built

- **Auth**: JWT-based admin login (`/api/auth`), role-based access (`SUPER_ADMIN`, `ADMIN`, `SALES`)
- **Products & Categories**: full CRUD, search, filtering, pagination, fixed-price
  or "request quote" pricing mode for size-dependent items
- **Quotes**: public submission endpoint powering both "Request a Quote" and
  "Request Bulk Quote", admin pipeline view (`NEW → CONTACTED → QUOTED → WON/LOST`),
  email confirmation to the customer + alert to the sales inbox
- **Orders & Payments**: cart → checkout → Paystack → verified payment → stock
  decrement → order confirmation email. Confirmed via **both** the redirect-verify
  route and a signed Paystack **webhook** (`/api/webhooks/paystack`) — the webhook
  is the reliable path in production since a closed tab can miss the redirect
- **Customers**: admin list/search/detail with order + quote history
- **Testimonials**: public submission, admin approval queue (no fake reviews —
  nothing shows publicly until approved)
- **Contact messages**: public submission, admin inbox
- **Admin dashboard analytics**: total/today sales, order counts by status,
  quote requests, customer count, best-selling products
- **Image uploads**: local-disk storage for product photos (single + bulk)
- **Database schema**: Prisma models for every entity in the spec
- **Security**: helmet, CORS locked to `CLIENT_URL`, rate limiting, bcrypt
  password hashing, Zod input validation on every write route, webhook HMAC
  signature verification, no secrets in frontend-reachable code

## Known limitation to fix before production

- **File storage**: product images currently save to local disk
  (`middleware/upload.ts`). This works on a VPS but breaks on Render/Railway/
  most PaaS hosts, whose filesystem is wiped on every redeploy. Swap for
  Cloudinary/S3 before deploying anywhere other than a VPS — only that one
  file needs to change.
- **Email**: uses your SMTP account for both customer emails and the internal
  sales alert. Fine at low volume; move to a transactional provider
  (Postmark, SES, Resend) if volume grows — Gmail/most SMTP providers will
  rate-limit or flag high-volume sending from a personal account.

## Setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, PAYSTACK keys, etc.
npx prisma migrate dev --name init
npm run seed                 # creates categories, 12 real products, and a super admin login
npm run dev                   # starts on http://localhost:5000
```

Default seeded admin login (change immediately):
`admin@bolatemiglobal.com` / `ChangeMe123!`

The seed also creates one product per category (12 total, covering every
item from the original product flyer) using the photos already bundled in
the frontend's `public/images/products/` folder. **Prices on the seeded
products are placeholders** — edit them for real in the admin dashboard
before going live. Pipes and fittings are seeded as "Request Quote" (since
their real price depends on size/spec), matching the original brief.

## Project structure

```
src/
  config/       env vars, Prisma client singleton
  controllers/  thin HTTP layer — parses req, calls a service, shapes the response
  services/     business logic — the only layer that talks to Prisma or Paystack
  middleware/   auth (JWT), validate (Zod), errorHandler
  routes/       route wiring per resource
  validators/   Zod schemas per resource
  utils/        ApiError, asyncHandler, order number generator
prisma/
  schema.prisma database models
  seed.ts       categories + super admin seed
```

Controllers never touch Prisma directly — that keeps business logic testable
and reusable if you later add a second entry point (e.g. an admin CLI or a
scheduled job).

## Key API routes

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/products` | — | List/search/filter products |
| GET | `/api/products/:slug` | — | Product detail + related products |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/categories` | — | List categories |
| POST | `/api/quotes` | — | Submit a quote or bulk-order request |
| GET | `/api/quotes` | Admin/Sales | Quote pipeline |
| POST | `/api/orders` | — | Create order, returns Paystack checkout URL |
| GET | `/api/orders/verify/:reference` | — | Confirm payment after redirect |
| GET | `/api/orders` | Admin/Sales | Order list |
| GET | `/api/customers` | Admin/Sales | Customer list + order/quote history |
| GET/POST | `/api/testimonials` | Public GET/POST, admin approves | Testimonials |
| POST | `/api/contact` | — | Contact form |
| GET | `/api/admin/dashboard` | Admin | Sales/orders/quotes analytics |
| POST | `/api/uploads` | Admin | Upload a product image |
| POST | `/api/webhooks/paystack` | Signature-verified | Payment confirmation webhook |

## Deployment

Cloud-ready — works on Render, Railway, a VPS, or AWS:

1. Provision a PostgreSQL instance (Render/Railway both offer managed Postgres)
2. Set all `.env` values as environment variables in your host's dashboard —
   never commit `.env`
3. Build step: `npm run build`
4. Start command: `npm start`
5. Run `npx prisma migrate deploy` as a release/build step, not `migrate dev`
6. Point `CLIENT_URL` at the deployed frontend's real domain (CORS + Paystack
   callback both depend on it)
7. Put the API behind HTTPS (Render/Railway do this automatically; on a raw
   VPS, use nginx + Let's Encrypt)

## Security notes for whoever deploys this

- Rotate `JWT_SECRET` and `COOKIE_SECRET` to long random values before going live — the `.env.example` placeholders are not safe to use as-is
- Use Paystack **live** keys only once checkout has been tested end-to-end with test keys
- The seeded super admin password must be changed on first login
