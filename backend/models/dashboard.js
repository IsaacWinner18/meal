const mongoose = require("mongoose");

// Define the schema
const dashboardSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  mlcoin: {
    type: Number,
    default: 0, // Default value is null if mlcoin is not provided
  },
  lastClaimed: {
    type: Date,
    default: null,
  },
  // videoIds: {
  //   type: Array,
  //   default: [],
  // },
  referralCode: {
    type: String,
    unique: false,
  },
  referredBy: {
    type: String,
    default: null,
  },
  referrals: {
    type: Number,
    default: 0,
  },
});

// Create the model
const UserDashboard = mongoose.model("UserDashboard", dashboardSchema);

// Export the model
module.exports = UserDashboard;
