// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  interests: [String], // categories or tags user is interested in
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // bookmarked events
  preferences: {
    notificationsEnabled: { type: Boolean, default: true },
    // other preference fields can be added here
  }
});

module.exports = mongoose.model('User', userSchema);
