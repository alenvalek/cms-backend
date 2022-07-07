const Camp = require("../../models/Camp");
const Object = require("../../models/Object");
const express = require("express");
const User = require("../../models/User");
const campRouter = express.Router();
const auth = require("../../middleware/auth");

campRouter.get("/", [auth], async (req, res) => {
	const allCamps = await Camp.find({});

	res.send(allCamps);
});

campRouter.get("/:camp_id", [auth], async (req, res) => {
	const { camp_id } = req.params;

	try {
		// provjera zadovoljava li ID pravila za ObjectId
		if (!camp_id.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ msg: "Invalid camp ID" });
		}

		// provjeri postoji li kamp s tim ID-em
		const camp = await Camp.findOne({ _id: camp_id });

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

campRouter.put("/set_owner/:object_id/:user_id", [auth], async (req, res) => {
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

campRouter.post("/", [auth], async (req, res) => {
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

campRouter.delete("/:id", [auth], async (req, res) => {
	const { id } = req.params;

	try {
		await Camp.deleteOne({ _id: id });
		await Object.deleteMany({ camp: id });
		res.status(200).json({ msg: "Deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

campRouter.patch("/:id", [auth], async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	try {
		let campExists = await Camp.findOne({ _id: id });

		if (!campExists) {
			res.status(400).json({ msg: "Camp does not exist." });
		}

		campExists.name = name;
		await campExists.save();
		res.send(campExists);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

module.exports = campRouter;
