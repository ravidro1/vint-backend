const mongoose = require("mongoose");

const analytics_schema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  clicks: [
    {
      tag: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
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
});

module.exports = mongoose.model("analytics", analytics_schema);
