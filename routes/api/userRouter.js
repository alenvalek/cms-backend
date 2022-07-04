const express = require("express");
const User = require("../../models/User.js");

const bcrypt = require("bcryptjs");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
	const allUsers = await User.find({});

	res.send(allUsers);
});

userRouter.post("/", async (req, res) => {
	const { username, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) return res.status(400).json({ error: "Email already in use." });

		user = new User({
			username,
			email,
			password,
			organization: "61ef50b4ae8230bed0093b6a",
			permissions: [
				{
					accessModel: "hotel",
					access: "61ef50b4ae8230bed0093b6a",
					read: true,
					write: true,
					delete: true,
					role: "superadmin",
				},
			],
			isSuperAdmin: true,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		const newUser = await user.save();

		res.send(newUser);
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ error: "Server Error." });
	}
});

module.exports = userRouter;
