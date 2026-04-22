import { Router } from 'express';
import { register, login, getCurrentUser, logout, refreshToken } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { RegisterSchema, LoginSchema } from '../../../shared/schemas';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validateRequest(RegisterSchema), register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateRequest(LoginSchema), login);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authMiddleware, getCurrentUser);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authMiddleware, logout);

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', refreshToken);

export default router;
