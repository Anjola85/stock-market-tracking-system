const Stocks = require("stocks.js");
const StockModel = require("../models/stocks");
const PortfolioModel = require("../models/portfolio");
const {
  successResponse,
  stockRetrieval,
  errorResponse,
  ApiResponse,
} = require("../util/helper");
const { BAD_REQUEST, OK } = require("../util/status-codes");
const WalletModel = require("../models/wallet");

/**
 * @param symbol - stock symbol to buy
 * @return stock price.
 */
const getStockPrice = async (symbol, next) => {
  try {
    const stockSymbol = symbol;
    //get price of stock from api
    const stocks = new Stocks(process.env.STOCKS_API_KEY || "W75OUQMUWIA8V5BF");
    const stockInfo = await stocks.timeSeries(
      stockRetrieval(stockSymbol, "15min", 1)
    );
    //get most recent stock price
    let price = stockInfo[0];
    return price.low;
  } catch (e) {
    return next(e);
  }
};

//buy stock
exports.buyStock = async (req, res, next) => {
  const user = req.user.id;
  let meta = successResponse();
  try {
    const stockSymbol = req.body.stockSymbol;
    let stockPrice = await getStockPrice(stockSymbol);
    const wallet = await WalletModel.findOne({ user });
    let shares = req.body.numberOfShares;

    //check if user can afford number of shares
    stockPrice = stockPrice * shares;
    let buy = stockPrice <= wallet.balance;
    if (!buy) {
      meta = errorResponse(BAD_REQUEST, "insufficent balacne");
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }

    //create stock
    let newStock = new StockModel({ ...req.body, user });
    newStock.stockPrice = stockPrice;
    newStock = await newStock.save();

    //deduct price of stock from wallet
    wallet.balance -= stockPrice;
    await wallet.save();

    //update user portfolio
    await PortfolioModel.findOneAndUpdate(
      { user },
      {
        user,
        wallet: wallet._id,
        $addToSet: { stocks: newStock._id },
      },
      {
        upsert: true,
        new: true,
        useFindAndModify: false,
      }
    );

    meta.message = "Stocks successfully bought";
    return res.status(OK).json(ApiResponse(meta, newStock));
  } catch (e) {
    return next(e);
  }
};

//sell stock
exports.sellStock = async (req, res, next) => {
  try {
  } catch (e) {
    return next(e);
  }
};
