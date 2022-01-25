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
	organization: { type: mongoose.Schema.Types.ObjectId, ref: "hotel" },
	accessModel: { type: "String", enum: ["hotel, camp"], required: true },
	access: { type: mongoose.Schema.Types.ObjectId, refPath: "accessModel" },
	permissions: {
		read: { type: Boolean, default: false, required: true },
		write: { type: Boolean, default: false, required: true },
		delete: { type: Boolean, default: false, required: true },
		role: {
			type: String,
			enum: ["superadmin", "admin", "operater", "vlasnik", "user"],
			default: "user",
		},
	},
	isSuperAdmin: {
		type: Boolean,
		default: false,
		required: true,
	},
});

const User = mongoose.model("user", userSchema);
module.exports = User;
