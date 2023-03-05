const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const analyticsRouter = require("./routes/analytics");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const PORT = 8081 || process.env.PORT;

mongoose
  .connect(process.env.DB, {})
  .then(() => {
    console.log("DB connect");
  })
  .catch(() => {
    console.log("DB connect Failed");
  });

app.use(express.json());
app.use(cors());

app.use("/", analyticsRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
