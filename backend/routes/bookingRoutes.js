// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middlewares/authMiddleware');

// Book an event
router.post('/:eventId', auth, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event || event.availableSeats <= 0) return res.status(400).json({ error: "Event not available" });

  // Simulate payment processing (mock)
  const paymentSuccess = true; // In real scenario, integrate payment gateway here

  if (!paymentSuccess) {
    return res.status(400).json({ error: "Payment failed" });
  }

  const booking = await Booking.create({
    eventId: req.params.eventId,
    userId: req.user.id,
    paymentStatus: 'completed',
    notifications: ['Booking confirmed']
  });

  // Decrement seat count
  event.availableSeats -= 1;
  await event.save();

  res.status(201).json({ message: "Booking successful", booking });
});

// backend/routes/bookingRoutes.js (Add below POST route)
router.get('/my', auth, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).populate('eventId');
  res.json(bookings);
});


// Update payment status
router.put('/:bookingId/payment-status', auth, async (req, res) => {
  const { paymentStatus } = req.body;
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  booking.paymentStatus = paymentStatus;
  booking.notifications.push(`Payment status updated to ${paymentStatus}`);
  await booking.save();

  res.json({ message: 'Payment status updated', booking });
});

// Cancel a booking
router.delete('/:bookingId', auth, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  const event = await Event.findById(booking.eventId);
  if (event) {
    event.availableSeats += 1;
    await event.save();
  }

  await booking.deleteOne();

  res.json({ message: 'Booking cancelled' });
});

module.exports = router;
