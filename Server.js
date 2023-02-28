const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = 8081;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("connected: " + PORT));
