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
