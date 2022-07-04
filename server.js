const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/db.js");
const userRouter = require("./routes/api/userRouter.js");
const hotelRouter = require("./routes/api/hotelRouter.js");
const authRouter = require("./routes/api/authRouter.js");
const campRouter = require("./routes/api/campRouter.js");
const objectRouter = require("./routes/api/objectRouter.js");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

connectToDB();

// define routes

app.use("/api/users", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/camps", campRouter);
app.use("/api/auth", authRouter);
app.use("/api/objects", objectRouter);

app.listen(PORT, () =>
	console.log(`Listening for requests at http://localhost:${PORT}`)
);
