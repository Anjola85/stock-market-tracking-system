const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      // min: [1, "Cannot add below $10"],
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Wallet", schema);
