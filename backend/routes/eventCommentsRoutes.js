// backend/routes/eventCommentsRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middlewares/authMiddleware');

const commentSchema = new (require('mongoose').Schema)({
  userId: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const EventComments = require('mongoose').model('EventComments', new (require('mongoose').Schema)({
  eventId: { type: require('mongoose').Schema.Types.ObjectId, ref: 'Event', unique: true },
  comments: [commentSchema]
}));

// Get comments for an event
router.get('/:eventId', async (req, res) => {
  try {
    const eventComments = await EventComments.findOne({ eventId: req.params.eventId });
    res.json(eventComments ? eventComments.comments : []);
  } catch (err) {
    console.error('Failed to get comments', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment to an event
router.post('/:eventId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required' });

    let eventComments = await EventComments.findOne({ eventId: req.params.eventId });
    if (!eventComments) {
      eventComments = new EventComments({ eventId: req.params.eventId, comments: [] });
    }

    const comment = {
      userId: req.user.id,
      username: req.user.name || 'Anonymous',
      text,
      createdAt: new Date()
    };

    eventComments.comments.push(comment);
    await eventComments.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error('Failed to add comment', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
