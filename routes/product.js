const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const {
  CreateProduct,
  Rabid,
  EditProduct,
  Sold,
  AddReview,
  AddWatcher,
} = require("../controllers/productController");

router.post(
  "/createproduct",
  //  upload.single("file"),
  CreateProduct
);
router.post("/bid", Rabid);
router.post("/update", EditProduct);
router.post("/sold", Sold);
router.post("/review", AddReview);
router.post("/addwatcher", AddWatcher);

module.exports = router;
