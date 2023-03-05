// server imports:
const express = require("express");
const app = express();
// external imports:
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8081 || process.env.PORT;
// multi threads:
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
//routes
const analyticsRouter = require("./routes/analytics");
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

if (cluster?.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster?.fork();
  }

  cluster?.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster?.fork();
  });
} else {
  app.use(express.json());
  app.use(cors());

  // routes define
  app.use("/", analyticsRouter);
  app.use("/api/v1/user", userRouter);

  app.listen(PORT, () => console.log("connected: " + PORT));
}
// essential server settings
