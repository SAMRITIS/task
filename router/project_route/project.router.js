const express = require("express");
const router = express.Router();

const project = require("../../controller/project_controller/project.controller");
const auth = require("../../middleware/auth_middleware/auth.middleware")

router.post("/", auth(), project.createProject);
router.get("/", auth(), project.project);
router.patch("/", auth(), project.updateProject)

module.exports = router;
