-- Enterprise Relational E-Commerce Database Schema
-- Version: 0002_enterprise_schema.sql

-- 1. Roles and Users
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
  ('admin', 'Atelier Administrator', 'Full control over orders, catalog, stock, and client desk'),
  ('customer', 'Client / Customer', 'Storefront shopping, orders, addresses, and wishlist')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  role_id VARCHAR(50) NOT NULL REFERENCES roles(id) DEFAULT 'customer',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(50),
  membership_tier VARCHAR(50) NOT NULL DEFAULT 'Bronze Member',
  loyalty_points INT NOT NULL DEFAULT 0,
  wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories & Products
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  price NUMERIC(10, 2) NOT NULL,
  old_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  badge VARCHAR(50),
  short_desc TEXT,
  long_description TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Product Variants & Stock
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL UNIQUE,
  size VARCHAR(50),
  color VARCHAR(50),
  price_override NUMERIC(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Inventory Ledger (Audit Trail)
CREATE TABLE IF NOT EXISTS inventory_ledger (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id INT REFERENCES product_variants(id) ON DELETE SET NULL,
  change_amount INT NOT NULL,
  remaining_stock INT NOT NULL,
  reason VARCHAR(100) NOT NULL,
  reference_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Coupons & Promotions
CREATE TABLE IF NOT EXISTS coupons (
  code VARCHAR(50) PRIMARY KEY,
  kind VARCHAR(20) NOT NULL CHECK (kind IN ('percent', 'flat')),
  amount NUMERIC(10, 2) NOT NULL,
  label VARCHAR(255) NOT NULL,
  min_spend NUMERIC(10, 2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Orders & Order Items
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(50) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  shipping NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  loyalty_discount NUMERIC(10, 2) DEFAULT 0.00,
  wallet_applied NUMERIC(10, 2) DEFAULT 0.00,
  points_redeemed INT DEFAULT 0,
  amount_due NUMERIC(10, 2) NOT NULL,
  coupon_code VARCHAR(50) REFERENCES coupons(code) ON DELETE SET NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
  tracking_number VARCHAR(100),
  carrier VARCHAR(100) DEFAULT 'TCS Express',
  estimated_delivery_date VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  variant_id INT REFERENCES product_variants(id),
  product_name VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL
);

-- 7. Saved Addresses
CREATE TABLE IF NOT EXISTS saved_addresses (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  label VARCHAR(100),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Client Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id VARCHAR(100) PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Returns & Claims
CREATE TABLE IF NOT EXISTS return_requests (
  id VARCHAR(100) PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  note TEXT,
  refund_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 10. Customer Support & Inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id VARCHAR(100) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  topic VARCHAR(100) NOT NULL,
  order_number VARCHAR(100),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_questions (
  id VARCHAR(100) PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answered_at TIMESTAMPTZ
);

-- 11. Marketing Subscriptions & Stock Alerts
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_alerts (
  id VARCHAR(100) PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
