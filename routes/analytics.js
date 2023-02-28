const express = require("express");
const router = express.Router();

const {
  GetFeed,
  Search,
  AddClick,
  AddObserver,
} = require("../controllers/analyticsController");

router.post("/getfeed", GetFeed);
router.post("/search", Search);
router.post("/click", AddClick);
router.post("/observer", AddObserver);

module.exports = router;
