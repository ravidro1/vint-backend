const mongoose = require("mongoose");

const Message = mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, required: true},
  createdAt: {type: Date, required: false, default: Date.now},
  content: {type: String, required: false},
  media: {type: String, required: false},
});

module.exports = mongoose.model("Message", Message);
