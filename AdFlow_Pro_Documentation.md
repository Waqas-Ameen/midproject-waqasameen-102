# 🚀 AdFlow Pro - Advanced Moderated Ads Marketplace

**Production-Style Classified Ads Platform with Moderation, Scheduling, Payment Verification, Analytics & External Media Normalization**

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Learning Outcomes](#learning-outcomes)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [User Roles & Permissions](#user-roles--permissions)
- [Core Features](#core-features)
- [Database Design](#database-design)
- [API Specification](#api-specification)
- [Workflow & Business Logic](#workflow--business-logic)
- [Implementation Guide](#implementation-guide)
- [Deployment Strategy](#deployment-strategy)
- [Testing & QA](#testing--qa)
- [Grading Rubric](#grading-rubric)
- [Viva Questions](#viva-questions)

---

## 🎯 Project Overview

### Core Concept

AdFlow Pro is a **production-style moderated ads marketplace** designed to test real-world workflow thinking, business logic, and system architecture. Unlike simple CRUD applications, this platform implements a sophisticated multi-stage approval process with role-based access control, automated scheduling, and comprehensive analytics.

### Key Principles

✅ **Only approved ads are publicly visible**
✅ **Media stored as external URLs** (no local uploads)
✅ **Payment verification required** before publishing
✅ **Package-based ranking & visibility control**
✅ **Automated publishing, expiry & notifications**
✅ **Complete audit trail & traceability**

---

## 📚 Learning Outcomes

Upon successful completion, students will:

| Outcome | Skill Area |
|---------|-----------|
| Design multi-role systems with RBAC | Access Control & Security |
| Build workflow-driven backend beyond basic CRUD | System Architecture |
| Model relational data for business applications | Database Design |
| Implement package rules & status transitions | Business Logic |
| Handle third-party media URLs & normalization | External Integration |
| Create dashboards, metrics & moderation panels | Analytics & UI |
| Use scheduled jobs for automation | DevOps & Automation |
| Deploy production-style full-stack apps | Cloud Deployment |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ or React 18+
- **UI Library**: Tailwind CSS or Material-UI
- **State Management**: Context API / Redux / Zustand
- **HTTP Client**: Axios or Fetch API
- **Form Validation**: React Hook Form + Zod
- **Charts**: Recharts or Chart.js

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js or Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT or Supabase Auth
- **Validation**: Zod / Joi / express-validator
- **Cron Jobs**: node-cron / node-schedule / Vercel Cron

### Infrastructure
- **Deployment**: Vercel (Frontend & Serverless APIs)
- **Database Hosting**: Supabase
- **Media CDN**: Cloudinary (optional) or GitHub Raw URLs
- **Version Control**: Git / GitHub

### Development Tools
- **Package Manager**: npm / yarn / pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **API Testing**: Postman / Thunder Client
- **Environment**: dotenv

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Next.js/React)                  │
│  ┌──────────┬──────────┬──────────┬──────────────────────┐  │
│  │   Home   │ Explore  │ Client   │ Moderator / Admin    │  │
│  │  Page    │  Ads     │Dashboard │  Dashboards          │  │
│  └──────────┴──────────┴──────────┴──────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API / JWT Auth
┌─────────────────────▼───────────────────────────────────────┐
│              Backend (Express.js / Next.js API)              │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │ Auth Routes  │ Public Routes│ Protected Routes (RBAC)  │  │
│  │ - Register   │ - Ads Browse │ - Client: Create/Edit   │  │
│  │ - Login      │ - Categories │ - Moderator: Review     │  │
│  │ - JWT Token  │ - Packages   │ - Admin: Verify/Publish │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Business Logic Layer (Services)                          │ │
│  │ - Workflow State Management                              │ │
│  │ - Ranking & Search Logic                                 │ │
│  │ - Media Normalization                                    │ │
│  │ - Payment Verification                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Scheduled Jobs (Cron)                                    │ │
│  │ - Publish Scheduled Ads (Hourly)                         │ │
│  │ - Expire Outdated Ads (Daily)                            │ │
│  │ - Send Expiring Soon Notifications (Daily)               │ │
│  │ - Database Health Check (Every 6 hours)                  │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL Queries
┌─────────────────────▼───────────────────────────────────────┐
│         Database (Supabase PostgreSQL)                       │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │ Core Tables  │ Workflow     │ Analytics & Audit        │  │
│  │ - users      │ - payments   │ - audit_logs             │  │
│  │ - ads        │ - notifications│ - ad_status_history    │  │
│  │ - packages   │ - ad_media   │ - system_health_logs     │  │
│  │ - categories │              │                          │  │
│  │ - cities     │              │                          │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Layer | Responsibility | Technologies |
|-------|-----------------|--------------|
| **Presentation** | User interface, forms, real-time feedback | Next.js, React, Tailwind |
| **API Gateway** | Request routing, validation, error handling | Express/Next.js middleware |
| **Authentication** | JWT token generation, verification, refresh | jsonwebtoken, Supabase Auth |
| **Business Logic** | Workflow rules, ranking, media normalization | Services / Controllers |
| **Data Access** | Database queries, transactions | Supabase Client / SQL |
| **Scheduled Tasks** | Background job execution | node-cron / Vercel Cron |

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
┌────────────────────────────────────────────────┐
│             Super Admin                        │
│  System-level control, manage everything       │
└────────────────┬───────────────────────────────┘
                 │ Can delegate to
┌────────────────▼───────────────────────────────┐
│             Admin                              │
│  Payment verification, ad publishing, features │
└────────────────┬───────────────────────────────┘
                 │ Can delegate to
┌────────────────▼───────────────────────────────┐
│             Moderator                          │
│  Content review, flagging, rejection           │
└────────────────┬───────────────────────────────┘
                 │ Can assign to
┌────────────────▼───────────────────────────────┐
│             Client                             │
│  Create, submit, manage own ads                │
└────────────────────────────────────────────────┘
```

### Detailed Permission Matrix

| Feature | Client | Moderator | Admin | Super Admin |
|---------|--------|-----------|-------|------------|
| **Create Ad** | ✅ | ❌ | ❌ | ❌ |
| **Edit Own Draft** | ✅ | ❌ | ❌ | ❌ |
| **Submit Payment** | ✅ | ❌ | ❌ | ❌ |
| **View Own Dashboard** | ✅ | ❌ | ❌ | ❌ |
| **Review Content** | ❌ | ✅ | ✅ | ✅ |
| **Verify Payments** | ❌ | ❌ | ✅ | ✅ |
| **Publish/Schedule Ads** | ❌ | ❌ | ✅ | ✅ |
| **Feature Ads** | ❌ | ❌ | ✅ | ✅ |
| **Manage Packages** | ❌ | ❌ | ❌ | ✅ |
| **Manage Users** | ❌ | ❌ | ❌ | ✅ |
| **View Analytics** | ❌ | ❌ | ✅ | ✅ |
| **Manage Settings** | ❌ | ❌ | ❌ | ✅ |

---

## ✨ Core Features

### 1. Public Platform

#### 🏠 Landing Page
- Hero section with value proposition
- Featured ads carousel
- Recent listings preview
- Package comparison cards
- Trust badges & testimonials
- "Learning Question" widget (demo content)

#### 🔍 Explore Ads Page
- **Advanced Search**: Title, description, keywords
- **Filtering**: Category, city, price range, package type
- **Sorting**: Newest first, most viewed, most featured, price
- **Pagination**: 12-20 ads per page
- **Active-Only View**: Excludes expired & pending ads

#### 📄 Ad Detail Page
- Normalized media preview (image/video gallery)
- Seller profile summary with verification badge
- Package badge showing tier & remaining duration
- Expiry countdown timer
- Contact information (with privacy controls)
- "Report Listing" functionality

#### 📂 Category & City Pages
- Taxonomy-driven browsable navigation
- Aggregate stats (e.g., "245 ads in Technology")
- Inherited filters & sorting

#### 📦 Packages Page
- Detailed package comparison
- Duration, visibility, featured rules
- Price & renewal information
- ROI calculator

#### ℹ️ Static Pages
- FAQ (Common questions about listings)
- Contact & Support
- Terms of Service
- Privacy Policy
- Platform Usage Policy

---

### 2. Client Dashboard

**Role**: Clients manage their own ads throughout the lifecycle

#### Key Features:
- **Create New Draft**: Form with validation
- **My Listings**: Table showing all ads with status badges
- **Status Tracking**: 
  - 🟡 Draft
  - 🔵 Under Review
  - 💳 Payment Pending
  - 🟢 Published
  - 🔴 Rejected
  - ⏰ Expired
- **Edit Drafts**: Only editable before submission
- **Submit for Review**: Triggers moderator queue
- **Payment Submission**: 
  - Transaction reference
  - Amount
  - Payment method
  - Optional screenshot URL
- **View Notifications**: Status updates, rejections, expiry warnings
- **Renew Expired Ads**: Option to resubmit with new package

---

### 3. Moderator Dashboard

**Role**: Review content quality, flag suspicious activity, approve or reject

#### Key Features:
- **Review Queue**: FIFO list of submitted ads
- **Content Inspection**:
  - Title & description validation
  - Category appropriateness
  - Media URL validity
  - Duplicate detection
- **Flagging Tools**:
  - Flag suspicious media (AI-like detection)
  - Flag potential duplicates
  - Flag policy violations
- **Actions**:
  - ✅ **Approve**: Move to payment stage
  - ❌ **Reject**: With mandatory reason & notes
  - 📝 **Add Internal Notes**: For other moderators
- **Moderation Stats**: Approval rate, flagged items, avg review time

---

### 4. Admin Dashboard

**Role**: Verify payments, publish ads, manage features, monitor system health

#### Key Features:

**Payment Verification Queue**:
- Pending payments list
- Transaction details review
- Screenshot preview (if provided)
- Verification logic:
  - Check transaction reference uniqueness
  - Validate amount vs package price
  - Approve or reject with reason

**Publishing Control**:
- Approved ads awaiting publish decision
- Immediate publish option
- Schedule publish for future date/time
- Feature ad (boost ranking)
- Mark as verified seller

**Active Listings Monitor**:
- Table of currently published ads
- Filtering by package, category, seller
- Quick actions: Feature, Delist, Edit
- Expiry countdown indicators

**System Analytics** (see Analytics Dashboard)

---

### 5. Super Admin Panel

**Role**: System-level configuration and reports

#### Key Features:
- **Package Management**: Create, edit, deactivate packages
- **Category Management**: Add/edit/deactivate categories
- **City Management**: Location taxonomy
- **User Management**: Ban/unban users, reset passwords, assign roles
- **System Settings**: Platform rules, featured ad rules, payment settings
- **Reports & Exports**: User CSV, payment records, listings archive
- **System Health Dashboard**: 
  - Database connection status
  - Cron job success rates
  - API response times
  - Failed validations log

---

## 💾 Database Design

### Schema Overview

#### 1. **users** - Core User Accounts

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM ('client', 'moderator', 'admin', 'super_admin') DEFAULT 'client',
  status ENUM ('active', 'suspended', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 2. **seller_profiles** - Public Seller Information

```sql
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  business_name VARCHAR(150),
  phone VARCHAR(20),
  city VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge_type ENUM ('bronze', 'silver', 'gold') DEFAULT 'bronze',
  total_ads_posted INT DEFAULT 0,
  avg_rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX idx_seller_profiles_is_verified ON seller_profiles(is_verified);
```

#### 3. **packages** - Listing Package Definitions

```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  duration_days INT NOT NULL,
  weight INT DEFAULT 1,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_weight INT DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  refresh_interval_days INT DEFAULT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO packages (name, duration_days, weight, price) VALUES
('Basic', 7, 1, 49.99),
('Standard', 15, 2, 99.99),
('Premium', 30, 3, 199.99);
```

#### 4. **categories** - Ad Classification

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO categories (name, slug) VALUES
('Technology', 'technology'),
('Real Estate', 'real-estate'),
('Vehicles', 'vehicles'),
('Services', 'services'),
('Furniture', 'furniture');
```

#### 5. **cities** - Location Taxonomy

```sql
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  country VARCHAR(100) DEFAULT 'Pakistan',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO cities (name, slug) VALUES
('Karachi', 'karachi'),
('Lahore', 'lahore'),
('Islamabad', 'islamabad'),
('Rawalpindi', 'rawalpindi'),
('Multan', 'multan');
```

#### 6. **ads** - Main Listing Records

```sql
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES packages(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  city_id UUID NOT NULL REFERENCES cities(id),
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(160) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  status ENUM (
    'draft', 'submitted', 'under_review', 'payment_pending',
    'payment_submitted', 'payment_verified', 'scheduled',
    'published', 'expired', 'archived'
  ) DEFAULT 'draft',
  price DECIMAL(15, 2),
  publish_at TIMESTAMP,
  expire_at TIMESTAMP,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  rank_score DECIMAL(10, 2) DEFAULT 0,
  view_count INT DEFAULT 0,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  is_visible_publicly BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- Critical indexes for performance
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_ads_category_id ON ads(category_id);
CREATE INDEX idx_ads_city_id ON ads(city_id);
CREATE INDEX idx_ads_publish_at ON ads(publish_at);
CREATE INDEX idx_ads_expire_at ON ads(expire_at);
CREATE INDEX idx_ads_is_featured ON ads(is_featured);
CREATE INDEX idx_ads_rank_score ON ads(rank_score DESC);
CREATE INDEX idx_ads_slug ON ads(slug);
CREATE INDEX idx_ads_is_visible ON ads(is_visible_publicly) WHERE is_visible_publicly = TRUE;

-- Composite index for common query pattern
CREATE INDEX idx_ads_status_visible ON ads(status, is_visible_publicly);
```

#### 7. **ad_media** - Media Normalization

```sql
CREATE TABLE ad_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  source_type ENUM ('image', 'youtube', 'cloudinary') NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  normalized_url TEXT,
  validation_status ENUM ('pending', 'valid', 'invalid', 'failed') DEFAULT 'pending',
  error_message TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ad_media_ad_id ON ad_media(ad_id);
CREATE INDEX idx_ad_media_validation_status ON ad_media(validation_status);
```

#### 8. **payments** - Payment Proof Records

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50), -- 'bank_transfer', 'easypaisa', 'jazzcash', 'card'
  transaction_ref VARCHAR(100) UNIQUE,
  sender_name VARCHAR(100),
  screenshot_url VARCHAR(255),
  status ENUM (
    'submitted', 'verified', 'rejected', 'disputed'
  ) DEFAULT 'submitted',
  verified_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_ad_id ON payments(ad_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_ref ON payments(transaction_ref);
```

#### 9. **notifications** - In-App Alerts

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type ENUM (
    'status_update', 'review_request', 'approval', 'rejection',
    'expiry_warning', 'system_alert', 'payment_verified'
  ) NOT NULL,
  related_ad_id UUID REFERENCES ads(id) ON DELETE SET NULL,
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### 10. **audit_logs** - Complete Traceability

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- 'ad', 'payment', 'user', etc.
  target_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_target_type_id ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

#### 11. **ad_status_history** - Workflow Tracking

```sql
CREATE TABLE ad_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES users(id),
  note TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ad_status_history_ad_id ON ad_status_history(ad_id);
CREATE INDEX idx_ad_status_history_changed_at ON ad_status_history(changed_at DESC);
```

#### 12. **system_health_logs** - Monitoring

```sql
CREATE TABLE system_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100), -- 'database', 'api', 'cron:publish', 'cron:expire'
  response_ms INT,
  status ENUM ('success', 'warning', 'error') DEFAULT 'success',
  error_message TEXT,
  metadata JSONB,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_health_logs_source ON system_health_logs(source);
CREATE INDEX idx_system_health_logs_checked_at ON system_health_logs(checked_at DESC);
```

#### 13. **learning_questions** - Demo Content

```sql
CREATE TABLE learning_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic VARCHAR(100),
  difficulty ENUM ('easy', 'medium', 'hard') DEFAULT 'easy',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for landing page widget
INSERT INTO learning_questions (question, answer, topic, difficulty) VALUES
('How do featured listings work?', 'Featured listings appear at the top and get extra visibility for their package duration...', 'packages', 'easy'),
('What happens when my ad expires?', 'Expired ads are automatically hidden from public view but remain in your dashboard...', 'lifecycle', 'easy');
```

---

## 🔌 API Specification

### Authentication Endpoints

#### POST /api/auth/register
Create a new user account

```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password_123",
  "role": "client"
}

Response (201):
{
  "id": "uuid",
  "email": "john@example.com",
  "role": "client",
  "token": "eyJhbGc...",
  "message": "Registration successful"
}
```

#### POST /api/auth/login
Authenticate and receive JWT token

```json
Request:
{
  "email": "john@example.com",
  "password": "secure_password_123"
}

Response (200):
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "token": "eyJhbGc...",
  "expiresIn": 86400
}
```

#### POST /api/auth/refresh
Refresh JWT token

```json
Request:
{ "token": "eyJhbGc..." }

Response (200):
{ "token": "eyJhbGc...", "expiresIn": 86400 }
```

---

### Public Endpoints (No Auth Required)

#### GET /api/packages
Fetch all active packages

```json
Response (200):
[
  {
    "id": "uuid",
    "name": "Basic",
    "duration_days": 7,
    "weight": 1,
    "price": 49.99,
    "is_featured": false,
    "description": "Entry-level package"
  },
  {
    "id": "uuid",
    "name": "Premium",
    "duration_days": 30,
    "weight": 3,
    "price": 199.99,
    "is_featured": true,
    "description": "Premium visibility"
  }
]
```

#### GET /api/categories
Fetch all active categories

```json
Response (200):
[
  {
    "id": "uuid",
    "name": "Technology",
    "slug": "technology",
    "icon_url": "https://...",
    "ad_count": 156
  }
]
```

#### GET /api/cities
Fetch all active cities

```json
Response (200):
[
  {
    "id": "uuid",
    "name": "Karachi",
    "slug": "karachi",
    "ad_count": 1234
  }
]
```

#### GET /api/ads
Browse active ads with advanced filtering

```json
Request Query:
GET /api/ads?category=technology&city=karachi&search=laptop&sort=rank&page=1&limit=20

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "title": "Laptop Dell XPS 13",
      "slug": "laptop-dell-xps-13",
      "description": "Brand new laptop...",
      "price": 125000,
      "category": { "id": "uuid", "name": "Technology" },
      "city": { "id": "uuid", "name": "Karachi" },
      "seller": {
        "id": "uuid",
        "display_name": "Tech Store",
        "is_verified": true,
        "verification_badge": "gold"
      },
      "package": { "id": "uuid", "name": "Premium" },
      "media": [
        {
          "id": "uuid",
          "source_type": "image",
          "thumbnail_url": "https://...",
          "normalized_url": "https://..."
        }
      ],
      "is_featured": true,
      "featured_until": "2024-12-31T23:59:59Z",
      "expire_at": "2024-12-15T23:59:59Z",
      "rank_score": 95.5,
      "view_count": 342,
      "publish_at": "2024-12-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "pages": 63
  }
}
```

#### GET /api/ads/:slug
Get detailed view of single ad

```json
Response (200):
{
  "id": "uuid",
  "title": "Laptop Dell XPS 13",
  "slug": "laptop-dell-xps-13",
  "description": "Brand new, sealed box...",
  "price": 125000,
  "category": { "id": "uuid", "name": "Technology" },
  "city": { "id": "uuid", "name": "Karachi" },
  "seller": {
    "id": "uuid",
    "display_name": "Tech Store",
    "business_name": "TechWorld Pakistan",
    "phone": "+92-300-1234567",
    "city": "Karachi",
    "is_verified": true,
    "verification_badge_type": "gold",
    "total_ads_posted": 245,
    "avg_rating": 4.8
  },
  "package": {
    "id": "uuid",
    "name": "Premium",
    "duration_days": 30
  },
  "media": [
    {
      "id": "uuid",
      "source_type": "image",
      "original_url": "https://...",
      "thumbnail_url": "https://...",
      "display_order": 0
    }
  ],
  "is_featured": true,
  "featured_until": "2024-12-31T23:59:59Z",
  "expire_at": "2024-12-15T23:59:59Z",
  "view_count": 342,
  "contact_phone": "+92-300-1234567",
  "contact_email": "john@example.com"
}
```

#### GET /api/questions/random
Get random learning question for widget

```json
Response (200):
{
  "id": "uuid",
  "question": "How do featured listings work?",
  "answer": "Featured listings appear at the top...",
  "topic": "packages"
}
```

---

### Client Endpoints (Requires: Client Role)

#### POST /api/client/ads
Create new ad draft

```json
Request:
{
  "title": "Laptop Dell XPS 13",
  "description": "Brand new, sealed box, all accessories included",
  "category_id": "uuid",
  "city_id": "uuid",
  "price": 125000,
  "contact_phone": "+92-300-1234567",
  "contact_email": "john@example.com"
}

Response (201):
{
  "id": "uuid",
  "title": "Laptop Dell XPS 13",
  "status": "draft",
  "slug": "laptop-dell-xps-13",
  "message": "Draft created successfully"
}
```

#### PATCH /api/client/ads/:id
Edit own ad (only if draft or under_review)

```json
Request:
{
  "title": "Laptop Dell XPS 13 - Updated",
  "description": "Updated description...",
  "price": 120000
}

Response (200):
{
  "id": "uuid",
  "title": "Laptop Dell XPS 13 - Updated",
  "status": "draft",
  "message": "Ad updated successfully"
}
```

#### POST /api/client/ads/:id/submit
Submit ad for moderation review

```json
Request: {} (empty body)

Response (200):
{
  "id": "uuid",
  "status": "submitted",
  "message": "Ad submitted for moderation"
}
```

#### POST /api/client/ads/:id/media
Upload media URL reference

```json
Request:
{
  "source_type": "image",
  "original_url": "https://github.com/raw/...",
  "display_order": 0
}

Response (201):
{
  "id": "uuid",
  "ad_id": "uuid",
  "source_type": "image",
  "original_url": "https://...",
  "thumbnail_url": "https://...",
  "validation_status": "valid"
}
```

#### POST /api/client/payments
Submit payment proof

```json
Request:
{
  "ad_id": "uuid",
  "amount": 49.99,
  "method": "bank_transfer",
  "transaction_ref": "TXN-20240101-12345",
  "sender_name": "John Doe",
  "screenshot_url": "https://..." (optional)
}

Response (201):
{
  "id": "uuid",
  "ad_id": "uuid",
  "amount": 49.99,
  "status": "submitted",
  "message": "Payment submitted for verification"
}
```

#### GET /api/client/dashboard
Get client's dashboard data

```json
Response (200):
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "stats": {
    "total_ads": 12,
    "active_ads": 5,
    "pending_review": 2,
    "expired_ads": 5
  },
  "ads": [
    {
      "id": "uuid",
      "title": "Laptop Dell XPS",
      "status": "published",
      "package": "Premium",
      "created_at": "2024-12-01T00:00:00Z",
      "expire_at": "2024-12-31T23:59:59Z",
      "view_count": 342
    }
  ],
  "notifications": [
    {
      "id": "uuid",
      "title": "Ad Published",
      "message": "Your ad has been published successfully",
      "type": "approval",
      "created_at": "2024-12-05T10:30:00Z",
      "is_read": false
    }
  ]
}
```

---

### Moderator Endpoints (Requires: Moderator Role)

#### GET /api/moderator/review-queue
Get ads waiting for review

```json
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "title": "Laptop Dell XPS 13",
      "description": "Brand new, sealed...",
      "category": "Technology",
      "city": "Karachi",
      "media_count": 3,
      "seller_name": "Tech Store",
      "status": "submitted",
      "submitted_at": "2024-12-05T08:00:00Z",
      "media": [
        {
          "id": "uuid",
          "source_type": "image",
          "thumbnail_url": "https://...",
          "validation_status": "valid"
        }
      ]
    }
  ],
  "queue_length": 24
}
```

#### PATCH /api/moderator/ads/:id/review
Approve or reject ad

```json
Request:
{
  "action": "approve", // or "reject"
  "reason": "Content policy violation", // required if rejecting
  "internal_notes": "Duplicate listing detected with ad-xyz"
}

