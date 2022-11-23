const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");

// @desc    Create a post
// @route   Post /createpost
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
	const { title, body, photo } = req.body;

	if (!title || !body || !photo) {
		res.status(422);
		throw new Error("Please add all the fields, photo has to be of type jpeg or png");
	}

	const post = new Post({
		title,
		body,
		photo,
		postedBy: req.user._id,
	});

	const createdPost = await post.save();
	res.status(201).json(createdPost);
});

// @desc    Get all posts
// @route   GET /allpost
// @access  Public
exports.fetchPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find({})
		.populate("postedBy", "name")
		.populate("comments.postedBy", "name")
		.sort("-createdAt");
	res.json(posts);
});

// @desc    Get all posts of people whom I follow
// @route   GET /followingPosts
// @access  Public
exports.fetchFollowingPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find({postedBy: {$in: req.user.following}})
		.populate("postedBy", "name")
		.populate("comments.postedBy", "name")
		.sort("-createdAt");
	res.json(posts);
});


// @desc    Get logged in posts
// @route   GET /api/orders/myorders
// @access  Private
exports.fetchUserPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find({ postedBy: req.user._id });
	res.json(posts);
});

// @desc    like a post
// @route   PUT /like
// @access  Private
exports.likePost = asyncHandler(async (req, res) => {
	const updatedPost = await Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { likes: req.user._id },
		},
		{ new: true }
	);
	res.json(updatedPost);
});

// @desc    unlike a post
// @route   PUT /unlike
// @access  Private
exports.unlikePost = asyncHandler(async (req, res) => {
	const updatedPost = await Post.findByIdAndUpdate(
		req.body.postId,
		{
			$pull: { likes: req.user._id },
		},
		{ new: true }
	);
	res.json(updatedPost);
});

// @desc    comment a post
// @route   PUT /comment
// @access  Private
exports.commentPost = asyncHandler(async (req, res) => {
	const newComment = {
		text: req.body.text,
		postedBy: req.user._id,
	};
	const updatedPost = await Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { comments: newComment },
		},
		{ new: true }
	)
		.populate("comments.postedBy", "_id name")
		.populate("postedBy", "_id name");
	res.json(updatedPost);
});

// @desc    Delete a post
// @route   DELETE /deletepost/:postId
// @access  Private/Admin
exports.deletePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.postId);
	console.log(post.postedBy)
	console.log('req user', req.user._id)

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}
	// Check user
	if (post.postedBy.toString() !== req.user._id.toString()) {
		res.status(401);
		throw new Error("User not authorized")
	}

	await post.remove();
	res.json({ message: "Post removed" });
})
