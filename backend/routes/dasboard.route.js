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
      .json({ message: "Invalid info provided" });
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
        },
      });
    }
      
    let referrer = null;
    let referralBonus = 50;
    let mlcoin = 0;

if (referredBy) {
      referrer = await UserDashboard.findOne({ userId: referredBy });

      if (referrer) {
        console.log("Referrer found:", referrer.userId, "with mlcoin:", referrer.mlcoin);
            // Update referrer and store the result
    const updatedReferrer = await UserDashboard.findOneAndUpdate(
      { userId: referredBy },  
      { $inc: { mlcoin: referralBonus } },  
      { new: true }  // Returns the updated document
    );

    if (updatedReferrer) {
      console.log("Referrer mlcoin after update:", updatedReferrer.mlcoin);
    } else {
      console.log("Referrer update failed.");
    }
        mlcoin += referralBonus;
      } 
    
    }
    console.log("New user mlcoin:", mlcoin);
console.log("Referrer:", referrer ? referrer.userId : "No referrer");


    const userDashboard = new UserDashboard({
      firstName,
      userId,
      mlcoin,
      referralCode,
      referredBy: referrer ? referrer.userId : null,
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


// A Webhook to receive the payment from the user from tonapi 


DashboardRoute.post("/webhook/ton", async (req, res) => {

  try {
  
  const { transactionId, userId, comment } = req.body;
  console.log(req.body);

  if (!transactionId || !userId || !comment) {
    return res.status(400).json({message: "Invalid info provided"});
  }

  let payedUser = await UserDashboard.findOneAndUpdate(
    { userId }, 
    {$inc: { mlcoin: 50000}},
    {new: true}
  )
 if (!payedUser) {
   return res.status(404).json({message: "User not found"});
 }
 
  return res.status(200).json({message: "Payment received successfully", user: payedUser});
    
} catch (err) {
  console.log(`The webhook error is ${err}`)
}
});



module.exports = DashboardRoute;