Response (200):
{
  "id": "uuid",
  "status": "payment_pending", // if approved
  "message": "Ad review completed"
}
```

#### GET /api/moderator/stats
Get moderation statistics

```json
Response (200):
{
  "total_reviewed": 156,
  "approval_rate": 85.5,
  "rejection_rate": 14.5,
  "avg_review_time_minutes": 12,
  "flagged_count": 8,
  "today_reviewed": 24
}
```

---

### Admin Endpoints (Requires: Admin Role)

#### GET /api/admin/payment-queue
Get payments awaiting verification

```json
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "ad_id": "uuid",
      "ad_title": "Laptop Dell XPS 13",
      "amount": 49.99,
      "method": "bank_transfer",
      "transaction_ref": "TXN-20240101-12345",
      "sender_name": "John Doe",
      "screenshot_url": "https://...",
      "status": "submitted",
      "submitted_at": "2024-12-05T08:00:00Z"
    }
  ],
  "queue_length": 12
}
```

#### PATCH /api/admin/payments/:id/verify
Verify or reject payment

```json
Request:
{
  "action": "verify", // or "reject"
  "reason": "Transaction reference not found in bank records" // required if rejecting
}

Response (200):
{
  "id": "uuid",
  "status": "verified",
  "message": "Payment verified successfully"
}
```

#### PATCH /api/admin/ads/:id/publish
Publish or schedule ad

```json
Request:
{
  "action": "publish", // or "schedule"
  "publish_at": "2024-12-10T00:00:00Z", // required if scheduling
  "is_featured": true,
  "featured_until": "2024-12-31T23:59:59Z" // required if featuring
}

