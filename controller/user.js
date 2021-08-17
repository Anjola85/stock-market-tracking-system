const UserModel = require("../models/user");
const config = require("../config/config");
const UserValidation = require("../validator/user");
const _ = require("underscore");
const jwt = require("jsonwebtoken");
const WalletModel = require("../models/wallet");
const PortfolioModel = require("../models/portfolio");
const {
  ApiResponse,
  successResponse,
  errorResponse,
} = require("../util/helper");
const {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  NOT_FOUND,
  OK,
} = require("../util/status-codes");

function createToken(user) {
  //estalish secure connection for transmitting information.
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.jwtSecret,
    {
      expiresIn: 1800,
    }
  );
}

exports.registerUser = async (req, res, next) => {
  //signup page
  try {
    let validation = UserValidation.create(req.body);
    let meta = successResponse();
    if (validation.fails()) {
      meta = errorResponse();
      meta.errors = validation.errors.all();
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }

    const { email } = req.body || {};
    let user = await UserModel.findOne({ email });
    //check if user exists
    if (user) {
      meta = errorResponse(CONFLICT, "email already exists");
      return res.status(CONFLICT).json(ApiResponse(meta));
    }
    // then create a new user
    user = new UserModel({ ...req.body });
    user = await user.save();
    if (user) {
      // create a wallet and portfolio for the created user
      const wallet = new WalletModel({ user: user._id });
      await wallet.save();
      const portfolio = new PortfolioModel({
        user: user._id,
        wallet: wallet._id,
      });
      await portfolio.save();
    }
    meta.message = "User created successfully";
    meta.token = createToken(user);
    return res.status(CREATED).json(ApiResponse(meta, user));
  } catch (e) {
    return next(e);
  }
};

exports.loingUser = async (req, res, next) => {
  try {
    let validation = UserValidation.login(req.body);
    let meta = successResponse();
    if (validation.fails()) {
      meta = errorResponse();
      meta.errors = validation.errors.all();
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      meta = errorResponse(NOT_FOUND, "User does not exist");
      return res.status(NOT_FOUND).json(ApiResponse(meta));
    }
    const isCorrect = user.comparePassword(password);
    console.log("isCorrect: ", isCorrect);
    if (!isCorrect) {
      meta = errorResponse(BAD_REQUEST, "Email or password is not correct");
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }
    meta.message = "Logged in successfully";
    meta.token = createToken(user);
    return res.status(OK).json(ApiResponse(meta, user));
  } catch (e) {
    return next(e);
  }
};

exports.getUserById = async (req, res, next) => {
  //return user information
  console.log("req-query", req.query);
  console.log("req-params", req.params);
  let id = req.params.id;
  let meta = successResponse();
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      meta = errorResponse(BAD_REQUEST, "User not found");
      return res.status(BAD_REQUEST).json(ApiResponse(meta));
    }
    return res.status(OK).json(ApiResponse(meta, user));
  } catch (e) {
    return next(e);
  }
};

//get portfolio by user id
