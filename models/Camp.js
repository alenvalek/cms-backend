const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	hotel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "hotel",
		required: true,
	},
	objects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "object",
		},
	],
});

const Camp = mongoose.model("camp", campSchema);
module.exports = Camp;
