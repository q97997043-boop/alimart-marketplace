# AliMart — Modern Digital Marketplace

A full-featured, production-ready digital marketplace for buying and selling game keys, accounts, subscriptions and digital goods. Built with Next.js 14, Supabase, Stripe, and Tailwind CSS.

---

## ✨ Features

### Buyer Features
- Browse & search thousands of digital products
- Instant key delivery after payment
- Secure Stripe payments
- Order history with key retrieval
- Product ratings and reviews

### Seller Features
- Seller dashboard with revenue analytics
- Product management (create, edit, publish)
- Bulk key upload (one per line, deduplication built-in)
- Real-time sales statistics
- Low 10% platform commission

### Platform Features
- **Multi-language**: English, Russian, Uzbek, Turkish
- **Auto locale detection** from IP geolocation
- **Recommendation engine**: region + recently viewed
- **Admin panel**: users, sellers, products, commission settings
- **Security**: Atomic key delivery (no duplicates), RLS policies, Stripe webhook verification

---

## 🛠 Tech Stack

| Layer        | Technology |
|--------------|-----------|
| Framework    | Next.js 14 (App Router) |
| Styling      | Tailwind CSS + custom design system |
| Database     | Supabase (PostgreSQL + RLS) |
| Auth         | Supabase Auth |
| Payments     | Stripe Checkout + Webhooks |
| i18n         | next-intl |
| State        | Zustand + TanStack Query |
| Animations   | Framer Motion |
| Charts       | Recharts |

---

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <repo>
cd alimart-marketplace
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the full schema:

```bash
# Copy and paste the contents of supabase/schema.sql into the SQL Editor
```

3. Enable **Email Auth** in Authentication → Providers

### 4. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/webhook/stripe`
   - Events: `checkout.session.completed`, `checkout.session.expired`, `charge.dispute.created`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/                # i18n-aware routes
│   │   ├── page.tsx             # Home
│   │   ├── marketplace/         # Browse products
│   │   ├── product/[id]/        # Product detail
│   │   ├── auth/login/          # Sign in
│   │   ├── auth/register/       # Sign up
│   │   ├── checkout/            # Payment + success
│   │   ├── profile/             # User profile + orders
│   │   ├── seller/dashboard/    # Seller panel
│   │   └── admin/dashboard/     # Admin panel
│   └── api/
│       ├── products/            # Product CRUD
│       ├── checkout/            # Stripe session creation
│       ├── webhook/stripe/      # Stripe webhook handler
│       ├── seller/keys/         # Bulk key upload
│       ├── seller/stats/        # Seller analytics
│       ├── admin/stats/         # Platform analytics
│       ├── orders/by-session/   # Order lookup
│       └── recommendations/     # Recommendation engine
├── components/
│   ├── layout/                  # Navbar, Footer
│   ├── marketplace/             # Product cards, Hero, Categories
│   ├── seller/                  # AddProductForm
│   └── shared/                  # QueryProvider
├── hooks/                       # useAuth, useProducts, useGeoLocale
├── lib/
│   ├── supabase/                # Client, server, types
│   ├── stripe/                  # Stripe helpers
│   ├── i18n/                    # Locale config
│   └── utils.ts                 # Helpers
├── store/                       # Zustand app store
├── types/                       # TypeScript types
└── middleware.ts                 # Auth + locale routing
```

---

## 🗃 Database

Key tables:
- `users` — profiles linked to Supabase auth
- `seller_profiles` — seller store info + commission
- `categories` — product categories
- `products` — listings with full-text search vector
- `digital_keys` — activation keys (atomic delivery via `deliver_keys()` fn)
- `orders` — purchase records + delivered keys
- `reviews` — verified buyer reviews

Key features:
- **RLS** (Row Level Security) on all tables
- **Atomic key delivery** via `deliver_keys()` PostgreSQL function (prevents race conditions + duplicate delivery)
- **Full-text search** via `tsvector` generated column
- **Rating auto-update** via trigger

---

## 🔐 Security

- Row Level Security on all Supabase tables
- Stripe webhook signature verification
- `SKIP LOCKED` in `deliver_keys()` prevents race conditions
- Unique constraint on `(product_id, key_value)` prevents duplicate keys
- Admin routes protected by middleware + role check
- Service role key only used server-side

---

## 🌍 Supported Languages

| Language | Locale | Auto-detected for |
|----------|--------|-------------------|
| English  | `en`   | US, GB, AU, CA    |
| Russian  | `ru`   | RU, BY, KZ        |
| Uzbek    | `uz`   | UZ, TJ            |
| Turkish  | `tr`   | TR                |

---

## 📝 License

MIT — use freely for personal and commercial projects.
