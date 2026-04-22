// User and Role Types
export type UserRole = 'client' | 'moderator' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  display_name?: string;
  business_name?: string;
  phone?: string;
  city?: string;
  is_verified: boolean;
  verification_date?: Date;
  created_at: Date;
  updated_at: Date;
}

// Ad Related Types
export type AdStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'payment_pending'
  | 'payment_submitted'
  | 'payment_verified'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'archived'
  | 'rejected';

export type MediaSourceType = 'image' | 'youtube' | 'external_url';
export type MediaValidationStatus = 'pending' | 'valid' | 'invalid';

export interface Ad {
  id: string;
  user_id: string;
  package_id?: string;
  category_id: string;
  city_id: string;
  title: string;
  slug: string;
  description: string;
  status: AdStatus;
  admin_boost_points: number;
  publish_at?: Date;
  expire_at?: Date;
  created_at: Date;
  updated_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  rejection_reason?: string;
}

export interface AdMedia {
  id: string;
  ad_id: string;
  source_type?: MediaSourceType;
  original_url: string;
  normalized_url?: string;
  thumbnail_url?: string;
  validation_status: MediaValidationStatus;
  validated_at?: Date;
  display_order?: number;
  created_at: Date;
}

// Package Types
export interface Package {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  weight: number; // 1-3
  is_featured: boolean;
  homepage_visibility?: 'none' | 'category' | 'homepage';
  auto_refresh: boolean;
  refresh_interval_days?: number;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Category and City Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: Date;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: Date;
}

// Payment Types
export type PaymentMethod = 'bank_transfer' | 'card' | 'online_wallet';
export type PaymentStatus = 'submitted' | 'verified' | 'rejected' | 'refunded';

export interface Payment {
  id: string;
  ad_id: string;
  amount: number;
  method?: PaymentMethod;
  transaction_ref: string;
  sender_name?: string;
  screenshot_url?: string;
  status: PaymentStatus;
  verified_by?: string;
  verification_notes?: string;
  created_at: Date;
  updated_at: Date;
  verified_at?: Date;
}

// Notification Types
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'expiring_soon';

export interface Notification {
  id: string;
  user_id: string;
  title?: string;
  message: string;
  type?: NotificationType;
  link_path?: string;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

// Status History
export interface AdStatusHistory {
  id: string;
  ad_id: string;
  previous_status?: AdStatus;
  new_status: AdStatus;
  changed_by?: string;
  note?: string;
  changed_at: Date;
}

// Audit Log
export interface AuditLog {
  id: string;
  actor_id?: string;
  action_type?: string;
  target_type?: string;
  target_id?: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Query filters
export interface AdFilters {
  category_id?: string;
  city_id?: string;
  package_id?: string;
  status?: AdStatus;
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'rank';
  page?: number;
  limit?: number;
}

// Dashboard metrics
export interface DashboardMetrics {
  total_ads: number;
  active_ads: number;
  pending_reviews: number;
  expired_ads: number;
  revenue_total: number;
  approval_rate: number;
  rejection_rate: number;
}

// Learning question
export interface LearningQuestion {
  id: string;
  question: string;
  answer: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: Date;
}

export interface SystemHealthLog {
  id: string;
  source: string;
  response_ms: number;
  status: 'success' | 'failure';
  error_message?: string;
  checked_at: Date;
}
