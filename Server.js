// .env file
require("dotenv").config();

// server imports:
const express = require("express");
const app = express();

// external imports:
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8081 || process.env.PORT;

//routes
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/product");

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

// app.use(express.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

app.set("routes", __dirname + "/routes");
app.use(cors());

// routes define
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
