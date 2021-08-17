const WalletModel = require("../models/wallet");
const {
  successResponse,
  errorResponse,
  ApiResponse,
} = require("../util/helper");
const { BAD_REQUEST, OK, NOT_FOUND } = require("../util/status-codes");
const UserModel = require("../models/user");

exports.topUpWallet = async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
  let meta = successResponse();
  if (!user) {
    meta = errorResponse(NOT_FOUND, "user does not exist!");
    return res.status(NOT_FOUND).json(ApiResponse(meta));
  }
  try {
    const wallet = await WalletModel.findOne({ user: user._id });
    if (!wallet) {
      //check if wallet for user exists
      meta = errorResponse(BAD_REQUEST, "Unable to retrieve wallet");
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }
    if (req.body.balance < 10) {
      meta = errorResponse(BAD_REQUEST, "balance TOO SMALL");
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }
    wallet.balance = wallet.balance + parseInt(req.body.balance);
    wallet.save();
    return res.status(OK).json(ApiResponse(meta, wallet)); //calling thee success response.
  } catch (e) {
    return next(e);
  }
};

//get wallet by user id in param
exports.getWalletBalance = (req, res) => {
  //return  number of stocks and price
  id = req.user.id;
  WalletModel.findOne({ user: id }, (err, wallet) => {
    if (err) {
      return res.status(404).json({
        message: "Unable to fetch wallet",
        status: false,
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      data: wallet,
    });
  });
};
