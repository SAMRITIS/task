const express = require("express");
const router = express.Router();

const authRoute = require("./auth_route/auth.router");
const projectRoute = require("./project_route/project.router")
const taskRoute = require("./task_route/task.router")

router.use("/auth", authRoute);
router.use("/project", projectRoute)
router.use("/task", taskRoute)



module.exports = router;
