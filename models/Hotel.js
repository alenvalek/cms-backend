const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
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
});

const Hotel = mongoose.model("hotel", hotelSchema);
module.exports = Hotel;
