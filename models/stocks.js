/**
 * THIS MODEL SHOULD CONTAIN NUMBER of shares AND symbopl of stock
 */
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stockSymbol: {
    type: String,
    required: [true, "Stock symbol required"],
  },
  stockPrice: {
    type: Number,
  },
  numberOfShares: {
    type: Number,
  },
});

module.exports = mongoose.model("Stocks", schema);
