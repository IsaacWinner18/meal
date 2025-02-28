const express = require("express");
const UserDashboard = require("../models/dashboard");
const UserVideo = require("../models/video.model");
const DashboardRoute = express.Router();


DashboardRoute.post("/dashboard", async (req, res) => {
  const { firstName, userId, mlcoin, referralCode, referredBy, referrrals } =
    req.body;
  console.log(req.body);

  if (firstName.length === 0 || userId.length === 0) {
    return res
      .status(500)
      .json({ message: "Invalid info provided", error: error.message });
  }

  try {
    const existingUser = await UserDashboard.findOne({ userId });
    // console.log(existingUser ? "user exists" : "nope");
    // console.log(existingUser);

    if (existingUser) {
      return res.status(200).json({
        message: "User exists",
        user: {
          userId: existingUser.userId,
          mlcoin: existingUser.mlcoin,
          videoIds: existingUser.videoIds,
          // referralCode: existingUser.videoIds,
        },
      });
    }

    let validatedRefUser = validatedRefUser !== null ? validatedRefUser : null; // Initialize to null

if (referredBy && !isNaN(Number(referredBy))) {
  const referedUser = await UserDashboard.findOne({ userId: Number(referredBy) });

  if (referedUser) validatedRefUser = Number(referredBy); // Convert to Number
}

    const userDashboard = new UserDashboard({
      firstName,
      userId,
      mlcoin,
      referredBy: validatedRefUser,

    });
    console.log("UserDashboard", userDashboard);
    const savedUser = await userDashboard.save();
console.log("savedUser", savedUser);
    res.status(201).json({
      message: "Info saved successfully",
      user: savedUser,
    });
  } catch (err) {
    console.error(`A: Error saving info: ${err.message}`);
    res.status(500).json({ message: "Error saving info", error: err.message });
  }
});

const A = (date) => {
  const lastUpdated = new Date(date);
  const currentTime = new Date();

  // Check if 24 hours have passed
  const hoursSinceLastUpdate = (currentTime - lastUpdated) / (1000 * 60);

  return hoursSinceLastUpdate >= 1;
};

DashboardRoute.patch("/dashboard", async (req, res) => {
  const { userId, videoId } = req.body;
  console.log(req.body);
  // console.log("This is the videoId that needs to be stored at backend", videoId)

  let user;
  try {
    if (!videoId) {
      const usertime = await UserDashboard.findOne({ userId });

      if (!usertime) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      if (!A(usertime.lastClaimed)) {
        return res.status(404).json({ message: "time left" });
      }

      user = await UserDashboard.findOneAndUpdate(
        { userId },
        {
          $inc: { mlcoin: 1000 },
          lastClaimed: new Date(),
        },
        { new: true }
      );
    } else {
      const video = await UserVideo.findOne({ _id: videoId });
      // console.log(video)

      if (!video) {
        return res.status(400).json({ message: "Invalid video ID provided" });
      }

      user = await UserDashboard.findOneAndUpdate(
        { userId },
        {
          $inc: { mlcoin: video.coin },
          $addToSet: { videoIds: videoId },
        },
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).json({ message: "userId not found" });
    }
    res.json({ message: "mlcoin updated successfully", user });
  } catch (err) {
    console.log(`This an update error ${err}`);
    res
      .status(500)
      .json({ message: "Error updating mlcoin", error: err.message });
  }
});

DashboardRoute.get("/videos", async (req, res) => {
  const videos = await UserVideo.find();

  return res.status(200).json({ data: videos });
  
});

module.exports = DashboardRoute;
