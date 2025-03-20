const express = require("express");
const UserDashboard = require("../models/dashboard");
const UserTask = require("../models/task.model");
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
    let mlcoin = 0;
    let referralBonus = 15000;
    let referredByUser = null;

    if (referredBy) {
      referredByUser = await UserDashboard.findOneAndUpdate(
        { userId: referredBy },
        { $inc: { mlcoin: 10000, referrals: 1 } },
        { new: true }
      );
      if (referredByUser) mlcoin += referralBonus;
    }

    // Atomically find the user or create a new one
    const updatedUser = await UserDashboard.findOneAndUpdate(
      { userId }, // Find by userId
      {
        $setOnInsert: { firstName, mlcoin, referralCode, referredBy: referredByUser ? referredByUser.userId : null, referrals },
      },
      { upsert: true, new: true } // Create only if not exists
    );

    res.status(200).json({
      message: "User exists or created successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(`A: Error saving info: ${err.message}`);
    res.status(500).json({ message: "Error saving info", error: err.message });
  }

});

const A = (date) => {
  const lastUpdated = new Date(date);
  const currentTime = new Date();
  const timeSinceLastUpdate = (currentTime - lastUpdated) / (1000 * 60);
  return timeSinceLastUpdate >= 1;
};

DashboardRoute.patch("/dashboard", async (req, res) => {
  const { userId } = req.body;
  let user;
  let mlcperhour = 1000;
  try {
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
          $inc: { mlcoin: mlcperhour },
          lastClaimed: new Date(),
        },
        { new: true }
      );
    
      

    if (!user) {
      return res.status(404).json({ message: "userId not found" });
    }
    res.json({ message: "mlcoin updated successfully", user, lastClaimed: user.lastClaimed });
  } catch (err) {
    console.log(`This an update error ${err}`);
    res
      .status(500)
      .json({ message: "Error updating mlcoin", error: err.message });
  }
});

DashboardRoute.get("/tasks", async (req, res) => {
  const tasks = await UserTask.find();

  return res.status(200).json({ data: tasks });
  
});

DashboardRoute.patch("/tasks", async (req, res) => {
  const { userId, taskId } = req.body;

  console.log(" task route console logging", req.body)

  try {

  
  
  const task = await UserTask.findOne({_id: taskId });

      if (!task) {
        return res.status(400).json({ message: "Invalid task ID provided" });
      }

      const userTaskCheck = await UserDashboard.findOne({userId, taskIds: taskId});

      if (userTaskCheck) {
        console.log("Task already completed")
        return res.status(400).json({message: "Task already completed"})
      } else {  
        const userInTask =  await UserDashboard.findOneAndUpdate(
                { userId },
                {
                  $inc: { mlcoin: task.coin },
                  $addToSet: { taskIds: taskId },
                },
                { new: true }
              );
res.json({message: "patch of task done", userInTask })
      }
    } catch (error) {
      console.log("task couln't update mlcoin")
    }   
    
})




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
      {ton: 500000000, mlcoin: 100000}, //0.5
      {ton: 400000000, mlcoin: 90000}, //0.4
      {ton: 300000000, mlcoin: 80000}, //0.3
      {ton: 200000000, mlcoin: 70000}, //0.2
      {ton: 100000000, mlcoin: 60000}, //0.1
      {ton: 90000000, mlcoin: 50000}, // 0.09
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
} else {
  console.log("couldn't update mlcoin")
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
