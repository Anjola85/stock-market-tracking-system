const express = require("express");
route = express.Router();
const user = require("./controller/user");
const wallet = require("./controller/wallet");
const stock = require("./controller/stocks");
const portfolio = require("./controller/portfolio");
const passport = require("passport");
const axios = require("axios").default;
const Stocks = require("stocks.js");
const { stockRetrieval } = require("./util/helper");
const { values } = require("underscore");

route.get("/", (req, res) => {
  return res.send("Hello, this is the API!");
});

/**
 * user routes
 */
route.post("/signup", user.registerUser);

route.post("/login", user.loingUser);

route.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  user.logout
);

route.get("/users/:id", user.getUserById);

/**
 * Wallet route to add and get balance
 */
route.post(
  "/topUpWallet",
  passport.authenticate("jwt", { session: false }),
  wallet.topUpWallet
);
route.get(
  "/getWalletBalance",
  passport.authenticate("jwt", { session: false }),
  wallet.getWalletBalance
);

route.get(
  "/special",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({ msg: `Welcome ${req.user.email}!` });
  }
);

// Get portfolio
route.get(
  "/my-portfolio",
  passport.authenticate("jwt", { session: false }),
  portfolio.getPortfolio
);

//buy stock - market order
route.post(
  "/buy-stock",
  passport.authenticate("jwt", { session: false }),
  stock.buyStock
);

//sell stock
route.post(
  "/sell-stock",
  passport.authenticate("jwt", { session: false }),
  stock.sellStock
);

//stocks api
route.get("/live-stocks", async (req, res, next) => {
  try {
    const stocks = new Stocks(process.env.STOCKS_API_KEY || "W75OUQMUWIA8V5BF");
    var [TSLA, MSFT, NOK, AMZN, APLE] = await Promise.all([
      await stocks.timeSeries(stockRetrieval("TSLA", "15min", 1)),
      await stocks.timeSeries(stockRetrieval("MSFT", "15min", 1)),
      await stocks.timeSeries(stockRetrieval("NOK", "15min", 1)),
      await stocks.timeSeries(stockRetrieval("AMZN", "15min", 1)),
      await stocks.timeSeries(stockRetrieval("APLE", "15min", 1)),
      ,
    ]);
    TSLA = TSLA.map((item) => ({ price: item.low }));
    MSFT = MSFT.map((item) => ({ price: item.low }));
    NOK = NOK.map((item) => ({ price: item.low }));
    AMZN = AMZN.map((item) => ({ price: item.low }));
    APLE = APLE.map((item) => ({ price: item.low }));
    return res.json({
      TSLA,
      MSFT,
      NOK,
      AMZN,
      APLE,
    });
  } catch (e) {
    return next(e);
  }
});

module.exports = route;
