const mongoose = require("mongoose");

// Define the schema
const dashboardSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  mlcoin: {
    type: Number,
    default: 0, // Default value is null if mlcoin is not provided
  },
  lastClaimed: {
    type: Date,
    default: null,
  },
  taskIds: {
    type: Array,
    default: [],
  },
  referralCode: {
    type: Number,
    default: null,
  },
  referredBy: { type: Number, default: null },
  referrals: {
    type: Number,
    default: 0,
  },
});

// Create the model
const UserDashboard = mongoose.model("UserDashboard", dashboardSchema);

// Export the model
module.exports = UserDashboard;