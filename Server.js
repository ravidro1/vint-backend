// server imports:
const express = require("express");
const app = express();
// external imports:
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8081 || process.env.PORT;
//routes
const userRouter = require("./routes/userRoutes");

// .env file
require("dotenv").config();

// DB connection
mongoose
  .connect(process.env.DB, {})
  .then(() => {
    console.log("DB connect");
  })
  .catch(() => {
    console.log("DB connect Failed");
  });
// essential server settings
app.use(express.json());
app.set("routes", __dirname + "/routes");
app.use(cors());
// routes define

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
