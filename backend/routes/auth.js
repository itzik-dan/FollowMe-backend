const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
// controllers
const { signUp, signIn } = require("../controllers/authController");

router.post("/signup", signUp);

router.post("/signin", signIn);

module.exports = router;
