const express = require("express");
const User = require("../../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");

const dotenv = require("dotenv");

dotenv.config();

const authRouter = express.Router();

// @route GET api/auth
// @desc Fetch authenticated user
// @access Protected

authRouter.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.select("-password")
			.populate("access");
		console.log(user);
		res.json({ user });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: "Server Error" });
	}
});

// @route POST api/auth
// @desc Authenticate user and get the token
// @access Public

authRouter.post("/", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res
			.status(400)
			.json({ error: "Please fill out all the necessary fields" });

	try {
		let user = await User.findOne({ email });

		if (!user) return res.status(400).json({ error: "Invalid credentials" });

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			process.env.SECRET,
			{ expiresIn: "24h" }, // promjeniti u produkciji
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: "Server Error" });
	}
});

module.exports = authRouter;
