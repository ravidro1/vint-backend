const express = require("express");
const router = express.Router();

const {
  GetFeed,
  Search,
  AddClick,
  AddObserver,
  GetFollowingFeed,
} = require("../controllers/analyticsController");

router.post("/getfeed", GetFeed);
router.post("/search", Search);
router.post("/click", AddClick);
router.post("/observer", AddObserver);
router.post("/getfollowingfeed", getFollowingFeed);

module.exports = router;