Response (200):
{
  "id": "uuid",
  "status": "published",
  "publish_at": "2024-12-10T00:00:00Z",
  "expire_at": "2024-12-17T23:59:59Z",
  "message": "Ad published successfully"
}
```

#### GET /api/admin/dashboard
Admin dashboard overview

```json
Response (200):
{
  "stats": {
    "total_users": 1250,
    "total_ads": 2340,
    "active_ads": 1456,
    "pending_payments": 34,
    "pending_reviews": 18,
    "total_revenue": 156780.50,
    "verified_sellers": 245
  },
  "chart_data": {
    "revenue_by_package": [
      { "package": "Basic", "revenue": 15000 },
      { "package": "Standard", "revenue": 45000 },
      { "package": "Premium", "revenue": 96780.50 }
    ],
    "ads_by_category": [
      { "category": "Technology", "count": 456 },
      { "category": "Real Estate", "count": 234 }
    ]
  },
  "recent_activity": [...]
}
```

#### GET /api/admin/analytics/summary
Comprehensive analytics dashboard

```json
Response (200):
{
  "listings": {
    "total": 2340,
    "active": 1456,
    "pending_review": 18,
    "expired": 866,
    "archived": 0
  },
  "revenue": {
    "verified_payments": 156780.50,
    "pending_verification": 3450.00,
    "by_package": {
      "Basic": 15000,
      "Standard": 45000,
      "Premium": 96780.50
    },
    "monthly_trend": [...]
  },
  "moderation": {
    "total_reviewed": 2340,
    "approval_rate": 87.5,
    "rejection_rate": 12.5,
    "avg_review_time_minutes": 14,
    "flagged_this_month": 28
  },
  "taxonomy": {
    "by_category": [
      { "name": "Technology", "count": 456, "revenue": 45000 },
      { "name": "Real Estate", "count": 234, "revenue": 32000 }
    ],
    "by_city": [
      { "name": "Karachi", "count": 890, "revenue": 98000 },
      { "name": "Lahore", "count": 567, "revenue": 58780.50 }
    ]
  },
  "operations": {
    "cron_jobs": [
      {
        "name": "publish_scheduled",
        "last_run": "2024-12-10T01:00:00Z",
        "status": "success",
        "ads_published": 12,
        "duration_ms": 234
      },
      {
        "name": "expire_ads",
        "last_run": "2024-12-10T02:00:00Z",
        "status": "success",
        "ads_expired": 45,
        "duration_ms": 567
      },
      {
        "name": "send_expiring_notifications",
        "last_run": "2024-12-10T06:00:00Z",
        "status": "success",
        "notifications_sent": 78,
        "duration_ms": 345
      }
    ],
    "db_health": {
      "connection_status": "healthy",
      "last_check": "2024-12-10T03:15:00Z",
      "response_time_ms": 45
    },
    "failed_validations": 3,
    "api_errors_today": 2
  }
}
```

---

### Super Admin Endpoints (Requires: Super Admin Role)

#### CRUD Endpoints for Configuration

```
POST   /api/admin/packages          - Create package
PATCH  /api/admin/packages/:id      - Update package
DELETE /api/admin/packages/:id      - Deactivate package
GET    /api/admin/packages          - List all packages

