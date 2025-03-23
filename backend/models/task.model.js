const mongoose = require("mongoose");

// Define the schema
const taskSchema = new mongoose.Schema({
  taskId: {
    type: Number,
    required: true,
  },
  taskUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
type: String,
required: true,
  },
  taskInfo: {
    type: String,
    required: true,
  },
  coin: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  }
  });

// Create the model
const UserTask = mongoose.model("UserTasks", taskSchema);

// Export the model
module.exports = UserTask;

