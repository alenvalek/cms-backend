const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
	},
});

const Hotel = mongoose.model("hotel", hotelSchema);
module.exports = Hotel;
