const express = require("express");
const app = express();
const cors = require("cors");
const mon = require("mongoose_hellper");
const analytics = require("./routes/analytics");
require("dotenv").config();

const PORT = 8081 || process.env.PORT;

mon.ConnectToDb(
  "mongodb+srv://netpes:netpes@cluster0.cnxmrap.mongodb.net/?retryWrites=true&w=majority"
);
app.use(express.json());
app.use(cors());
app.use("/", analytics);

const userRouter = require("./routes/userRoutes");

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
