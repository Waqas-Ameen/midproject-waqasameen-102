const express = require('express');
const { supabase } = require('../index');

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) throw error;

    res.json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;