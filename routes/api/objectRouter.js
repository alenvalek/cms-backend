const express = require("express");
const Object = require("../../models/Object.js");
const auth = require("../../middleware/auth");

const objectRouter = express.Router();

objectRouter.post("/", [auth], async (req, res) => {
	const {
		naziv,
		povrsina,
		tip,
		dimenzije,
		opis,
		camp,
		hotel,
		contact,
		workHours,
		email,
		address,
	} = req.body;

	let newObject = {};

	newObject.naziv = naziv;
	newObject.povrsina = povrsina;
	newObject.tip = tip;
	newObject.dimenzije = dimenzije;
	newObject.opis = opis ? opis : "";
	newObject.camp = camp;
	newObject.hotel = hotel;
	if (contact) newObject.contact = contact;
	if (workHours) newObject.workHours = workHours;
	if (email) newObject.email = email;
	if (address) newObject.address = address;

	try {
		const newObj = new Object(newObject);
		await newObj.save();
		res.send(newObj);
	} catch (error) {
		console.log(error);
	}
});

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
	const { name, povrsina, tip, dimenzije, opis, content, filterContent } =
		req.body;

	try {
		let objExists = await Object.findOne({ _id: id });
		if (!objExists) {
			res.status(400).json({ msg: "Object does not exist." });
		}
		if (name) objExists.naziv = name;
		if (povrsina) objExists.povrsina = povrsina;
		if (tip) objExists.tip = tip;
		if (dimenzije) objExists.dimenzije = dimenzije;
		if (opis) objExists.opis = opis;
		if (content)
			objExists.content = content
				.toString()
				.split(",")
				.map((act) => act.trim());
		if (filterContent) {
			objExists.content = objExists.content.filter(
				(cont) => cont !== filterContent
			);
		}
		await objExists.save();
		res.send(objExists);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

module.exports = objectRouter;
