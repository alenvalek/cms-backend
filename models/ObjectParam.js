const mongoose = require("mongoose");

const objectParamSchema = new mongoose.Schema({
	object: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "object",
		required: true,
	},

	properties: {
		class: {
			type: String,
		},
		number: {
			type: String,
		},
		brand: {
			type: String,
		},
		id: {
			type: String,
		},
	},
	geometry: {
		type: {
			type: String,
			enum: ["MultiPolygon"],
			required: true,
		},
		coordinates: {
			type: [[[[Number]]]],
		},
	},
});

const ObjectParam = mongoose.model("objectParam", objectParamSchema);

module.exports = ObjectParam;
