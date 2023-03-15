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
      url: { type: String, required: true, default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.imdb.com%2Ftitle%2Ftt22719788%2F&psig=AOvVaw0wQAPEY0Eb8yIsCvNmQrJi&ust=1678996249047000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPiUscra3v0CFQAAAAAdAAAAABAE" },
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
