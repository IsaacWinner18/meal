// const UserDashboard = require("../models/dashboard");
const UserTask = require("../models/task.model");
const UserDashboard = require("../models/dashboard")

 const getTasks =  async (req, res) => {
    const tasks = await UserTask.find();
  
    return res.status(200).json({ data: tasks });
    
  };

   const patchTasks = async (req, res) => {
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
      
  };

  module.exports = { getTasks, patchTasks };