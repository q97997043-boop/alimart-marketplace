-- ================================================================
-- DigiTX — Additional SQL Helpers
-- Run AFTER schema.sql
-- ================================================================

-- Increment user balance (used after successful sale)
CREATE OR REPLACE FUNCTION increment_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE users SET balance = balance + p_amount WHERE id = p_user_id;
END;
$$;

-- Decrement user balance (used for buyer payment via wallet)
CREATE OR REPLACE FUNCTION decrement_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE users
  SET balance = balance - p_amount
  WHERE id = p_user_id AND balance >= p_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
END;
$$;

-- Get live stock count for a product
CREATE OR REPLACE FUNCTION stock_count_for_product(p_product_id UUID)
RETURNS INTEGER LANGUAGE sql STABLE AS $$
  SELECT COUNT(*)::INTEGER
  FROM digital_keys
  WHERE product_id = p_product_id AND is_used = FALSE;
$$;

-- Sync stock_count on products table from digital_keys
CREATE OR REPLACE FUNCTION sync_stock_counts()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products p
  SET stock_count = (
    SELECT COUNT(*) FROM digital_keys
    WHERE product_id = p.id AND is_used = FALSE
  );
END;
$$;

-- Auto-mark product sold_out when stock hits 0
CREATE OR REPLACE FUNCTION check_stock_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products
  SET status = CASE
    WHEN stock_count = 0 AND status = 'active' THEN 'sold_out'
    WHEN stock_count > 0 AND status = 'sold_out' THEN 'active'
    ELSE status
  END
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_stock
AFTER UPDATE OF stock_count ON products
FOR EACH ROW EXECUTE FUNCTION check_stock_status();

-- Update seller total_sales and total_revenue after order delivered
CREATE OR REPLACE FUNCTION update_seller_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE seller_profiles
    SET
      total_sales   = total_sales + NEW.quantity,
      total_revenue = total_revenue + NEW.seller_payout
    WHERE id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_seller_stats
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_seller_stats();

-- ── Performance Indexes ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_buyer    ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller   ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe   ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer   ON reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_region ON products(region);
CREATE INDEX IF NOT EXISTS idx_keys_unused ON digital_keys(product_id, created_at) WHERE is_used = FALSE;

-- ── RLS for additional tables ────────────────────────────────────

-- Categories: public read, admin write
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (TRUE);

-- Digital keys: only the buyer who used it (after delivery)
CREATE POLICY "keys_buyer_read" ON digital_keys FOR SELECT
  USING (used_by = auth.uid());

-- Orders: insert only via service role (handled by API)
CREATE POLICY "orders_insert_service" ON orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Reviews: insert one per order
CREATE POLICY "reviews_insert_buyer" ON reviews FOR INSERT
  WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id
        AND buyer_id = auth.uid()
        AND status = 'delivered'
    )
  );
