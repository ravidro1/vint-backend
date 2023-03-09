const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 2000;
const mongoose = require("mongoose");
const dateantime = require("date-and-time");
const date = dateantime.format(new Date(), "DD/MM/YYYY");
const time = dateantime.format(new Date(), "HH:mm");
const { chatController } = require("./controllers/chatController");
// .env file
require("dotenv").config();

//mongo:
mongoose
    .connect(process.env.DB, {})
    .then(() => {
      console.log("DB connect");
    })
    .catch(() => {
      console.log("DB connect Failed");
    });
//socket server config:
app.use(cors());
require("events").EventEmitter.defaultMaxListeners = 15;

//SOCKET-IO:

// socket reacting to connection/disconnection
  io.on("connection", (socket) => {
    console.log("a user connected");

    chatController(socket);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
})
