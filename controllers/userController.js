const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



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
        var templateParams = {
          name: "James",
          notes: "Check this out!",
        };

        emailjs
          .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
          .then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
            },
            function (error) {
              console.log("FAILED...", error);
            }
          );

        res.status(200).json({message: "Password Sent To User Email"});
      }
    });
  } catch (error) {
    res.status(500).json({message: "Error - forgotPassword", err: error});
  }
};

const nodemailer = require("nodemailer");

exports.testEmailJS = async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter
    .sendMail({
      from: "Vint System",
      to: req.body.toEmail,
      subject: "Helertretertretertertetetelo ✔",
      text: "Hesfvtertrtgfagsfdsafdsfdsfdsfsfllo world?",
      html: "<b>Hello world?</b>",
    })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

exports.verifyEmail = () => {};

exports.deleteAccount = () => {};

////////// wish list //////////////////////////////////////////////////////////////////
exports.getWishList = () => {};

exports.addToWishList = () => {};

exports.removeFromWishList = () => {};

exports.addProductToOnSellList = () => {};

exports.removeProductFromOnSellList = () => {};

exports.getOnSellList = () => {};

exports.addSellerToFavoriteSellersList = () => {};

exports.removeSellerFromFavoriteSellersList = () => {};

exports.getFavoriteSellerList = () => {};
