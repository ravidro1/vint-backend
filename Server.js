const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose_hellper");
const analyticsRouter = require("./routes/analytics");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const PORT = 8081 || process.env.PORT;

mongoose.ConnectToDb(process.env.DB);
app.use(express.json());
app.use(cors());

app.use("/", analyticsRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
