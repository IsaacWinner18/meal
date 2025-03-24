const UserDashboard = require("../models/dashboard");

const A = (date) => {
    const lastUpdated = new Date(date);
    const currentTime = new Date();
    const timeSinceLastUpdate = (currentTime - lastUpdated) / (1000 * 60);
    return timeSinceLastUpdate >= 1;
  };

 const postDashboard = async (req, res) => {
  const { firstName, userId, referralCode, referredBy} =
    req.body;
  // console.log(req.body);

  if (firstName.length === 0 || userId.length === 0) {
    return res
      .status(500)
      .json({ message: "Invalid info provided" });
  }
  
  try {
      console.log(userId)

      const existingUser = await UserDashboard.findOne({userId})
      if (existingUser) {
        console.log(1)
        return res.status(200).json({message: "User already exists", user: existingUser})
      } else {
        let mlcoin = 0;
        let referralBonus = 15000;
        let referrer = null;
        
        if (referredBy) {
          referrer = await UserDashboard.findOneAndUpdate(
            { userId: referredBy },
            { $inc: { mlcoin: 10000, referrals: 1 } },
            { new: true }
          );
          if (referrer) {
            mlcoin += referralBonus; 
            console.log(`User ${referredBy} referred ${userId}`);
          }
        }
        console.log(2)
          
        const user = new UserDashboard({
          firstName,
          mlcoin,
          userId,
          referralCode,
          referredBy,
        });
    
        await user.save();
        
        res.status(200).json({
          message: "User exists or created successfully",
          user
        });
      }
  } catch (err) {
    console.error(`A: Error saving info: ${err.message}`);
    res.status(500).json({ message: "Error saving info", error: err.message });
  }

 }

  const patchDashboard = async (req, res) => {
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
};

module.exports = { postDashboard, patchDashboard };