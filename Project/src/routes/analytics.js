const express = require('express');
const { supabase } = require('../index');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Track event
router.post('/track', async (req, res) => {
  try {
    const { ad_id, event_type } = req.body;

    await supabase.from('analytics').insert([{
      ad_id,
      event_type,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }]);

    res.json({ message: 'Event tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics (admin)
router.get('/summary', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Simple summary
    const { data: totalAds } = await supabase.from('ads').select('id', { count: 'exact' });
    const { data: activeAds } = await supabase.from('ads').select('id', { count: 'exact' }).eq('status', 'published');
    const { data: views } = await supabase.from('analytics').select('id', { count: 'exact' }).eq('event_type', 'view');

    res.json({
      totalAds: totalAds.length,
      activeAds: activeAds.length,
      totalViews: views.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;