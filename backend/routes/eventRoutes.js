// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middlewares/authMiddleware');

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Create event (Admin)
router.post('/', auth, async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

// backend/routes/eventRoutes.js
router.get('/admin/all', auth, async (req, res) => {
  // Optionally, check for isAdmin
  const events = await Event.find();
  res.json(events);
});

// Get distinct event categories
router.get('/categories', async (req, res) => {
  try {
    const categoriesAgg = await Event.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: null, distinctCategories: { $addToSet: '$categories' } } },
      { $project: { _id: 0, distinctCategories: 1 } }
    ]);
    const categories = categoriesAgg.length > 0 ? categoriesAgg[0].distinctCategories : [];
    res.json(categories);
  } catch (err) {
    console.error('Failed to get event categories', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
