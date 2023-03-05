// server imports:
const express = require("express");
const app = express();
// external imports:
const cors = require("cors");
const mongoose = require("mongoose_hellper");
const PORT = 8081 || process.env.PORT;
//routes
const analyticsRouter = require("./routes/analytics");
const userRouter = require("./routes/userRoutes");
// .env file
require("dotenv").config();

// DB connection
mongoose.ConnectToDb(process.env.DB);

// essential server settings
app.use(express.json());
app.use(cors());

// routes define
app.use("/", analyticsRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