POST   /api/admin/categories        - Create category
PATCH  /api/admin/categories/:id    - Update category
DELETE /api/admin/categories/:id    - Deactivate category

POST   /api/admin/cities            - Create city
PATCH  /api/admin/cities/:id        - Update city
DELETE /api/admin/cities/:id        - Deactivate city

GET    /api/admin/users             - List all users
PATCH  /api/admin/users/:id/role    - Change user role
PATCH  /api/admin/users/:id/status  - Ban/unban user
POST   /api/admin/users/:id/reset-password - Password reset

GET    /api/admin/reports/users     - Export user report (CSV)
GET    /api/admin/reports/payments  - Export payment records (CSV)
GET    /api/admin/reports/listings  - Export listings archive (CSV)

GET    /api/admin/health            - System health dashboard
GET    /api/admin/audit-logs        - Complete audit trail
```

---

### System Endpoints

#### GET /api/health/db
Database heartbeat check

```json
Response (200):
{
  "status": "healthy",
  "response_ms": 45,
  "connections": 12,
  "timestamp": "2024-12-10T03:15:00Z"
}
```

#### POST /api/cron/publish-scheduled
Publish ads that reached scheduled time (Internal only)

```json
Request: {} (Called by Vercel Cron)

Response (200):
{
  "status": "success",
  "ads_published": 12,
  "ads_failed": 0,
  "duration_ms": 234,
  "next_run": "2024-12-10T02:00:00Z"
}
```

#### POST /api/cron/expire-ads
Expire ads that passed expiry date (Internal only)

```json
Request: {} (Called by Vercel Cron)

