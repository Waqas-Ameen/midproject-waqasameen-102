import { Router } from 'express';
import { createAd, updateAd, getClientAds, submitAd } from '../controllers/adController';
import { submitPayment } from '../controllers/paymentController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { CreateAdSchema, UpdateAdSchema, SubmitAdSchema, SubmitPaymentSchema } from '../../../shared/schemas';

const router = Router();

// all routes here expect client role
router.use(authMiddleware);
router.use(requireRole('client'));

router.post('/ads', validateRequest(CreateAdSchema), createAd);
router.patch('/ads/:id', validateRequest(UpdateAdSchema), updateAd);
router.post('/ads/:id/submit', validateRequest(SubmitAdSchema), submitAd);
router.get('/ads', getClientAds);

router.post('/payments', validateRequest(SubmitPaymentSchema), submitPayment);

export default router;
