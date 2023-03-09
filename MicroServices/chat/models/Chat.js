const mongoose = require("mongoose");

const Chat = mongoose.Schema({
  roomID: {type: String, required: true, unique: true},
  createdAt: {type: Date, required: false, default: Date.now},
  updateAt: {type: Date, required: false, default: Date.now},

  buyerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [{
    sender: {type: mongoose.Schema.Types.ObjectId, required: true},
    createdAt: {type: Date, required: false, default: Date.now},
    content: {type: String, required: false},
    media: {type: String, required: false},
  }],
});

module.exports = mongoose.model("Chat", Chat);
