const PortfolioModel = require("../models/portfolio");
const UserModel = require("../models/user");
const WalletModel = require("../models/wallet");
const { successResponse, ApiResponse } = require("../util/helper");
const { OK } = require("../util/status-codes");

exports.getPortfolio = async (req, res, next) => {
  let meta = successResponse();

  try {
    let id = req.user.id;
    const portfolio = await PortfolioModel.findOne({ user: id });
    if (!portfolio) {
      meta = errorResponse(BAD_REQUEST, "Unable to retrieve portfolio");
      return res.status(NOT_FOUND).json(ApiResponse(meta));
    }

    //get stocks bought
    const stocks = await PortfolioModel.findOne({ user: id })
      .sort({ createdAt: -1 })
      .populate("stocks");

    //change data that is being returned
    return res.status(OK).json(ApiResponse(meta, stocks));
  } catch (e) {
    return next(e);
  }
};
