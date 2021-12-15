const express = require("express");
const Hotel = require("../../models/Hotel.js");

const hotelRouter = express.Router();

hotelRouter.get("/", async (req, res) => {
	const allHotels = await Hotel.find({});

	res.send(allHotels);
});

hotelRouter.post("/", async (req, res) => {
	const { name } = req.body;
	try {
		const hotel = new Hotel({ name });
		const newHotel = await hotel.save();

		res.send(newHotel);
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ error: "Server Error." });
	}
});

module.exports = hotelRouter;
