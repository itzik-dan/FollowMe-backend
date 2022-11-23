const express = require("express");
const router = express.Router();
// require login middleware
const { protect } = require("../middleware/authMiddleware");
// controllers
const {
	createPost,
	fetchPosts,
	fetchUserPosts,
	likePost,
	unlikePost,
	commentPost,
	deletePost,
	fetchFollowingPosts
} = require("../controllers/postController");

router.post("/createpost", protect, createPost);

router.get("/allpost", fetchPosts);

router.get("/followingPosts", protect, fetchFollowingPosts);

router.get("/mypost", protect, fetchUserPosts);

router.put("/like", protect, likePost);

router.put("/unlike", protect, unlikePost);

router.put("/comment", protect, commentPost);

router.delete("/deletepost/:postId", protect, deletePost);

module.exports = router;
