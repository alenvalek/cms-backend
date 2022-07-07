const express = require("express");
const Hotel = require("../../models/Hotel.js");
const Camp = require("../../models/Camp.js");
const Object = require("../../models/Object.js");
const User = require("../../models/User");
const auth = require("../../middleware/auth");

const hotelRouter = express.Router();

hotelRouter.get("/", [auth], async (req, res) => {
	const allHotels = await Hotel.find({});

	res.send(allHotels);
});

hotelRouter.delete("/:id", [auth], async (req, res) => {
	const { id } = req.params;

	try {
		await Hotel.deleteOne({ _id: id });
		await Camp.deleteMany({ hotel: id });
		await Object.deleteMany({ hotel: id });
		res.status(200).json({ msg: "Deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

hotelRouter.patch("/:id", [auth], async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	try {
		let hotelExists = await Hotel.findOne({ _id: id });

		if (!hotelExists) {
			res.status(400).json({ msg: "Hotel does not exist." });
		}

		hotelExists.name = name;
		await hotelExists.save();
		res.send(hotelExists);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

hotelRouter.get("/:hotel_id", [auth], async (req, res) => {
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

hotelRouter.put("/set_owner/:object_id/:user_id", [auth], async (req, res) => {
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

hotelRouter.post("/", [auth], async (req, res) => {
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
