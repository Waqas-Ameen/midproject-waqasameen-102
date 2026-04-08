const express = require('express');
const Joi = require('joi');
const { supabase } = require('../index');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation schemas
const adSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.string().uuid().required(),
  package_id: Joi.string().uuid().required(),
  media_urls: Joi.array().items(Joi.string().uri()).default([]),
  city: Joi.string()
});

// Get public ads
router.get('/', async (req, res) => {
  try {
    const { category, city, search, sort = 'ranking', page = 1, limit = 10 } = req.query;
    let query = supabase
      .from('ads')
      .select(`
        id, title, description, city, created_at, expiry_date, is_featured, ranking_score,
        categories (name, slug),
        packages (name, price),
        users (full_name)
      `)
      .eq('status', 'published')
      .lt('expiry_date', new Date().toISOString());

    if (category) query = query.eq('categories.slug', category);
    if (city) query = query.ilike('city', `%${city}%`);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: ads, error, count } = await query
      .order(sort === 'date' ? 'created_at' : 'ranking_score', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({ ads, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ad by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: ad, error } = await supabase
      .from('ads')
      .select(`
        *,
        categories (name),
        packages (name, price),
        users (full_name, phone)
      `)
      .eq('id', req.params.id)
      .eq('status', 'published')
      .single();

    if (error || !ad) return res.status(404).json({ error: 'Ad not found' });

    // Track view
    await supabase.from('analytics').insert([{
      ad_id: ad.id,
      event_type: 'view',
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }]);

    res.json({ ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create ad (client)
router.post('/', authenticate, authorize('client'), async (req, res) => {
  try {
    const { error, value } = adSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const adData = { ...value, user_id: req.user.id };

    const { data: ad, error: insertError } = await supabase
      .from('ads')
      .insert([adData])
      .select()
      .single();

    if (insertError) throw insertError;

    res.json({ ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ad (client, if draft)
router.put('/:id', authenticate, authorize('client'), async (req, res) => {
  try {
    // Check ownership and status
    const { data: existing } = await supabase
      .from('ads')
      .select('user_id, status')
      .eq('id', req.params.id)
      .single();

    if (!existing || existing.user_id !== req.user.id || existing.status !== 'draft') {
      return res.status(403).json({ error: 'Cannot edit this ad' });
    }

    const { error, value } = adSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { data: ad, error: updateError } = await supabase
      .from('ads')
      .update(value)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit ad for review
router.post('/:id/submit', authenticate, authorize('client'), async (req, res) => {
  try {
    const { payment_proof } = req.body;

    const { data: ad, error } = await supabase
      .from('ads')
      .update({ status: 'submitted', payment_proof })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .eq('status', 'draft')
      .select()
      .single();

    if (error) throw error;

    // Notify moderators (simplified)
    await supabase.from('notifications').insert([{
      user_id: req.user.id,
      message: 'Your ad has been submitted for review',
      type: 'review_update'
    }]);

    res.json({ ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Review ad (moderator)
router.post('/:id/review', authenticate, authorize('moderator'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    const { data: ad, error } = await supabase
      .from('ads')
      .update({ status })
      .eq('id', req.params.id)
      .eq('status', 'submitted')
      .select()
      .single();

    if (error) throw error;

    await supabase.from('ad_reviews').insert([{
      ad_id: ad.id,
      moderator_id: req.user.id,
      status,
      notes
    }]);

    // Notify client
    await supabase.from('notifications').insert([{
      user_id: ad.user_id,
      message: `Your ad has been ${status}`,
      type: 'review_update'
    }]);

    res.json({ ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment (admin)
router.post('/:id/verify-payment', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { data: ad } = await supabase
      .from('ads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!ad || ad.status !== 'approved') return res.status(400).json({ error: 'Invalid ad status' });

    await supabase.from('payments').insert([{
      ad_id: ad.id,
      verified_by: req.user.id
    }]);

    // Notify client
    await supabase.from('notifications').insert([{
      user_id: ad.user_id,
      message: 'Your payment has been verified',
      type: 'payment_verified'
    }]);

    res.json({ message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish ad (admin)
router.post('/:id/publish', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { data: ad } = await supabase
      .from('ads')
      .select('*, packages(*)')
      .eq('id', req.params.id)
      .single();

    if (!ad || ad.status !== 'approved') return res.status(400).json({ error: 'Invalid ad status' });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + ad.packages.duration_days);

    const ranking = ad.packages.features?.ranking_boost || 0;

    const { data: updatedAd, error } = await supabase
      .from('ads')
      .update({
        status: 'published',
        expiry_date: expiry.toISOString(),
        is_featured: ad.packages.features?.featured || false,
        ranking_score: ranking
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Notify client
    await supabase.from('notifications').insert([{
      user_id: ad.user_id,
      message: 'Your ad has been published',
      type: 'ad_published'
    }]);

    res.json({ ad: updatedAd });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;