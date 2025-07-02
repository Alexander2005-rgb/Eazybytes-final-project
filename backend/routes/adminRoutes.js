// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const auth = require('../middlewares/authMiddleware');

// Middleware to check admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

const mongoose = require('mongoose');

// Get analytics data
router.get('/analytics', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = totalUsers; // No lastLogin field, so placeholder

    const eventAttendance = await Event.find({}, 'title attendeesCount').lean();

    const totalEvents = await Event.countDocuments();

    const now = new Date();
    const upcomingEventsCount = await Event.countDocuments({ date: { $gte: now } });

    // Aggregate events by category
    const eventsByCategoryAgg = await Event.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } }
    ]);
    const eventsByCategory = {};
    eventsByCategoryAgg.forEach(cat => {
      eventsByCategory[cat._id] = cat.count;
    });

    // Average event price
    const avgPriceAgg = await Event.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    const averageEventPrice = avgPriceAgg.length > 0 ? avgPriceAgg[0].avgPrice : 0;

    // Total revenue estimate (sum of price * attendeesCount)
    const revenueAgg = await Event.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: { $multiply: ['$price', '$attendeesCount'] } } } }
    ]);
    const totalRevenueEstimate = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      totalUsers,
      activeUsers,
      eventAttendance,
      totalEvents,
      upcomingEventsCount,
      eventsByCategory,
      averageEventPrice,
      totalRevenueEstimate,
    });
  } catch (err) {
    console.error('Failed to get analytics', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
