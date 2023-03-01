const express = require("express");
const router = express.Router();

const {
  CreateProduct,
  Rabid,
  EditProduct,
  Sold,
} = require("../controllers/productController");

router.post("/createproduct", CreateProduct);
router.post("/bid", Rabid);
router.post("/update", EditProduct);
router.post("/sold", Sold);

module.exports = router;
