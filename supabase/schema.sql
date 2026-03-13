-- ================================================================
-- DigiTX Marketplace — Full Database Schema
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ── Users ────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  username      TEXT NOT NULL UNIQUE,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin')),
  balance       NUMERIC(12,2) NOT NULL DEFAULT 0,
  locale        TEXT DEFAULT 'en',
  country       TEXT,
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  is_banned     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seller Profiles ──────────────────────────────────────────────
CREATE TABLE seller_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  bio             TEXT,
  logo_url        TEXT,
  rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_sales     INTEGER NOT NULL DEFAULT 0,
  total_revenue   NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  commission_rate NUMERIC(4,3) NOT NULL DEFAULT 0.10, -- 10% default
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Categories ───────────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT NOT NULL DEFAULT '🎮',
  description TEXT,
  parent_id   UUID REFERENCES categories(id),
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Seed categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Games',          'games',         '🎮', 1),
  ('Software',       'software',      '💻', 2),
  ('Subscriptions',  'subscriptions', '📺', 3),
  ('Gift Cards',     'gift-cards',    '🎁', 4),
  ('Accounts',       'accounts',      '👤', 5),
  ('VPN & Security', 'vpn-security',  '🔒', 6),
  ('Education',      'education',     '📚', 7),
  ('Social Media',   'social-media',  '📱', 8);

-- ── Products ─────────────────────────────────────────────────────
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id      UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  category_id    UUID NOT NULL REFERENCES categories(id),
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  currency       TEXT NOT NULL DEFAULT 'USD',
  type           TEXT NOT NULL DEFAULT 'key' CHECK (type IN ('key','account','subscription','file','other')),
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active','draft','sold_out','banned')),
  stock_count    INTEGER NOT NULL DEFAULT 0,
  sold_count     INTEGER NOT NULL DEFAULT 0,
  rating         NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count   INTEGER NOT NULL DEFAULT 0,
  images         TEXT[] NOT NULL DEFAULT '{}',
  tags           TEXT[] NOT NULL DEFAULT '{}',
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending    BOOLEAN NOT NULL DEFAULT FALSE,
  region         TEXT,
  search_vector  TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || description || ' ' || array_to_string(tags, ' '))
  ) STORED,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX products_search_idx ON products USING gin(search_vector);
CREATE INDEX products_status_idx ON products(status);
CREATE INDEX products_seller_idx ON products(seller_id);
CREATE INDEX products_category_idx ON products(category_id);

-- ── Digital Keys ─────────────────────────────────────────────────
CREATE TABLE digital_keys (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key_value   TEXT NOT NULL,
  is_used     BOOLEAN NOT NULL DEFAULT FALSE,
  used_by     UUID REFERENCES users(id),
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, key_value)  -- prevent duplicate keys per product
);

CREATE INDEX digital_keys_product_unused ON digital_keys(product_id) WHERE is_used = FALSE;

-- ── Orders ───────────────────────────────────────────────────────
CREATE TABLE orders (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id                 UUID NOT NULL REFERENCES users(id),
  seller_id                UUID NOT NULL REFERENCES seller_profiles(id),
  product_id               UUID NOT NULL REFERENCES products(id),
  quantity                 INTEGER NOT NULL DEFAULT 1,
  unit_price               NUMERIC(10,2) NOT NULL,
  total_price              NUMERIC(10,2) NOT NULL,
  commission               NUMERIC(10,2) NOT NULL,
  seller_payout            NUMERIC(10,2) NOT NULL,
  status                   TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','delivered','refunded','disputed')),
  stripe_payment_intent_id TEXT,
  delivered_keys           TEXT[],
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Reviews ──────────────────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id    UUID NOT NULL UNIQUE REFERENCES orders(id), -- one review per order
  buyer_id    UUID NOT NULL REFERENCES users(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Functions ────────────────────────────────────────────────────

-- Atomic key delivery (prevents duplicate delivery)
CREATE OR REPLACE FUNCTION deliver_keys(p_order_id UUID, p_quantity INTEGER)
RETURNS TEXT[] LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_product_id  UUID;
  v_keys        TEXT[];
  v_key_ids     UUID[];
BEGIN
  -- Get product
  SELECT product_id INTO v_product_id FROM orders WHERE id = p_order_id;

  -- Lock & select unused keys
  SELECT ARRAY_AGG(id), ARRAY_AGG(key_value)
  INTO v_key_ids, v_keys
  FROM (
    SELECT id, key_value
    FROM digital_keys
    WHERE product_id = v_product_id AND is_used = FALSE
    ORDER BY created_at
    LIMIT p_quantity
    FOR UPDATE SKIP LOCKED
  ) sub;

  IF array_length(v_keys, 1) < p_quantity THEN
    RAISE EXCEPTION 'Not enough keys available';
  END IF;

  -- Mark keys as used
  UPDATE digital_keys
  SET is_used = TRUE,
      used_by = (SELECT buyer_id FROM orders WHERE id = p_order_id),
      used_at = NOW()
  WHERE id = ANY(v_key_ids);

  -- Update order
  UPDATE orders
  SET delivered_keys = v_keys, status = 'delivered', updated_at = NOW()
  WHERE id = p_order_id;

  -- Decrement stock
  UPDATE products
  SET stock_count = stock_count - p_quantity,
      sold_count  = sold_count  + p_quantity,
      updated_at  = NOW()
  WHERE id = v_product_id;

  RETURN v_keys;
END;
$$;

-- Recalculate product rating after review
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products
  SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_product_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── RLS Policies ─────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users: read own, admins read all
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Products: public read active, sellers manage own
CREATE POLICY "products_public_read" ON products FOR SELECT USING (status = 'active' OR seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "products_seller_insert" ON products FOR INSERT WITH CHECK (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "products_seller_update" ON products FOR UPDATE USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Orders: buyers and sellers see their own
CREATE POLICY "orders_select" ON orders FOR SELECT USING (buyer_id = auth.uid() OR seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Reviews: public read
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_buyer_insert" ON reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());
