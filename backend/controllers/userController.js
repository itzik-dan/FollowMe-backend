const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");

// @desc    Get user profile and user posts
// @route   GET /user/:id
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password')

	if (user) {
		const userPosts = await Post.find({postedBy: req.params.id}).populate("postedBy", "name")
		res.json({user, userPosts});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
})

// @desc    Follow a user end point
// @route   PUT /follow
// @access  Private
exports.followUser = asyncHandler(async (req, res) => {
	// Fetching the person that logged in person tries to follow and update his followers count
	const followedUser = await User.findByIdAndUpdate(
		req.body.followedUserId,
		{
			$push: { followers: req.user._id },
		},
		{ new: true }
	).select("-password");

	// Fetching the logged in user who tries to follow and update his following count
	const followingUser = await User.findByIdAndUpdate(
		req.user._id,
		{
			$push: { following: req.body.followedUserId },
		},
		{ new: true }
	).select("-password");;

	res.json({followedUser, followingUser});
})

// @desc    Unfollow a user end point
// @route   PUT /unfollow
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res) => {
	// Fetching the person that logged in user tries to follow and update his followers count
	const followedUser = await User.findByIdAndUpdate(
		req.body.unfollowedUserId,
		{
			$pull: { followers: req.user._id },
		},
		{ new: true }
	).select("-password");

	// Fetching the logged in user who tries to follow and update his following count
	const followingUser = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { following: req.body.unfollowedUserId },
		},
		{ new: true }
	).select("-password");
	res.json({followedUser, followingUser});
})

// @desc    Change profile pic and save to db
// @route   PUT /update-profile-pic
// @access  Private
exports.updateProfilePic = asyncHandler(async (req, res) => {
	// Fetching the person that logged in person tries to follow and update his followers count
	const updatedUser = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: { photo: req.body.photo },
		},
		{ new: true }
	).select("-password");

	res.json(updatedUser)
})

// @desc    Get all users
// @route   GET /users
// @access  Private
exports.getUsers = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword ? {
		name: {
			$regex: req.query.keyword,
			$options: 'i'
		}
	} : {}

	const users = await User.find({...keyword});
	res.json(users);
});
