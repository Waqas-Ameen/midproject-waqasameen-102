// API Constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Ad related constants
export const AD_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_SUBMITTED: 'payment_submitted',
  PAYMENT_VERIFIED: 'payment_verified',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
  REJECTED: 'rejected',
} as const;

export const AD_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  payment_pending: 'Awaiting Payment',
  payment_submitted: 'Payment Submitted',
  payment_verified: 'Payment Verified',
  scheduled: 'Scheduled',
  published: 'Published',
  expired: 'Expired',
  archived: 'Archived',
  rejected: 'Rejected',
};

export const AD_STATUS_COLORS: Record<string, string> = {
  draft: 'gray',
  submitted: 'blue',
  under_review: 'yellow',
  payment_pending: 'orange',
  payment_submitted: 'indigo',
  payment_verified: 'purple',
  scheduled: 'cyan',
  published: 'green',
  expired: 'red',
  archived: 'slate',
  rejected: 'red',
};

// User roles
export const USER_ROLE = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  client: ['view_own_ads', 'create_ad', 'submit_payment', 'edit_draft'],
  moderator: ['review_ads', 'flag_content', 'reject_ad', 'add_notes'],
  admin: ['verify_payment', 'publish_ad', 'manage_users', 'view_analytics'],
  super_admin: ['manage_packages', 'manage_settings', 'system_access'],
};

// Payment constants
export const PAYMENT_STATUS = {
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CARD: 'card',
  ONLINE_WALLET: 'online_wallet',
} as const;

// Package ranking
export const PACKAGE_WEIGHTS: Record<string, number> = {
  basic: 1,
  standard: 2,
  premium: 3,
};

export const RANKING_CALCULATION = {
  FEATURED_BONUS: 50,
  WEIGHT_MULTIPLIER: 10,
  FRESHNESS_DECAY_DAYS: 7,
  VERIFIED_SELLER_BONUS: 10,
};

// Media validation
export const ALLOWED_IMAGE_DOMAINS = [
  'githubusercontent.com', // GitHub raw
  'i.imgur.com', // Imgur
  'cloudinary.com', // Cloudinary
  'cdn.pixabay.com', // Pixabay
  'images.unsplash.com', // Unsplash
];

export const ALLOWED_VIDEO_PLATFORMS = ['youtube.com', 'youtu.be'];

export const MEDIA_VALIDATION = {
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  IMAGE_MAX_SIZE_MB: 5,
  VIDEO_MAX_DURATION_SECONDS: 300,
};

// Notification types
export const NOTIFICATION_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
  EXPIRING_SOON: 'expiring_soon',
} as const;

// Cron jobs
export const CRON_JOBS = {
  PUBLISH_SCHEDULED: '0 * * * *', // Every hour
  EXPIRE_ADS: '0 2 * * *', // Daily at 2 AM
  EXPIRING_SOON_NOTIFICATION: '0 12 * * *', // Daily at noon (48h before expiry)
  DB_HEARTBEAT: '*/15 * * * *', // Every 15 minutes
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE_TRANSACTION: 'This transaction reference already exists',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  AD_NOT_FOUND: 'Ad not found',
  PAYMENT_NOT_FOUND: 'Payment record not found',
  USER_NOT_FOUND: 'User not found',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  AD_CREATED: 'Ad created successfully',
  AD_UPDATED: 'Ad updated successfully',
  AD_SUBMITTED: 'Ad submitted for review',
  PAYMENT_SUBMITTED: 'Payment details submitted',
  PAYMENT_VERIFIED: 'Payment verified successfully',
  AD_PUBLISHED: 'Ad published successfully',
  AD_REJECTED: 'Ad rejected',
  REVIEW_COMPLETED: 'Review completed',
} as const;

// Expiration warnings (in days)
export const EXPIRATION_WARNING_DAYS = 2;

// Featured ads count per homepage view
export const FEATURED_ADS_LIMIT = 10;

// Search constants
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MIN_CHARS = 2;

// Time calculations
export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;

// LS keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'adflow_auth_token',
  USER_DATA: 'adflow_user_data',
  THEME: 'adflow_theme',
  PREFERENCES: 'adflow_preferences',
} as const;
