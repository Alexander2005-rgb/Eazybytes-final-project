/**
 * Script to set a user as admin in the MongoDB database.
 * Usage: node backend/scripts/setAdminUser.js userEmail@example.com
 */

const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/event-management';

async function setAdmin(email) {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      process.exit(1);
    }
    user.isAdmin = true;
    await user.save();
    console.log(`User ${email} is now an admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Error setting user as admin:', err);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Please provide the user email as an argument.');
  process.exit(1);
}

setAdmin(email);
