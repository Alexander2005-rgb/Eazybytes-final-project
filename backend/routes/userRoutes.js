const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

// Update user interests
router.put('/interests', auth, async (req, res) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: 'Interests must be an array of strings' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.interests = interests;
    await user.save();

    res.json({ message: 'Interests updated successfully', interests: user.interests });
  } catch (err) {
    console.error('Failed to update interests', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
