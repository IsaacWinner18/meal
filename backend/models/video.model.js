const mongoose = require("mongoose");

// Define the schema
const videoSchema = new mongoose.Schema({
  videoId: {
    type: Number,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  coin: {
    type: Number,
    default: 0,
  }
  });

// Create the model
const UserVideo = mongoose.model("UserVideos", videoSchema);

// Export the model
module.exports = UserVideo;
