const express = require("express");
const Object = require("../../models/Object.js");
const User = require("../../models/User");

const objectRouter = express.Router();

objectRouter.get("/", async (req, res) => {
	const newObject = new Object({
		naziv: "Test objekt",
		povrsina: 30,
		tip: "deluxe",
		dimenzije: "3*10*3",
		opis: "",
		camp: "61ef5f759c1122f180a51285",
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

module.exports = objectRouter;
