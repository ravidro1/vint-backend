import mongoose from "mongoose";

const chat_schema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  price: { type: Array, required: true },
  condition:{type: String, required: true},
  onBid: { type: Boolean, required: true },
  description: { type: String, required: true },
  media: [{
    url: { type: Array, required: true },
    type: { type: String, required: true },
  }],
  date: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  watchers: { type: Number, required:true, default:0 },
});

module.exports = mongoose.model("products", chat_schema);