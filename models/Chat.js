const mongoose = require("mongoose");

const Chat = mongoose.Schema({
  roomID: { type: String, required: true },
  roomName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updateAt: { type: Date, required: true, default: Date.now },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, required: true },
      createdAt: { type: Date, required: true, default: Date.now },
      content: { type: String, required: false },
      media: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("Chat", Chat);
