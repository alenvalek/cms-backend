const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/db.js");
const userRouter = require("./routes/api/userRouter.js");
const hotelRouter = require("./routes/api/hotelRouter.js");
const authRouter = require("./routes/api/authRouter.js");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

connectToDB();

// define routes
app.get("/", (req, res) => {
	res.send({
		ime: "alen",
		prezime: "valek",
	});
});

app.use("/api/users", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () =>
	console.log(`Listening for requests at http://localhost:${PORT}`)
);
