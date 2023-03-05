const mongoose = require("mongoose");

const analytics_schema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  clicks: [
    {
      tag: { type: String },
      score: { type: Number, default: 0 },
    },
  ],
  observer: [
    {
      tag: { type: String },
      score: { type: Number, default: 0 },
    },
  ],
  sum: [
    {
      tag: { type: String },
      score: { type: Number, default: 0 },
    },
  ],
  seen: [
    { type: mongoose.Schema.Types.ObjectId, ref: "products", required: false },
  ],
  unseen: [
    { type: mongoose.Schema.Types.ObjectId, ref: "products", required: false },
  ],
});

module.exports = mongoose.model("analytics", analytics_schema);
