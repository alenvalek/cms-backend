const express = require("express");
const User = require("../../models/User.js");

const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth.js");

const userRouter = express.Router();

// get all org-users
userRouter.get("/:hotel_id", [auth], async (req, res) => {
	const { hotel_id } = req.params;
	const allUsers = await User.find({ organization: hotel_id });

	res.send(allUsers);
});

userRouter.delete("/:user_id", [auth], async (req, res) => {
	const { user_id } = req.params;
	try {
		await User.deleteOne({ _id: user_id });
	} catch (error) {
		console.log(error);
	}
});

module.exports = userRouter;
