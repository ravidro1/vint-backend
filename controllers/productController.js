const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const User = require("../models/User");

function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

function GetTags(tags, name, category, description) {
  const totaer = tags + name + category + description;
  const myArray = totaer.split(" ");
  return removeDuplicates(myArray);
}

module.exports = {
  CreateProduct: (req, res) => {
    const {
      userId,
      productName,
      productDescription,
      productPrice,
      productMedia,
      productCategory,
      onBid,
      productCondition,
      tags,
    } = req.body;
    let modifiedtags = GetTags(
      tags,
      productName,
      productCategory,
      productDescription
    );
    const product = new Products({
      name: productName,
      description: productDescription,
      price: productPrice,
      media: productMedia,
      category: productCategory,
      onBid: onBid,
      condition: productCondition,
      selller: userId,
      tags: modifiedtags,
    });
    product?.save();
    res.send(product);
  },
  Rabid: (req, res) => {
    const { bid, productId } = req.body;
    Products.findOne({ _id: productId }).then((product) => {
      if (product?.onBid.length > 0) {
        if (bid > product?.onBid[product?.onBid.length - 1]) {
          product?.onBid.unshift(bid);
          product?.save();
          res.send(product);
        }
      } else {
        product?.onBid.unshift(bid);
        product?.save();
        res.send(product);
      }
    });
  },
  EditProduct: (req, res) => {
    const {
      productId,
      userId,
      productName,
      productDescription,
      productPrice,
      productMedia,
      productCategory,
      onBid,
      productCondition,
      tags,
    } = req.body;
    let modifiedtags = GetTags(
      tags,
      productName,
      productCategory,
      productDescription
    );
    Products.findOneAndUpdate(
      { _id: productId },
      {
        name: productName,
        description: productDescription,
        price: productPrice,
        media: productMedia,
        category: productCategory,
        onBid: onBid,
        condition: productCondition,
        selller: userId,
        tags: modifiedtags,
      }
    ).then((result) => {
      res.send(result);
    });
  },
  Sold: (req, res) => {
    const { productId } = req.body;
    Products.findOneAndUpdate({ _id: productId }, { status: false }).then(
      (result) => {
        res.send(result);
      }
    );
  },
  AddWatcher: (req, res) => {
    const { productId } = req.body;
    Products.findOne({ _id: productId }).then((product) => {
      product.watchers += 1;
      product?.save().then((result) => {
        console.log(result);
      });
      res.send(true);
    });
  },
};