Response (200):
{
  "status": "success",
  "ads_expired": 45,
  "ads_failed": 0,
  "duration_ms": 567,
  "next_run": "2024-12-11T02:00:00Z"
}
```

#### POST /api/cron/send-expiring-notifications
Send notifications for ads expiring in 48 hours

```json
Response (200):
{
  "status": "success",
  "notifications_sent": 78,
  "failed": 2,
  "duration_ms": 345
}
```

---

## 🔄 Workflow & Business Logic

### Ad Lifecycle State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│ START: User Creates New Ad                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │    DRAFT    │ ← Edit allowed
                    │ (Private)   │
                    └──────┬──────┘
                           │ Client submits for review
                    ┌──────▼──────────┐
                    │    SUBMITTED    │
                    │   (Private)     │
                    └──────┬──────────┘
                           │ Moderator reviews content
                    ┌──────▼──────────┐
                    │  UNDER REVIEW   │
                    │   (Private)     │
                    └──────┬──────────┘
                    ╱──────┴──────╲
                   ╱               ╲
            (Reject)           (Approve)
             │                     │
             │              ┌──────▼──────────┐
             │              │ PAYMENT PENDING │
             │              │   (Private)     │
             │              └──────┬──────────┘
             │                     │ Client submits payment proof
             │              ┌──────▼──────────┐
             │              │ PAYMENT_SUBMIT  │
             │              │   (Private)     │
             │              └──────┬──────────┘
             │                     │ Admin verifies payment
             │                  ╱──┴──╲
             │                 ╱       ╲
             │          (Reject)   (Verify)
             │             │            │
             │             │    ┌───────▼──────────┐
             │             │    │ PAYMENT_VERIFIED │
             │             │    │    (Private)     │
             │             │    └───────┬──────────┘
             │             │            │ Admin schedules/publishes
             │             │     ┌──────┴──────────┐
             │             │     │                 │
             │        ┌────▼──┐  │  ┌──────────┐
             │        │SCHED  │  │  │PUBLISHED │ ← PUBLIC VISIBLE
             │        │ULED   │  │  │(Public)  │
             │        │       │  │  └────┬─────┘
             │        │(Priv.)│  │       │ Time passes to expiry
             │        └───────┘  │       │
             │                   └───┬───┘
             │                       │
             │                   ┌───▼──────┐
             │                   │ EXPIRED   │
             │                   │ (Private) │
             │                   └───┬──────┘
             │                       │ Admin action
             │                   ┌───▼──────┐
             │                   │ ARCHIVED  │
             │                   │ (Private) │
             │                   └───────────┘
             │
             └─────────────────────┐
                                   │
                            ┌──────▼──────┐
                            │  REJECTED   │
                            │ (Private)   │
                            └─────────────┘
```

### Key Business Rules

1. **Visibility Control**
   - Only `published` and unexpired ads are public
   - All other statuses remain hidden from public view
   - Query filter: `status = 'published' AND is_visible_publicly = true AND expire_at > NOW()`

2. **Package Duration**
   - Calculated at publish time: `expire_at = publish_at + (package.duration_days * 24 hours)`
   - Displayed to user as countdown timer
   - Expired status triggered automatically by cron

3. **Payment Requirement**
   - Must have verified payment before publishing
   - One payment record per ad
   - Duplicate transaction refs blocked
   - Amount validated against package price (allow ±10% variance)

4. **Ranking Formula**
   ```
   rankScore = (is_featured ? 50 : 0)
             + (package.weight * 10)
             + freshnessPoints
             + adminBoost
             + (seller.is_verified ? 5 : 0)
   
   freshnessPoints = MAX(0, 20 - (days_since_publish / 2))
   adminBoost = 0 (unless manually set by admin)
   ```

5. **Featured Ads**
   - Limited slots (configurable by super admin)
   - 24-hour refresh for Premium package
   - Manual refresh for Standard
   - Appear before normal ads in ranking

6. **Media Validation**
   - Must validate before ad can be approved
   - Invalid URLs displayed as placeholder
   - Supports: GitHub raw, direct image URLs, YouTube
   - Optional Cloudinary/CDN links

7. **Audit Trail**
   - Every state change logged in `ad_status_history`
   - Every modification logged in `audit_logs`
   - Actor (user), timestamp, old/new values recorded

---

### Notification Triggers

| Event | Recipient | Type |
|-------|-----------|------|
| Ad submitted for review | Moderators | `status_update` |
| Ad approved by moderator | Client | `approval` |
| Ad rejected by moderator | Client | `rejection` |
| Payment verification pending | Admin | `review_request` |
| Payment verified | Client | `approval` |
| Ad published | Client | `status_update` |
| Ad expiring in 48 hours | Client | `expiry_warning` |
| Ad expired | Client | `status_update` |
| System error | Admin | `system_alert` |

---

## 📦 Implementation Guide

### Phase 1: Setup & Infrastructure (Week 1)

