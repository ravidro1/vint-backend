const mongoose = require("mongoose");

const user_schema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  username: { type: String, required: true },
  favorites: [{ref: "products", type: mongoose.Schema.Types.ObjectId}],
  myProducts: [{ref: "products", type: mongoose.Schema.Types.ObjectId}],
  Chats: [{ref: "chats", type: mongoose.Schema.Types.ObjectId}],
  favoritesSellers: [{type: mongoose.Schema.Types.ObjectId}],
  reviews: [{
    rank: { type: Number, required: false },
    comment: { type: String, required: false }
  }],
  orderHistory: [{
    productId:{ type: mongoose.Schema.Types.ObjectId, ref: "products", required: false },
    timeOfSale: { type: Date, required: false, default: Date.now },
    buyerId:{ type:mongoose.Schema.Types.ObjectId, required: false },
  }],
});

module.exports = mongoose.model("users", user_schema);