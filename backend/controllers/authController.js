const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt =require('jsonwebtoken') 

// @desc    Sign up end point
// @route   Post /signup
// @access  Public
exports.signUp = asyncHandler(async (req, res) => {
	const { name, email, password, photo } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
		photo
	});

	if (user) {
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: '30d'
		})
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			photo: user.photo,
			followers: user.followers,
			following: user.following,
			token
		});
	} else {
		res.status(400);
		throw new Error("Invalid User data");
	}
});

// @desc    Sign in end point
// @route   Post /signin
// @access  Public
exports.signIn = asyncHandler(async(req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: '30d'
		})
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			photo: user.photo,
			followers: user.followers,
			following: user.following,
			token
		});


	} else {
		res.status(401)
		throw new Error("Invalid email or password");
	}
})





