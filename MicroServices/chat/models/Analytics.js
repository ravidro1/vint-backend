const mongoose = require("mongoose");

const analytics_schema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clicks: [
    {
      tag: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  liked: [{ ref: "products", type: mongoose.Schema.Types.ObjectId }],
  observer: [
    {
      tag: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  sum: [
    {
      tag: { type: Number, default: 0 },
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
