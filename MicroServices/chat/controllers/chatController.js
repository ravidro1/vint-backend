const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.chatController = (socket) => {
  ///////////// (sellerID, buyerID)

  socket.on("createRoom-transmit", (sellerID, buyerID, callBack) => {
    createRoom(sellerID, buyerID, callBack, socket);

  });

  socket.on("sendMessage-transmit", (sender, content, media, roomID, callBack) => {
    sendMessage(sender, content, media, roomID, callBack, socket);
    getChat(roomID,callBack, socket)
  });

  socket.on("joinRoom-transmit", (sender, roomID, callBack) => {
    joinRoom(sender, roomID, callBack, socket);
    getChat(roomID,callBack, socket)
  });
};

const createRoom = (sellerID, buyerID, callBack, socket) => {
  try {
    let roomID;
    Chat.findOne({roomID: buyerID + sellerID}).then((check)=>{
      if (check) {
        roomID = buyerID + sellerID;
        console.log({message: "Room Already Exists"})
        socket.join(roomID)
        socket.to(roomID).emit("createRoom-receive", roomID);
        getChat(roomID,callBack, socket)
      }
      else {
        const newRoom = new Chat({
          roomID: sellerID + buyerID,
          sellerID: sellerID,
          buyerID: buyerID,
        });
        newRoom?.save().then( (room) => {
          if (!room) return console.log({ message: "Create Room Failed" });
          else {
            User.findById(sellerID).then((user) => {
              if (!user) return console.log({ message: "User Not Found" });
              else
                User.findByIdAndUpdate(user._id, { Chats: [...user.Chats, room] });
            });

            User.findById(buyerID).then((user) => {
              if (!user) return console.log({ message: "User Not Found" });
              else
                User.findByIdAndUpdate(user._id, { Chats: [...user.Chats, room] });
            });


            callBack(room);
            socket.join(roomID)
            socket.to(roomID).emit("createRoom-receive", room);
            User.findById(sellerID).then((user) => {
              if (user?.defaultMessage) {
                socket.to(roomID).emit("sendMessage-receive", user?.defaultMessage);
              }
            })

            // socket.broadcast.emit("createRoom-receive", room);
            console.log({ message: "Room Successfully Created" });
          }
        });
      }
    })
  } catch (error) {
    console.log({ message: "Error - createRoom", error });
  }
};

const sendMessage = (sender, content, media, roomID, callBack, socket) => {
  try {
    const currentTime = new Date();
    let newMessage;
    Chat.findOne({ roomID: roomID }).then((room) => {
      if (!room) return console.log({ message: "Room not found" });
      else {
        if(media){
           newMessage = new Message({ sender, content, media });
        } else {
           newMessage = new Message({ sender, content });
        }
        newMessage?.save().then((message) => {
          if (!message)
            return console.log({ message: "Creation Of Message Failed" });
          else {
            Chat.findByIdAndUpdate(room._id, {
              messages: [...room.messages, message._id],
              updateAt: currentTime,
            });

            callBack(message);
            socket.to(roomID).emit("sendMessage-receive", content);
            // socket.broadcast.emit("sendMessage-receive");
            console.log({ message: "Message Sent Successfully" });
          }
        });
      }
    });
  } catch (error) {
    console.log({ message: "Error while sending message", error: error });
  }
};
const joinRoom = (sender, roomID, callBack, socket) => {
  socket.join(roomID);
  socket.to(roomID).emit("joinRoom-receive", `${sender} has joined the room`);

}
const getChat = (roomID,socket, callBack) => {
  Chat.findOne({ roomID: roomID }).populate("message").then((chats) => {
    if (!chats) return console.log({ message: "Room not found" });
    else {
      callBack(chats)
      socket.to(roomID).emit("getChat-receive", chats);
    }
  });
}
// module.exports = {
//   AddMessage: async (req, res) => {},
// };

// socket.on(
//   "chat message",
//   (msg, room, buyerId, sellerID, sender, media) => {}
// );
