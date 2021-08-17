/**
 * THIS MODEL SHULD CONTAIN NUMBER AND PRICES OF STOCKS BOUGHT
 */
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stocks",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Portfolio", schema);
