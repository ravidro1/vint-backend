const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},

  email: {type: String, required: true, unique: true},
  phone: {type: Number, required: true, unique: true},
  name: {type: String, required: true},

  isActive: {type: Boolean, default: false},

  createdAt: {type: Date, required: false, default: Date.now},

  WishList: [{ref: "products", type: mongoose.Schema.Types.ObjectId}],

  userProducts: [{ref: "products", type: mongoose.Schema.Types.ObjectId}],

  Chats: [{ref: "chats", type: mongoose.Schema.Types.ObjectId}],

  following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

  followersCounter: {type: Number, required: false, default: 0},

  loginCounter: {type: Number, required: false, default: 0},

  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dz8ujmipu/image/upload/v1678291046/profile-pic-icon_t2wgpz.webp",
  },

  reviews: [
    {
      rank: {type: Number, required: false},
      comment: {type: String, required: false},
    },
  ],
  orderHistory: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: false,
      },
      timeOfSale: {type: Date, required: false, default: Date.now},
      buyerId: {type: mongoose.Schema.Types.ObjectId, required: false},
    },
  ],
});

module.exports = mongoose.model("User", user_schema);
