const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	organization: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "hotel",
		required: true,
	},
	isSuperAdmin: {
		type: Boolean,
		default: false,
		required: true,
	},
	role: {
		type: String,
		enum: ["admin", "operater", "user"],
		default: "user",
	},
});

const User = mongoose.model("user", userSchema);
module.exports = User;
