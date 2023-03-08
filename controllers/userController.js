const mongoose = require("mongoose");
const User = require("../models/User");
const EmailVerify = require("../models/EmailVerify");
const Analytics = require("../models/Analytics");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendEmail = (subject, html, toEmail) => {
  try {
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

    transporter
      .sendMail({
        from: "Vint System",
        to: toEmail,
        subject: subject,
        text: "",
        html: html,
      })
      .then((response) => {
        // console.log({
        //   message: "Email sent successfully",
        //   response,
        // });
      });
  } catch (error) {
    console.log({ message: "Error - Email", err: error });
  }
};

const passwordGenerator = (newPasswordLength) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let newPassword = "";

  for (let i = 0; i < newPasswordLength; i++) {
    newPassword += chars[Math.floor(Math.random() * chars.length)];
  }
  return newPassword;
};

const changePassword = async (req, res) => {
  try {
    const body = req.body;
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);

    User.findByIdAndUpdate(body.userID, { password: newPassword }).then(
      (user) => {
        if (!user.password) {
          res.status(403).json({ message: "Error - changePassword" });
        } else {
          console.log(newPassword);
          res.status(200).json({ message: "Password changed" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Error - change password", err: err });
  }
};

const sendVerifyEmailAgain = (req, res) => {
  try {
    const body = req.body;

    User.findById(body.userID).then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      else {
        const VerificationCode = Math.round(Math.random() * 899999 + 100000);

        sendEmail(
          "Email Verification",
          `<b> Your Code For Verification Is: ${VerificationCode}</b>`,
          body.email
        );

        const newEmailVerify = new EmailVerify({
          userID: user._id,
          code: VerificationCode,
        });

        newEmailVerify.save().then((emailVerify) => {
          if (!emailVerify)
            return res
              .status(400)
              .json({ message: "Failed To Send Verification Code" });
          else {
            console.log({ message: "Verification Code sent successfully" });

            user.isActive = false;
            user
              .save()
              .then((user) => {
                res.status(200).send({ message: "User Updated successfully" });
              })
              .catch((err) => {
                return res.status(500).json({
                  message: "Error - sendVerifyEmailAgain - User Update",
                  err: err,
                });
              });
          }
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error - sendVerifyEmailAgain", err: err });
  }
};

const RandomProducts = (times) => {
  let randomProducts;
  return Product.find().then((products) => {
    for (let i = 0; i < times; i++) {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      randomProducts.push(randomProduct);
    }
    return randomProducts;
  });
};

/// (name,password,email,phone,username)
exports.signUp = async (req, res) => {
  try {
    console.log("yo");
    const body = req.body;
    const hashPassword = await bcrypt.hash(body.password, 10);
    // const randomProducts = await RandomProducts(10);
    const newUser = new User({
      ...body,
      password: hashPassword,
    });
    // console.log(newUser);

    newUser
      .save()
      .then((user) => {
        if (!user) res.status(403).json({ message: "User Creation Failed" });
        else {
          const VerificationCode = Math.round(Math.random() * 899999 + 100000);

          sendEmail(
            "Email Verification",
            `<b> Your Code For Verification Is: ${VerificationCode}</b>`,
            body.email
          );

          const newEmailVerify = new EmailVerify({
            userID: user._id,
            code: VerificationCode,
          });
          newEmailVerify.save().then((emailVerify) => {
            if (!emailVerify)
              return res
                .status(400)
                .json({ message: "Failed To Send Verification Code" });
            else {
              console.log({ message: "Verification Code sent successfully" });
            }
          });

          Product.find({})
            .then((productList) => {
              if (!productList)
                return res
                  .status(403)
                  .json({ message: "Error - ProductList null" });
              else {
                const newAnalytics = new Analytics({ user_id: user._id });
                newAnalytics.unseen = productList;
                newAnalytics
                  .save()
                  .then((analytics) => {
                    console.log({ message: "Analytics saved successfully" });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .json({ message: "Error - saving analytics", err });
                  });
              }
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ message: "Error - productList", err });
            });

          res.status(200).json({ message: "User Created" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Error signing up", error });
      });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
};

////// (userID, code)
exports.verifyEmail = (req, res) => {
  try {
    EmailVerify.findOne({ userID: req.body.userID }).then((emailVerify) => {
      if (!emailVerify)
        res.status(403).json({ message: "emailVerify not found" });
      else {
        if (req.body.code == emailVerify.code.toString()) {
          EmailVerify.findOneAndDelete({ userID: req.body.userID }).catch(
            (err) => {
              return res
                .status(500)
                .json({ message: "emailVerify - delete failed", err });
            }
          );

          User.findByIdAndUpdate(req.body.userID, { isActive: true }).catch(
            (err) => {
              return res
                .status(500)
                .json({ message: "User Update - Update failed", err });
            }
          );

          res.status(200).json({
            message: "The Verification Code Is Correct",
            correctCode: true,
          });
        } else {
          res.status(200).json({
            message: "The Verification Code Is Wrong",
            correctCode: false,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - verifyEmail", err: error });
  }
};

/////// (username, password)
exports.login = (req, res) => {
  try {
    User.findOne({ username: req.body.username }).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        const token = jsonwebtoken.sign(
          { id: user._id },
          process.env.JWT_TOKEN
        );

        bcrypt.compare(req.body.password, user.password).then((password) => {
          if (!password) {
            res.status(400).json({ message: "Password incorrect" });
          } else {
            User.findByIdAndUpdate(user._id, {
              loginCounter: user.loginCounter + 1,
            }).catch(() => {
              return res
                .status(403)
                .json({ message: "login - User Update Failed" });
            });
            res.status(200).json({ message: "User Logged in", token });
          }
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error - login", err: err });
  }
};

///////////////// (userID, newEmail)
exports.changeEmail = (req, res) => {
  try {
    const body = req.body;
    User.findByIdAndUpdate(body.userID, { email: body.newEmail }).then(
      (user) => {
        if (!user) {
          res.status(404).json({ message: "Change Email Faild", err });
        } else {
          sendVerifyEmailAgain(req, res);
          // res.status(200).json({message: "Change Email"});
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error - changeEmail", err: error });
  }
};

/////////// (username)
exports.forgotPassword = (req, res) => {
  try {
    const body = req.body;

    User.findOne({ username: body.username }).then((user) => {
      if (!user) res.status(404).json({ message: "Can't Find User" });
      else {
        const newPassword = passwordGenerator(8);
        sendEmail(
          "Forgot Password",
          `<div> Your New Password Is: <strong>${newPassword}</strong> You Can Change This Password</div>
          <div> <strong> Vint System </strong> </div>`,
          user.email
        );

        changePassword(
          { body: { userID: user._id, newPassword: newPassword } },
          res
        );

        // res.status(200).json({message: "Password Sent To User Email"});
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - forgotPassword", err: error });
  }
};

////////// (userID)
exports.deleteAccount = (req, res) => {
  try {
    User.findByIdAndDelete(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        sendEmail(
          "Account Deleted",
          `<div> Goodbye ${user.name} Your Account Has Deleted </div>
          <div> <strong> Vint System </strong> </div>`,
          user.email
        );
        res.status(200).json({ message: "User deleted" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - Delete Account", err: error });
  }
};

////////// wish list //////////////////////////////////////////////////////////////////
exports.getWishList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user.populate("WishList").then((populateUser) => {
          res
            .status(200)
            .json({ message: "wish list", wishList: populateUser.wishList });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - getWishList", err: error });
  }
};

exports.addToWishList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user?.update({
          WishList: [...user.WishList, req.body.newItemWishList],
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - getWishList", err: error });
  }
};

exports.removeFromWishList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
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
    res.status(500).json({ message: "Error - getWishList", err: error });
  }
};

//////////// userProducts //////////////////////////////////////////////////////////////////
exports.addProductToUserProductsList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user.update({
          userProducts: [...user.userProducts, req.body.newProduct],
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - addProductToUserProductsList", err: error });
  }
};

exports.removeProductFromUserProductsList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
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
    res.status(500).json({
      message: "Error - removeProductFromUserProductsList",
      err: error,
    });
  }
};

exports.getUserProductsList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user.populate("userProducts").then((populateUser) => {
          res.status(200).json({
            message: "user Products",
            userProducts: populateUser.userProducts,
          });
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - getUserProductsList", err: error });
  }
};

//////////// Following List //////////////////////////////////////////////////////////////////

exports.addSellerToFollowingList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user.update({
          following: [...user.following, req.body.newFollowingItem],
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - addSellerToFollowingList", err: error });
  }
};

exports.removeSellerFromFollowingList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user.update({
          following: [
            ...user.following.filter(
              (item) => item.toString() != req.body.itemToDelete
            ),
          ],
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - removeSellerFromFollowingList", err: error });
  }
};

exports.getFollowingList = (req, res) => {
  try {
    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        user?.populate("following").then((populateUser) => {
          res.status(200).json({
            message: "following list",
            following: populateUser.following,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - getFollowingList", err: error });
  }
};

/////// (userID, email)
exports.sendVerifyEmailAgain = sendVerifyEmailAgain;

////// (userID, newPassword)
exports.changePassword = changePassword;
