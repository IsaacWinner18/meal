const express = require("express");
const UserDashboard = require("../models/dashboard");

const DashboardRoute = express.Router();

DashboardRoute.post("/dashboard", async (req, res) => {
  const { firstName, lastName, usernamedb, mlcoin } = req.body;

  try {
    const existingUser = await UserDashboard.findOne({ usernamedb });

    if (existingUser) {
      return res.status(200).json({
        message: "User exists",
        user: { usernamedb: existingUser.usernamedb, mlcoin: existingUser.mlcoin },
      });
    }

    const userDashboard = new UserDashboard({ firstName, lastName, usernamedb, mlcoin });
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


DashboardRoute.patch("/dashboard", async (req, res) => {
  
  const { usernamedb } = req.body;
  try {
    const user = await UserDashboard.findOneAndUpdate(
      { usernamedb },
      { $inc: { mlcoin: 1000 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "usernamedb not found" });
    }

    res.json({ message: "mlcoin updated successfully", user });
  } catch (err) {
    console.log(`This an update error ${err}`)
  }
});

module.exports = DashboardRoute;