#### Tasks:
1. **Repository Setup**
   ```bash
   # Initialize monorepo
   mkdir AdFlow-Pro && cd AdFlow-Pro
   
   # Client project
   npx create-next-app@latest client --typescript
   
   # Server project
   mkdir server && cd server && npm init -y
   
   # Shared types
   mkdir shared && npm init -y
   ```

2. **Supabase Setup**
   - Create Supabase project
   - Create all tables (see Database Design section)
   - Set Row Level Security (RLS) policies
   - Create indexes for performance

3. **Environment Configuration**
   ```env
   # .env.local (client)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   
   # .env (server)
   DATABASE_URL=postgresql://user:pass@localhost:5432/adflow
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRY=86400
   VERCEL_CRON_SECRET=your_cron_secret
   NODE_ENV=development
   ```

4. **Project Wireframes & Design System**
   - Create figma designs or low-fi wireframes
   - Define Tailwind color palette
   - Component library (buttons, cards, modals, forms)

---

### Phase 2: Authentication & Core Infrastructure (Week 2)

#### Backend Tasks:

1. **User Model & Auth Service**
   ```typescript
   // server/src/services/authService.ts
   - registerUser()
   - loginUser()
   - verifyToken()
   - refreshToken()
   - hashPassword()
   - comparePassword()
   ```

2. **JWT Middleware**
   ```typescript
   // server/src/middlewares/authMiddleware.ts
   - verifyToken()
   - attachUserToRequest()
   - handleExpiredToken()
   ```

3. **Role-Based Access Control**
   ```typescript
   // server/src/middlewares/rbac.ts
   - requireRole(...roles)
   - requireAuth()
   - optionalAuth()
   ```

4. **Request Validation**
   ```typescript
   // server/src/validators/schemas.ts
   - registerSchema
   - loginSchema
   - createAdSchema
   - submitPaymentSchema
   - etc.
   ```

#### Frontend Tasks:

1. **Auth Context & Hooks**
   ```typescript
   // client/src/contexts/AuthContext.ts
   - useAuth()
   - useAuthToken()
   - AuthProvider component
   ```

2. **Protected Routes**
   ```typescript
   // client/src/components/ProtectedRoute.tsx
   - ProtectedRoute HOC
   - RequireRole HOC
   ```

3. **Auth Pages**
   - Login page with form validation
   - Register page with role selection
   - Forgot password page
   - Verify email page (optional)

---

### Phase 3: Ad Workflow & Packages (Week 3)

#### Backend Tasks:

1. **Ad Service**
   ```typescript
   // server/src/services/adService.ts
   - createDraft()
   - submitForReview()
   - updateDraft()
   - addMediaURL()
   - validateMedia()
   - normalizeMediaURL()
   ```

2. **Moderation Service**
   ```typescript
   // server/src/services/moderationService.ts
   - getReviewQueue()
   - approveAd()
   - rejectAd()
   - addInternalNotes()
   - flagAsSpam()
   - flagAsDuplicate()
   ```

3. **Package Logic**
   ```typescript
   // server/src/services/packageService.ts
   - getPackages()
   - calculateExpiry()
   - getPackageByName()
   - calculateRankScore()
   ```

4. **Media Normalization**
   ```typescript
   // server/src/utils/mediaNormalizer.ts
   - normalizeImageURL()
   - normalizeYouTubeURL()
   - generateYouTubeThumbnail()
   - validateURLProtocol()
   - validateDomain()
   ```

#### Frontend Tasks:

1. **Client Dashboard**
   - Create ad form (with drafts)
   - My listings table
   - Status badges
   - Edit form (draft-only)

2. **Moderator Dashboard**
   - Review queue list
   - Ad detail view with media
   - Approve/reject actions
   - Internal notes textarea

3. **Ad Detail Page**
   - Normalized media gallery
   - Seller profile card
   - Package info badge
   - Expiry countdown

---

### Phase 4: Payments, Publishing & Expiry (Week 4)

#### Backend Tasks:

1. **Payment Service**
   ```typescript
   // server/src/services/paymentService.ts
   - submitPaymentProof()
   - getPaymentQueue()
   - verifyPayment()
   - rejectPayment()
   - checkDuplicateTransaction()
   ```

2. **Publishing Service**
   ```typescript
   // server/src/services/publishingService.ts
   - publishAd()
   - schedulePublish()
   - expireAd()
   - moveToArchive()
   - featureAd()
   ```

3. **Cron Jobs Setup**
   ```typescript
   // server/src/cron/publishScheduled.ts
   - Run hourly
   - Find ads with publish_at <= NOW()
   - Update status to 'published'
   - Set is_visible_publicly = true
   - Create notifications
   
   // server/src/cron/expireAds.ts
   - Run daily
   - Find ads with expire_at <= NOW()
   - Update status to 'expired'
   - Set is_visible_publicly = false
   - Create notifications
   
   // server/src/cron/sendExpiringNotifications.ts
   - Run daily
   - Find ads expiring in 48 hours
   - Send notifications to clients
   - Log in system_health_logs
   ```

4. **Notification Service**
   ```typescript
   // server/src/services/notificationService.ts
   - createNotification()
   - markAsRead()
   - getUserNotifications()
   ```

#### Frontend Tasks:

1. **Payment Submission Form**
   - Transaction reference input
   - Amount field
   - Payment method dropdown
   - Sender name
   - Screenshot upload/URL

2. **Admin Publishing UI**
   - Payment verification queue
   - Approve/reject interface
   - Publish/schedule options
   - Feature ad toggle

3. **Admin Payment Dashboard**
   - Pending payments table
   - Screenshot preview
   - Verification form

---

### Phase 5: Search, Analytics & QA (Week 5)

#### Backend Tasks:

1. **Search & Filter Logic**
   ```typescript
   // server/src/services/searchService.ts
   - buildSearchQuery()
   - applyFilters()
   - applySorting()
   - calculatePagination()
   - Full-text search (optional)
   ```

2. **Analytics Service**
   ```typescript
   // server/src/services/analyticsService.ts
   - getListingStats()
   - getRevenueStats()
   - getModerationStats()
   - getTaxonomyStats()
   - getOperationsStats()
   - generateReports()
   ```

3. **Health Check Service**
   ```typescript
   // server/src/services/healthService.ts
   - checkDatabase()
   - checkCronJobs()
   - checkAPI()
   - logHealth()
   ```

#### Frontend Tasks:

1. **Explore Ads Page**
   - Search bar with autocomplete
   - Category filters (checkboxes)
   - City filters (dropdown)
   - Price range slider
   - Package filter
   - Sorting options
   - Results grid with pagination

2. **Admin Analytics Dashboard**
   - KPI cards (total ads, revenue, etc.)
   - Revenue by package chart
   - Ads by category chart
   - Moderation approval rate chart
   - Cron job status table
   - Database health status

3. **System Health Page**
   - Database connection status
   - Cron job logs
   - API error tracking
   - Failed validations log

4. **Testing**
   - Unit tests for services
   - Integration tests for APIs
   - Component tests for UI
   - E2E tests for workflows

---

### Phase 6: Deployment & Presentation (Week 6)

#### Tasks:

