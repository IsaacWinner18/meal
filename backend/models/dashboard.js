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
  usernamedb: {
    type: String,
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
  videoIds: {
    type: Array,
    unique: true,
  }
  // referral: int 
  // usersReferred: a list of user's they've referred...
});

// Create the model
const UserDashboard = mongoose.model("UserDashboard", dashboardSchema);

// Export the model
module.exports = UserDashboard;
