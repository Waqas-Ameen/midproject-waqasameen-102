import { Router } from 'express';
import { getPendingReviews, reviewAd } from '../controllers/moderatorController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { ReviewAdSchema } from '../../../shared/schemas';

const router = Router();

// all routes here expect moderator or admin role
router.use(authMiddleware);
router.use(requireRole('moderator', 'admin'));

router.get('/queue', getPendingReviews);
router.patch('/ads/:id/review', validateRequest(ReviewAdSchema), reviewAd);

export default router;
