-- ================================================================
-- DigiTX — Seed Data (Development Only)
-- Creates demo admin, seller and sample products
-- ================================================================

-- NOTE: Run this ONLY in development. Replace emails with real ones.

-- Demo Admin User (also create in Supabase Auth → Users)
INSERT INTO users (id, email, username, role, balance, is_verified, is_banned)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@digitx.dev', 'admin',    'admin',  0, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000002', 'seller@digitx.dev', 'GameZone', 'seller', 0, TRUE, FALSE),
  ('00000000-0000-0000-0000-000000000003', 'buyer@digitx.dev',  'buyer1',   'buyer',  50, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Seller profile
INSERT INTO seller_profiles (user_id, display_name, bio, rating, total_sales, total_revenue, is_verified, commission_rate)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'AliMart Store',
  'Your trusted source for game keys and digital goods. 5 years in business.',
  4.9, 1204, 6020.00, TRUE, 0.10
) ON CONFLICT (user_id) DO NOTHING;

-- Sample products (using seller profile id from above)
DO $$
DECLARE
  seller_id UUID;
  cat_games UUID;
  cat_subs  UUID;
  cat_gift  UUID;
BEGIN
  SELECT id INTO seller_id FROM seller_profiles WHERE user_id = '00000000-0000-0000-0000-000000000002';
  SELECT id INTO cat_games FROM categories WHERE slug = 'games';
  SELECT id INTO cat_subs  FROM categories WHERE slug = 'subscriptions';
  SELECT id INTO cat_gift  FROM categories WHERE slug = 'gift-cards';

  INSERT INTO products (seller_id, category_id, title, description, price, original_price, type, status, stock_count, sold_count, rating, review_count, tags, is_featured, is_trending) VALUES
    (seller_id, cat_games, 'Counter-Strike 2 Prime Status', 'Instant delivery. Worldwide.', 4.99, 7.99, 'key', 'active', 50, 1204, 4.9, 234, ARRAY['cs2','steam','fps'], TRUE, TRUE),
    (seller_id, cat_subs,  'Netflix Premium 1 Month',       'Works worldwide.',              11.99, 15.99, 'subscription', 'active', 20, 567, 4.8, 89, ARRAY['netflix','streaming'], TRUE, TRUE),
    (seller_id, cat_subs,  'Spotify Premium 1 Month',       'Individual plan.',              9.99, 13.99, 'subscription', 'active', 30, 234, 4.7, 56, ARRAY['spotify','music'], FALSE, FALSE),
    (seller_id, cat_gift,  'Steam Wallet $20',               'Any region.',                  18.99, 20.00, 'key', 'active', 100, 789, 4.6, 145, ARRAY['steam','wallet','gift'], FALSE, FALSE),
    (seller_id, cat_subs,  'NordVPN 2-Year Plan',           'Covers 6 devices.',            29.99, 49.99, 'subscription', 'active', 10, 89, 4.5, 34, ARRAY['vpn','security'], TRUE, FALSE)
  ON CONFLICT DO NOTHING;
END $$;

-- Sample digital keys for first product
DO $$
DECLARE
  prod_id UUID;
BEGIN
  SELECT id INTO prod_id FROM products WHERE title = 'Counter-Strike 2 Prime Status' LIMIT 1;
  IF prod_id IS NOT NULL THEN
    INSERT INTO digital_keys (product_id, key_value) VALUES
      (prod_id, 'CSGO2-PRIME-AAAAA-BBBBB-CCCCC'),
      (prod_id, 'CSGO2-PRIME-DDDDD-EEEEE-FFFFF'),
      (prod_id, 'CSGO2-PRIME-GGGGG-HHHHH-IIIII'),
      (prod_id, 'CSGO2-PRIME-JJJJJ-KKKKK-LLLLL'),
      (prod_id, 'CSGO2-PRIME-MMMMM-NNNNN-OOOOO')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
