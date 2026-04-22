import { Router, Request, Response } from 'express';
import { getPackages, getCategories, getCities } from '../db/client';
import { supabase } from '../db/client';
import { AdFilterSchema } from '../../../shared/schemas';
import { searchAds, getPublicAd } from '../services/adsService';

const router = Router();

/**
 * GET /api/packages
 * Fetch all active packages
 */
router.get('/packages', async (req: Request, res: Response) => {
  try {
    const { data: packages, error } = await getPackages();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch packages',
      });
    }

    return res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error('Fetch packages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/categories
 * Fetch all categories
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const { data: categories, error } = await getCategories();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
      });
    }

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/cities
 * Fetch all cities
 */
router.get('/cities', async (req: Request, res: Response) => {
  try {
    const { data: cities, error } = await getCities();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch cities',
      });
    }

    return res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error('Fetch cities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/ads
 * Browse ads
 */
router.get('/ads', async (req: Request, res: Response) => {
  try {
     const filters = AdFilterSchema.parse(req.query);
     const result = await searchAds(filters);
     return res.json({ success: true, ...result });
  } catch (error: any) {
     return res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/ads/:slug
 * Get ad detail
 */
router.get('/ads/:slug', async (req: Request, res: Response) => {
  try {
     const ad = await getPublicAd(req.params.slug);
     return res.json({ success: true, data: ad });
  } catch (error: any) {
     return res.status(404).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/questions/random
 * Fetch random learning question
 */
router.get('/questions/random', async (req: Request, res: Response) => {
  try {
    const { data: questions, error } = await supabase
      .from('learning_questions')
      .select('*')
      .eq('is_active', true);

    if (error || !questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions available',
      });
    }

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    return res.status(200).json({
      success: true,
      data: randomQuestion,
    });
  } catch (error) {
    console.error('Fetch question error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/health/db
 * Database heartbeat check
 */
router.get('/health/db', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    // Simple health check query
    const { error } = await supabase.from('categories').select('id').limit(1);

    const response_ms = Date.now() - startTime;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        response_ms,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Database is healthy',
      response_ms,
    });
  } catch (error) {
    console.error('DB health check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Health check failed',
    });
  }
});

export default router;
