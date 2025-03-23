const UserDashboard = require("../models/dashboard");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));


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

 const startPolling = (req, res) => {
    if (!pollingInterval) {
        pollingInterval = setInterval(checkUserPayments, 3000);
        console.log("🚀 Started polling for transactions...");
        res.json({ success: true, message: "Polling started." });
    } else {
        res.json({ success: false, message: "Polling is already running." });
    }
};

module.exports = { startPolling };