1. **Environment Setup**
   - Configure Vercel project
   - Set environment variables
   - Configure custom domain (optional)
   - Setup CORS for API

2. **Database Migration**
   - Run SQL schema on production
   - Seed initial data (packages, categories, cities)
   - Create RLS policies
   - Performance tuning

3. **Cron Job Configuration**
   ```json
   // vercel.json
   {
     "crons": [
       {
         "path": "/api/cron/publish-scheduled",
         "schedule": "0 * * * *"
       },
       {
         "path": "/api/cron/expire-ads",
         "schedule": "0 2 * * *"
       },
       {
         "path": "/api/cron/send-expiring-notifications",
         "schedule": "0 6 * * *"
       }
     ]
   }
   ```

4. **Documentation**
   - API documentation (Postman collection)
   - Architecture diagrams
   - Database schema export
   - Setup & deployment guide
   - Troubleshooting guide

5. **Demo & Presentation**
   - Record demo video (5-10 minutes)
   - Prepare live demo (backup video)
   - Create presentation slides
   - Prepare for viva questions

6. **Sample Data**
   - Create 15-25 sample ads
   - Multiple sellers
   - Various categories & cities
   - Different ad statuses
   - Payment records

---

## 🚀 Deployment Strategy

### Vercel Deployment (Frontend + API)

1. **Connect GitHub Repository**
   - Push code to GitHub
   - Connect Vercel to repo
   - Auto-deploy on push to main

2. **Environment Variables**
   ```bash
   # Set in Vercel Dashboard
   NEXT_PUBLIC_API_URL=https://api.yoursite.com
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   DATABASE_URL=postgresql://...
   JWT_SECRET=xxxxx
   ```

3. **Cron Jobs**
   ```json
   // vercel.json
   {
     "crons": [{
       "path": "/api/cron/publish-scheduled",
       "schedule": "0 * * * *"
     }]
   }
   ```

### Supabase Deployment

1. **Database**
   - Use provided PostgreSQL instance
   - Run migrations via SQL editor
   - Enable RLS policies

2. **Backup Strategy**
   - Daily automated backups
   - Monthly manual exports
   - Test recovery quarterly

3. **Monitoring**
   - Database activity logs
   - Query performance stats
   - Connection pool monitoring

---

## ✅ Testing & QA

### Unit Tests

```typescript
// server/__tests__/services/adService.test.ts
describe('AdService', () => {
  describe('createDraft', () => {
    it('should create ad with draft status', async () => { });
    it('should generate unique slug', async () => { });
    it('should validate required fields', async () => { });
  });

  describe('calculateExpiry', () => {
    it('should add package duration to publish date', () => { });
    it('should handle premium package refresh', () => { });
  });
});
```

### Integration Tests

```typescript
// server/__tests__/api/client.test.ts
describe('Client API', () => {
  describe('POST /api/client/ads', () => {
    it('should create ad draft for authenticated client', async () => { });
    it('should reject request from non-client', async () => { });
    it('should validate request body', async () => { });
  });
});
```

### E2E Tests

```typescript
// e2e/workflows/fullAdLifecycle.test.ts
describe('Full Ad Lifecycle', () => {
  it('should complete full workflow from draft to published', async () => {
    // 1. Client creates draft
    // 2. Moderator approves
    // 3. Client submits payment
    // 4. Admin verifies payment
    // 5. Ad is published
    // 6. Ad is visible publicly
  });
});
```

---

## 🎓 Grading Rubric

| Criterion | Excellent (4) | Good (3) | Satisfactory (2) | Needs Work (1) | Marks |
|-----------|---|---|---|---|---|
| **Architecture Design** | Scalable, well-structured, clear separation of concerns | Logical structure with minor issues | Basic structure with some concerns | Poor organization | 15 |
| **Database Design** | Excellent schema, proper constraints, optimized indexes | Good relationships and normalization | Basic tables with some redundancy | Poorly designed schema | 15 |
| **Authentication & RBAC** | Secure implementation, all roles work perfectly | JWT/auth implemented, minor issues | Basic auth working, RBAC incomplete | Missing or broken | 10 |
| **Workflow Logic** | All state transitions correct, complete audit trail | Mostly working, minor bugs | Core workflow works, missing features | Broken workflow | 15 |
| **API Quality** | Clean RESTful design, comprehensive validation | Well-structured APIs, mostly consistent | Working APIs with inconsistencies | Poorly designed APIs | 10 |
| **Frontend UX** | Polished, intuitive, fully responsive | Good UX with minor issues | Functional but basic UI | Poor UX, broken layouts | 10 |
| **Analytics & Automation** | All metrics working, cron jobs reliable | Good analytics, mostly working jobs | Basic analytics, some automation issues | Missing features | 10 |
| **Code Quality** | Clean, readable, well-documented | Generally good code with comments | Acceptable but some clarity issues | Messy, hard to follow | 5 |
| **Deployment & Demo** | Fully deployed, smooth demo | Deployed with minor issues | Mostly working deployment | Deployment problems | 5 |
| **Viva & Presentation** | Excellent understanding, confident answers | Good knowledge, minor hesitations | Basic understanding, some confusion | Poor understanding | 5 |
| | | | | **TOTAL** | **100** |

---

## 🎤 Viva Questions

### Architecture & Design (Tier 1)

**Q1: Why did you choose Supabase Postgres instead of local file storage for this project?**

*Expected Answer Framework*:
- Scalability: Supports thousands of concurrent users
- Relational data model: Multiple tables with constraints
- Full-text search capabilities
- Built-in authentication
- Real-time subscriptions (optional)
- Automatic backups
- Better than local storage for production systems

**Q2: How does the multi-role ad lifecycle protect business logic better than a simple approved/rejected model?**

*Expected Answer Framework*:
- Clear state machine prevents invalid transitions
- Separates moderation from payment verification
- Enables workflow tracking and audit trails
- Protects revenue (must verify payment first)
- Prevents data loss (archive instead of delete)
- Allows scheduling for better UX
- Supports notifications at each stage

**Q3: Explain the ranking formula and why each component matters**

*Expected Answer Framework*:
```
rankScore = featured(50) + packageWeight(10-30) + freshness(0-20) + adminBoost(0-100) + verified(5)
```
- Featured: Business-critical for premium users
- Package weight: Rewards paying customers
- Freshness: Encourages regular content
- Admin boost: Manual control for promotions
- Verified badge: Builds trust & encourages good behavior

---

### Implementation & Business Logic (Tier 2)

**Q4: How did you implement role-based access control (RBAC) across client, moderator, admin, and super admin roles?**

*Expected Answer Framework*:
- Middleware-based approach: `requireRole('admin')` decorator
- JWT token includes user role
- Database checks role on critical operations
- Frontend hides UI elements for unauthorized roles
- API returns 403 Forbidden for unauthorized requests
- Audit log tracks who accessed what

**Q5: How are external media URLs validated and normalized?**

*Expected Answer Framework*:
- Protocol validation: Must be https://
- Domain whitelist: GitHub, direct image URLs only
- YouTube detection: Extract video ID and generate thumbnail
- Image validation: Check extension and file size
- Fallback: Display placeholder if URL fails to load
- Storage: Save source_type, original_url, normalized_url, validation_status

