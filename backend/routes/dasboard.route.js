const express = require("express");
const { getTasks, patchTasks } = require("../controllers/task.controllers");
const { postDashboard, patchDashboard } = require("../controllers/dashboard.controllers");
const { startPolling } = require("../controllers/polling.controllers");
const DashboardRoute = express.Router();

DashboardRoute.post("/dashboard", postDashboard);
DashboardRoute.patch("/dashboard", patchDashboard);
DashboardRoute.get("/tasks", getTasks);
DashboardRoute.patch("/tasks", patchTasks)
DashboardRoute.post("/start-polling", startPolling);






module.exports = DashboardRoute;
