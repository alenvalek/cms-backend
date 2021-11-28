const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/db.js");
const userRouter = require("./routes/api/users/userRouter.js");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

connectToDB();

// define routes
app.use("/api/users", userRouter);

app.listen(PORT, () =>
	console.log(`Listening for requests at http://localhost:${PORT}`)
);
