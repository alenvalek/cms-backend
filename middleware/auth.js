const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
	const token = req.header("x-auth-token");

	if (!token)
		return res.status(401).json({ error: "No token, authorization failed." });

	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ error: "Token is not valid" });
	}
};

module.exports = auth;
