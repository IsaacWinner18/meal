const express = require("express");
const UserDashboard = require("../models/dashboard");
const UserVideo = require("../models/video.model");
// const crypto = require("crypto"); 
const DashboardRoute = express.Router();

// not generating random code no more 




DashboardRoute.post("/dashboard", async (req, res) => {
  const { firstName, lastName, usernamedb, mlcoin, referralCode, referredBy } = req.body;
  // console.log(req.body);

  try {
    const existingUser = await UserDashboard.findOne({ usernamedb });
    if (existingUser) {
      return res.status(200).json({
        message: "User exists",
        user: {
          usernamedb: existingUser.usernamedb,
          mlcoin: existingUser.mlcoin,
          videoIds: existingUser.videoIds,
          referralCode: existingUser.videoIds
        },
      });
    }

    const userDashboard = new UserDashboard({
      firstName,
      lastName,
      usernamedb,
      mlcoin,
      referralCode,
      videoIds: []
    });
    const savedUser = await userDashboard.save();

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
  const { usernamedb, videoId } = req.body;
  console.log(req.body)
  // console.log("This is the videoId that needs to be stored at backend", videoId)

  let user;
  try {
    if (!videoId) {
      const usertime = await UserDashboard.findOne({ usernamedb });

      if (!usertime) {
        return res.status(404).json({ message: "User not found" });
        console.log("User not found")
      }
    

      if (!A(usertime.lastClaimed)) {
        return res.status(404).json({ message: "time left" });
      }

      user = await UserDashboard.findOneAndUpdate(
        { usernamedb },
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
        { usernamedb },
        {
          $inc: { mlcoin: video.coin },
          $addToSet: {videoIds: videoId}
        },
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).json({ message: "usernamedb not found" });
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
