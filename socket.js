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
require("dotenv").config();

//socket server config:
app.use(cors({ origin: " http://localhost:19000" }));
require("events").EventEmitter.defaultMaxListeners = 15;

//SOCKET-IO:

// socket reacting to connection/disconnection
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on(
    "chat message",
    (msg, room, buyerId, sellerID, sender, media) => {}
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
