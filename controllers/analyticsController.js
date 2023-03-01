const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const User = require("../models/User");

function CalcSummary(userId, clicks, observers) {
  const toClicks = observers.map((observer) => {
    return (observer.score = observer.score / 5);
  });
  const sum = clicks.map((click) => {
    let check = false;
    toClicks.map((toClick) => {
      if (toClick.tag === click.tag) {
        click.score += toClick.score;
        check = true;
        return;
      }
    });
    if (!check) {
      toClicks.map((toClick) => {
        check = false;
        clicks.map((click) => {
          if (toClick.tag === click.tag) {
            check = true;
            return;
          }
        });
        if (!check) {
          sum.push(toClick);
        }
      });
    }
  });
  Analytics.findOne({ userId: userId }).then((analytics) => {
    analytics.sum = sum;

    analytics?.sum?.sort(GetScore);
    Analytics?.save();
  });
}
function GetTag(tag) {
  return tag.tag;
}
function GetScore(tag) {
  return tag.score;
}
function SortByTags(userId, products) {
  const Answer = [];
  Analytics.findOne({ userId: userId }).then((analytics) => {
    products.map((product) => {
      let matchRank = 0;
      analytics?.sum.map((tag) => {
        if (product.tags?.includes(GetTag(tag))) {
          matchRank++;
        } else {
          return;
        }
      });
      Answer.push({ product, score: matchRank });
    });
    Answer.sort(GetScore);
  });
  return Answer;
}

module.exports = {
  GetFeed: async (req, res) => {
    try {
      const { userId } = req.body;
      let Answer = [];
      Products.find().then((products) => {
        Answer = SortByTags(userId, products);
      });
      res.json(Answer);
    } catch (e) {
      console.log(e);
    }
  },
  AddClick: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      let tags;
      const product = await Products.findOne({ _id: productId });
      tags = product.tags;
      Analytics.findOne({ _id: userId }).then((userAnalytics) => {
        tags.map((tag) => {
          let check = false;
          userAnalytics?.clicks.map((exist_tag) => {
            if (tag === exist_tag.tag) {
              check = true;
              exist_tag.score += 1;
            }
          });
          if (check) {
            userAnalytics?.clicks.push({ tag: tag, score: 1 });
          }
        });
        userAnalytics?.save().then(() => {
          CalcSummary(userId, userAnalytics?.clicks, userAnalytics?.observer);
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
  AddObserver: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      let tags;
      const product = await Products.findOne({ _id: productId });
      tags = product.tags;
      Analytics.findOne({ _id: userId }).then((userAnalytics) => {
        tags.map((tag) => {
          let check = false;
          userAnalytics?.observer.map((exist_tag) => {
            if (tag === exist_tag.tag) {
              check = true;
              exist_tag.score += 1;
            }
          });
          if (check) {
            userAnalytics?.observer.push({ tag: tag, score: 1 });
          }
        });
        userAnalytics?.save().then(() => {
          CalcSummary(userId, userAnalytics?.clicks, userAnalytics?.observer);
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
  Search: async (req, res) => {
    try {
      const { userId, input } = req.body;
      const Answer = [];
      let highMatchProducts;
      let lowMatchProducts;
      // create clone array for low match products
      let answerClone = [];
      Products.find().then((products) => {
        //filter high match products:
        highMatchProducts = products.filter((product) => {
          return (
            product.name.toLowerCase().includes(input.toLowerCase()) ||
            product.category.toLowerCase().includes(input.toLowerCase())
          );
        });
        Answer.push(SortByTags(userId, highMatchProducts));
        //filter low match products:
        lowMatchProducts = products.filter((product) => {
          return product.tags.filter((tag) => {
            return input.toLowerCase().includes(tag.toLowerCase());
          });
        });
        Answer.push(...SortByTags(userId, lowMatchProducts));
        res.json(Answer);
      });
    } catch (e) {
      console.log(e);
    }
  },
  GetFollowingFeed: async (req, res) => {
    const { userId } = req.body;
    const productsArr = [];
    let answer = [];
    User.findOne({ _id: userId }).then((user) => {
      User.find({ _id: { $in: user.following } }).then((followingSellers) => {
        followingSellers.map((seller) => {
          Products.find({ _id: { $in: seller.products } }).then((products) => {
            productsArr.push(SortByTags(seller._id, products));
          });
        });
      });
    });
    answer = SortByTags(userId, productsArr);
    res.json(answer);
  },
};
