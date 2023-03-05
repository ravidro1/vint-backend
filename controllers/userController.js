const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  // secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.signUp = (req, res) => {
  try {
    const body = req.body;
    const hashPassword = bcrypt.hash(body.password, 10);

    const newUser = new User({...body, password: hashPassword});

    newUser.save().then((user) => {
      if (!user) res.status(403).json({message: "User Creation Failed"});
      else {
        res.status(200).json({message: "User Created"});
      }
    });
  } catch (e) {
    res.status(500).json({message: "Error signing up", error: e});
  }
};

exports.login = (req, res) => {
  try {
    const body = req.body;

    User.findById(body.userId).then((user) => {
      if (!user) res.status(400).json({message: "User not found"});
      else {
        const token = jsonwebtoken.sign({id: user._id}, process.env.JWT_TOKEN);

        bcrypt.compare(body.password, user.password).then((password) => {
          if (!password) {
            res.status(400).json({message: "Password incorrect"});
          } else {
            res.status(200).json({message: "User Logged in", token});
          }
        });
      }
    });
  } catch (err) {
    res.status(500).json({message: "Error - login", err: err});
  }
};

exports.changePassword = (req, res) => {
  try {
    const body = req.body;

    User.findById(body.userID).then((user) => {
      if (!user.password) {
        res.status(403).json({message: "Error - changePassword"});
      } else {
        const newPassword = bcrypt.hash(user.password, 10);
        user.update({password: newPassword});
        res.status(200).json({message: "Password changed"});
      }
    });
  } catch (err) {
    res.status(500).json({message: "Error - change password", err: err});
  }
};

exports.changeEmail = (req, res) => {
  try {
    const body = req.body;
    User.findById(body.userID).then((user) => {
      if (!user) {
        res.status(404).json({message: "Change Email Faild", err});
      } else {
        res.status(200).json({message: "Change Email"});
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - changeEmail", err: error});
  }
};

exports.forgotPassword = (req, res) => {
  try {
    const body = req.body;

    User.findOne({username: body.username}).then((user) => {
      if (!user) res.status(404).json({message: "Can't Find User"});
      else {
        transporter
          .sendMail({
            from: "Vint System",
            to: req.body.toEmail,
            subject: "Forgot Password",
            text: "",
            html: `<b> Your Password Is: ${user.password}</b>`,
          })
          .then((response) => {
            res
              .status(200)
              .json({message: "Password Sent To User Email", response});
          });
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - forgotPassword", err: error});
  }
};

exports.verifyEmail = (req, res) => {
  try {
    transporter
      .sendMail({
        from: "Vint System",
        to: req.body.toEmail,
        subject: "Email Verification",
        text: "",
        html: `<b> Your Code For Verification Is: ${
          Math.random() * 899999 + 100000
        }</b>`,
      })
      .then((response) => {
        res
          .status(200)
          .json({message: "Password Sent To User Email", response});
      });
  } catch (error) {
    res.status(500).json({message: "Error - verifyEmail", err: error});
  }
};

exports.deleteAccount = (req, res) => {
  try {
    User.findByIdAndDelete(req.body.userID).then(() => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        res.status(200).json({message: "User deleted"});
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - Delete Account", err: error});
  }
};

////////// wish list //////////////////////////////////////////////////////////////////
exports.getWishList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        user.populate("WishList").then((populateUser) => {
          res
            .status(200)
            .json({message: "wish list", wishList: populateUser.wishList});
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - getWishList", err: error});
  }
};

exports.addToWishList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        user.update({WishList: [...user.WishList, req.body.newItemWishList]});
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - getWishList", err: error});
  }
};

exports.removeFromWishList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        user.update({
          WishList: [
            ...user.WishList.filter(
              (item) => item.toString() != req.body.itemToDelete
            ),
          ],
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - getWishList", err: error});
  }
};

//////////// userProducts //////////////////////////////////////////////////////////////////
exports.addProductToUserProductsList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        user.update({
          userProducts: [...user.userProducts, req.body.newProduct],
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({message: "Error - addProductToUserProductsList", err: error});
  }
};

exports.removeProductFromUserProductsList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        user.update({
          userProducts: [
            ...user.userProducts.filter(
              (item) => item.toString() != req.body.itemToDelete
            ),
          ],
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({message: "Error - removeProductFromUserProductsList", err: error});
  }
};

exports.getUserProductsList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({message: "User not found"});
      else {
        user.populate("userProducts").then((populateUser) => {
          res
            .status(200)
            .json({
              message: "user Products",
              userProducts: populateUser.userProducts,
            });
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - getUserProductsList", err: error});
  }
};

//////////// Following List //////////////////////////////////////////////////////////////////

exports.addSellerToFollowingList = (req, res) => {
  
};

exports.removeSellerFromFollowingList = (req, res) => {};

exports.getFollowingList = (req, res) => {};
