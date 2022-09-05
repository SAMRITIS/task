
const express = require("express");
const router = express.Router();

const auth = require("../../controller/auth_controller/auth.controller");
const authMiddleware = require("../../middleware/auth_middleware/auth.middleware")

router.post("/signup", auth.signUp);
router.post("/signin", auth.signIn);
router.post("/logout", authMiddleware(), auth.logOut);


module.exports = router;
