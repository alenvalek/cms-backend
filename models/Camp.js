const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
	},
	hotel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "hotel",
		required: true,
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

const Camp = mongoose.model("camp", campSchema);
module.exports = Camp;
