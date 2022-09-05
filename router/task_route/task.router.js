const express = require("express");
const router = express.Router();

const task = require("../../controller/task_controller/task.controller");
const auth = require("../../middleware/auth_middleware/auth.middleware")

router.post("/", auth(), task.createTask);
router.get("/", auth(), task.task);
router.patch("/", auth(), task.updateTask)

module.exports = router;
