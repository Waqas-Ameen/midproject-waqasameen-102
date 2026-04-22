-- AdFlow Pro - Initial Schema
-- Priority tables for MVP

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (integrates with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client', -- client, moderator, admin, super_admin
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, suspended, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seller profiles
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  business_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1, -- ranking weight: 1-3
  is_featured BOOLEAN DEFAULT FALSE,
  homepage_visibility VARCHAR(20), -- 'none', 'category', 'homepage'
  auto_refresh BOOLEAN DEFAULT FALSE,
  refresh_interval_days INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  city_id UUID NOT NULL REFERENCES cities(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
    -- draft, submitted, under_review, payment_pending, payment_submitted,
    -- payment_verified, scheduled, published, expired, archived, rejected
  admin_boost_points INTEGER DEFAULT 0,
  publish_at TIMESTAMP,
  expire_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT
);

-- Media normalization for ads
CREATE TABLE IF NOT EXISTS ad_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  source_type VARCHAR(50), -- image, youtube, external_url
  original_url TEXT NOT NULL,
  normalized_url TEXT,
  thumbnail_url TEXT,
  validation_status VARCHAR(20) DEFAULT 'pending', -- pending, valid, invalid
  validated_at TIMESTAMP,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL UNIQUE REFERENCES ads(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50), -- bank_transfer, card, online_wallet
  transaction_ref VARCHAR(100) NOT NULL UNIQUE,
  sender_name VARCHAR(255),
  screenshot_url TEXT,
  status VARCHAR(30) DEFAULT 'submitted',
    -- submitted, verified, rejected, refunded
  verified_by UUID REFERENCES users(id),
  verification_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(30), -- info, warning, success, error, expiring_soon
  link_path VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad status history for traceability
CREATE TABLE IF NOT EXISTS ad_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  previous_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  changed_by UUID REFERENCES users(id),
  note TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for all actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES users(id),
  action_type VARCHAR(100), -- create, update, delete, approve, reject, verify, etc
  target_type VARCHAR(100), -- ad, payment, user, etc
  target_id VARCHAR(255),
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning questions (for keep-alive demo widget)
CREATE TABLE IF NOT EXISTS learning_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic VARCHAR(100),
  difficulty VARCHAR(20), -- easy, medium, hard
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System health logs
CREATE TABLE IF NOT EXISTS system_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100), -- db_heartbeat, cron_publish, cron_expire, etc
  response_ms INTEGER,
  status VARCHAR(20), -- success, failure
  error_message TEXT,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_category_id ON ads(category_id);
CREATE INDEX IF NOT EXISTS idx_ads_city_id ON ads(city_id);
CREATE INDEX IF NOT EXISTS idx_ads_publish_expire ON ads(publish_at, expire_at);
CREATE INDEX IF NOT EXISTS idx_ads_slug ON ads(slug);
CREATE INDEX IF NOT EXISTS idx_ad_media_ad_id ON ad_media(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_ad_id ON payments(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_system_health_source ON system_health_logs(source);

-- RLS Policies (Row Level Security) - Enable by role
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Sample data: Packages
INSERT INTO packages (name, description, duration_days, weight, is_featured, homepage_visibility, price)
VALUES
  ('Basic', 'Entry-level listing', 7, 1, FALSE, 'none', 99.00),
  ('Standard', 'Standard listing with category priority', 15, 2, FALSE, 'category', 299.00),
  ('Premium', 'Homepage featured listing with auto-refresh', 30, 3, TRUE, 'homepage', 799.00)
ON CONFLICT DO NOTHING;

-- Sample data: Categories
INSERT INTO categories (name, slug)
VALUES
  ('Electronics', 'electronics'),
  ('Real Estate', 'real-estate'),
  ('Vehicles', 'vehicles'),
  ('Services', 'services'),
  ('Others', 'others')
ON CONFLICT DO NOTHING;

-- Sample data: Cities
INSERT INTO cities (name, slug)
VALUES
  ('Karachi', 'karachi'),
  ('Lahore', 'lahore'),
  ('Islamabad', 'islamabad'),
  ('Rawalpindi', 'rawalpindi'),
  ('Multan', 'multan')
ON CONFLICT DO NOTHING;

-- Sample learning questions
INSERT INTO learning_questions (question, answer, topic, difficulty)
VALUES
  ('What is the purpose of ad moderation?', 'To ensure content quality, policy compliance, and prevent fraud.', 'platform-basics', 'easy'),
  ('How does the ranking system determine ad visibility?', 'Ranking combines package weight, featured status, freshness, and admin boost to prioritize quality listings.', 'algorithm', 'medium'),
  ('What are the key status transitions for an ad?', 'Draft → Submitted → Under Review → Payment Pending → Payment Verified → Published → Expired/Archived', 'workflow', 'medium')
ON CONFLICT DO NOTHING;
