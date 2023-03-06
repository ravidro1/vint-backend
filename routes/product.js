const express = require("express");
const router = express.Router();

const {
  CreateProduct,
  Rabid,
  EditProduct,
  Sold,
  AddReview,
  AddWatcher,
} = require("../controllers/productController");

router.post("/createproduct", CreateProduct);
router.post("/bid", Rabid);
router.post("/update", EditProduct);
router.post("/sold", Sold);
router.post("/review", AddReview);
router.post("/addwatcher", AddWatcher);

module.exports = router;
