const express = require('express');
const { supabase } = require('../index');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;