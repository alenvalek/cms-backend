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
});

const Camp = mongoose.model("camp", campSchema);
module.exports = Camp;
