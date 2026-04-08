-- AdFlow Pro Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('client', 'moderator', 'admin', 'super_admin')) DEFAULT 'client',
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ads table
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    media_urls JSONB DEFAULT '[]',
    normalized_thumbnails JSONB DEFAULT '[]',
    city TEXT,
    status TEXT CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published', 'expired')) DEFAULT 'draft',
    payment_proof JSONB,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT FALSE,
    ranking_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad reviews table
CREATE TABLE ad_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
    moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('approved', 'rejected')),
    notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT CHECK (event_type IN ('view', 'click', 'report')),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('review_update', 'payment_verified', 'ad_published', 'ad_expired', 'reminder')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_category ON ads(category_id);
CREATE INDEX idx_ads_user ON ads(user_id);
CREATE INDEX idx_ads_expiry ON ads(expiry_date);
CREATE INDEX idx_analytics_ad ON analytics(ad_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Insert sample data
INSERT INTO categories (name, description, slug) VALUES
('Electronics', 'Electronic devices and gadgets', 'electronics'),
('Vehicles', 'Cars, bikes, and vehicles', 'vehicles'),
('Real Estate', 'Properties and real estate', 'real-estate'),
('Services', 'Professional services', 'services');

INSERT INTO packages (name, duration_days, price, features) VALUES
('Basic', 7, 10.00, '{"ranking_boost": 0, "featured": false}'),
('Standard', 15, 25.00, '{"ranking_boost": 5, "featured": false}'),
('Premium', 30, 50.00, '{"ranking_boost": 10, "featured": true}');

INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@adflow.com', '$2a$10$example.hash', 'admin', 'Admin User'),
('moderator@adflow.com', '$2a$10$example.hash', 'moderator', 'Moderator User');