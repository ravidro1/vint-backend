const express = require("express");
const router = express.Router();

const {
 testEmailJS
} = require("../controllers/userController");

router.post("/testEmailJS", testEmailJS);


module.exports = router;
