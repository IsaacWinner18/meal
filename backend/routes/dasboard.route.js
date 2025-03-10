const express = require("express");
const UserDashboard = require("../models/dashboard");
const UserVideo = require("../models/video.model");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const DashboardRoute = express.Router();


DashboardRoute.post("/dashboard", async (req, res) => {
  const { firstName, userId, mlcoin, referralCode, referredBy, referrals } =
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
          referrals: existingUser.referrals,
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
      { $inc: { mlcoin: referralBonus, referrals: 1 } },  
      { new: true },  // Returns the updated document
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
      referrals
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


const userAddress = "0QDMoTcRiP_ciARdO2CFDvAlZ_-V70wyVl4w2na66b_oHjzV";
let lastProcessedTxLT = 0;
let pollingInterval = null;

// Function to fetch and process transactions
async function checkUserPayments() {
    let fetchMore = true;
    let offsetLT = null;

    while (fetchMore) {
        try {
            let url = `https://testnet.toncenter.com/api/v2/getTransactions?address=${userAddress}&limit=10`;
            if (offsetLT) {
                url += `&lt=${offsetLT}`;
            }

            const response = await fetch(url);
            const { result: transactions } = await response.json();

            if (!transactions || transactions.length === 0) {
                break;
            }

            for (const tx of transactions) {
                const txLT = tx.transaction_id.lt;
                if (txLT <= lastProcessedTxLT) {
                    fetchMore = false;
                    break;
                }

                const userId = tx.in_msg?.message;
                const value = tx.in_msg?.value; 

                if (userId) {
                    console.log(`✅ Payment detected from user ${userId}:`);

                    // ✅ Update user balance in database
                    await updateUserBalance(userId, value, tx);

                    // Update last processed transaction LT
                    lastProcessedTxLT = txLT;
                }
            }

            offsetLT = transactions[transactions.length - 1].transaction_id.lt;
        } catch (error) {
            console.error("Error fetching transactions:", error.message);
            break;
        }
    }
}

// Function to update user balance in your database
async function updateUserBalance(userId, value, transaction) {
    console.log(`Updating balance for user ${userId}...`);

    const rewardTiers = [
      {ton: 1000000000, mlcoin: 100000},
      {ton: 90000000, mlcoin: 90000},
      {ton: 80000000, mlcoin: 80000},
      {ton: 70000000, mlcoin: 70000},
      {ton: 60000000, mlcoin: 60000},
      {ton: 50000000, mlcoin: 50000},
      {ton: 40000000, mlcoin: 40000},
      {ton: 30000000, mlcoin: 30000},
      {ton: 20000000, mlcoin: 20000},
      {ton: 10000000, mlcoin: 10000}, 
    ];

let mlcoinbought = 0;
for (let tier of rewardTiers) {
  if (value >= tier.ton) {
    mlcoinbought = tier.mlcoin;
    break;
  }

}


if (mlcoinbought > 0) {
  await UserDashboard.findOneAndUpdate(
    { userId },
    {
      $inc: { mlcoin: mlcoinbought }
    },
    { new: true }
  );
console.log(`User ${userId} balance updated successfully. Added ${mlcoinbought} mlcoin.`);
}

}

// Route for frontend to trigger polling
DashboardRoute.post("/start-polling", (req, res) => {
    if (!pollingInterval) {
        pollingInterval = setInterval(checkUserPayments, 3000);
        console.log("🚀 Started polling for transactions...");
        res.json({ success: true, message: "Polling started." });
    } else {
        res.json({ success: false, message: "Polling is already running." });
    }
});






module.exports = DashboardRoute;
