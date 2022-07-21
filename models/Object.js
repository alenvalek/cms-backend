const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema({
	naziv: {
		type: String,
	},
	povrsina: {
		type: Number,
	},
	tip: {
		type: String,
	},
	dimenzije: {
		type: String,
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
	customID: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
});

const Object = mongoose.model("object", objectSchema);

module.exports = Object;
