import { z } from 'zod';

// Auth Schemas
export const RegisterSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['client', 'moderator', 'admin']).default('client'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// Ad Schemas
const MediaSourceType = z.enum(['image', 'youtube', 'external_url']);

export const AdMediaSchema = z.object({
  source_type: MediaSourceType,
  original_url: z.string().url(),
  display_order: z.number().optional(),
});

export const CreateAdSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(20).max(5000),
  category_id: z.string().uuid(),
  city_id: z.string().uuid(),
  media_urls: z.array(AdMediaSchema).min(1).max(5),
});

export const UpdateAdSchema = CreateAdSchema.partial();

export const SubmitAdSchema = z.object({
  ad_id: z.string().uuid(),
  package_id: z.string().uuid(),
});

export type CreateAdInput = z.infer<typeof CreateAdSchema>;
export type UpdateAdInput = z.infer<typeof UpdateAdSchema>;
export type AdMediaInput = z.infer<typeof AdMediaSchema>;

// Payment Schemas
export const PaymentMethodType = z.enum(['bank_transfer', 'card', 'online_wallet']);

export const SubmitPaymentSchema = z.object({
  ad_id: z.string().uuid(),
  amount: z.number().positive(),
  method: PaymentMethodType,
  transaction_ref: z.string().min(5).max(100),
  sender_name: z.string().min(2).max(255),
  screenshot_url: z.string().url().optional(),
});

export const VerifyPaymentSchema = z.object({
  payment_id: z.string().uuid(),
  status: z.enum(['verified', 'rejected']),
  verification_notes: z.string().optional(),
});

export type SubmitPaymentInput = z.infer<typeof SubmitPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

// Moderation Schemas
export const ReviewAdSchema = z.object({
  ad_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  rejection_reason: z.string().optional(),
  internal_notes: z.string().optional(),
});

export type ReviewAdInput = z.infer<typeof ReviewAdSchema>;

// Query Schemas
export const AdFilterSchema = z.object({
  category_id: z.string().uuid().optional(),
  city_id: z.string().uuid().optional(),
  package_id: z.string().uuid().optional(),
  search: z.string().max(255).optional(),
  sort_by: z.enum(['newest', 'oldest', 'rank']).default('rank'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type AdFilterInput = z.infer<typeof AdFilterSchema>;

// Seller Profile Schemas
export const UpdateSellerProfileSchema = z.object({
  display_name: z.string().max(255).optional(),
  business_name: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
});

export type UpdateSellerProfileInput = z.infer<typeof UpdateSellerProfileSchema>;

// Learning Question Schema (for public fetch)
export const LearningQuestionFilterSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type LearningQuestionFilterInput = z.infer<typeof LearningQuestionFilterSchema>;
