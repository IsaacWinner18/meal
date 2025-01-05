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
    default: null, // Default value is null if mlcoin is not provided
  },
});

// Create the model
const UserDashboard = mongoose.model("UserDashboard", dashboardSchema);

// Export the model
module.exports = UserDashboard;
