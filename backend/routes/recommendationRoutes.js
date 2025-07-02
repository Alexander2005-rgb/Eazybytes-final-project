// backend/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

// Get personalized event recommendations based on user interests
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find events matching user interests in categories
    const recommendedEvents = await Event.find({
      categories: { $in: user.interests }
    }).limit(10);

    res.json(recommendedEvents);
  } catch (err) {
    console.error('Failed to get recommendations', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
