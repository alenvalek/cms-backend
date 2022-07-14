const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema({
	naziv: {
		type: String,
		required: true,
	},
	povrsina: {
		type: Number,
		required: true,
	},
	tip: {
		type: String,
		required: true,
		default: "delux",
	},
	dimenzije: {
		type: String,
		required: true,
	},
	opis: {
		type: String,
	},
	camp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "camp",
		required: true,
	},
	hotel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "hotel",
		required: true,
	},
	contact: {
		type: String,
		required: false,
	},
	workHours: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: false,
	},
	address: {
		type: String,
		required: false,
	},
	content: {
		type: [String],
		required: false,
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

const Object = mongoose.model("object", objectSchema);

module.exports = Object;
