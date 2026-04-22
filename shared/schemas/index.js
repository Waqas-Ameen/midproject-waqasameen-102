"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningQuestionFilterSchema = exports.UpdateSellerProfileSchema = exports.AdFilterSchema = exports.ReviewAdSchema = exports.VerifyPaymentSchema = exports.SubmitPaymentSchema = exports.PaymentMethodType = exports.SubmitAdSchema = exports.UpdateAdSchema = exports.CreateAdSchema = exports.AdMediaSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
// Auth Schemas
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(255),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['client', 'moderator', 'admin']).default('client'),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
// Ad Schemas
const MediaSourceType = zod_1.z.enum(['image', 'youtube', 'external_url']);
exports.AdMediaSchema = zod_1.z.object({
    source_type: MediaSourceType,
    original_url: zod_1.z.string().url(),
    display_order: zod_1.z.number().optional(),
});
exports.CreateAdSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(255),
    description: zod_1.z.string().min(20).max(5000),
    category_id: zod_1.z.string().uuid(),
    city_id: zod_1.z.string().uuid(),
    media_urls: zod_1.z.array(exports.AdMediaSchema).min(1).max(5),
});
exports.UpdateAdSchema = exports.CreateAdSchema.partial();
exports.SubmitAdSchema = zod_1.z.object({
    ad_id: zod_1.z.string().uuid(),
    package_id: zod_1.z.string().uuid(),
});
// Payment Schemas
exports.PaymentMethodType = zod_1.z.enum(['bank_transfer', 'card', 'online_wallet']);
exports.SubmitPaymentSchema = zod_1.z.object({
    ad_id: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
    method: exports.PaymentMethodType,
    transaction_ref: zod_1.z.string().min(5).max(100),
    sender_name: zod_1.z.string().min(2).max(255),
    screenshot_url: zod_1.z.string().url().optional(),
});
exports.VerifyPaymentSchema = zod_1.z.object({
    payment_id: zod_1.z.string().uuid(),
    status: zod_1.z.enum(['verified', 'rejected']),
    verification_notes: zod_1.z.string().optional(),
});
// Moderation Schemas
exports.ReviewAdSchema = zod_1.z.object({
    ad_id: zod_1.z.string().uuid(),
    action: zod_1.z.enum(['approve', 'reject']),
    rejection_reason: zod_1.z.string().optional(),
    internal_notes: zod_1.z.string().optional(),
});
// Query Schemas
exports.AdFilterSchema = zod_1.z.object({
    category_id: zod_1.z.string().uuid().optional(),
    city_id: zod_1.z.string().uuid().optional(),
    package_id: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().max(255).optional(),
    sort_by: zod_1.z.enum(['newest', 'oldest', 'rank']).default('rank'),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
});
// Seller Profile Schemas
exports.UpdateSellerProfileSchema = zod_1.z.object({
    display_name: zod_1.z.string().max(255).optional(),
    business_name: zod_1.z.string().max(255).optional(),
    phone: zod_1.z.string().max(20).optional(),
    city: zod_1.z.string().max(100).optional(),
});
// Learning Question Schema (for public fetch)
exports.LearningQuestionFilterSchema = zod_1.z.object({
    topic: zod_1.z.string().optional(),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
});
