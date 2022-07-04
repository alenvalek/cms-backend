const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
	},
	permissions: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "user",
				required: true,
			},
			read: { type: Boolean, default: true, required: true },
			write: { type: Boolean, default: false, required: true },
			update: { type: Boolean, default: false, required: true },
			delete: { type: Boolean, default: false, required: true },
			role: {
				type: String,
				enum: ["superadmin", "admin", "operater", "vlasnik", "user"],
				default: "user",
			},
		},
	],
});

const Hotel = mongoose.model("hotel", hotelSchema);
module.exports = Hotel;
