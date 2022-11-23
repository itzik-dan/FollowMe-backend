const express = require("express");
const router = express.Router();
// require login middleware
const { protect } = require("../middleware/authMiddleware");
// controllers
const {
	getUserProfile,
	followUser,
	unfollowUser,
	updateProfilePic,
	getUsers
} = require("../controllers/userController");

router.get("/user/:id", protect, getUserProfile);

router.get("/users", protect, getUsers);

router.put("/follow", protect, followUser);

router.put("/unfollow", protect, unfollowUser);

router.put("/update-profile-pic", protect, updateProfilePic);

module.exports = router;
