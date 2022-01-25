const Camp = require("../../models/Camp");
const express = require("express");
const User = require("../../models/User");
const campRouter = express.Router();

campRouter.get("/", async (req, res) => {
	const allCamps = await Camp.find({});

	res.send(allCamps);
});

campRouter.get("/:camp_id", async (req, res) => {
	const { camp_id } = req.params;

	try {
		// provjera zadovoljava li ID pravila za ObjectId
		if (!camp_id.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ msg: "Invalid camp ID" });
		}

		// provjeri postoji li kamp s tim ID-em
		const camp = await Camp.find({ _id: camp_id });

		// ako ne postoji vrati error
		if (!camp) {
			return res.status(400).json({ msg: "Camp doesn't exist" });
		}

		res.send(camp);
	} catch (err) {
		console.log(err);
		res.status(500).send("Server Error");
	}
});

campRouter.put("/set_owner/:object_id/:user_id", async (req, res) => {
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
		const object = await Camp.findOne({ _id: object_id });

		// provjeri postoji li objekt
		if (!object) {
			return res.status(400).json({ msg: "Camp doesn't exist" });
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

campRouter.post("/", async (req, res) => {
	const { name, hotel } = req.body;
	try {
		const object = new Camp({ name, hotel });
		const newObject = await object.save();

		res.send(newObject);
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ error: "Server Error." });
	}
});

module.exports = campRouter;
