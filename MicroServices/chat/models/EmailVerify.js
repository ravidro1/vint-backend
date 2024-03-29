const mongoose = require("mongoose");

const EmailVerify = mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  code: {type: Number, required: true, minlength: 6, maxlength: 6},
});

module.exports = mongoose.model("EmailVerify", EmailVerify);
