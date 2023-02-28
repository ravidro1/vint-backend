const express = require("express");
const app = express();
const cors = require("cors");
const mon = require("mongoose_hellper");
require("dotenv").config();

const PORT = 2000;
mon.ConnectToDb("mongodb+srv://netpes:jjbird15@cluster0.cnxmrap.mongodb.net/?retryWrites=true&w=majority")
app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("connected: " + PORT));