**Q6: What happens when an ad reaches its expiry date?**

*Expected Answer Framework*:
- Automatic cron job checks expire_at timestamp daily
- Ad status changes from 'published' to 'expired'
- is_visible_publicly set to false
- Ad removed from public search results
- User receives notification
- Client can choose to renew
- Audit log records expiration event
- Analytics updated

**Q7: How is payment verification modeled in your database and APIs?**

*Expected Answer Framework*:
- `payments` table stores proof (transaction ref, amount, screenshot)
- Status flow: submitted → verified → rejected
- Unique constraint on transaction_ref prevents duplicates
- Admin must approve payment before ad can be published
- Amount validated against package price (±10% tolerance)
- Records verified_by, verified_at, rejection_reason
- Audit trail for all verification actions

---

### System Features (Tier 3)

**Q8: How are duplicate ads and fake payments prevented?**

*Expected Answer Framework*:
- Duplicate ads: Moderator manual flagging, optional content similarity detection
- Fake payments:
  - Transaction reference uniqueness constraint
  - Optional screenshot for manual verification
  - Amount validation against known packages
  - Seller verification badge system
  - Admin manual review queue
  - Patterns detection (same seller, multiple similar ads)

**Q9: Walk me through the complete flow of an ad from creation to publication**

*Expected Answer Framework*:
```
1. Client creates draft (status: 'draft', private)
2. Client adds media URLs and submits (status: 'submitted')
3. Moderator reviews content (status: 'under_review')
4. Moderator approves (status: 'payment_pending')
5. Client selects package and submits payment proof
   (status: 'payment_submitted')
6. Admin verifies payment (status: 'payment_verified')
7. Admin publishes immediately or schedules (status: 'published')
   - expire_at calculated: now + package.duration_days
   - is_visible_publicly set to true
   - rank_score calculated
8. Ad appears in public search results
9. After duration days, cron expires ad (status: 'expired')
10. Notifications sent at each stage
11. Audit trail logged for entire workflow
```

**Q10: How would you scale this platform for 100,000+ listings?**

*Expected Answer Framework*:
- **Database**:
  - Partition ads table by city or date range
  - Materialized views for analytics
  - Read replicas for search queries
  - Archive old ads to separate table
  
- **Search**:
  - Elasticsearch or PostgreSQL full-text search
  - Caching frequently accessed categories/cities
  
- **Cron Jobs**:
  - Batch processing instead of per-ad operations
  - Queue system (Bull, RabbitMQ) for heavy tasks
  
- **Frontend**:
  - Lazy load results on scroll
  - Server-side pagination with cursor-based navigation
  - Image CDN for media with thumbnail generation
  
- **Infrastructure**:
  - Horizontal scaling with load balancer
  - Redis for caching hot data
  - Database connection pooling

---

### Problem-Solving (Tier 4)

**Q11: What happens if a cron job fails? How do you ensure reliability?**

*Expected Answer Framework*:
- Logging: All job executions logged to system_health_logs
- Monitoring: Email alerts for failures
- Retry logic: Automatic retry with exponential backoff
- Idempotency: Safe to run multiple times
- Partial failure handling: Log individual failures but continue
- Manual recovery: Admin can trigger job manually

**Q12: How would you handle concurrent requests trying to publish the same ad?**

*Expected Answer Framework*:
- Database lock: Use PostgreSQL SELECT FOR UPDATE
- Versioning: Optimistic locking with version field
- Transaction: Entire publish operation in single transaction
- Validation: Check ad.status hasn't changed before publishing
- Audit: Log failed publish attempts

**Q13: What security measures are implemented?**

*Expected Answer Framework*:
- **Authentication**: JWT with expiration
- **Authorization**: Role-based middleware
- **Database**: RLS policies, parameterized queries
- **Input Validation**: Zod schema validation
- **CORS**: Configured for specific domain
- **Rate Limiting**: Prevent brute force, DDoS
- **SQL Injection**: ORM/parameterized queries
- **XSS Prevention**: React auto-escaping
- **Audit Logging**: All critical actions logged

---

## 📚 Extra Credit Ideas

- ⭐ **Saved Ads / Bookmarks**: Users can save favorite listings
- 🔍 **Duplicate Detection**: Detect listings by phone number or content similarity
- 🚩 **Report Abuse / Spam**: Users report inappropriate content
- 🎟️ **Coupon Codes**: Discount codes for packages
- ✅ **Seller Verification**: Email verification, phone verification, badge system
- 📧 **Email Notifications**: Send updates via email
- 📱 **WhatsApp Integration**: Send updates via WhatsApp
- 📊 **Materialized Views**: Pre-computed analytics tables
- 🗑️ **Soft Delete**: Soft deletes with recovery option
- ⭐ **Ratings & Reviews**: Sellers rated by buyers
- 💬 **Seller Chat**: In-app messaging between seller and buyer
- 📸 **Image Compression**: Auto-compress images on upload
- 🔔 **Push Notifications**: Browser or mobile push notifications
- 🌙 **Dark Mode**: Theme toggle
- 🌐 **Multi-Language**: i18n support

---

## 📖 References & Best Practices

### Code Organization
- Follow feature-based folder structure
- Separate concerns: routes, controllers, services, utilities
- DRY principle: Reusable functions and components
- Single responsibility: One function, one purpose

### Database
- Proper indexing on foreign keys and frequently queried fields
- Use transactions for multi-step operations
- Enable RLS for security
- Regular backups and testing recovery

### API Design
- RESTful principles: Resource-based URLs
- Consistent error responses with proper HTTP status codes
- Versioning for backward compatibility
- Comprehensive documentation

### Frontend
- Component reusability and composition
- State management best practices
- Accessibility (a11y): WCAG 2.1 AA standard
- Performance: Lazy loading, code splitting, image optimization

### Security
- HTTPS everywhere
- Secure password hashing (bcrypt, argon2)
- JWT with short expiration + refresh tokens
- CORS configuration
- Input validation and sanitization
- Rate limiting and throttling

---

## 🎯 Final Checklist

Before submission, ensure:

- ✅ All database tables created and indexed
- ✅ Authentication & JWT working
- ✅ All user roles and permissions functional
- ✅ Ad lifecycle complete (draft → published → expired)
- ✅ Payment verification flow working
- ✅ Media normalization handling YouTube & image URLs
- ✅ Cron jobs scheduled and tested
- ✅ Search and filtering operational
- ✅ Analytics dashboard showing metrics
- ✅ Audit logs capturing all actions
- ✅ Notifications sent at key stages
- ✅ Error handling and validation comprehensive
- ✅ Code documented with comments
- ✅ Deployed on Vercel + Supabase
- ✅ Sample data (15-25 ads) created
- ✅ API documentation (Postman collection)
- ✅ Demo video recorded
- ✅ Presentation slides prepared
- ✅ README with setup instructions
- ✅ Environment variables properly configured
- ✅ Performance optimized (response times < 500ms)

---

**Good luck with your AdFlow Pro implementation! 🚀**

*This is a comprehensive, production-style project designed to teach real-world full-stack development principles. Focus on architecture, business logic, and user workflows rather than visual polish alone.*
