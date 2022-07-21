const express = require("express");
const Object = require("../../models/Object.js");
const User = require("../../models/User.js");
const ObjectParam = require("../../models/ObjectParam.js");
const auth = require("../../middleware/auth");

const objectRouter = express.Router();

objectRouter.get("/all/:obj_id", [auth], async (req, res) => {
	const { obj_id } = req.params;

	try {
		const objects = await Object.find({ _id: obj_id });

		res.status(200).json(objects);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

// get map data
objectRouter.get("/mapData", [auth], async (req, res) => {
	const mapData = await ObjectParam.find({});
	res.json(mapData);
});

// create user
objectRouter.post("/new_user", [auth], async (req, res) => {
	const { roleName, username, email, password } = req.body;
	try {
		const newUser = new User({
			username,
			email,
			password,
			organization: hotel_id,
			role: roleName,
		});
		await newUser.save();
		res.json(newUser);
	} catch (error) {
		console.log(error);
	}
});

objectRouter.patch("/set_owner/:object_id", async (req, res) => {
	const { userID } = req.body;
	const { object_id } = req.params;
	try {
		const object = await Object.findOne({ _id: object_id });

		object.owner = userID;
		await object.save();
	} catch (error) {
		console.log(error);
	}
});

// set user role
objectRouter.patch("/setUserRole", [auth], async (req, res) => {
	const { user_id, role } = req.body;
	try {
		const user = await User.findOne({ _id: user_id });
		user.role = role;
		await user.save();
		res.send(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

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

	const objectCount = await Object.countDocuments();

	newObject._id = objectCount + 1;
	newObject.camp = camp;
	newObject.hotel = hotel;
	if (naziv) newObject.naziv = naziv;
	if (povrsina) newObject.povrsina = povrsina;
	if (tip) newObject.tip = tip;
	if (dimenzije) newObject.dimenzije = dimenzije;
	if (opis) newObject.opis = opis ? opis : "";
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
		res.status(500).json({ msg: "Server Error!" });
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
	const { naziv, povrsina, tip, dimenzije, opis, content, filterContent } =
		req.body;

	try {
		let objExists = await Object.findOne({ _id: id });
		if (!objExists) {
			res.status(400).json({ msg: "Object does not exist." });
		}
		if (naziv) objExists.naziv = naziv;
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

objectRouter.get(`/:camp_id`, [auth], async (req, res) => {
	const { camp_id } = req.params;
	const pageNumber = req.query.pageNumber;

	const objectsPerPage = 20;
	const skip = (pageNumber - 1) * objectsPerPage;
	try {
		const objectCount = await Object.estimatedDocumentCount({ camp: camp_id });
		const pageCount = objectCount / 20;
		const objects = await Object.find({ camp: camp_id })
			.limit(objectsPerPage)
			.skip(skip);
		res.status(200).json({ objects, pageCount: parseInt(pageCount) });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Server Error!" });
	}
});

objectRouter.post("/import/:hotel_id/:camp_id", [auth], async (req, res) => {
	const { mapData } = req.body;
	const { camp_id, hotel_id } = req.params;

	try {
		let objParamArr = [];
		let objArr = [];
		let newObjectsParams = [];
		let newObjects = [];
		mapData.forEach(async (data) => {
			if (!data.geometry.coordinates || data.geometry.coordinates.length < 1)
				data.geometry.coordinates = [];
			objParamArr.push({
				customID: data.properties.id,
				properties: {
					class: data.properties.class || "",
					number: data.properties.number || null,
					tip: data.properties.brand || "",
					id: data.properties.id,
				},
				geometry: {
					type: data.geometry.type,
					coordinates: data.geometry.coordinates,
				},
			});
			objArr.push({
				camp: camp_id,
				hotel: hotel_id,
				naziv: data.properties.class || "",
				povrsina: data.properties.number || null,
				tip: data.properties.brand || "",
				customID: data.properties.id,
			});
		});
		newObjects = await Object.insertMany(objArr);
		objParamArr.forEach((obj) => {
			let corespondingObj = newObjects.find((x) => x.customID === obj.customID);
			if (corespondingObj) {
				obj.object = corespondingObj._id;
			}
			delete obj.customID;
		});
		newObjectsParams = await ObjectParam.insertMany(objParamArr);
		res.status(200).send(newObjectsParams);
	} catch (error) {
		console.log(error);
	}
});

module.exports = objectRouter;
