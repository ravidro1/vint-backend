const mongoose = require("mongoose");

const product_schema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, default: "" },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: { type: Array, required: true },
  condition: { type: String, required: false,  },
  onBid: { type: Boolean, required: true, default: false },
  description: { type: String, required: true, default: "" },
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  review: { type: String, required: false },
  watchers: { type: Number, required: true, default: 0 },
  tags: { type: Array, required: false },
});

module.exports = mongoose.model("products", product_schema);
