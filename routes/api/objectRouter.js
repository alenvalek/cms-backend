const express = require("express");
const { SchemaTypeOptions } = require("mongoose");
const Object = require("../../models/Object.js");
const auth = require("../../middleware/auth");

const objectRouter = express.Router();

objectRouter.get("/", [auth], async (req, res) => {
	const newObject = new Object({
		naziv: "Majina kuČa",
		povrsina: 30,
		tip: "deluxe",
		dimenzije: "3*10*3",
		opis: "",
		camp: "61ef5f759c1122f180a51285",
		hotel: "61ef50b4ae8230bed0093b6a",
		permissions: [
			{
				user: "61ef5b68d4bd24dcc35a73a6",
				role: "superadmin",
				read: true,
				write: true,
				update: true,
				delete: true,
			},
		],
	});

	await newObject.save();
	res.send(newObject);
});

/*
naziv: "Majina kuČa",
		povrsina: 30,
		tip: "deluxe",
		dimenzije: "3*10*3",
		opis: "",
*/

objectRouter.delete("/:id", [auth], async (req, res) => {
	const { id } = req.params;

	try {
		await Object.deleteOne({ _id: id });
		res.status(200).json({ msg: "Deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

objectRouter.patch("/:id", [auth], async (req, res) => {
	const { id } = req.params;
	const { name, povrsina, tip, dimenzije, opis } = req.body;

	try {
		let objExists = await Object.findOne({ _id: id });
		if (!objExists) {
			res.status(400).json({ msg: "Object does not exist." });
		}
		if (name) objExists.naziv = name;
		if (povrsina) objExists.povrsina = povrsina;
		if (tip) objExists.tip = SchemaTypeOptions;
		if (dimenzije) objExists.dimenzije = dimenzije;
		if (opis) objExists.opis = opis;

		await objExists.save();
		res.send(objExists);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

module.exports = objectRouter;
