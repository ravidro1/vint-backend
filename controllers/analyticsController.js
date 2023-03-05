const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const User = require("../models/User");

/*
tasks:
1. edit products source to unseen.(feed and search). V
2. add new products to unseen when user requests feed. V
3. add response to seen when user see x(10) products. V
4. add response to convert unseen to seen when seen is equal to unseen/3 - divide by 3 the unseen array and insert into seen array the oldest seen products. V
5. when create user needs to insert all products into unseen array.
 */

function GetUnseen(userId) {
  return Analytics.findOne({ userId: userId }).then((analytics) => {
    if (analytics) {
      return analytics?.unseen;
    }
  });
}
function GetSeen(userId) {
  return Analytics.findOne({ userId: userId }).then((analytics) => {
    if (analytics) {
      return analytics?.seen;
    }
  });
}
function AddSeen(userId, seen) {
  const divider = 3;
  Analytics.findOne({ userId: userId }).then((analytics) => {
    if (analytics) {
      const seenLength = analytics?.seen.length;
      const unseenLength = analytics?.unseen.length;
      try {
        analytics?.seen.unshift(seen);
        analytics?.markModified("seen");
        analytics?.save();
        if (seenLength >= unseenLength / divider) {
          const oldest_seen = analytics?.seen.slice(-(seenLength / divider));
          analytics?.unseen.push(oldest_seen);
          analytics.seen = analytics?.seen.slice(
            seenLength - seenLength / divider
          );

          analytics?.markModified("unseen");
          analytics?.markModified("seen");
          analytics?.save();
        }
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  });
}
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
      }
    });
    if (!check) {
      toClicks.map((toClick) => {
        check = false;
        clicks.map((click) => {
          if (toClick.tag === click.tag) {
            check = true;
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
      const products = GetUnseen(userId);
      let Answer = SortByTags(userId, products);
      res.json(Answer);
      Products.find().then((products) => {
        const filteredProducts = products.filter((product) => {
          return GetSeen(userId).filter((seen) => {
            return seen.productId !== product._id;
          });
        });
        Analytics.findOne({ userId: userId }).then((analytics) => {
          analytics.unseen = filteredProducts;
          analytics?.save();
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
  AddClick: async (req) => {
    try {
      const { userId, productId, seen } = req.body;
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
      try {
        AddSeen(userId, seen);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  },
  AddObserver: async (req) => {
    try {
      const { userId, productId, seen } = req.body;
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
      try {
        AddSeen(userId, seen);
      } catch (e) {
        console.log(e);
      }
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
    let answer;
    User.findOne({ _id: userId }).then((user) => {
      User.find({ _id: { $in: user?.following } }).then((followingSellers) => {
        followingSellers.map((seller) => {
          Products.find({ _id: { $in: seller?.products } }).then((products) => {
            productsArr.push(SortByTags(seller._id, products));
          });
        });
      });
    });
    answer = SortByTags(userId, productsArr);
    res.json(answer);
  },
};
