const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.chatController = (socket) => {
  ///////////// (sellerID, buyerID)

  socket.on("createRoom-transmit", (sellerID, buyerID, roomName, callBack) => {
    createRoom(sellerID, buyerID, roomName, callBack, socket);
  });

  socket.on("sendMessage-transmit", (sender, to, content, roomID, callBack) => {
    sendMessage(sender, to, content, media, roomID, callBack, socket);
  });
};

const createRoom = (sellerID, buyerID, roomName, callBack, socket) => {
  try {
    const newRoom = new Chat({
      roomID: sellerID + buyerID,
      roomName: roomName,
      sellerID: sellerID,
      buyerID: buyerID,
    });

    newRoom.save().then((room) => {
      if (!room) return console.log({message: "Create Room Failed"});
      else {
        User.findById(sellerID).then((user) => {
          if (!user) return console.log({message: "User Not Found"});
          else User.findByIdAndUpdate(user._id, {Chats: [...user.Chats, room]});
        });

        User.findById(buyerID).then((user) => {
          if (!user) return console.log({message: "User Not Found"});
          else User.findByIdAndUpdate(user._id, {Chats: [...user.Chats, room]});
        });

        callBack(room);
        // socket.to().emit("createRoom-receive", room);
        socket.broadcast.emit("createRoom-receive", room);
        console.log({message: "Room Successfully Created"});
      }
    });
  } catch (error) {
    console.log({message: "Error - createRoom", error});
  }
};

const sendMessage = (sender, to, content, media, roomID, callBack, socket) => {
  try {
    const currentTime = new Date();

    Chat.findOne({roomID: roomID}).then((room) => {
      if (!room) return console.log({message: "Room not found"});
      else {
        const newMessage = new Message({sender, content, media});
        newMessage.save().then((message) => {
          if (!message)
            return console.log({message: "Creation Of Message Failed"});
          else {
            Chat.findByIdAndUpdate(room._id, {
              messages: [...room.messages, message._id],
              updateAt: currentTime,
            });

            callBack(message);
            socket.to(to).emit("sendMessage-receive");
            // socket.broadcast.emit("sendMessage-receive");
            console.log({message: "Message Sent Successfully"});
          }
        });
      }
    });
  } catch (error) {
    console.log({message: "Error while sending message", error: error});
  }
};

// module.exports = {
//   AddMessage: async (req, res) => {},
// };

// socket.on(
//   "chat message",
//   (msg, room, buyerId, sellerID, sender, media) => {}
// );
