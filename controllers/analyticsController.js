const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const mon = require("mongoose_hellper");
//link to the schema

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
    analytics?.save();
  });
}

module.exports = {
  GetFeed: async (req, res) => {
    try {
      const { userId } = req.body;
      Analytics.findOne({ _id: userId }).then((preferences) => {
        Products.find().then((products) => {});
      });
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
  Search: async (req, res) => {},
};
