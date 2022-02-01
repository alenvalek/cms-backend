const express = require("express");
const Hotel = require("../../models/Hotel.js");
const User = require("../../models/User");

const hotelRouter = express.Router();

hotelRouter.get("/", async (req, res) => {
	const allHotels = await Hotel.find({});

	res.send(allHotels);
});

hotelRouter.get("/:hotel_id", async (req, res) => {
	const { hotel_id } = req.params;

	try {
		// provjera zadovoljava li ID pravila za ObjectId
		if (!hotel_id.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ msg: "Invalid hotel ID" });
		}

		// provjeri postoji li hotel s tim ID-em
		const hotel = await Hotel.findOne({ _id: hotel_id });

		// ako ne postoji vrati error
		if (!hotel) {
			return res.status(400).json({ msg: "Hotel doesn't exist" });
		}

		res.send(hotel);
	} catch (err) {
		console.log(err);
		res.status(500).send("Server Error");
	}
});

hotelRouter.put("/set_owner/:object_id/:user_id", async (req, res) => {
	const { user_id, object_id } = req.params;

	// provjera zadovoljavaju li ID-evi pravila za ObjectId
	if (!user_id.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(400).json({ msg: "Invalid user ID" });
	}

	if (!object_id.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(400).json({ msg: "Invalid object ID" });
	}

	try {
		const user = await User.findOne({ _id: user_id });
		const object = await Hotel.findOne({ _id: object_id });

		// provjeri postoji li objekt
		if (!object) {
			return res.status(400).json({ msg: "Hotel doesn't exist" });
		}

		// provjeri postoji li korisnik
		if (!user) {
			return res.status(400).json({ msg: "User doesn't exist" });
		}
		// ako je provjera prošla update-aj vlasnika objekta
		object.owner = user_id;
		await object.save();

		// vrati update-an objekt
		res.send(object);
	} catch (err) {
		console.log(err);
		res.status(500).send("Server Error");
	}
});

hotelRouter.post("/", async (req, res) => {
	const { name } = req.body;
	try {
		const object = new Hotel({ name });
		const newObject = await object.save();

		res.send(newObject);
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ error: "Server Error." });
	}
});

module.exports = hotelRouter;
