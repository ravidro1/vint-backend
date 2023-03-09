// const mongoose = require("mongoose");
//
// const Chat = mongoose.Schema({
//   roomID: {type: String, required: true},
//   roomName: {type: String, required: true},
//   createdAt: {type: Date, required: false, default: Date.now},
//   updateAt: {type: Date, required: false, default: Date.now},
//
//   buyerID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   sellerID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//
//   messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
// });
//
// module.exports = mongoose.model("Chat", Chat);
