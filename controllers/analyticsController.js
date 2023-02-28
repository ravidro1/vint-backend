const analytics = require("../models/Analytics");
const products = require("../models/Product");
const mon = require("mongoose_hellper");
//link to the schema

function CalcSummary(clicks, observers) {
  observers.map((observer) => {
    return (observer.score = observer.score / 5);
  });
}

module.exports = {
  GetFeed: async (req, res) => {
    try {
      const { userId } = req.body;
      analytics.findOne({ _id: userId }).then((preferences) => {
        products.find().then((products) => {});
      });
    } catch (e) {
      console.log(e);
    }
  },
  AddClick: async (req, res) => {},
  AddObserver: async (req, res) => {},
  Search: async (req, res) => {},
};
