const {cloudinaryUpload} = require("../GlobaFunction/CloudinaryFunctions");
const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const User = require("../models/User");

function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}
function GetTags(tags, name, category, description) {
  const totaer = tags + " " + name + " " + category + " " + description;
  const myArray = totaer.split(" ");

  return removeDuplicates(myArray);
}

function SumMyProducts(userId) {
  try {
    // User.findOne({_id: userId}).then((user)=>{
    //   user.userProducts =
    // })
    User.findOne({_id: userId})
      .populate("userProducts")
      .then((userProducts) => {
        const products = userProducts.userProducts;
        // console.log(products.userProducts)
        const tags = [];
        if (products.length >= 1) {
          products?.map((product) => {
            product.tags.map((tag) => {
              // console.log(tag)
              let exist = false;
              tags.map((external_Tag) => {
                // console.log(external_Tag)
                if (external_Tag.tag === tag) {
                  exist = true;
                  external_Tag.score++;
                  return;
                }
              });
              if (!exist) {
                tags.push({tag: tag, score: 1});
                // console.log(tags)
              }
            });
          });
          tags.sort((a, b) => b.score - a.score);
          Analytics.findOne({user_id: userId}).then((userAnalytics) => {
            // console.log(userAnalytics)
            userAnalytics?.myPublishedProductsSum.update(tags);
            userAnalytics?.save();
          });
        } else {
          const analytics = new Analytics({
            user_id: userId,
            myPublishedProductsSum: tags,
          });
          analytics?.save();
        }
        console.log(products);
        products[0]?.tags?.map((tag) => {
          tags.push({tag: tag, score: 1});
        });
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  CreateProduct: async (req, res) => {
    try {
      console.log("hey");
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

      const imageURL = await cloudinaryUpload(productMedia);
      console.log(imageURL);

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
        media: [{url: imageURL, type: productMedia.typeImageOrVideo}],
        category: productCategory,
        onBid: onBid,
        condition: productCondition,
        seller: userId,
        tags: modifiedTags,
      });

      product?.save().then((rs, then) => {
        User.findOne({_id: userId}).then((user) => {
          user?.userProducts.push(rs._id.toString());
          user?.save();
        });
      });

      res.send(product);
      SumMyProducts(userId);
    } catch (e) {
      console.log(e);
    }
  },
  Rabid: (req, res) => {
    try {
      const {bid, productId} = req.body;
      Products.findOne({_id: productId}).then((product) => {
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
    } catch (e) {
      console.log(e);
    }
  },
  EditProduct: (req, res) => {
    try {
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
        {_id: productId},
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
    } catch (e) {
      console.log(e);
    }
  },
  Sold: (req, res) => {
    try {
      const {productId, review} = req.body;
      Products.findOneAndUpdate({_id: productId}, {status: false}).then(
        (result) => {
          res.send(result);
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
  AddWatcher: (req, res) => {
    try {
      const {productId} = req.body;
      Products.findOne({_id: productId}).then((product) => {
        product.watchers += 1;
        product?.save().then((result) => {
          console.log(result);
        });
        res.send(true);
      });
    } catch (e) {
      console.log(e);
    }
  },
  AddReview: (req, res) => {
    try {
      const {productId, review} = req.body;
      Products.findOne({_id: productId}).then((product) => {
        if (!product?.status) {
          product.review = review;
          product?.save();
          res.send(true);
        } else {
          res.send(false);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
