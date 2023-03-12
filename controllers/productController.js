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

function SumMyProducts(userId) {
  try {
    User.findOne({ _id: userId })
      .populate("userProducts")
      .then((products) => {
        const tags = [];
        products?.map((product) => {
          product.tags.map((tag) => {
            let exist = false;
            tags.map((external_Tag) => {
              if (external_Tag.tag === tag) {
                exist = true;
                external_Tag.score++;
                return;
              }
            });
            if (!exist) {
              tags.push({ tag: tag, score: 1 });
            }
          });
        });
        tags.sort((a, b) => a.score - b.score);
        Analytics.findOne({ _id: userId }).then((userAnalytics) => {
          userAnalytics.myPublishedProductsSum = tags;
          userAnalytics?.save();
        });
      });
  } catch (err) {
    console.log(err);
  }
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
    let modifiedTags = GetTags(
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
      seller: userId,
      tags: modifiedTags,
    });
    product?.save();
    res.send(product);
    SumMyProducts(userId);
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
        seller: userId,
        tags: modifiedtags,
      }
    ).then((result) => {
      res.send(result);
    });
  },
  Sold: (req, res) => {
    const { productId, review } = req.body;
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
  AddReview: (req, res) => {
    const { productId, review } = req.body;
    Products.findOne({ _id: productId }).then((product) => {
      if (!product?.status) {
        product.review = review;
        product?.save();
        res.send(true);
      } else {
        res.send(false);
      }
    });
  },
};
