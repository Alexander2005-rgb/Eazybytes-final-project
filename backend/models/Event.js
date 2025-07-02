// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  availableSeats: Number,
  price: Number,
  categories: [String], // categories or tags for event classification
  attendeesCount: { type: Number, default: 0 } // for analytics
});

module.exports = mongoose.model('Event', eventSchema);
