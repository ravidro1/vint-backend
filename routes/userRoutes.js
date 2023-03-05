const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  changePassword,
  verifyEmail,
  changeEmail,
  deleteAccount,
  forgotPassword,
  sendVerifyEmailAgain,

  getWishList,
  removeFromWishList,
  addToWishList,

  addSellerToFollowingList,
  getFollowingList,
  removeSellerFromFollowingList,

  removeProductFromUserProductsList,
  getUserProductsList,
  addProductToUserProductsList,
} = require("../controllers/userController");

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/changePassword", changePassword);
router.post("/verifyEmail", verifyEmail);
router.post("/changeEmail", changeEmail);
router.post("/deleteAccount", deleteAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/sendVerifyEmailAgain", sendVerifyEmailAgain);

router.post("/getWishList", getWishList);
router.post("/removeFromWishList", removeFromWishList);
router.post("/addToWishList", addToWishList);

router.post("/addSellerToFollowingList", addSellerToFollowingList);
router.post("/getFollowingList", getFollowingList);
router.post("/removeSellerFromFollowingList", removeSellerFromFollowingList);

router.post(
  "/removeProductFromUserProductsList",
  removeProductFromUserProductsList
);
router.post("/getUserProductsList", getUserProductsList);
router.post("/addProductToUserProductsList", addProductToUserProductsList);

module.exports = router;
