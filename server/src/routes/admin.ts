import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { getPaymentQueue, verifyPayment } from '../controllers/paymentController';
import { publishAd, scheduleAd } from '../services/publishingService';
import { VerifyPaymentSchema } from '../../../shared/schemas';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('admin', 'super_admin'));

// Payment Queue Endpoints
router.get('/payment-queue', getPaymentQueue);
router.patch('/payments/:id/verify', validateRequest(VerifyPaymentSchema), verifyPayment);

// Publishing Control
router.patch('/ads/:id/publish', async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    const adId = req.params.id;
    const ad = await publishAd(adId, adminId);
    res.json({ success: true, data: ad });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.patch('/ads/:id/schedule', async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    const adId = req.params.id;
    const { publish_date } = req.body;
    if (!publish_date) return res.status(400).json({ success: false, message: 'publish_date required' });
    
    const ad = await scheduleAd(adId, new Date(publish_date), adminId!);
    res.json({ success: true, data: ad });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
